from pathlib import Path
import subprocess,json,re
p=Path(__file__).resolve().parents[1]
r=subprocess.run(['ffmpeg','-hide_banner','-i',str(p/'mix-pre.wav'),'-af','loudnorm=I=-14:TP=-1.2:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
m=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0];(p/'qa/loudness-pass1.json').write_text(json.dumps(m,indent=2))
af=f"loudnorm=I=-14:TP=-1.2:LRA=9:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json"
r=subprocess.run(['ffmpeg','-y','-hide_banner','-i',str(p/'mix-pre.wav'),'-af',af,'-ar','48000','-c:a','pcm_s24le',str(p/'mix.wav')],capture_output=True,text=True,check=True)
m2=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0];(p/'qa/loudness-pass2.json').write_text(json.dumps(m2,indent=2))
subprocess.run(['ffmpeg','-y','-v','error','-i',str(p/'picture.mp4'),'-i',str(p/'mix.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','256k','-t','36','-movflags','+faststart',str(p/'letter-to-the-wind.mp4')],check=True)
print(m2)
