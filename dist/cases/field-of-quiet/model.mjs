/* Two coherent, equal-strength ideal monopoles in free space; horizontal slice.
   r is softened at 0.15 m. Height/color are normalized time-averaged intensity,
   NOT particle displacement, loudness in phons, or calibrated acoustic SPL. */
export const SPEED=343;
export const DEFAULTS=Object.freeze({frequency:220,separation:2.4,phase:0});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function sanitize(p={}){
 const val=(k)=>Number.isFinite(Number(p[k]))&&p[k]!==undefined?Number(p[k]):DEFAULTS[k];
 return {frequency:clamp(val('frequency'),140,520),separation:clamp(val('separation'),.8,3.6),phase:((val('phase')%360)+360)%360};
}
export function wavelength(f){return SPEED/f;}
export function interference(a,b,delta){
 const real=a+b*Math.cos(delta),imag=b*Math.sin(delta);
 const amplitude=Math.hypot(real,imag)/(a+b);
 const intensity=clamp(amplitude*amplitude,0,1);
 return {intensity,amplitude:Math.sqrt(intensity),decibels:Math.max(-80,10*Math.log10(Math.max(1e-8,intensity)))};
}
export function sampleField(x,z,params={}){
 const p=sanitize(params),rA=Math.max(.15,Math.hypot(x+p.separation/2,z)),rB=Math.max(.15,Math.hypot(x-p.separation/2,z));
 const pathDifference=rA-rB,delta=2*Math.PI*pathDifference/wavelength(p.frequency)+p.phase*Math.PI/180;
 return {...interference(1/rA,1/rB,delta),rA,rB,pathDifference,delta,wavelength:wavelength(p.frequency)};
}
