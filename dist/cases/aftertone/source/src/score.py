#!/usr/bin/env python3
"""Original deterministic modal-string score. No samples, external assets or downloads.
Usage: python src/score.py --timeline src/timeline.json --out-dir audio
Standalone restoration of the original score; requires only NumPy, SciPy and timeline JSON.
"""
import argparse, hashlib, json, re
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR=48000
SECONDS=32
N=SR*SECONDS
SYNTHESIZER_VERSION="resonance-modal-strings-1.0"

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def pitch(name):
    m=re.match(r'([A-G])(#?)([0-9])',name)
    semis={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}[m[1]]+(bool(m[2]))
    return 440*2**(((int(m[3])+1)*12+semis-69)/12)

def synth_note(name,dur,voice,seed):
    f=pitch(name); t=np.arange(round(dur*SR))/SR
    rng=np.random.default_rng(seed)
    y=np.zeros_like(t)
    if voice=='air':
        # Bow pressure slowly raises harmonics; no attack transient or new pulse.
        env=(1-np.exp(-t/.4))*np.minimum(1,np.maximum(0,(dur-t)/1.8))
        for h in range(1,12):
            y+=np.sin(2*np.pi*f*h*t+0.012*np.sin(2*np.pi*4.1*t))*h**-1.8*np.exp(-t/(4.5+h*.15))
        breath=signal.sosfilt(signal.butter(2,[500,3000],fs=SR,btype='bandpass',output='sos'),rng.normal(size=len(t)))
        y=(y+.025*breath)*env*.7
    else:
        woody=voice=='wood'
        for h in range(1,19):
            # Small positive dispersion and faster upper-mode losses give rounded material.
            fh=f*h*np.sqrt(1+(0.000025 if woody else .000008)*h*h)
            decay=(1.9 if woody else 3.0)/(1+.18*(h-1)**1.2)
            a=(np.sin(h*np.pi*.22)**2+.1)/h**(1.1 if woody else 1.35)
            y+=a*np.cos(2*np.pi*fh*t+0.12*h)*np.exp(-t/decay)
        y*=1-np.exp(-t/(.007 if woody else .011))
        # Physical contact noise is quiet and contained inside the musical attack.
        noise=signal.sosfilt(signal.butter(2,3600,fs=SR,output='sos'),rng.normal(size=len(t)))
        y+=.012*noise*np.exp(-t/.025)*(1-np.exp(-t/.002))
        y*=np.minimum(1,(dur-t)/.20)
    return y

def add_mono(dst,y,start,amp,pan):
    pos=round(start*SR); end=min(N,pos+len(y)); y=y[:end-pos]
    if pos<0 or pos>=N: raise ValueError('Event outside score')
    dst[pos:end,0]+=y*amp*np.cos((pan+1)*np.pi/4)
    dst[pos:end,1]+=y*amp*np.sin((pan+1)*np.pi/4)

