"""Original deterministic procedural chamber score and material foley. No sampled music."""
import json
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile
P=Path(__file__).resolve().parents[1]; SR=48000; DUR=36; N=SR*DUR
rng=np.random.default_rng(7302026)
music=np.zeros((N,2),np.float64); foley=np.zeros_like(music); room=np.zeros_like(music); cue=[]
def add(bus,s,at,g=.1,pan=0):
 i=round(at*SR); n=min(len(s),N-i)
 if n<=0:return
 a=np.sqrt((1-pan)*.5);b=np.sqrt((1+pan)*.5)
 bus[i:i+n,0]+=s[:n]*g*a;bus[i:i+n,1]+=s[:n]*g*b

def freq(m):return 440*2**((m-69)/12)
def lute(m,dur=1.4):
 f=freq(m);t=np.arange(int(SR*dur))/SR
 # Inharmonic plucked-string partials, body resonances, pick transient.
 s=np.zeros_like(t)
 for h in range(1,16):s+=np.sin(2*np.pi*f*h*(1+.000022*h*h)*t+.16*h)/(h**1.3)*np.exp(-t*(1.6+h*.37))
 env=(1-np.exp(-t*650))*np.minimum(1,(dur-t)*60)
 attack=rng.normal(0,1,len(t));attack=signal.sosfilt(signal.butter(2,[1300,6500],fs=SR,btype='bandpass',output='sos'),attack)
 return (s+.03*attack*np.exp(-t*130))*env*.55

def bow(m,dur=3.8):
 f=freq(m);t=np.arange(int(SR*dur))/SR;phase=2*np.pi*f*t+.012*f*np.sin(2*np.pi*5.1*t)/(5.1)
 s=sum(np.sin(h*phase+.06*h)/(h**1.8) for h in range(1,13))
 env=np.minimum(1,t/.55)*np.minimum(1,(dur-t)/1.0)
 return s*env*.26

def note(at,m,dur=1.4,g=.1,pan=0):add(music,lute(m,dur),at,g,pan);cue.append({'t':at,'type':'plucked_note','midi':m})
b=5/6
# A spare question: two notes, an answer lower than expected.
for at,m,g in [(0.45,62,.09),(1.7,69,.075),(3.1,65,.085),(4.2,64,.08)]:note(at,m,1.55,g,-.15)
melody=[(5,62),(5+b,65),(5+2*b,69),(5+3*b,72),(5+4*b,69),(5+5*b,67),(10,65),(10+b,64),(10+2*b,62),(10+3*b,60),(13.33,62)]
for at,m in melody:note(at,m,1.8,.095,-.18)
for at,m in [(5,38),(6.67,45),(8.33,41),(10,36),(11.67,43),(13.33,38)]:note(at,m,2,.12,.12)
# Release is articulated slowly, then gathers its own momentum.
for at,m in [(15.4,50),(16.2,62),(17,65),(17.83,69),(18.67,72),(19.08,74),(19.5,72),(19.92,69),(20.33,67),(20.75,69)]:note(at,m,1.35,.11,.12)
for at,m in [(16.2,38),(18.67,41),(20.33,45)]:note(at,m,2,.1,-.12)
# Rose pigment arrives with a sustained, warming sixth; not a borrowed melody.
for at,m,d,g,pan in [(22.2,53,4.7,.16,-.35),(22.35,60,4.5,.115,.25),(22.55,69,4.3,.08,-.1),(25.5,55,3.6,.14,-.25),(25.6,62,3.5,.10,.3),(25.9,71,3.2,.07,0),(28.5,50,5.4,.13,-.3),(28.6,57,5.4,.1,.3),(28.75,65,5.2,.08,.05)]:
 add(music,bow(m,d),at,g,pan);cue.append({'t':at,'type':'bowed_note','midi':m})
for at,m in [(22.2,77),(23.03,76),(23.87,72),(24.7,74),(25.53,71),(26.37,69),(27.2,67),(28.5,65),(30.17,62),(32.67,74)]:note(at,m,2.3,.085,.15)
for at,m in [(22.2,41),(25.5,43),(27.17,45),(28.5,38),(31,45)]:note(at,m,3,.115,-.1)
# Small early reflections. All are generated and silence-gated after processing.
for delay,g,swap in [(.039,.13,False),(.083,.1,True),(.127,.075,False),(.181,.052,True),(.277,.037,False)]:
 k=int(delay*SR);music[k:]+=music[:-k,::-1 if swap else 1]*g

