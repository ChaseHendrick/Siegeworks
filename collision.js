export const TERRAIN={minX:-62,maxX:62,minZ:-44,maxZ:44,step:1,cols:124,rows:88};
export const PERSON_ORIGIN=.72;

// The renderer and height field use the same vertices and triangle diagonal.
export function terrainIndices(){const out=[];for(let j=0;j<TERRAIN.rows;j++)for(let i=0;i<TERRAIN.cols;i++){const a=j*(TERRAIN.cols+1)+i,b=a+TERRAIN.cols+1,c=b+1,d=a+1;out.push(a,b,c,a,c,d);}return out;}
export function terrainHeight(sample,x,z){x=Math.max(-62,Math.min(61.999999,x));z=Math.max(-43.999999,Math.min(44,z));const u=x+62,v=44-z,i=Math.floor(u),j=Math.floor(v),fx=u-i,fz=v-j,a=sample(i-62,44-j),b=sample(i+1-62,44-j),c=sample(i-62,43-j),d=sample(i+1-62,43-j);return fx+fz<=1?a+(b-a)*fx+(c-a)*fz:d+(c-d)*(1-fx)+(b-d)*(1-fz);}

export function localPoint(box,x,z){const dx=x-box.x,dz=z-box.z,c=Math.cos(box.yaw),s=Math.sin(box.yaw);return{x:c*dx-s*dz,z:s*dx+c*dz};}
export function containsPoint(box,x,z,radius=0){const p=localPoint(box,x,z);return Math.abs(p.x)<box.w/2+radius&&Math.abs(p.z)<box.d/2+radius;}
export function insidePolygon(points,x,z){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function segmentBlocked(box,from,to,radius=.58){const a=localPoint(box,from.x,from.z),b=localPoint(box,to.x,to.z);let lo=0,hi=1;for(const [key,half] of [['x',box.w/2+radius],['z',box.d/2+radius]]){const delta=b[key]-a[key];if(Math.abs(delta)<1e-9){if(Math.abs(a[key])>=half)return false;}else{let enter=(-half-a[key])/delta,exit=(half-a[key])/delta;if(enter>exit)[enter,exit]=[exit,enter];lo=Math.max(lo,enter);hi=Math.min(hi,exit);if(lo>=hi)return false;}}return hi>0&&lo<1;}

// Separate outbound/return lanes join through round ends, without reversals.
export function cartRoute(s){const left=s.camp[0]+2,right=s.start[0]+7,z=s.camp[1]+18,r=2.2,length=Math.max(8,right-left);return{left,right:left+length,z,r,length,total:2*length+2*Math.PI*r};}
export function cartPoint(route,distance){const {left,right,z,r,length,total}=route;let d=((distance%total)+total)%total;if(d<length)return{x:left+d,z:z-r,heading:Math.PI/2};d-=length;if(d<Math.PI*r){const a=-Math.PI/2+d/r;return{x:right+r*Math.cos(a),z:z+r*Math.sin(a),heading:Math.atan2(-Math.sin(a),Math.cos(a))};}d-=Math.PI*r;if(d<length)return{x:right-d,z:z+r,heading:-Math.PI/2};d-=length;const a=Math.PI/2+d/r;return{x:left+r*Math.cos(a),z:z+r*Math.sin(a),heading:Math.atan2(-Math.sin(a),Math.cos(a))};}