def room(x):
    # Sparse deterministic early reflections, then a gentle diffused 1.9s room.
    rng=np.random.default_rng(8621); length=round(1.9*SR)
    out=x.copy()
    for c in range(2):
        ir=np.zeros(length)
        for d,a in [(.041,.14),(.067,.095),(.103,.075),(.149,.05)]: ir[round((d+c*.003)*SR)]=a
        idx=rng.integers(round(.18*SR),length,900)
        ir[idx]+=rng.normal(size=len(idx))*.005*np.exp(-idx/(SR*.52))
        ir=signal.sosfilt(signal.butter(1,4300,fs=SR,output='sos'),ir)
        out[:,c]+=signal.fftconvolve(x[:,c],ir)[:N]
    return out

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--timeline',type=Path,required=True); ap.add_argument('--out-dir',type=Path,required=True); args=ap.parse_args()
    provenance={"timeline_sha256":sha(args.timeline),"synthesizer_version":SYNTHESIZER_VERSION}
    timeline=json.loads(args.timeline.read_text()); ev=timeline['events']
    for k in ['release','contact01','response1','reply1','contact12','response2','contact03','response3','crest1','crest2','crest3','returnA','returnB','markA','markB']: float(ev[k])
    notes=[]
    def n(t,p,v='main',a=.18,d=5,pan=-.15,cue=None):
        notes.append(dict(time=float(t),sample=round(t*SR),pitch=p,voice=v,gain=a,duration=d,pan=pan,shared_cue=cue))
    # I. A distinct melodic cell opens, then the lower voice answers.
    n(ev['release'],'D4',a=.29,cue='release');n(2.5,'A4',a=.21);n(3.25,'E5',a=.16)
    n(ev['response1'],'A3','wood',.22,5,.22,'response1'); n(6.5,'E4','wood',.17,4,.22);n(7.25,'D4','wood',.15,4,.22)
    n(7.75,'A4',a=.15);n(8.5,'E5',a=.13)
    # II. Two breathing contrapuntal phrases, F natural first; no event-per-note mapping.
    n(9.25,'F3','wood',.19,5,.22);n(9.5,'D4',a=.15);n(10.1,'A4',a=.125);n(10.7,'E5',a=.12)
    n(11.0,'C4','wood',.145,4,.22);n(11.4,'D4',a=.12)
    n(11.75,'G3','wood',.18,5,.22);n(12.5,'D4','wood',.14,4,.22);n(12.7,'E5',a=.13,d=4)
    n(13.5,'A3','wood',.16,5,.22);n(14,'E4','wood',.13,4,.22);n(14.25,'D5',a=.15,d=4)
    # III. One slow third voice, with explicitly independent upper/middle phrasing.
    n(15,'D3','air',.23,7,0);n(16,'A3','air',.12,5,0)
    n(16.5,'D4',a=.16);n(17.15,'A4',a=.13);n(17.8,'E5',a=.12)
    n(16.65,'F4','wood',.14,3,.22);n(17.6,'E4','wood',.12,3,.22)
    n(18,'G3','air',.21,5,0);n(18.35,'B3','wood',.14,4,.22);n(19,'D4','wood',.125,4,.22);n(18.75,'E5',a=.14,d=5)
    n(19.5,'A3','air',.15,5,0);n(19.8,'D4','wood',.13,4,.22);n(20.65,'E4','wood',.12,4,.22);n(21.1,'A4',a=.10,d=4)
    # Shared staggered convergence, F# replaces F natural, D add9 not a loud hit.
    n(ev['crest1'],'D3','air',.27,10,0,'crest1')
    n(ev['crest2'],'A3','wood',.14,9,.22,'crest2');n(ev['crest2'],'F#4','wood',.13,5,.22,'crest2')
    n(ev['crest3'],'E5',a=.13,d=2.25,cue='crest3')
    # Retraction: upper line exits, descending middle line releases into old body resonance.
    n(24.5,'F#4','wood',.095,2.75,.22);n(25.15,'E4','wood',.085,2.10,.22);n(25.85,'D4','wood',.075,1.40,.22)
    # Sustained A body remains inherited from before 28, not a final new phrase.
    n(23.0,'A3','air',.09,8.75,0)
    bgm=np.zeros((N,2)); sfx=np.zeros((N,2))
    for i,e in enumerate(notes): add_mono(bgm,synth_note(e['pitch'],e['duration'],e['voice'],1200+i),e['time'],e['gain'],e['pan'])
    fx=[]
    def texture(t,d,g,label,cue=None,pan=0):
        seed=800+len(fx); rng=np.random.default_rng(seed); tt=np.arange(round(d*SR))/SR
        noise=rng.normal(size=len(tt)); noise=signal.sosfilt(signal.butter(2,[450,2400],fs=SR,btype='bandpass',output='sos'),noise)
        env=np.sin(np.pi*np.minimum(tt/d,1))**2*np.exp(-tt/(d*.37))
        y=(noise+.45*np.sin(2*np.pi*420*tt)*np.exp(-tt/.035)+.16*np.sin(2*np.pi*970*tt)*np.exp(-tt/.018))*env*3.0
        add_mono(sfx,y,t,g,pan)
        fx.append(dict(time=t,sample=round(t*SR),duration=d,gain=g,label=label,shared_cue=cue,seed=seed))
    texture(1,.5,.018,'tension friction',pan=-.32)
    texture(ev['release'],.065,.018,'fingertip release','release',-.32)
    for key,g in [('contact01',.033),('reply1',.018),('contact12',.023),('contact03',.032),('crest1',.014),('crest2',.013),('crest3',.012),('returnA',.018),('returnB',.014)]: texture(ev[key],.11,g,'material contact',key,.2)
    for t,g in [(23.15,.013),(24.05,.011),(24.85,.009)]: texture(t,.17,g,'fiber settling')
    bgm=room(bgm);sfx=room(sfx)
    # No upper added onset after 28. Inherited body gets a slow final natural attenuation.
    t=np.arange(N)/SR; final=np.ones(N)
    k=t>28;final[k]=np.exp(-((t[k]-28)/1.75)**2)
    # Only the last 20 ms performs anti-click endpoint closure.
    final[-960:]*=np.linspace(1,0,960)**2
    bgm*=final[:,None];sfx*=final[:,None]
    mix=bgm+sfx
    true_peak=max(np.max(np.abs(signal.resample_poly(mix[:,c],4,1))) for c in range(2))
    gain=min(1,.80/true_peak)
    bgm*=gain;sfx*=gain;mix=bgm+sfx
    args.out_dir.mkdir(parents=True,exist_ok=True)
    technical={}
    for name,data in [('bgm',bgm),('sfx',sfx),('mix',mix)]:
        assert data.shape==(N,2) and np.isfinite(data).all()
        p=args.out_dir/(name+'.wav');wavfile.write(p,SR,data.astype(np.float32))
        tp=max(float(np.max(np.abs(signal.resample_poly(data[:,c],4,1)))) for c in range(2))
        technical[name]={'path':str(p),'sha256':sha(p),'sample_rate':SR,'samples_per_channel':N,'channels':2,'duration_s':32,'sample_peak':float(np.max(np.abs(data))),'true_peak_4x':tp,'true_peak_dbTP':20*np.log10(max(tp,1e-12)),'rms':float(np.sqrt(np.mean(data**2))),'last_750ms_rms':float(np.sqrt(np.mean(data[-36000:]**2))),'nonfinite':0,'clipped_samples':int(np.count_nonzero(np.abs(data)>=1))}
    report={'title':'余响织成光','sample_rate':SR,'duration_s':32,'timeline_path':str(args.timeline),'timeline_sha256':sha(args.timeline),'provenance':provenance,'synthesis':'Original modal plucked strings and slow bowed harmonic voices, deterministic seeds, no recorded assets.','master_gain':gain,'notes':notes,'sfx_events':fx,'technical':technical,'actual_listening_performed':False,'artistic_quality':'Not established by numeric checks; actual listening required.'}
    (args.out_dir/'score-events.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(technical,indent=2))
if __name__=='__main__': main()
