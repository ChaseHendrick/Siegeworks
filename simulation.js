import {scenarioById} from './scenarios.js';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t,smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
export function naturalHeight(s,x,z){
 if(Math.abs(x)>62||Math.abs(z)>44)return -4;
 const noise=.16*Math.sin(x*.23+z*.11)+.12*Math.cos(z*.28-x*.13);
 if(s.id==='masada'){const r=((x-18)/16)**4+(z/28)**4,mesa=24*(1-smooth((r-.8)/.5));const t=clamp((x+41)/43,0,1),spur=x<2&&x>-43?17*t*(1-smooth((Math.abs(z)-2)/10)):0;return Math.max(mesa,spur)+noise;}
 if(s.id==='alesia'){const r=Math.hypot(x/16,z/13);return 9*(1-smooth((r-.7)/.55))+noise+1.5*Math.exp(-((x+46)**2+(z-20)**2)/180);}
 if(s.id==='tyre'){if(x<-32)return .5+noise;const r=Math.hypot((x-24)/17,z/23);return r<.92?2+noise:r<1.05?mix(2,-3,(r-.92)/.13):-3;}
 if(s.id==='jerusalem')return 7*smooth((x+3)/14)+noise+1.3*Math.exp(-((x-34)**2+(z+14)**2)/150);
 if(s.theme==='coast'&&z>29)return -3;
 return s.height*smooth((x+1)/14)+noise;
}
export function workPoint(s,t){if(s.kind==='rings'){const ring=t<.5?0:1,a=(t% .5)*Math.PI*4;return{x:Math.cos(a)*(ring?47:30),z:Math.sin(a)*(ring?33:22),ring};}const x=mix(s.start[0],s.end[0],t);const phase=t*5%1;return{x,z:s.kind==='trenches'?(phase<.5?phase*2:2-phase*2)*6-3:0};}

export function fortressOutline(s){let outline;if(s.id==='masada')outline=[[-12,-23],[11,-23],[13,-15],[12,21],[5,24],[-12,21]];else if(s.id==='candia'){outline=Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2,r=i%2?17:24;return[Math.cos(a)*r,Math.sin(a)*r];});}else outline=[[-16,-21],[14,-21],[17,-13],[17,17],[10,22],[-16,20]];return outline.map(([x,z])=>[x+s.fort[0],z+s.fort[1]]);}
function patrolPoint(s,t){const polygon=fortressOutline(s),q=(t%1)*polygon.length,i=Math.floor(q),f=q-i,a=polygon[i],b=polygon[(i+1)%polygon.length];return{x:mix(a[0],b[0],f),z:mix(a[1],b[1],f)};}

