# 给变化，留一格 / Room for Change

40秒原创瑞士动态排版短片。一个固定15:00的新增会进入排满的日程：两项任务明确改期，空位逐格传递，结尾保留一格余量。全部日程为虚构，不是用户日历，也不是生产率实验。

成片下载在作品页的 film.mp4。此源包不重复附带成片；运行 build.sh 后生成 deliverables/room-for-change.mp4。1920×1080，24fps，48kHz立体声。没有旁白。片内文字、音乐、纸张和印刷声共同叙事。

## 重建
在已具备 Node.js、@napi-rs/canvas、Python 3、NumPy、SciPy、Pillow、FFmpeg 的环境中运行 `sh build.sh`。
脚本不安装依赖、不联网、不调用付费API。字体已本地随包提供，不需要系统中文字体。首帧及任意帧：`node src/render.cjs frame 25.5 preview.png`。

- src/timeline.cjs：任务身份、路径、帧时、共享声音事件。
- src/film.cjs：原创平面、字体、纸条与全部逐帧状态。
- src/render.cjs：真实离线Canvas渲染。
- src/sound.py：原创程序配乐、纸与印刷拟音、环境底。
- src/master.py：两遍响度归一与封装。
- src/test.cjs、src/verify.py：状态、路径、文字区、解码与最终AAC检查。
- audio/：音乐、拟音、环境、母混音分轨与谱事件。
- SCRIPT.md、DESIGN.md、TREATMENT.md：可读剧本、画面与声音设计。

参考语法来自 Lemo-Opuscar 的 Swiss Motion Graphics。故事、任务、路径、配乐与拟音均为新作。参考影片和原音轨没有进入成片或源码包。CREDITS列出第三方字体及许可；新增使用其他材料时需自行确认相应权利。

## 检查边界
具体技术结果见 QUALITY.md 和 qa/verification.json。完整解码、逐帧状态/几何检查、接触表和实际静帧审查可以证明各自范围，但不等于完整原速观看、主观听审或真人观众认可。尚未完成的项目如实保留，不将“可播放文件”称作完整艺术验收。

## 公开包说明
本包包含原创源码、音乐/拟音/环境/母混音分轨、字体许可和检查说明。未包含参考原片、内部制作记录、上传助手或账号信息。公开展示不新增源码或媒体复用许可。
