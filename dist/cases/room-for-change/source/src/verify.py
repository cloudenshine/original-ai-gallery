from pathlib import Path
import json,subprocess,hashlib,numpy as np
from scipy.io import wavfile
from PIL import Image,ImageDraw,ImageFont
P=Path(__file__).resolve().parents[1];F=P/'deliverables/room-for-change.mp4';Q=P/'qa'
def run(args):return subprocess.run(args,capture_output=True,text=True,check=True)
j=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(F)]).stdout);(Q/'ffprobe.json').write_text(json.dumps(j,indent=2));v=next(s for s in j['streams'] if s['codec_type']=='video');a=next(s for s in j['streams'] if s['codec_type']=='audio')
assert(v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==(1920,1080,'24/1',960);assert abs(float(v['duration'])-40)<.002;assert a['channels']==2
# Complete decode and every-frame numerical screening, not full-speed perceptual review.
p=subprocess.Popen(['ffmpeg','-v','error','-i',str(F),'-vf','scale=320:180','-f','rawvideo','-pix_fmt','rgb24','pipe:1'],stdout=subprocess.PIPE,stderr=subprocess.PIPE);means=[];diff=[];prev=None
while True:
 b=p.stdout.read(320*180*3)
 if not b:break
 assert len(b)==320*180*3
 im=np.frombuffer(b,dtype=np.uint8).astype(float);means.append(float(im.mean()))
 if prev is not None:diff.append(float(np.abs(im-prev).mean()))
 prev=im
err=p.stderr.read().decode();assert p.wait()==0 and not err and len(means)==960 and min(means)>100
r=run(['ffmpeg','-hide_banner','-i',str(F),'-af','loudnorm=I=-14:TP=-1.2:LRA=9:print_format=json','-f','null','-']);l=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0];(Q/'final-loudness.json').write_text(json.dumps(l,indent=2));assert -15<float(l['input_i'])<-13;assert float(l['input_tp'])<=-1.2
run(['ffmpeg','-y','-v','error','-i',str(F),'-vn','-c:a','pcm_s16le',str(Q/'decoded-audio.wav')]);sr,au=wavfile.read(Q/'decoded-audio.wav');au=au.astype(float)/32768;sil=[]
for lo,hi in [(10.1,11.15),(22.6,23.65)]:
 s=au[int(lo*sr):int(hi*sr)];db=float(20*np.log10(np.sqrt(np.mean(s*s))+1e-12));sil.append({'from':lo,'to':hi,'rms_dbfs':db});assert db<-55
report={'resolution':[1920,1080],'fps':24,'frames':len(means),'video_seconds':float(v['duration']),'audio_seconds':float(a['duration']),'audio_channels':a['channels'],'sample_rate':a['sample_rate'],'lufs':float(l['input_i']),'true_peak_dbtp':float(l['input_tp']),'all_frame_decode':'pass','min_frame_mean':min(means),'maximum_adjacent_MAD':max(diff),'max_MAD_frame':int(np.argmax(diff)+1),'near_silences':sil,'sha256':hashlib.sha256(F.read_bytes()).hexdigest(),'real_time_audiovisual_viewing':'not_completed','subjective_listening':'not_completed','boundary':'Contact sheets, numerical audio measurements, and complete decoding are not continuous playback or subjective listening.'};(Q/'verification.json').write_text(json.dumps(report,indent=2))
# Two independent sample offsets from the encoded deliverable.
font=ImageFont.truetype(str(P/'assets/NotoSansSC-Regular.otf'),19)
for batch,times in [('contact-a',[0,3,5.625,7.5,10.5,13.5,14.5,16.5,18,20.625,22,24.5,25.5,28,29,32,36,39.5]),('contact-b',[1,4.75,6.875,8.5,11.5,13.25,15.75,17.75,19.75,20.25,21.5,23.875,26.5,27.875,30,34.5,37,39.958])]:
 sheet=Image.new('RGB',(1440,6*296),'#F2F0EA');d=ImageDraw.Draw(sheet)
 for i,t in enumerate(times):
  f=Q/f'{batch}-{t:.3f}.jpg';run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(F),'-frames:v','1','-q:v','2',str(f)]);im=Image.open(f);im.thumbnail((480,270));x=i%3*480;y=i//3*296;sheet.paste(im,(x,y));d.text((x+10,y+272),f'{t:.3f} s',font=font,fill='#141414')
 sheet.save(Q/f'{batch}.jpg',quality=94)
run(['ffmpeg','-y','-v','error','-ss','37.5','-i',str(F),'-frames:v','1','-q:v','1',str(P/'deliverables/poster.jpg')])
print(json.dumps(report,indent=2))
