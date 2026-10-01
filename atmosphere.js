import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {dayTime,nightAmount} from './simulation.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
// Light keyframes by sun height: -1 is deep night, 0 the horizon, 1 high noon.
const KEYS=[
 {at:-1,top:'#0a1128',horizon:'#1f2a46',bottom:'#161c2c',sun:'#9db4e0',sunI:.42,sky:'#43557d',ground:'#23242c',hemiI:.42,exposure:1.28,env:.12},
 {at:-.2,top:'#18234a',horizon:'#4b4f72',bottom:'#2a2c3a',sun:'#a9b8e0',sunI:.36,sky:'#56638a',ground:'#2e2c33',hemiI:.48,exposure:1.2,env:.16},
 {at:0,top:'#3b5584',horizon:'#e79a6f',bottom:'#6c5a57',sun:'#ff8a52',sunI:.9,sky:'#8e8fa8',ground:'#6c5649',hemiI:.75,exposure:1.08,env:.26},
 {at:.16,top:'#5f86b8',horizon:'#f1d2ac',bottom:'#b7b4a6',sun:'#ffc27e',sunI:2.4,sky:'#b6c5d6',ground:'#9a8670',hemiI:1.0,exposure:1.0,env:.36},
 {at:.45,top:'#6e9cc9',horizon:'#e2eaec',bottom:'#bccbcf',sun:'#fff0d4',sunI:3.1,sky:'#cddcea',ground:'#ad9a7c',hemiI:1.05,exposure:.98,env:.42},
 {at:1,top:'#5f93c8',horizon:'#e4ecee',bottom:'#c0ced2',sun:'#fff6e4',sunI:3.3,sky:'#d4e2ee',ground:'#b2a184',hemiI:1.05,exposure:.96,env:.44}];
const COLOR_KEYS=['top','horizon','bottom','sun','sky','ground'],NUM_KEYS=['sunI','hemiI','exposure','env'];
const sample=(h,out)=>{let i=0;while(i<KEYS.length-2&&h>KEYS[i+1].at)i++;const a=KEYS[i],b=KEYS[i+1],t=smooth(a.at,b.at,h);for(const k of COLOR_KEYS)out[k].set(a[k]).lerp(new THREE.Color(b[k]),t);for(const k of NUM_KEYS)out[k]=a[k]+(b[k]-a[k])*t;return out;};
const SKY_VERTEX=`varying vec3 vDir;void main(){vDir=normalize((modelMatrix*vec4(position,1.)).xyz-cameraPosition);vec4 p=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);gl_Position=p.xyww;}`;
const SKY_FRAGMENT=`uniform vec3 top,horizon,bottom,sunColor,sunDir,moonDir;uniform float sunUp,night;varying vec3 vDir;
void main(){vec3 d=normalize(vDir);float h=d.y;vec3 c=h>0.?mix(horizon,top,pow(smoothstep(0.,.62,h),.8)):mix(horizon,bottom,smoothstep(0.,-.35,h));
float s=max(dot(d,sunDir),0.);c+=sunColor*(pow(s,700.)*3.*sunUp+pow(s,18.)*.22*sunUp+pow(s,4.)*.08*sunUp);
float m=max(dot(d,moonDir),0.);c+=vec3(.85,.9,1.)*(smoothstep(.9994,.9997,m)*1.4+pow(m,60.)*.12)*night;
gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
// Tilt-shift: a sharp band across the middle of the frame, soft above and below, like a macro photograph of a model.
const TiltShift={uniforms:{tDiffuse:{value:null},delta:{value:new THREE.Vector2()},focus:{value:.56},band:{value:.18},amount:{value:1}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 delta;uniform float focus,band,amount;varying vec2 vUv;
 void main(){float blur=smoothstep(band,band+.32,abs(vUv.y-focus))*amount;vec4 sum=vec4(0.);float total=0.;
 for(int i=-4;i<=4;i++){float w=exp(-float(i*i)/8.);sum+=texture2D(tDiffuse,vUv+delta*float(i)*blur)*w;total+=w;}gl_FragColor=sum/total;}`};
