import * as THREE from 'three';
// Soft round sprites with per-particle size, colour and opacity. One pool is alpha-blended (dust, smoke, spray); one is additive (fire, sparks, glows).
const VERTEX=`attribute float size;attribute float alpha;attribute vec3 tint;varying float vAlpha;varying vec3 vTint;uniform float scale;
void main(){vAlpha=alpha;vTint=tint;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*scale/max(.1,-mv.z);gl_Position=projectionMatrix*mv;}`;
const FRAGMENT=`varying float vAlpha;varying vec3 vTint;uniform float softness;
void main(){vec2 q=gl_PointCoord-.5;float d=length(q)*2.;if(d>1.)discard;float a=pow(1.-d,softness)*vAlpha;gl_FragColor=vec4(vTint,a);
#include <colorspace_fragment>
}`;
class Pool{
 constructor(max,additive){this.max=max;this.items=[];this.geometry=new THREE.BufferGeometry();for(const [name,n] of [['position',3],['size',1],['alpha',1],['tint',3]])this.geometry.setAttribute(name,new THREE.BufferAttribute(new Float32Array(max*n),n).setUsage(THREE.DynamicDrawUsage));this.material=new THREE.ShaderMaterial({uniforms:{scale:{value:600},softness:{value:additive?1.6:1.15}},vertexShader:VERTEX,fragmentShader:FRAGMENT,transparent:true,depthWrite:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending});this.points=new THREE.Points(this.geometry,this.material);this.points.frustumCulled=false;this.points.renderOrder=additive?6:5;}
 add(p){if(this.items.length>=this.max)this.items.shift();this.items.push(p);}
 update(dt,extra=[]){const pos=this.geometry.attributes.position,size=this.geometry.attributes.size,alpha=this.geometry.attributes.alpha,tint=this.geometry.attributes.tint;let n=0;
 for(let i=this.items.length-1;i>=0;i--){const p=this.items[i];p.age+=dt;if(p.age>=p.life){this.items.splice(i,1);continue;}p.vx*=1-p.drag*dt;p.vz*=1-p.drag*dt;p.vy=p.vy*(1-p.drag*dt)-p.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
 for(const p of [...this.items,...extra]){if(n>=this.max)break;const f=p.life?p.age/p.life:0,fade=p.life?Math.min(1,f*8)*(1-f)**1.4:1;pos.setXYZ(n,p.x,p.y,p.z);size.setX(n,p.size*(1+(p.grow||0)*f));alpha.setX(n,p.opacity*fade);tint.setXYZ(n,p.r,p.g,p.b);n++;}
 this.geometry.setDrawRange(0,n);for(const a of [pos,size,alpha,tint])a.needsUpdate=true;}
 dispose(){this.geometry.dispose();this.material.dispose();}
}
const COLORS={dust:'#e2d3b2',smoke:'#9a9a94',darkSmoke:'#5d5a56',steam:'#eef2f2',fire:'#ff9a3c',ember:'#ffcf6e',spark:'#ffe2a0',splash:'#e8f4f6',flash:'#fff0b8',glow:'#ffb35c',rain:'#cfd8de'};
const rgb=new THREE.Color();
export class Particles{
 constructor(parent){this.soft=new Pool(900,false);this.glow=new Pool(700,true);parent.add(this.soft.points,this.glow.points);this.seed=3;this.lights=[];}
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 emit(kind,x,y,z,{count=1,speed=1,up=1,size=1,life=1.4,spread=.2,drag=1.2,gravity=0,grow=1,opacity=1,color}={}){const pool=['fire','ember','spark','flash','glow'].includes(kind)?this.glow:this.soft;rgb.set(color||COLORS[kind]||'#fff');for(let i=0;i<count;i++){const a=this.random()*Math.PI*2,r=this.random();pool.add({x:x+(this.random()-.5)*spread,y:y+(this.random()-.5)*spread*.5,z:z+(this.random()-.5)*spread,vx:Math.cos(a)*r*speed,vy:up*(.5+this.random()*.8),vz:Math.sin(a)*r*speed,size:size*(.7+this.random()*.6),life:life*(.7+this.random()*.6),age:0,drag,gravity,grow,opacity,r:rgb.r,g:rgb.g,b:rgb.b});}}
 dust(x,y,z,strength=3){this.emit('dust',x,y,z,{count:Math.min(16,Math.ceil(strength*2)),speed:strength*.55,up:strength*.45,size:.9+strength*.15,life:1.6,spread:.4,gravity:.6,grow:1.6,opacity:.6});}
 smoke(x,y,z,amount=1,dark=false){this.emit(dark?'darkSmoke':'smoke',x,y,z,{count:Math.ceil(5*amount),speed:.5*amount,up:.9,size:1.8*amount,life:3.2,spread:.5,drag:.8,gravity:-.15,grow:2.6,opacity:.42});}
 muzzle(x,y,z,dx=0,dz=0,scale=1){this.emit('flash',x,y,z,{count:3,speed:.4,up:.1,size:2.6*scale,life:.16,spread:.1,opacity:1});for(let i=0;i<8;i++)this.emit('smoke',x+dx*i*.25*scale,y,z+dz*i*.25*scale,{count:1,speed:.35,up:.35,size:1.5*scale,life:2.6,drag:1.4,gravity:-.12,grow:2.2,opacity:.5});}
 sparks(x,y,z,n=6){this.emit('spark',x,y,z,{count:n,speed:2.6,up:1.6,size:.28,life:.55,gravity:5,drag:.4,grow:0});}
 splash(x,y,z,strength=1){this.emit('splash',x,y,z,{count:Math.ceil(7*strength),speed:1.4*strength,up:2.6*strength,size:.55,life:.9,gravity:7,drag:.3,grow:.4,opacity:.8});}
 fire(x,y,z,scale=1){this.emit('fire',x,y,z,{count:1,speed:.12,up:.9*scale,size:1.15*scale,life:.6,spread:.25*scale,drag:.5,gravity:-.4,grow:-.5,opacity:.85});if(this.random()<.3)this.emit('ember',x,y+.2,z,{count:1,speed:.3,up:1.4,size:.22,life:1.1,gravity:-.3,grow:0});}
 rain(cx,cz,intensity){for(let i=0;i<Math.ceil(intensity*24);i++)this.emit('rain',cx+(this.random()-.5)*120,22+this.random()*12,cz+(this.random()-.5)*86,{count:1,speed:0,up:0,size:.42,life:1.3,spread:0,gravity:22,drag:0,grow:0,opacity:.45});}
 // Glows are rebuilt each frame from torches, fires and lamps.
 update(dt,glows=[]){this.soft.update(dt);this.glow.update(dt,glows);}
 // Sizes are in world units: the projected diameter is size × viewport height ÷ (2 tan(fov/2) × distance).
 setScale(height,fov=36){this.soft.material.uniforms.scale.value=this.glow.material.uniforms.scale.value=height/(2*Math.tan(fov*Math.PI/360));}
 dispose(){this.soft.dispose();this.glow.dispose();}
}
export const glowColor=(hex,out={})=>{rgb.set(hex);out.r=rgb.r;out.g=rgb.g;out.b=rgb.b;return out;};