def noise(dur,lo,hi):
 a=rng.normal(0,1,int(dur*SR));s=signal.sosfilt(signal.butter(3,[lo,hi],fs=SR,btype='bandpass',output='sos'),a);return s/(np.std(s)+1e-9)
def shaped(a,attack=.03,release=.1):
 t=np.arange(len(a))/SR;return a*np.minimum(1,t/attack)*np.minimum(1,(len(a)/SR-t)/release)
def ping(at,f=3100,g=.035,pan=0):
 t=np.arange(int(.16*SR))/SR;s=(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*1.414*t))*np.exp(-t*40);s*=np.minimum(1,t/.001);add(foley,s,at,g,pan)
def brush(at,dur,g,pan=0,lo=750,hi=4400):
 s=shaped(noise(dur,lo,hi),.025,.12);t=np.arange(len(s))/SR;s*=.55+.3*np.sin(2*np.pi*13*t)+.15*np.sin(2*np.pi*37*t)
 add(foley,s,at,g,pan)
# Engraving grain rises and falls in separate cuts, not one arbitrary noise wash.
for k in range(29):
 at=.1+k*.245;dur=.16+.05*np.sin(k);brush(at,dur,.008 if at<3.5 else .011,pan=-.24+.15*np.sin(k),lo=2100,hi=7200)
 if k%5==0:ping(at+dur,3900+k*45,.012,-.2)
# Circular scribe, mark, paper anticipation, opening, lifting.
brush(10,.9,.009,.5,1800,6800);ping(10,2800,.021,.5)
brush(13.7,1.1,.009,-.12,500,4800)
for at in [15.4,15.74,16.19,16.72]:
 brush(at,.35,.015,-.15,400,4300);ping(at,1450,.014,-.1)
t=np.arange(int(.35*SR))/SR;add(foley,np.sin(2*np.pi*(135*t-65*t*t))*np.exp(-t*19),15.4,.09,-.1)
brush(17,.5,.018,.15,900,6200)
# Wind is shaped along the seed's flight, and carried through the camera movement.
s=shaped(noise(10.1,130,1650),1.2,2);t=np.arange(len(s))/SR;s*=.6+.12*np.sin(t*2.2);add(room,s,17.5,.015,.15)
# A single water drop followed by a granular wet brush.
t=np.arange(int(.34*SR))/SR;phase=2*np.pi*(800*t+800*t*t);drop=np.sin(phase)*np.exp(-t*21)*(1-np.exp(-t*900));add(foley,drop,22.2,.07,.4)
brush(22.27,1.75,.012,.4,400,2600)
for at in np.arange(28.5,29.12,.055):ping(at,2600+300*rng.random(),.008,0)
# Near-silent room with faint clock only in the early workshop.
a=shaped(noise(36,70,300),.4,2);add(room,a,0,.0015,0)
for at in range(0,14,2):ping(at+.12,850,.004,-.6)
for lo,hi in [(14.5,15.4),(21.5,22.2)]:
 for bus in [music,foley,room]:
  a=int(lo*SR);bb=int(hi*SR);fade=int(.025*SR);bus[a-fade:a]*=np.linspace(1,0,fade)[:,None];bus[a:bb]=0;bus[bb:bb+fade]*=np.linspace(0,1,fade)[:,None]
fade=np.ones(N);fade[int(34*SR):]=np.linspace(1,0,N-int(34*SR))
for a in [music,foley,room]:a*=fade[:,None]
# Guard against denormals and accidental clipping. Master normalization is external two-pass.
for name,bus in [('music',music),('foley',foley),('ambience',room)]:wavfile.write(P/f'{name}.wav',SR,np.int16(np.clip(bus,-1,1)*32767))
mix=music+foley+room;wavfile.write(P/'mix-pre.wav',SR,np.int16(np.clip(mix,-1,1)*32767))
(P/'audio-cues.json').write_text(json.dumps({'sr':SR,'duration':36,'composition':'Original procedural lute-like pluck and bowed harmonics. Not recordings of real instruments.','music_events':cue,'silences':[[14.5,15.4],[21.5,22.2]],'pre_peak':float(np.max(np.abs(mix)))},indent=2))
print('audio generated',float(np.max(np.abs(mix))))
