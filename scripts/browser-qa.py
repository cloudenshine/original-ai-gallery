from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time,hashlib
from PIL import Image,ImageDraw
r=Path(__file__).resolve().parents[1];out=r/'evidence/browser';out.mkdir(parents=True,exist_ok=True)
ids=[p.name for p in (r/'dist/cases').iterdir() if p.is_dir() and (p/'scene.mjs').exists()]
reports=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for id in sorted(ids):
  page=browser.new_page(viewport={'width':1440,'height':1300},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:8767/cases/'+id+'/');page.wait_for_selector('#scene[data-time]');page.wait_for_timeout(100)
  t0=float(page.locator('#scene').get_attribute('data-time'));page.wait_for_timeout(300);t1=float(page.locator('#scene').get_attribute('data-time'))
  assert t1>t0, (id,'playing time did not advance')
  page.locator('#play').click();a=page.locator('#scene').evaluate('(c)=>c.toDataURL()');time_a=page.locator('#scene').get_attribute('data-time');page.wait_for_timeout(180);assert page.locator('#scene').evaluate('(c)=>c.toDataURL()')==a,(id,'pause unstable')
  page.locator('#seek').evaluate('(e)=>{e.value=5;e.dispatchEvent(new Event("input",{bubbles:true}))}');assert abs(float(page.locator('#scene').get_attribute('data-time'))-5)<.02
  page.locator('#scene').screenshot(path=str(out/(id+'-canvas.png')))
  page.screenshot(path=str(out/(id+'-desktop.png')),full_page=True)
  a=page.locator('#scene').evaluate('(c)=>c.toDataURL()')
  page.locator('#seek').evaluate('(e)=>{e.value=1.5;e.dispatchEvent(new Event("input",{bubbles:true}))}');b=page.locator('#scene').evaluate('(c)=>c.toDataURL()');assert a!=b,(id,'time does not change render')
  page.locator('#seek').evaluate('(e)=>{e.value=5;e.dispatchEvent(new Event("input",{bubbles:true}))}')
  page.locator('#seek').evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}))}',1 if id=='signal-letterpress' else 5)
  page.locator('#parameter').evaluate('(e)=>{e.value=e.min;e.dispatchEvent(new Event("input",{bubbles:true}))}');low=page.locator('#scene').evaluate('(c)=>c.toDataURL()');page.locator('#parameter').evaluate('(e)=>{e.value=e.max;e.dispatchEvent(new Event("input",{bubbles:true}))}');high=page.locator('#scene').evaluate('(c)=>c.toDataURL()');assert low!=high,(id,'parameter not visible')
  page.locator('#reset').click();assert page.locator('#scene').get_attribute('data-time')=='0.0000'
  # Visual samples across a whole loop; automated state/diff checks are not full human playback review.
  duration=float(page.locator('#seek').get_attribute('max'));frames=[]
  for k in range(8):
   tt=duration*k/8
   page.locator('#seek').evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}))}',tt)
   f=out/(id+f'-sample-{k}.png');page.locator('#scene').screenshot(path=str(f));frames.append(f)
  montage=Image.new('RGB',(1200,400),'#ddd')
  for i,f in enumerate(frames):im=Image.open(f);im.thumbnail((300,200));montage.paste(im,((i%4)*300,(i//4)*200))
  montage.save(out/(id+'-sequence.jpg'))
  page.set_viewport_size({'width':390,'height':844});page.locator('#seek').evaluate('(e)=>{e.value=5;e.dispatchEvent(new Event("input",{bubbles:true}))}');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(id,'mobile overflow');page.screenshot(path=str(out/(id+'-mobile.png')),full_page=True)
  assert not errors,(id,errors)
  page.close()
  reduced=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');reduced.goto('http://127.0.0.1:8767/cases/'+id+'/');reduced.wait_for_selector('#scene[data-time]');assert reduced.locator('#scene').get_attribute('data-playing')=='false';reduced.close()
  reports.append({'id':id,'playAdvances':True,'pausePixelStable':True,'seekRendersDifferentPixels':True,'parameterChangesPixels':True,'reset':True,'mobileWidth':390,'mobileOverflow':False,'reducedMotionStartsPaused':True,'consoleErrors':errors,'sampleCount':8,'limits':'Automated checks plus sampled frames; not continuous human playback, real-device or Safari/Firefox testing.'})
 browser.close()
(out/'report.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
print(json.dumps(reports,ensure_ascii=False,indent=2))
