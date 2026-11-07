# 造物案例馆

真实制作、分类清楚、可追溯的 AI 图像与代码创作案例。网站负责展示，仓库保存产物与过程。

## 运行

零第三方运行依赖。Node 20+ 运行 `npm test`。以静态服务器服务 `dist/`；请勿直接用 file:// 打开首页。

## 把黄昏折成一座山

![把黄昏折成一座山](dist/cases/folded-dusk/original.png)

纸的纤维、玻璃的折光、石的沉静。用三种材料，搭出一座只存在于想象里的微缩山河。

- 用途：概念视觉
- 制作方式：image-generation
- 工具：ChatGPT 内置图像生成
- 模型：ChatGPT 图像生成，具体模型版本未披露
- [真实产物](dist/cases/folded-dusk/original.png) · [源码或提示词](dist/cases/folded-dusk/prompt.txt) · [来源与验证](dist/cases/folded-dusk/provenance.json)
- 验证：已实际生成并目视检查；1536 × 1024 PNG，SHA-256 已核。累计生成 2 次，本页为当前新输出。具体模型版本未披露，不是真实摄影。

## 无名地形

![无名地形](dist/cases/contour-atlas/poster.svg)

没有一张地图被借用。31 条闭合曲线从同一组规则生长，每个种子都是一座没有名字的岛。

- 用途：生成艺术
- 制作方式：procedural-image
- 工具：SVG + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/contour-atlas/index.html) · [源码或提示词](dist/cases/contour-atlas/geometry.mjs) · [来源与验证](dist/cases/contour-atlas/provenance.json)
- 验证：确定性、闭合性、有限值与种子差异已通过测试；封面由真实源码生成。不是实际地理数据。

## 相位花园

![相位花园](dist/cases/phase-garden/poster.svg)

让时间成为画笔。两组细线轨道在相位差里交织，暂停、拖动，再找到你喜欢的那个瞬间。

- 用途：界面动效
- 制作方式：coding-motion
- 工具：Canvas + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/phase-garden/index.html) · [源码或提示词](dist/cases/phase-garden/index.html) · [来源与验证](dist/cases/phase-garden/provenance.json)
- 验证：播放、暂停、重播、时间与幅度改变几何的核心测试通过。封面为同一算法第 6 秒。不是已导出影片。

## 回到平衡

![回到平衡](dist/cases/spring-lab/poster.svg)

为什么有些动效轻轻到达，有些却来回摆动？拖一条滑杆，看阻尼如何改变回到平衡的过程。

- 用途：知识解释
- 制作方式：interactive
- 工具：JavaScript + SVG
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/spring-lab/index.html) · [源码或提示词](dist/cases/spring-lab/model.mjs) · [来源与验证](dist/cases/spring-lab/provenance.json)
- 验证：归一化模型的起点、收敛、超调与临界阻尼测试通过；不是实测或工程性能数据。

## 夜航路线

![夜航路线](dist/cases/night-transit/poster.png)

把城市想象成一张会呼吸的路线图。调节班次密度，观察光点如何沿三条路线穿越、停靠，再各自远去。原创虚构网络，不含实际地图或客流数据。

