"""Original additive-synthesis score and illustrative event chime. No sampled recordings."""
from pathlib import Path
import json,wave,numpy as np
ROOT=Path(__file__).resolve().parent
S=json.loads((ROOT/'timeline.json').read_text());sr=S['sampleRate'];n=int(sr*S['duration']);t=np.arange(n)/sr
bg=np.zeros((n,2));fx=np.zeros((n,2))
freq={'D3':146.832384,'A3':220,'G3':195.997718,'D4':293.664768,'E4':329.627557,'F4':349.228231,'G4':391.995436,'A4':440,'B4':493.883301}
def add(target,start,f,dur,amp,pan,chime=False):
 k=int(round(start*sr));length=min(int(dur*sr),n-k);u=np.arange(length)/sr
 env=(1-np.exp(-u/0.012))*np.exp(-u/(0.65 if chime else 1.3))
 harmonics=[(1,1),(2.01,.25),(3.98,.10)] if chime else [(1,1),(2,.22),(3,.07)]
 a=sum(g*np.sin(2*np.pi*f*h*u)*np.exp(-u*(h-1)*.4) for h,g in harmonics)*env*amp
 target[k:k+length,0]+=a*np.sqrt((1-pan)/2);target[k:k+length,1]+=a*np.sqrt((1+pan)/2)
for i,(at,note) in enumerate(S['notes']):add(bg,at,freq[note],4,.115 if at<30 else .09,(-.2 if i%2 else .2))
# Crossfade harmonic color gently at the actual mode switch, then return for resolution.
blend=np.clip((t-S['switchAt'])/2,0,1)*(1-np.clip((t-24)/6,0,1))
pad=(np.sin(2*np.pi*freq['D3']*t)+.55*np.sin(2*np.pi*freq['A3']*t))*(1-blend)+(np.sin(2*np.pi*freq['G3']*t)+.55*np.sin(2*np.pi*freq['D4']*t))*blend
pad*=.028*np.clip(t/1.5,0,1);bg+=pad[:,None]
add(fx,S['switchAt'],880,3,.13,0,True)
fade=np.clip((S['duration']-t)/3,0,1)**2;bg*=fade[:,None];fx*=fade[:,None];mix=bg+fx
ROOT.joinpath('audio').mkdir(exist_ok=True)
for name,a in [('bgm',bg),('sfx',fx),('mix',mix)]:
 assert np.max(np.abs(a))<.95
 with wave.open(str(ROOT/'audio'/f'{name}.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((a*32767).astype('<i2').tobytes())
report={'sampleRate':sr,'samples':n,'duration':S['duration'],'switchSample':int(S['switchAt']*sr),'bgmPeak':float(abs(bg).max()),'sfxPeak':float(abs(fx).max()),'mixPeak':float(abs(mix).max()),'sfxNonzeroBeforeSwitch':bool(np.any(fx[:int(S['switchAt']*sr)])),'listeningReview':'not performed; objective PCM checks only'}
(ROOT/'audio'/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
