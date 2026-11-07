"""Original procedural score + dry print Foley. No downloaded audio or samples."""
from pathlib import Path
import json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
P=Path(__file__).resolve().parents[1]; TL=json.loads((P/'timeline.json').read_text()); SR=48000; DUR=TL['duration']; N=int(DUR*SR); RNG=np.random.default_rng(70519)
music=np.zeros((N,2)); foley=np.zeros((N,2)); ambience=np.zeros((N,2)); notes=[]
def add(buf,s,at,gain=1,pan=0):
 i=round(at*SR); j=min(N,i+len(s));
 if j<=i:return
 s=s[:j-i]*gain;buf[i:j,0]+=s*np.sqrt((1-pan)/2);buf[i:j,1]+=s*np.sqrt((1+pan)/2)
def tone(midi,dur=.7,kind='mallet'):
 t=np.arange(round(dur*SR))/SR;f=440*2**((midi-69)/12)
 if kind=='mallet':s=np.sin(2*np.pi*f*t+1.5*np.sin(2*np.pi*f*3.98*t)*np.exp(-10*t))+.2*np.sin(2*np.pi*2*f*t)*np.exp(-12*t);env=np.minimum(t/.004,1)*np.exp(-6*t)
 else:s=np.sin(2*np.pi*f*t)+.3*np.sin(4*np.pi*f*t)+.15*np.sin(6*np.pi*f*t);env=np.minimum(t/.01,1)*np.exp(-5*t)
 return s*env*np.minimum((dur-t)/.03,1)
def noise(dur,low=1200,high=6000):
 t=np.arange(round(dur*SR))/SR;s=RNG.normal(0,1,len(t));s=sosfilt(butter(2,[low,high],btype='bandpass',fs=SR,output='sos'),s)
 return s,t
def clack(power=1):
 s,t=noise(.18,900,7000);body=np.sin(2*np.pi*460*t)+.25*np.sin(2*np.pi*1300*t);return power*(.24*s*np.exp(-45*t)+.28*body*np.exp(-32*t))*np.minimum(t/.0015,1)
def slide(d):
 s,t=noise(d,1000,5500);return s*(.5+.5*np.sin(2*np.pi*34*t))*np.sin(np.pi*t/d)**2*.10
beat=60/TL['bpm']
# The opening phrase fills eight steps. Its resolution leaves the eighth step unplayed.
for k in range(64):
 at=k*beat
 kind='mallet'
 if any(a<=at<b for a,b in TL['silences']):continue
 if 7.5<=at<10:continue
 if at<10:
  seq=[60,67,64,72,67,62,69,65];m=seq[k%8];g=.20
 elif at<17.5:
  if k%2:continue
  m=45;g=.12;kind='bass'
 elif at<25:
  if k%4!=0:continue
  m=60 if k%8==0 else 67;g=.11
 else:
  seq=[60,64,67,72,69,67,64,None];m=seq[k%8];g=.20
  if m is None:continue
 if at>=37.5:
  if k not in [60,62]:continue
  m=60 if k==60 else 67;g=.14
 add(music,tone(m,kind=kind),at,g,pan=((k%4)-1.5)*.13);notes.append({'time':at,'midi':m,'instrument':'original FM wood mallet','gain':g})
 if k%4==0 and at<37.5:
  root=48 if at<10 or at>=25 else 45
  add(music,tone(root,.85,'bass'),at,.16,0);notes.append({'time':at,'midi':root,'instrument':'harmonic bass','gain':.16})
music[int(7.5*SR):int(10*SR)]=0
# Restrained mechanical rhythm, thinning instead of speeding up at the resolution.
for k in range(64):
 at=k*beat
 if any(a<=at<b for a,b in TL['silences']):continue
 if at>=37.5:continue
 if at>=25 and k%8 in [5,7]:continue
 if 10<=at<25 and k%2:continue
 s,t=noise(.075,3500,10000);add(music,s*np.exp(-60*t),at,.045,pan=.12)
 if k%4 in [0,2] and not(7.5<=at<10):
  t=np.arange(int(.18*SR))/SR;phase=2*np.pi*(58*t+35*.03*(1-np.exp(-t/.03)));kick=(np.sin(phase)+.17*np.sin(2*phase))*np.exp(-28*t);add(music,kick,at,.12)
 if k%4==3 and at<10:
  s,t=noise(.10,700,4500);add(music,s*np.exp(-45*t),at,.09)
# Shared visual events own all material sounds and special melodic answers.
for e in TL['events']:
 at=e['t']; typ=e['type'];pan=-.25 if e['id']=='N' else .12
 if typ=='slide-start':
  add(foley,slide(e['duration']),at,.65,pan)
  if e['id'] in ['D','E']:add(music,tone(65 if e['id']=='D' else 69,.9),at,.18,.1)
 elif typ=='blocked':add(foley,clack(.6),at,.65,-.2)
 elif typ in ['archive','align','arrive','reflow','meeting']:
  add(foley,clack(),at,.7 if typ!='meeting' else 1.05,pan)
  if 'pitch' in e:add(music,tone(e['pitch'],1.1),at,.30 if typ=='meeting' else .20,pan)
 elif typ=='label':add(foley,clack(.4),at,.3,-.25)
 elif typ=='knife':add(foley,clack(.65),at,.45,-.25)
# Only the orange exception carries a quiet continuous pitch while it approaches.
for a,b,f0,f1,g in [(6.875,7.5,330,440,.065),(8.125,8.75,440,330,.045),(23.75,25,330,523.25,.08)]:
 t=np.arange(round((b-a)*SR))/SR;phase=2*np.pi*(f0*t+.5*(f1-f0)/(b-a)*t*t);s=np.sin(phase)*np.sin(np.pi*t/(b-a))*.8;add(foley,s,a,g,-.2)
# Very quiet press-room air. It is a designed noise bed, not a location recording.
for ch in [0,1]:
 s=RNG.normal(0,1,N);s=sosfilt(butter(2,[1800,6500],btype='bandpass',fs=SR,output='sos'),s);ambience[:,ch]=s*.0007
for buf in [music,foley,ambience]:
 for a,b in TL['silences']:
  ia,ib=round(a*SR),round(b*SR);r=240
  buf[ia-r:ia]*=np.linspace(1,0,r)[:,None];buf[ia:ib]=0;buf[ib:ib+r]*=np.linspace(0,1,r)[:,None]
 # Last 0.75 s is a tail, not an extra beat or sign-off.
 q=int(.75*SR);buf[-q:]*=np.linspace(1,0,q)[:,None]
P.joinpath('audio').mkdir(exist_ok=True)
for name,buf in [('music',music),('foley',foley),('ambience',ambience)]:wavfile.write(P/f'audio/{name}.wav',SR,np.int16(np.clip(buf,-1,1)*32767))
mix=music+foley+ambience;assert np.max(np.abs(mix))<1
wavfile.write(P/'audio/mix-pre.wav',SR,np.int16(mix*32767));(P/'audio/score.json').write_text(json.dumps({'bpm':96,'notes':notes,'events':TL['events'],'silences':TL['silences'],'source':'Original synthesis; no samples or external recordings'},indent=2))
print(json.dumps({'samples':N,'channels':2,'peak_dbfs':float(20*np.log10(np.max(np.abs(mix)))),'original_notes':len(notes),'shared_events':len(TL['events'])}))
