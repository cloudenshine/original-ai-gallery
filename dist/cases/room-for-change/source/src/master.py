from pathlib import Path
import subprocess,json
P=Path(__file__).resolve().parents[1]
def loud(args):
 r=subprocess.run(args,capture_output=True,text=True,check=True);return json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0]
m=loud(['ffmpeg','-hide_banner','-i',str(P/'audio/mix-pre.wav'),'-af','loudnorm=I=-14:TP=-1.8:LRA=9:print_format=json','-f','null','-']);(P/'qa/loudness-pass1.json').write_text(json.dumps(m,indent=2))
af=f"loudnorm=I=-14:TP=-1.8:LRA=9:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json"
m2=loud(['ffmpeg','-y','-hide_banner','-i',str(P/'audio/mix-pre.wav'),'-af',af,'-ar','48000','-c:a','pcm_s24le',str(P/'audio/mix.wav')]);(P/'qa/loudness-pass2.json').write_text(json.dumps(m2,indent=2))
subprocess.run(['ffmpeg','-y','-v','error','-i',str(P/'picture.mp4'),'-i',str(P/'audio/mix.wav'),'-map','0:v','-map','1:a','-c:v','copy','-af','volume=-0.3dB','-c:a','aac','-b:a','256k','-t','40','-movflags','+faststart',str(P/'deliverables/room-for-change.mp4')],check=True)
print(m2)
