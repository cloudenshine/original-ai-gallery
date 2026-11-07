from pathlib import Path
import json,hashlib
from html import escape
r=Path(__file__).resolve().parents[1];d=r/'dist'
base={'method':'code','model':'ChatGPT 协作，具体底层模型未披露','rights':'本次新写源码与程序图形，未使用外部素材。公开复用许可尚未选定。','createdAt':'2026-11-07'}
rows=[dict(id='contour-atlas',title='无名地形',category='procedural-image',useCase='生成艺术',summary='没有一张地图被借用。31 条闭合曲线从同一组规则生长，每个种子都是一座没有名字的岛。',engine='SVG + JavaScript',tags=['确定性生成','SVG','可下载'],verification='确定性、闭合性、有限值与种子差异已通过测试；封面由真实源码生成。不是实际地理数据。',steps=['打开实例，初始种子为 00。','选择“换一座岛”，观察几何变化。','保存 SVG，相同种子可复现相同轮廓。'],source='geometry.mjs'),dict(id='phase-garden',title='相位花园',category='coding-motion',useCase='界面动效',summary='让时间成为画笔。两组细线轨道在相位差里交织，暂停、拖动，再找到你喜欢的那个瞬间。',engine='Canvas + JavaScript',tags=['实时动效','可拖动时间','减弱动态'],verification='播放、暂停、重播、时间与幅度改变几何的核心测试通过。封面为同一算法第 6 秒。不是已导出影片。',steps=['打开实例，运行浏览器动效。','暂停并拖动时间轴。','调节运动幅度；启动状态跟随系统“减少动态效果”设置。'],source='index.html'),dict(id='spring-lab',title='回到平衡',category='interactive',useCase='知识解释',summary='为什么有些动效轻轻到达，有些却来回摆动？拖一条滑杆，看阻尼如何改变回到平衡的过程。',engine='JavaScript + SVG',tags=['交互解释','数学示意','可调阻尼'],verification='归一化模型的起点、收敛、超调与临界阻尼测试通过；不是实测或工程性能数据。',steps=['调节阻尼比 ζ，比较响应。','播放响应，观察点沿曲线运动。','恢复默认回到 ζ = 0.55。'],source='model.mjs')]
image_dir=d/'cases/folded-dusk'
image_meta=None
if (image_dir/'original.png').exists() and (image_dir/'asset-meta.json').exists() and (image_dir/'prompt.txt').exists():
 image_meta=json.loads((image_dir/'asset-meta.json').read_text())
 raw=(image_dir/'original.png').read_bytes()
 import struct
 assert raw[:8]==b'\x89PNG\r\n\x1a\n', 'Original image must be PNG'
 assert struct.unpack('>II',raw[16:24])==(image_meta['width'],image_meta['height']), 'Image dimensions do not match evidence'
 assert hashlib.sha256(raw).hexdigest()==image_meta['sha256'], 'Image hash does not match evidence'
 assert image_meta.get('visualInspection'), 'Missing visual inspection record'
if image_meta:
 rows.insert(0,dict(id='folded-dusk',title='把黄昏折成一座山',category='image-generation',method='image-model',useCase='概念视觉',summary='纸的纤维、玻璃的折光、石的沉静。用三种材料，搭出一座只存在于想象里的微缩山河。',engine='ChatGPT 内置图像生成',model='ChatGPT 图像生成，具体模型版本未披露',tags=['概念静物','材质表现','原创提示词'],verification=f"已实际生成并目视检查；{image_meta['width']} × {image_meta['height']} PNG，SHA-256 已核。累计生成 {image_meta['generationAttemptsTotal']} 次，本页为当前新输出。具体模型版本未披露，不是真实摄影。",rights='本次从原创提示词新生成，未提供参考图，未使用人物、商标或私人素材。AI 输出不构成独创性或版权的法律保证；公开复用许可待定。',steps=['阅读原创提示词。','文本生图，无参考图，透明背景关闭。',f"累计生成 {image_meta['generationAttemptsTotal']} 次；本页当前产物生成 {image_meta['currentArtifactGenerationCount']} 次，检查记录随文件保留。"],source='prompt.txt',poster='cases/folded-dusk/original.png',artifact='cases/folded-dusk/original.png'))