- 用途：信息可视化
- 制作方式：coding-motion
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/night-transit/index.html) · [源码或提示词](dist/cases/night-transit/scene.mjs) · [来源与验证](dist/cases/night-transit/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 轨道观测台

![轨道观测台](dist/cases/orbit-observatory/poster.png)

五条倾斜轨道围绕一枚光核缓慢交错，轨道展开度直接改变空间构型。

- 用途：科学主题视觉、音乐舞台背景、交互展陈
- 制作方式：coding-motion
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/orbit-observatory/index.html) · [源码或提示词](dist/cases/orbit-observatory/scene.mjs) · [来源与验证](dist/cases/orbit-observatory/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 两色之间

![两色之间](dist/cases/overprint-studio/poster.png)

一张想象中的植物印样，由暖橙和靛蓝两块色版逐次叠印。调节套准偏移，观察边缘错位与色块重叠；这是程序图形示意，不是印刷设备模拟。

- 用途：视觉设计实验
- 制作方式：interactive
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/overprint-studio/index.html) · [源码或提示词](dist/cases/overprint-studio/scene.mjs) · [来源与验证](dist/cases/overprint-studio/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 纸城入夜

![纸城入夜](dist/cases/paper-city/poster.png)

二十五栋折纸建筑组成暮光街区，调节夜色可改变窗光，太阳与电车缓慢移动。

- 用途：城市主题片头、品牌叙事、建筑互动插画
- 制作方式：coding-motion
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/paper-city/index.html) · [源码或提示词](dist/cases/paper-city/scene.mjs) · [来源与验证](dist/cases/paper-city/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 一束光的岔路

![一束光的岔路](dist/cases/prism-desk/poster.png)

在深色光学工作台上改变入射方向，观察白光展开为有序色带。简化示意，非物理校准。

- 用途：概念教学 · 交互展陈 · 科学视觉
- 制作方式：interactive
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/prism-desk/index.html) · [源码或提示词](dist/cases/prism-desk/scene.mjs) · [来源与验证](dist/cases/prism-desk/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 檐下听雨

![檐下听雨](dist/cases/rain-study/poster.png)

雨线在檐外落下，涟漪沿石阶展开。一幅以代码绘制的雨夜小景。

- 用途：氛围场景 · 品牌开场 · 循环背景
- 制作方式：coding-motion
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/rain-study/index.html) · [源码或提示词](dist/cases/rain-study/scene.mjs) · [来源与验证](dist/cases/rain-study/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 信号成字

![信号成字](dist/cases/signal-letterpress/poster.png)

散落的字母沿各自轨迹归位，停留成一张有呼吸的活版海报。

- 用途：动态字体 · 片头设计 · 品牌宣言
- 制作方式：coding-motion
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/signal-letterpress/index.html) · [源码或提示词](dist/cases/signal-letterpress/scene.mjs) · [来源与验证](dist/cases/signal-letterpress/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 潮汐织场

![潮汐织场](dist/cases/tidal-weave/poster.png)

经纬丝带沿共同的波面起伏，交叉处严格交替穿插，织幅参数控制波动强度。

- 用途：纺织品牌视觉、抽象艺术海报、参数化设计展示
- 制作方式：coding-motion
- 工具：Canvas 2D + JavaScript
- 模型：ChatGPT 协作，具体底层模型未披露
- [真实产物](dist/cases/tidal-weave/index.html) · [源码或提示词](dist/cases/tidal-weave/scene.mjs) · [来源与验证](dist/cases/tidal-weave/provenance.json)
- 验证：原生 Canvas 实帧、全周期取样及静音 MP4 技术预览已导出；模型与共享控件事件测试通过。浏览器与手机实际验收暂未完成。

## 琥珀与石灰岩

![琥珀与石灰岩](dist/cases/image-amber-limestone/original.png)

用克制的三物体构图呈现石灰岩、玻璃与薄纸的材质差异。

- 用途：产品静物
- 制作方式：image-generation
- 工具：ChatGPT 内置图像生成
- 模型：ChatGPT 图像生成，具体模型版本未披露
- [真实产物](dist/cases/image-amber-limestone/original.png) · [源码或提示词](dist/cases/image-amber-limestone/prompt.txt) · [来源与验证](dist/cases/image-amber-limestone/provenance.json)
- 验证：目视通过。主体接触阴影自然，琥珀玻璃高光、石材微孔及薄纸透光清晰；无品牌、人物或乱码。 1536 × 1024 PNG，SHA-256 已复核。虚构产品的生成式视觉，不代表可制造性验证。

## 潮汐阅览室

![潮汐阅览室](dist/cases/image-tidal-reading-room/original.png)

以椭圆天窗、混凝土曲面与海岸开口组织安静的阅读空间。

- 用途：建筑概念
- 制作方式：image-generation
- 工具：ChatGPT 内置图像生成
- 模型：ChatGPT 图像生成，具体模型版本未披露
- [真实产物](dist/cases/image-tidal-reading-room/original.png) · [源码或提示词](dist/cases/image-tidal-reading-room/prompt.txt) · [来源与验证](dist/cases/image-tidal-reading-room/provenance.json)
- 验证：目视通过。天窗与曲面长凳形成连贯空间，海岸层次清晰，无人物、标志或可读书名。 1536 × 1024 PNG，SHA-256 已复核。虚构建筑概念图，未进行结构、海岸防护或建筑规范审核。

## 种子渡夜

![种子渡夜](dist/cases/image-seed-courier/original.png)

小田鼠用叶舟运送一枚发光的蒲公英种子，纸本水粉质感与月光共同构成叙事。

- 用途：叙事插画
- 制作方式：image-generation
- 工具：ChatGPT 内置图像生成
- 模型：ChatGPT 图像生成，具体模型版本未披露
- [真实产物](dist/cases/image-seed-courier/original.png) · [源码或提示词](dist/cases/image-seed-courier/prompt.txt) · [来源与验证](dist/cases/image-seed-courier/provenance.json)
- 验证：目视通过。角色轮廓与手持关系清晰，单只鼠、单条尾巴、单叶舟成立；纸张肌理与深靛色层次稳定。 1536 × 1024 PNG，SHA-256 已复核。童话性比例与发光种子属于艺术设定，不作植物学或动物学图解。

## 种子温室

![种子温室](dist/cases/image-seed-library/original.png)

以象牙色温室、盆栽与悬浮土壤剖面构成可爱但克制的微缩场景。

- 用途：3D 风格微缩场景
- 制作方式：image-generation
- 工具：ChatGPT 内置图像生成
- 模型：ChatGPT 图像生成，具体模型版本未披露
- [真实产物](dist/cases/image-seed-library/original.png) · [源码或提示词](dist/cases/image-seed-library/prompt.txt) · [来源与验证](dist/cases/image-seed-library/provenance.json)
- 验证：成品目视通过。透明版本彩边未通过审核，最终改为不透明浅灰背景；成品轮廓干净、全物体未裁切，六盆植物与层状土壤可读。 1254 × 1254 PNG，SHA-256 已复核。这是 3D 风格的二维生成图，不含真实网格、材质节点或 3D 工程文件。最终图不是透明素材。垂直留白较提示词目标紧，但无裁切。

## 雨水花园剖面

![雨水花园剖面](dist/cases/image-rain-garden/original.png)

用水彩式剖面展示地表径流、种植土、碎石层和排水管的关系。

- 用途：概念性教育图解
- 制作方式：image-generation
- 工具：ChatGPT 内置图像生成
- 模型：ChatGPT 图像生成，具体模型版本未披露
- [真实产物](dist/cases/image-rain-garden/original.png) · [源码或提示词](dist/cases/image-rain-garden/prompt.txt) · [来源与验证](dist/cases/image-rain-garden/provenance.json)
- 验证：目视通过。RAIN GARDEN、RUNOFF、SOIL、GRAVEL、DRAIN 五处文字均正确；土层在碎石上方，排水管位于碎石层，水流箭头方向一致。 1536 × 1024 PNG，SHA-256 已复核。只示意一种带排水管的雨水花园配置，不是施工图、设计规范或经过专家校审的科学教材。

## 原创与参考

以下仓库仅提供案例组织与展示思路，未复制其图片、提示词、代码或故事：

- https://github.com/Evolink-AI/awesome-gpt-image-2-6-prompts-and-api
- https://github.com/guanmo-ai/awesome-ai-motion
- https://github.com/lemomo-ai/lemo-opuscar

## 权利

原创源码与媒体均为本次任务新制。AI 生成并非版权或独创性法律保证。公开复用许可尚未选定，不默认授予开源或媒体复用许可。
