> 这是文本源码浏览页。现在观看请打开[在线影片](../film.mp4)或[完整分辨率母版](../master.mp4)。[完整源包](../source.zip)内原始 README 提到的 `letter-to-the-wind.mp4` 是运行 `build.sh` 后生成的输出文件，源包未包含该成片；无需重建即可通过前述链接观看。SOURCE-MANIFEST.json 记录完整源包，包括本页未展开的二进制依赖。

# 风的信 / Letter to the Wind

一个 36 秒的原创铜版画代码短片。一枚虚构种荚张开，一粒带翼种子离开，最后以一抹玫瑰色留在纸上。参照 Lemo-Opuscar 的铜版画语法，不复制其蜜蜂示例。此片不是植物学事实图解。

## 观看
优先打开 letter-to-the-wind.mp4。1920×1080、24 fps、48 kHz 立体声，包含原创程序配乐、材料音效和烧录中文短诗。独立字幕：letter-to-the-wind.srt。poster.jpg 是成片末段实际抽帧。

## 可编辑内容
- src/film.js：原创几何、墨线、纸纹、染色、摄影和动作。
- index.html：同一绘图代码的浏览器入口；通过控制台 render(t) 定位任意时间。
- src/render-native.cjs：原生 Canvas 离线逐帧输出。
- src/sound.py：原创拨弦/弓弦合成、纸、刻刀、风和水声。不是实录乐器。
- src/master.py、src/verify.py：混音归一化、封装和媒体检查。
- build.sh：一条命令重建。依赖已安装的 Node.js、@napi-rs/canvas、Python 3、NumPy、SciPy、Pillow、FFmpeg。本脚本不安装依赖、不联网、不调用付费接口。

## 参考与许可
REFERENCES.md 给出实际参考和六个差异；CREDITS 与字体许可记录第三方资产。影片没有上游原作图像、音频或人物，没有水印。

## 验证范围
整片每帧解码、分辨率/帧率/时长、音轨、最终AAC响度与真峰值、两处静默、关键帧与0.2秒释放动作条带已进行检查。qa/verification.json 记录机器可核结果，本说明记录未验边界。

重要限制：没有完成原速连续观看与真实听审。结构解码、数值音量与抽帧不等于审美、流畅度或听感验收，因此本包不作这些已经通过的宣称。

## 发布与素材
本作已获所有者许可用于公开案例展示。增加素材时请另行确认其使用权。