export class SiegeSimulation{
 constructor(id='masada'){this.config=scenarioById(id);this.clock=0;this.seed=this.config.seed;this.completedLoads=0;this.engine=0;this.stage='Building';this.wallHealth=1;this.built=new Float64Array(this.config.kind==='rings'?160:48);this.capacity=new Float64Array(this.built.length);this.base=new Float64Array(this.built.length);this.revision=0;this.agents=[];this.events=[];this.shotClock=0;this.shots=0;this.supplyPause=0;
 for(let i=0;i<this.built.length;i++){const t=i/(this.built.length-1),p=workPoint(this.config,t);this.base[i]=naturalHeight(this.config,p.x,p.z);const target=this.config.kind==='ramp'?mix(this.base[0]+.35,this.config.height+.15,t):this.config.kind==='causeway'?1.05:this.config.kind==='terraces'?mix(.45,this.config.height+.1,t):this.base[i]+(this.config.kind==='rings'?1.7:this.config.kind==='battery'?1.5:.8);this.capacity[i]=Math.max(.25,target-this.base[i])*5;}
 const s=this.config;for(let id=0;id<s.workers+s.soldiers+s.defenders+(s.relief||0);id++){const role=id<s.workers?'worker':id<s.workers+s.soldiers?'soldier':id<s.workers+s.soldiers+s.defenders?'defender':'relief';const a={id,role,job:role==='worker'?'Loading supplies':'Patrolling',x:s.camp[0]+(id%8)*.55,z:s.camp[1]+Math.floor(id/8)*.6,y:0,heading:0,walk:0,state:'load',timer:this.random()*3,carrying:false,loads:0,disabled:false,panic:0,health:1,recovery:0,target:0};if(role==='defender'){const p=patrolPoint(s,(id-s.workers-s.soldiers)/s.defenders);a.x=p.x;a.z=p.z;}if(role==='relief'){a.x=-55+(id%5)*1.05;a.z=16+Math.floor((id-s.workers-s.soldiers-s.defenders)/5)*1.3;}a.y=this.heightAt(a.x,a.z)+(role==='defender'?(s.id==='constantinople'?5:s.id==='candia'?3.6:2.7)+.25:0);this.agents.push(a);}
 }
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 get progress(){return this.built.reduce((a,b)=>a+b,0)/this.capacity.reduce((a,b)=>a+b,0);}
 get front(){let i=this.built.findIndex((h,i)=>h<this.capacity[i]-.001);return i<0?this.built.length-1:i;}
 heightAt(x,z){let h=naturalHeight(this.config,x,z);if(this.config.kind==='rings')return h;const t=(x-this.config.start[0])/(this.config.end[0]-this.config.start[0]);if(t>=0&&t<=1){const p=workPoint(this.config,t),side=Math.abs(z-p.z),i=clamp(Math.round(t*(this.built.length-1)),0,this.built.length-1);if(this.config.kind==='trenches'&&side<1.5)h=this.base[i]-.85*Math.min(1,this.built[i]/this.capacity[i]);else if(side<4.1&&this.config.kind!=='trenches')h=Math.max(h,this.base[i]+this.built[i]/5*(1-smooth((side-2.6)/1.5)));}return h;}
 move(a,x,z,dt,speed=2.1){const dx=x-a.x,dz=z-a.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*speed);a.heading=Math.atan2(dx,dz);a.x+=dx/(d||1)*step;a.z+=dz/(d||1)*step;a.y=this.heightAt(a.x,a.z);a.walk+=step*3.4;return d<.4;}
 deposit(index,amount=3){if(!Number.isInteger(index)||index<0||index>=this.built.length)return 0;const used=Math.min(amount,this.capacity[index]-this.built[index]);this.built[index]+=used;this.revision++;return used;}
 react(x,z,r=9){for(const a of this.agents)if(!a.disabled&&Math.hypot(a.x-x,a.z-z)<r)a.panic=Math.max(a.panic,3+this.random()*2);}
 update(dt){if(!Number.isFinite(dt)||dt<=0)return;dt=Math.min(.1,dt);this.clock+=dt;this.events=[];const s=this.config,front=this.front;
 for(const a of this.agents){if(a.disabled)continue;if(a.recovery>0){a.recovery-=dt;a.job='Recovering';continue;}if(a.panic>0){a.panic-=dt;a.job='Taking cover';const awayX=a.x+(a.x-s.end[0])* .1,awayZ=a.z+(a.z>=0?2:-2);this.move(a,clamp(awayX,-56,56),clamp(awayZ,-37,37),dt,3);continue;}
 if(a.role==='worker'){const supply={x:s.camp[0]+(a.id%6)*1.1,z:s.camp[1]+(a.id%4)*1.2};const targetIndex=s.kind==='rings'?(a.id*7+Math.floor(a.loads/2)*3)%this.built.length:clamp(front+(a.id%5)-2,0,this.built.length-1);const target=workPoint(s,targetIndex/(this.built.length-1));target.z+=(a.id%2?1:-1)*1.2;
 if(a.state==='load'){a.job='Loading supplies';a.timer-=dt;if(a.timer<=0){a.carrying=true;a.state='out';a.target=targetIndex;}}
 else if(a.state==='out'){a.job=s.kind==='trenches'?'Bringing tools':'Hauling material';const p=workPoint(s,a.target/(this.built.length-1));p.z+=(a.id%2?1:-1)*1.2;const waypoint=a.x<s.start[0]-1&&s.kind!=='rings'?{x:s.start[0]-1,z:(a.id%2?1:-1)*1.2}:p;if(this.move(a,waypoint.x,waypoint.z,dt,2.25)&&waypoint===p){a.state='build';a.timer=1.8;}}
 else if(a.state==='build'){a.job=s.kind==='trenches'?'Digging approach':s.kind==='rings'?'Setting stakes':'Laying material';a.timer-=dt;if(a.timer<=0){const used=this.deposit(a.target);if(used>0){this.completedLoads++;a.loads++;this.events.push({type:'deposit',x:a.x,z:a.z,y:a.y,amount:used});}a.carrying=false;a.state='back';}}
 else{a.job='Returning to camp';const waypoint=a.x>s.start[0]+1&&s.kind!=='rings'?{x:s.start[0],z:(a.id%2?1:-1)*2}:supply;if(this.move(a,waypoint.x,waypoint.z,dt,2.8)&&waypoint===supply){a.state='load';a.timer=1+this.random()*2;}}
 }else if(a.role==='soldier'){const i=a.id-s.workers;if(s.kind==='rings'){const t=(this.clock*.008+i/s.soldiers)%1,p=workPoint(s,t);this.move(a,p.x*.85,p.z*.85,dt,1.7);a.job='Holding the siege lines';}else{const t=(this.clock*.022+i*.13)%1,x=mix(s.start[0]-9,s.start[0]+8,t),z=8+(i%4)*1.25;this.move(a,x,z,dt,1.55);a.job=this.stage==='Building'?'Escorting supplies':'Advancing in formation';}}
 else if(a.role==='relief'){a.job=this.engine>.7?'Approaching the outer line':'Waiting beyond the lines';if(this.engine>.7)this.move(a,-44+(a.id%4)*.4,10+(a.id%5)*.8,dt,1.7);}else{const i=a.id-s.workers-s.soldiers,p=patrolPoint(s,i/s.defenders+this.clock*.0025);this.move(a,p.x,p.z,dt,1.1);a.y=naturalHeight(s,a.x,a.z)+(s.id==='constantinople'?5:s.id==='candia'?3.6:2.7)+.25;a.job='Watching the approach';}
 }
 if(this.progress>.985){this.stage=s.kind==='rings'?'Holding the lines':'Advancing';if(s.kind==='ramp'||s.kind==='terraces'||s.kind==='causeway')this.engine=Math.min(1,this.engine+dt*.012);else this.engine=Math.min(1,this.engine+dt*.04);}
 if(this.engine>.96){this.stage=s.kind==='rings'?'Relief force approaching':'Bombardment';this.shotClock+=dt;if(this.shotClock>(s.kind==='battery'||s.kind==='trenches'?3.2:5.5)){this.shotClock=0;this.shots++;this.events.push({type:s.kind==='rings'?'relief':'shot'});}}
 if(this.wallHealth<.22)this.stage='Breach opened';
 }
 finishWorks(){for(let i=0;i<this.built.length;i++)this.built[i]=this.capacity[i];this.revision++;}
 exportState(){return{version:1,scenario:this.config.id,clock:this.clock,seed:this.seed,built:[...this.built],completedLoads:this.completedLoads,engine:this.engine,wallHealth:this.wallHealth,shotClock:this.shotClock,shots:this.shots,agents:this.agents.map(a=>({...a,disabled:false}))};}
 restoreState(save){if(save?.version!==1||save.scenario!==this.config.id||save.built?.length!==this.built.length||save.agents?.length!==this.agents.length||!save.built.every((v,i)=>Number.isFinite(v)&&v>=0&&v<=this.capacity[i]+.001))return false;for(const a of save.agents)if(!['x','y','z','health','timer','loads'].every(k=>Number.isFinite(a[k]))||Math.abs(a.x)>100||Math.abs(a.z)>100||a.health<0||a.health>1||!['load','out','build','back'].includes(a.state))return false;this.built.set(save.built);for(const k of ['clock','seed','completedLoads','engine','wallHealth','shotClock','shots'])if(Number.isFinite(save[k])&&save[k]>=0)this[k]=save[k];this.engine=clamp(this.engine,0,1);this.wallHealth=clamp(this.wallHealth,0,1);this.agents.forEach((a,i)=>{for(const k of Object.keys(a))if(k!=='id'&&k!=='role'&&k!=='disabled'&&typeof save.agents[i][k]===typeof a[k])a[k]=save.agents[i][k];a.disabled=false;});this.revision++;return true;}
}
