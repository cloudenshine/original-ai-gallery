"""Deterministic original synthesized score; no samples or voices. 48kHz stereo PCM -> FLAC."""
import numpy as np, subprocess, json
from pathlib import Path
root=Path(__file__).parent; spec=json.loads((root/'cues.json').read_text()); sr=48000; duration=spec['format']['duration']; n=sr*duration
bgm=np.zeros((n,2)); sfx=np.zeros((n,2))
def note(dst,start,dur,freq,amp,pan=0):
 i=int(start*sr); m=min(int(dur*sr),n-i); t=np.arange(m)/sr
 env=np.minimum(1,t/.45)*np.minimum(1,(dur-t)/1.1)
 wave=(np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*2*freq*t)+.08*np.sin(2*np.pi*3*freq*t))*env*amp
 dst[i:i+m,0]+=wave*(1-pan*.25);dst[i:i+m,1]+=wave*(1+pan*.25)
for j,part in enumerate(spec['storyboard']):
 st=part['time'][0]; roots=[130.8128,146.8324,130.8128]; r=roots[j]
 for q,f in enumerate([r,r*1.5,r*2]):note(bgm,st,18,f,.032,(-1,0,1)[q])
 for b in range(0,16,4):
  for q,mul in enumerate([2,2.5,3]):note(bgm,st+b+q*.55,2.2,r*mul,.018,(-1,0,1)[q])
 if j:
  i=int(st*sr);t=np.arange(int(.35*sr))/sr; wave=.13*np.sin(2*np.pi*(660*t+160*t*t))*np.exp(-t*16)*np.minimum(1,t/.008)
  sfx[i:i+len(t)]+=wave[:,None]
fade=np.minimum(1,np.arange(n)/sr/1.0)*np.minimum(1,(duration-np.arange(n)/sr)/1.8)
bgm*=fade[:,None]
(root/'audio').mkdir(exist_ok=True)
for name,a in [('bgm',bgm),('sfx',sfx),('mix',bgm+sfx)]:
 pcm=np.round(np.clip(a,-1,1)*8388607).astype('<i4')*256
 subprocess.run(['ffmpeg','-v','error','-y','-f','s32le','-ar',str(sr),'-ac','2','-i','pipe:0','-c:a','flac',str(root/'audio'/f'{name}.flac')],input=pcm.tobytes(),check=True)
print('Original BGM and selection SFX generated; peak',float(np.max(np.abs(bgm+sfx))))
