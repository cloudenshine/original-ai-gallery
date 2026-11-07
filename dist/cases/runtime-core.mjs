export function clockState(duration,reducedMotion=false){return {t:0,duration,playing:!reducedMotion}}
export function advance(s,delta){if(!s.playing||!Number.isFinite(delta)||delta<0)return {...s};return {...s,t:(s.t+delta)%s.duration}}
export function seek(s,t){return {...s,t:Math.max(0,Math.min(s.duration,Number.isFinite(t)?t:0)),playing:false}}
export function reset(s){return {...s,t:0}}
export function parameterValue(v,p){return Number.isFinite(v)?Math.max(p.min,Math.min(p.max,v)):p.value}
