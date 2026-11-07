> Text-only source view. The complete archive is ../source.zip, restored from repository-local chunks. SOURCE-MANIFEST.json describes that full archive, including binary dependencies.

# 余响织成光 · Aftertone

一根弦被拨动，收到了另外三根弦的回答。由声音留下的金色光纹展开为织物，再慢慢收回。原来的弦仍在，却留下了两道新痕迹。

原创 coding-motion 艺术短片；抽象寓言，不是声学实验或物理仿真。画面、时间线、旋律、合成音色和事件音均为本片制作。没有使用现成影片、静态图片动画、音乐采样或付费生成服务。

## 重建
环境需要 Node.js、@napi-rs/canvas、Python 3、NumPy、SciPy 与 ffmpeg/ffprobe。不会自动安装软件。运行 `bash build.sh`。视频由确定性的时间函数绘制，音乐与事件音读取同一事件时钟。源代码、分轨与混音都保留。

## 欣赏与核验
最终 MP4 包含画面与声音。GIF 不支持声音，不作为本作的完整声画版本。具体媒体、解码、播放、确定性及恢复检查见 VERIFICATION.md。技术检查、画面抽样、连续观看、实际听音分别记录，不能相互替代。
