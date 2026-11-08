# 转动之间：34秒有声演示

这是原交互案例的独立播放版本。保留原 SVG、运动学模型和颜色，以相同输入比较固定齿圈与固定行星架。原互动页面仍可操作。

## 复现

需要 Node.js、已安装的 @napi-rs/canvas 与 sharp、Python 与 NumPy、FFmpeg，以及 Noto Sans CJK 字体。未打包第三方软件或字体。设置 CJK_FONT 可指定现有字体文件。原字体通常适用 SIL OFL；字体许可应以安装来源为准。

在案例目录执行：

    node demo-source/render.cjs --stills
    node demo-source/render.cjs
    python demo-source/score.py
    ffmpeg -i demo-silent-v2.mp4 -i demo-source/audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -t 34 demo.mp4

脚本拒绝覆盖既有 demo-silent-v2.mp4。请在新目录恢复后运行。确定性运动采样为1280×720、24fps、816帧；16秒切换由同一 timeline.json 同时控制画面与提示音。

视频仅放大三枚现有编号；源SVG与模型不修改。派生SVG旋转角按模360规范化，保持几何状态等价；SVG由Sharp/libRSVG栅格化为PNG，再由Canvas排版。实际中心裁片及全帧轮毂检查与整段观看分别记录。

## 声音及权利

原创程序合成和声、轻拨弦及一次模式切换提示音。BGM/SFX分轨及混音可由 score.py 恢复，没有采样外部音乐、真实机械录音或私人声音。声音是设计表达，不代表真实齿轮接触。公开展示不额外授予媒体与源码的复用许可，亦不作独创性法律保证。

## 验证边界

配乐与音效均进入最终AAC声轨。逐帧取样、数学/时序检查、字体边界检查与全文件解码仅证明各自技术范围。当前环境Chromium因socket权限不能启动，实际浏览器连续播放、手机实机与完整主观听审未完成；cv2不可用，依赖它的影片门禁未运行。不要把编码通过当作完整艺术验收。

模型仅为理想运动学，简化梯形齿形不用于制造，不模拟受力、扭矩、摩擦或磨损。
