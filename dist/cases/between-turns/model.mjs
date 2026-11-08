// Ideal planetary gear kinematics. Degrees, pitch radii 120/60/240.
export function pose(sun,mode='ring'){
 if(!Number.isFinite(sun)||!['ring','carrier'].includes(mode))throw new RangeError('Invalid input');
 const carrier=mode==='ring'?sun/3:0,ring=mode==='ring'?0:-sun/2,planet=carrier-2*(sun-carrier);
 return {sun,carrier,ring,planet,centers:[0,120,240].map(a=>{const t=(a+carrier)*Math.PI/180;return {x:180*Math.cos(t),y:180*Math.sin(t)};})};
}
export function gear(n,r,internal=false){
 const points=[];
 for(let i=0;i<n;i++)for(const [f,offset] of [[-.4,-4.5],[-.2,4.5],[.2,4.5],[.4,-4.5]]){const a=(i+f)*2*Math.PI/n,rr=r+(internal?-offset:offset);points.push(`${(rr*Math.cos(a)).toFixed(3)},${(rr*Math.sin(a)).toFixed(3)}`);}
 return 'M'+points.join('L')+'Z';
}
