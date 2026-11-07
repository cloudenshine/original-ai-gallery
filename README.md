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

## 原创与参考

以下仓库仅提供案例组织与展示思路，未复制其图片、提示词、代码或故事：

- https://github.com/Evolink-AI/awesome-gpt-image-2-6-prompts-and-api
- https://github.com/guanmo-ai/awesome-ai-motion
- https://github.com/lemomo-ai/lemo-opuscar

## 权利

原创源码与媒体均为本次任务新制。AI 生成并非版权或独创性法律保证。公开复用许可尚未选定，不默认授予开源或媒体复用许可。