extra_file=r/'data/batch-02.json'
if extra_file.exists():rows.extend(json.loads(extra_file.read_text()))
extra_file=r/'data/batch-03.json'
if extra_file.exists():rows.extend(json.loads(extra_file.read_text()))
extra_file=r/'data/batch-04.json'
if extra_file.exists():rows.extend(json.loads(extra_file.read_text()))
extra_file=r/'data/batch-anatomy.json'
if extra_file.exists():rows.extend(json.loads(extra_file.read_text()))
extra_file=r/'data/batch-blender.json'
if extra_file.exists():rows.extend(json.loads(extra_file.read_text()))
items=[]
for c in rows:
 if c.get('media'):
  path=d/'cases'/c['id'];title=escape(c['title'])
  media=(f'<video controls playsinline preload="metadata" poster="{escape(Path(c["poster"]).name)}"><source src="{escape(c["media"])}" type="video/mp4">请下载影片后播放。</video>' if c['media'].endswith('.mp4') else f'<img src="{escape(c["media"])}" alt="{title}">')
  if c.get('gif'):media+=f'<h2>代码制作 GIF（无声）</h2><img src="{escape(c["gif"])}" alt="{title} GIF"><p>此 GIF 为代码合成，并非图像工具原生 GIF 输出。</p>'
  if c.get('sourceImage'):media+=f'<h2>编辑前图像</h2><img src="{escape(c["sourceImage"])}" alt="编辑前图像">'
  links=f'<a href="{escape(c["media"])}">打开媒体文件</a> · <a href="{escape(c["source"])}">下载源码与提示词</a> · <a href="provenance.json">来源与验证</a>'
  if c.get('master'):links+=f' · <a href="{escape(c["master"])}">下载完整分辨率母版</a>'
  if c['id']=='letter-to-the-wind':links+='<p>源包 README 中的 letter-to-the-wind.mp4 是运行 build.sh 后生成的输出，不随源包附带。直接观看请使用上方影片或完整母版链接。</p>'
  if c.get('subtitles'):links+=f' · <a href="{escape(c["subtitles"])}">下载字幕 SRT</a>'
  refs=''.join(f'<li><a href="{escape(url)}" rel="noopener">{escape(url)}</a></li>' for url in c['extraProvenance']['references'])
  (path/'index.html').write_text(f'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} · 造物案例馆</title><style>body{{max-width:1000px;margin:40px auto;padding:0 20px;background:#f7f6f0;color:#292d28;font:17px/1.7 system-ui}}video,img{{display:block;max-width:100%;max-height:80vh;margin:24px auto}}a{{color:inherit}}li{{overflow-wrap:anywhere}}</style><a href="../../">← 返回作品索引</a><h1>{title}</h1><p>{escape(c["summary"])}</p>{media}<p>{links}</p><h2>制作与验证</h2><p>{escape(c["engine"])}</p><p>{escape(c["verification"])}</p><p>{escape(c["rights"])}</p><h2>参考资料</h2><ul>{refs}</ul></html>')
 c=base|c;c.setdefault('poster',f"cases/{c['id']}/poster.svg");c.setdefault('artifact',f"cases/{c['id']}/index.html");c['provenance']=f"cases/{c['id']}/provenance.json";c['source']=f"cases/{c['id']}/{c['source']}";items.append(c)
 prov={k:c[k] for k in ['title','category','method','engine','model','rights','verification','createdAt']};prov['originality']='本次新制；未复制参考仓库的图片、提示词、故事或源码。未对互联网相似作品作穷尽检索。'
 if c['id']=='folded-dusk':prov|=image_meta
 if c.get('extraProvenance'):prov.update(c['extraProvenance'])
 (d/c['provenance']).write_text(json.dumps(prov,ensure_ascii=False,indent=2)+'\n')
config=json.loads((r/'publication.json').read_text()) if (r/'publication.json').exists() else {'state':'unpublished','repository':None}
(d/'cases.json').write_text(json.dumps({**config,'cases':items},ensure_ascii=False,indent=2)+'\n')
readme='# 造物案例馆\n\n真实制作、分类清楚、可追溯的 AI 图像与代码创作案例。网站负责展示，仓库保存产物与过程。\n\n## 运行\n\n零第三方运行依赖。需要 Node 20+ 和 Python 3；`npm test` 与 `npm run build` 会先用 Python 3 恢复并校验大文件。以静态服务器服务 `dist/`；请勿直接用 file:// 打开首页。\n\n'
readme+=f'## 在线作品集\n\n[打开造物案例馆](https://cloudenshine.github.io/original-ai-gallery/) · {len(items)} 件作品。部署是否完成以 GitHub Actions 的 Pages 结果为准。\n\n'
for c in items:
 source_link='https://cloudenshine.github.io/original-ai-gallery/'+c['source']
 artifact_link='https://cloudenshine.github.io/original-ai-gallery/'+c['artifact']
 readme+=f"## {c['title']}\n\n![{c['title']}](dist/{c['poster']})\n\n{c['summary']}\n\n- 用途：{c['useCase']}\n- 制作方式：{c['category']}\n- 工具：{c['engine']}\n- 模型：{c['model']}\n- [真实产物]({artifact_link}) · [源码或提示词]({source_link}) · [来源与验证](dist/{c['provenance']})\n- 验证：{c['verification']}\n\n"
readme+='## 大文件恢复\n\n仓库以 9,000,000 字节分块保存六个大文件。运行 `python3 scripts/restore-binaries.py` 校验每块与完整 SHA-256 并原子恢复；`npm test` 和 `npm run build` 自动执行恢复。无需网络。在线下载链接指向 Pages，是否已部署请检查 GitHub Actions。\n\n[风的信完整母版](https://cloudenshine.github.io/original-ai-gallery/cases/letter-to-the-wind/master.mp4)\n\n'
readme+='## 原创与参考\n\n以下仓库仅提供案例组织与展示思路，未复制其图片、提示词、代码或故事：\n\n- https://github.com/Evolink-AI/awesome-gpt-image-2-6-prompts-and-api\n- https://github.com/guanmo-ai/awesome-ai-motion\n- https://github.com/lemomo-ai/lemo-opuscar\n\n## 权利\n\n原创源码与媒体均为本次任务新制。AI 生成并非版权或独创性法律保证。公开复用许可尚未选定，不默认授予开源或媒体复用许可。\n'
(r/'README.md').write_text(readme)
