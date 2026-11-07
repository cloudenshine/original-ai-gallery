from pathlib import Path
import json,hashlib,subprocess
from PIL import Image,ImageDraw,ImageFont
import numpy as np
from scipy.io import wavfile
P=Path(__file__).resolve().parents[1]; F=P/'letter-to-the-wind.mp4';QA=P/'qa'
def cmd(args):return subprocess.run(args,capture_output=True,text=True,check=True).stdout
probe=json.loads(cmd(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(F)]));(QA/'ffprobe.json').write_text(json.dumps(probe,indent=2))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert(v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==(1920,1080,'24/1',864)
assert abs(float(v['duration'])-36)<.002 and abs(float(a['duration'])-36)<.05
# Every decoded frame is checked at low resolution. This is a machine continuity check, not aesthetic viewing.
f=subprocess.Popen(['ffmpeg','-v','error','-i',str(F),'-vf','scale=320:180','-f','rawvideo','-pix_fmt','rgb24','pipe:1'],stdout=subprocess.PIPE)
size=320*180*3;prev=None;diff=[];means=[];frames=0
while True:
 b=f.stdout.read(size)
 if not b:break
 assert len(b)==size
 im=np.frombuffer(b,np.uint8).reshape(180,320,3).astype(float);means.append(float(im.mean()))
 if prev is not None:diff.append(float(np.abs(im-prev).mean()))
 prev=im;frames+=1
assert f.wait()==0 and frames==864 and min(means)>100
# Loudness measured on final AAC, not just input WAV.
r=subprocess.run(['ffmpeg','-hide_banner','-i',str(F),'-vn','-af','loudnorm=I=-14:TP=-1.2:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);loud=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0];(QA/'final-loudness.json').write_text(json.dumps(loud,indent=2))
subprocess.run(['ffmpeg','-y','-v','error','-i',str(F),'-vn','-acodec','pcm_s16le',str(QA/'decoded-audio.wav')],check=True)
sr,audio=wavfile.read(QA/'decoded-audio.wav');audio=audio.astype(float)/32768
sil=[]
for lo,hi in [(14.53,15.37),(21.53,22.17)]:
 s=audio[int(lo*sr):int(hi*sr)];sil.append({'from':lo,'to':hi,'rms_dbfs':float(20*np.log10(np.sqrt(np.mean(s*s))+1e-12))})
result={'resolution':[v['width'],v['height']],'fps':v['r_frame_rate'],'decoded_frames':frames,'video_seconds':float(v['duration']),'audio_seconds':float(a['duration']),'audio_channels':a['channels'],'sample_rate':a['sample_rate'],'final_lufs':float(loud['input_i']),'final_true_peak_dbtp':float(loud['input_tp']),'min_frame_mean':min(means),'max_adjacent_frame_MAD':max(diff),'max_adjacent_frame_index':int(np.argmax(diff)+1),'near_silences':sil,'sha256':hashlib.sha256(F.read_bytes()).hexdigest(),'full_speed_human_av_review':False,'limitation':'No continuous audiovisual perception tool available; all-frame decode, numerical audio checks, contact sheet and action strips do not establish full aesthetic playback or listening approval.'}
assert float(loud['input_tp'])<=-1.0 and -15<float(loud['input_i'])<-13
(QA/'verification.json').write_text(json.dumps(result,indent=2))
# Fresh delivered-video frames for review, not stale pre-encode renders.
times=[0,3,6,9,12,15,16,17,18,20,23,26,29,32,35.5]
imgs=[]
for t in times:
 f=QA/f'delivery-{t:05.2f}.jpg';subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(F),'-frames:v','1','-q:v','2',str(f)],check=True);imgs.append((t,f))
font=ImageFont.truetype(str(P/'assets/NotoSerif-Regular.ttf'),16)
out=Image.new('RGB',(1440,1500),'#e5dbc4');d=ImageDraw.Draw(out)
for i,(t,f) in enumerate(imgs):
 im=Image.open(f);im.thumbnail((480,270));x=i%3*480;y=i//3*300;out.paste(im,(x,y));d.text((x+12,y+274),f'{t:04.1f} s',font=font,fill='#332516')
out.save(QA/'delivery-contact.jpg',quality=94)
Image.open(QA/'delivery-35.50.jpg').save(P/'poster.jpg',quality=96)
print(json.dumps(result,indent=2))
