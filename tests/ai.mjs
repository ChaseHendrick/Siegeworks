import assert from 'node:assert/strict';
import * as THREE from 'three';
import {SCENARIOS} from '../scenarios.js';
import {SiegeSimulation,naturalHeight,WATER_LEVEL,campLayout,workPoint,fortressOutline,phases,breachable,DAY_LENGTH,dayTime,nightAmount} from '../simulation.js';
import {SiegePhysics} from '../physics.js';
import {MiniatureScene} from '../scene.js';
import {cartPoint} from '../collision.js';
function world(id){const sim=new SiegeSimulation(id),physics=new SiegePhysics(sim),scene=Object.create(MiniatureScene.prototype);Object.assign(scene,{sim,physics,root:new THREE.Group(),breakableWalls:[],banners:[],mats:new Map(),randSeed:sim.config.seed});scene.box=()=>{};scene.part=()=>{};scene.buildArchitecture();return{sim,physics,scene};}
function run(w,seconds,each){for(let i=0;i<seconds*30;i++){w.sim.update(1/30);w.physics.update(1/30);w.physics.handleEvents(w.sim.events);w.scene.collapseWalls();each?.(w.sim.events);}}

// Every siege is complete, sourced, and laid out on dry land where people live and work.
const ids=new Set();for(const s of SCENARIOS){assert(!ids.has(s.id),s.id+' is unique');ids.add(s.id);for(const k of ['name','date','faction','enemy','region','work','focus','description','fact','limit','finale'])assert(typeof s[k]==='string'&&s[k].length>2,`${s.id} has ${k}`);assert(['ancient','medieval','early modern'].includes(s.era),s.id+' era');assert(s.sources.length>=2&&s.sources.every(([label,url])=>label&&/^https:\/\//.test(url)),s.id+' cites at least two https sources');assert(s.dress?.soldier&&s.dress?.defender&&s.dress?.worker,s.id+' dresses every side');assert(phases(s).length>=3);
 const c=campLayout(s),wet=(x,z)=>naturalHeight(s,x,z)<WATER_LEVEL+.3;for(let col=0;col<c.cols;col++)for(let row=0;row<c.rows;row++)assert(!wet(c.x+col*3.6,c.z+row*4.2),s.id+' tents stand on land');for(let i=0;i<c.cols;i++){const p=c.supply(i);assert(!wet(p.x,p.z),s.id+' supply points are on land');}for(const f of c.fires)assert(!wet(f.x,f.z),s.id+' fires are on land');const sim=new SiegeSimulation(s.id);for(let d=0;d<sim.cartRoute.total;d+=.5){const p=cartPoint(sim.cartRoute,d);assert(!wet(p.x,p.z),s.id+' carts keep to land');}if(s.kind!=='rings'&&s.kind!=='causeway')for(let t=0;t<=1;t+=.05){const p=workPoint(s,t);assert(!wet(p.x,p.z),s.id+' works start and run on land');}}
assert.equal(SCENARIOS.length,24,'two dozen sieges');assert(SCENARIOS.filter(s=>/Roman|Octavian/.test(s.faction)).length>=12,'at least a dozen Roman campaigns');
console.log('24 sieges have complete notes, sources, dress, and dry camps, carts and works.');

// Workers choose open ground, spread along the front, and keep apart.
for(const id of ['masada','alesia','candia']){const sim=new SiegeSimulation(id);let builds=0,deposits=0,crowded=0,close=0,moving=0;const was=new Map();for(let i=0;i<3600;i++){sim.update(1/30);deposits+=sim.events.filter(e=>e.type==='deposit').length;for(const a of sim.agents){if(a.role!=='worker')continue;if(was.get(a.id)==='build'&&a.state==='back')builds++;was.set(a.id,a.state);}if(i%30===0){for(let k=0;k<sim.built.length;k++)crowded=Math.max(crowded,sim.reserved[k]*sim.loadSize-(sim.capacity[k]-sim.built[k]));const walkers=sim.agents.filter(a=>a.role==='worker'&&(a.state==='out'||a.state==='back'));moving+=walkers.length;for(const a of walkers)if(walkers.some(b=>b!==a&&Math.hypot(a.x-b.x,a.z-b.z)<.25))close++;}}
 assert(builds>20,id+' crews complete trips');assert(deposits>=builds*.9,`${id} trips deliver material (${deposits}/${builds})`);assert(crowded<=sim.loadSize*2.5,`${id} no cell is oversubscribed (${crowded.toFixed(1)} beyond its remaining room)`);assert(close<moving*.05,`${id} walkers rarely overlap (${close}/${moving})`);}
console.log('Workers deliver on nearly every trip, share the front, and keep their spacing.');

// Night shift: half the crews rest at the fires while the rest keep building by torchlight.
{const sim=new SiegeSimulation('masada');let nightDeposits=0,nightSamples=0,resting=0,torches=0;for(let i=0;i<DAY_LENGTH*30;i++){sim.update(1/30);if(nightAmount(sim.clock)>.9){nightDeposits+=sim.events.filter(e=>e.type==='deposit').length;if(i%60===0){nightSamples++;resting+=sim.agents.filter(a=>a.role==='worker'&&a.state==='rest').length/sim.config.workers;torches+=sim.agents.filter(a=>a.torch).length;}}}
 assert(nightSamples>10,'the day includes a night');assert(resting/nightSamples>.35,'a large share of workers rests at night');assert(nightDeposits>0,'the night shift keeps building');assert(torches/nightSamples>5,'people carry torches after dark');
 for(let i=0;i<120*30;i++)sim.update(1/30);assert(dayTime(sim.clock)<.4);assert(sim.agents.filter(a=>a.role==='worker'&&a.state==='rest').length<sim.config.workers*.3,'most return to work in the morning');
 const off=new SiegeSimulation('masada');off.dayCycle=false;for(let i=0;i<DAY_LENGTH*30;i++)off.update(1/30);assert(!off.agents.some(a=>a.torch),'always-day mode never lights torches');}
console.log('Day and night: rest, torches, and a working night shift.');

// Defenders gather on the threatened wall and shoot at the works.
{const w=world('masada');w.sim.built.forEach((_,i)=>{if(i<30)w.sim.built[i]=w.sim.capacity[i];});w.sim.revision++;let missiles=0,impacts=0;run(w,90,events=>{missiles+=events.filter(e=>e.type==='missile').length;impacts+=w.physics.pendingImpacts.splice(0).length;});const wall=w.sim.agents.filter(a=>a.role==='defender'&&a.wallPatrol),near=wall.filter(a=>Math.abs(((a.patrolT-w.sim.threat.t+1.5)%1)-.5)<.08);assert(near.length>=wall.length*.45,`defenders concentrate on the threatened wall (${near.length}/${wall.length})`);assert(missiles>8,'archers shoot at the works');assert(impacts>=missiles*.8,`missiles land (${impacts}/${missiles})`);console.log('Defenders man the threatened wall and loosed',missiles,'missiles.');}

// Where the city fell by assault, a breach draws both sides into melee; where it held, the walls stand.
for(const id of ['masada','constantinople','gamla']){const w=world(id);w.sim.finishWorks();w.sim.engine=1;w.sim.wallHealth=.1;w.physics.refreshTerrain();let hits=0;run(w,45,events=>hits+=events.filter(e=>e.type==='hit').length);assert(w.scene.breakableWalls.some(c=>c.removed),id+' the wall opens');assert(hits>3,`${id} attackers and defenders fight at the breach (${hits})`);assert(w.sim.agents.every(a=>a.health>=.2),id+' combat stays nonfatal');assert.equal(w.sim.stage,w.sim.config.finale);}
for(const id of ['hatra','rhodes','uxellodunum']){const w=world(id);assert(!breachable(w.sim.config));w.sim.finishWorks();w.sim.engine=1;w.sim.wallHealth=.05;w.physics.refreshTerrain();run(w,10);w.scene.collapseWalls();assert(!w.scene.breakableWalls.some(c=>c.removed),id+' walls never open where the city held');w.sim.shots=8;w.sim.update(1/30);assert.equal(w.sim.stage,w.sim.config.finale,id+' reaches its own finale');}
console.log('Breaches only where the city fell by assault; elsewhere the walls hold.');

// Relief armies and sorties meet the besiegers' lines.
for(const id of ['alesia','vienna','acre','numantia']){const w=world(id);w.sim.finishWorks();w.sim.engine=1;w.physics.refreshTerrain();let hits=0;run(w,70,events=>hits+=events.filter(e=>e.type==='hit').length);assert(hits>3,`${id} the lines are attacked (${hits} blows)`);assert(w.sim.agents.every(a=>['x','y','z'].every(k=>Number.isFinite(a[k]))));}
console.log('Relief armies and sorties reach the siege lines.');

// Saves stay compatible: new fields round-trip, and saves made before them still load.
{const sim=new SiegeSimulation('tyre');for(let i=0;i<900;i++)sim.update(1/30);const save=JSON.parse(JSON.stringify(sim.exportState())),copy=new SiegeSimulation('tyre');assert(copy.restoreState(save));assert.deepEqual(copy.exportState(),save);const old=JSON.parse(JSON.stringify(save));for(const a of old.agents)for(const k of ['fatigue','pose','torch','patrolT','shootCooldown','aim','fights','tumbles','arrowHits','stuck','avoid'])delete a[k];assert(new SiegeSimulation('tyre').restoreState(old),'older saves still restore');const bad=JSON.parse(JSON.stringify(save));bad.agents[3].fatigue=null;bad.agents[4].patrolT=Number.NaN;assert(new SiegeSimulation('tyre').restoreState(JSON.parse(JSON.stringify(bad))),'non-numbers are ignored');const nan=JSON.parse(JSON.stringify(save));nan.agents[2].stuck='x';assert(new SiegeSimulation('tyre').restoreState(nan));}
console.log('Saves round-trip and older saves still load.');