const Finish={uniforms:{tDiffuse:{value:null},vignette:{value:.32},time:{value:0}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform float vignette,time;varying vec2 vUv;
 float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+time)*43758.5453);}
 void main(){vec4 c=texture2D(tDiffuse,vUv);vec2 q=vUv-.5;float v=1.-dot(q,q)*vignette*2.2;c.rgb*=clamp(v,0.,1.);c.rgb+=(hash(vUv*913.)-.5)*.012;gl_FragColor=c;}`};

export class Atmosphere{
 constructor(scene,renderer,{quality='high',cycle=true}={}){this.scene=scene;this.renderer=renderer;this.quality=quality;this.cycle=cycle;this.state={top:new THREE.Color(),horizon:new THREE.Color(),bottom:new THREE.Color(),sun:new THREE.Color(),sky:new THREE.Color(),ground:new THREE.Color()};this.sunDir=new THREE.Vector3(-.3,.85,.45).normalize();this.night=0;this.daylight=1;
 this.dome=new THREE.Mesh(new THREE.SphereGeometry(420,32,16),new THREE.ShaderMaterial({uniforms:{top:{value:new THREE.Color()},horizon:{value:new THREE.Color()},bottom:{value:new THREE.Color()},sunColor:{value:new THREE.Color()},sunDir:{value:new THREE.Vector3()},moonDir:{value:new THREE.Vector3()},sunUp:{value:1},night:{value:0}},vertexShader:SKY_VERTEX,fragmentShader:SKY_FRAGMENT,side:THREE.BackSide,depthWrite:false,fog:false}));this.dome.renderOrder=-10;this.dome.frustumCulled=false;scene.add(this.dome);
 const stars=new Float32Array(900*3);let seed=7;const rand=()=>(seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296;for(let i=0;i<900;i++){const u=rand()*2-1,a=rand()*Math.PI*2,y=Math.abs(u)*.92+.08,r=Math.sqrt(1-y*y);stars.set([Math.cos(a)*r*400,y*400,Math.sin(a)*r*400],i*3);}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(stars,3));this.stars=new THREE.Points(sg,new THREE.PointsMaterial({color:'#e8eeff',size:1.6,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false,fog:false}));this.stars.renderOrder=-9;this.stars.frustumCulled=false;scene.add(this.stars);
 this.hemi=new THREE.HemisphereLight('#fff','#888',1);scene.add(this.hemi);
 this.sun=new THREE.DirectionalLight('#fff',3);this.sun.castShadow=true;const size=quality==='high'?4096:2048;this.sun.shadow.mapSize.set(size,size);const c=this.sun.shadow.camera;c.left=-82;c.right=82;c.top=68;c.bottom=-68;c.near=1;c.far=260;this.sun.shadow.bias=-.0002;this.sun.shadow.normalBias=.14;this.sun.shadow.radius=3;scene.add(this.sun);scene.add(this.sun.target);
 scene.fog=new THREE.Fog('#dfe5e1',230,470);
 try{const pmrem=new THREE.PMREMGenerator(renderer);this.envTexture=pmrem.fromScene(new RoomEnvironment(),.04).texture;scene.environment=this.envTexture;pmrem.dispose();}catch{}
 this.setupComposer();}
 setupComposer(){this.composer?.dispose?.();this.composer=null;if(this.quality!=='high')return;const size=this.renderer.getSize(new THREE.Vector2()),ratio=this.renderer.getPixelRatio(),target=new THREE.WebGLRenderTarget(Math.max(1,size.x*ratio),Math.max(1,size.y*ratio),{type:THREE.HalfFloatType,samples:4});this.composer=new EffectComposer(this.renderer,target);this.renderPass=new RenderPass(this.scene,null);this.composer.addPass(this.renderPass);this.tiltX=new ShaderPass(TiltShift);this.tiltY=new ShaderPass(TiltShift);this.composer.addPass(this.tiltX);this.composer.addPass(this.tiltY);this.composer.addPass(new OutputPass());this.finish=new ShaderPass(Finish);this.composer.addPass(this.finish);this.resize();}
 setQuality(quality){if(quality===this.quality)return;this.quality=quality;const size=quality==='high'?4096:2048;this.sun.shadow.mapSize.set(size,size);this.sun.shadow.map?.dispose();this.sun.shadow.map=null;this.setupComposer();}
 resize(){if(!this.composer)return;const size=this.renderer.getSize(new THREE.Vector2()),ratio=this.renderer.getPixelRatio();this.composer.setPixelRatio(ratio);this.composer.setSize(size.x,size.y);this.tiltX.uniforms.delta.value.set(1.4/Math.max(1,size.x),0);this.tiltY.uniforms.delta.value.set(0,1.4/Math.max(1,size.y));}
 // Sun and moon follow the miniature clock; "always day" holds a clear mid-morning.
 update(clock,camera,focusDistance=120,weather=0){const t=this.cycle?dayTime(clock):.2,night=this.cycle?nightAmount(clock):0,day=t<.62,phi=day?Math.PI*t/.62:Math.PI*(t-.62)/.38,elev=Math.sin(phi),height=day?elev:-Math.max(night,.2+elev*.1);this.night=night;this.daylight=1-night;
 const dir=new THREE.Vector3(Math.cos(phi)*.9-.35*Math.sin(phi),Math.sin(phi)*1.1+.03,.55).normalize();const st=sample(height,this.state);if(weather>0){const grey=new THREE.Color('#9aa3a6');st.top.lerp(grey,weather*.7);st.horizon.lerp(new THREE.Color('#b7bcb8'),weather*.6);st.sunI*=1-weather*.6;}
 this.sunDir.copy(dir);const light=day?dir:new THREE.Vector3(-dir.x,dir.y,dir.z);this.sun.position.copy(light).multiplyScalar(130);this.sun.target.position.set(0,0,0);this.sun.color.copy(st.sun);this.sun.intensity=day?st.sunI*smooth(-.04,.12,elev):st.sunI*smooth(.02,.3,elev)+.08;this.hemi.color.copy(st.sky);this.hemi.groundColor.copy(st.ground);this.hemi.intensity=st.hemiI;
 const u=this.dome.material.uniforms;u.top.value.copy(st.top);u.horizon.value.copy(st.horizon);u.bottom.value.copy(st.bottom);u.sunColor.value.copy(st.sun);u.sunDir.value.copy(day?dir:dir.clone().negate());u.moonDir.value.copy(day?dir.clone().multiplyScalar(-1):dir);u.sunUp.value=day?smooth(-.1,.1,elev):0;u.night.value=night;this.stars.material.opacity=night*.85*(1-weather);
 this.scene.fog.color.copy(st.horizon).lerp(st.bottom,.35);this.scene.environmentIntensity=st.env;this.renderer.toneMappingExposure=st.exposure;this.dome.position.copy(camera.position);this.stars.position.copy(camera.position);
 if(this.composer){const amount=clamp((focusDistance-28)/110,0,1);this.tiltX.uniforms.amount.value=this.tiltY.uniforms.amount.value=.35+amount*.9;this.finish.uniforms.time.value=(clock*.37)%10;}}
 render(camera){if(this.composer){this.renderPass.camera=camera;this.composer.render();}else this.renderer.render(this.scene,camera);}
 dispose(){this.composer?.renderTarget1?.dispose();this.composer?.renderTarget2?.dispose();this.envTexture?.dispose();this.dome.geometry.dispose();this.dome.material.dispose();this.stars.geometry.dispose();this.stars.material.dispose();this.sun.shadow.map?.dispose();}
}
