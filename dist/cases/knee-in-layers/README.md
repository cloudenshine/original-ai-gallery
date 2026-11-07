# 膝关节的一次屈伸 / Knee in Layers

这是一份实际调用 Anatomy 的教学案例，并附可独立运行的原创二维互动学习卡。它不是“自制人体 3D 模型”，也不是把 2D 图像冒充 Anatomy 导出。

## 已完成

- 使用 Anatomy `find_anatomy` 核对了精确英文结构名。
- `open_anatomy` 已接受 `scene.json`：4 个教学步骤，3 项结构辨认测验。
- `read_anatomy_view` 返回 `viewerShowing: false`。原生场景已创建，但创作端未收到查看器实际显示确认，不宣称已完成 3D 播放目视验收。
- 网站学习卡包含骨骼、半月板、肌肉三层关系图及即时辨认练习。所有 SVG 路径、教学文字、HTML/CSS/JS 均为本案例新写，没有临摹或截取第三方图片。

## 如何使用

### 公开网页

通过静态服务器打开 `index.html`。点击 01/02/03 切换主题；选择答案立即获得反馈。该页面无需第三方运行依赖，也不调用远端医疗 API。

### Anatomy 原生 3D 场景

1. 在已连接 Anatomy 且支持它的小组件的对话中，附上 `scene.json`。
2. 请求助手用 `find_anatomy` 复核结构后，将 JSON 作为 `open_anatomy` 参数。
3. 查看器中从三块骨开始，切换至半月板、股四头肌，最后在第四步播放下蹲、暂停并拖动时间轴。
4. 需继续问答时，先调用 `read_anatomy_view`，根据实际显示步骤与选中结构回答，不预设用户已经播放或答题。

`quiz.targets` 必须是包含 `structure` 的对象数组，不是字符串数组。首次 schema 校验发现此限制，已修正并获得工具接受。场景创建不等于浏览器已经显示；必须分别验证。

## 教学目标

- 辨认股骨、胫骨、髌骨的位置关系。
- 区分半月板和骨表面的关节软骨。
- 理解股四头肌参与伸膝，动作涉及多关节协作。
- 学会区分解剖观察、示意运动和临床生物力学计算。

本场景没有精确检索到独立的髌韧带模型；未把搜索返回的近名“Meniscopatellar ligament”当作髌韧带。网页里的肌腱连线只是原创关系示意。

## 模型、播放与医学边界

Anatomy 工具声明：模型是成人参考解剖，来自 Z-Anatomy / BodyParts3D，不是用户身体。动作使用手设的示意角度，软组织近似跟随骨骼。它不能定位症状原因。我们不提供个体诊断、治疗、训练处方，不根据动画计算关节负荷、组织应变或肌肉激活。

本次连接工具仅暴露结构搜索、打开/替换场景及读回状态；未暴露模型、图片、视频或独立嵌入导出方法。因此原生 3D 需在支持 Anatomy 的宿主中播放，GitHub Pages 仅提供独立二维学习卡与复现参数。

## 版权与来源

- 本目录没有 Anatomy / Z-Anatomy / BodyParts3D 的模型、纹理、截图或数据包。没有声称获得 Anatomy 应用本身的导出许可。
- 上游 Z-Anatomy 官方仓库说明其代码与内容使用 CC BY-SA 4.0，注明 BodyParts3D 为 CC BY-SA 2.1 Japan，同时列有额外第三方素材许可。那是上游资源许可，不自动证明本应用任意资源均可导出。今后若取得模型，需要逐个核对来源和适用许可并履行署名与相同方式共享要求。
- 本案例原创脚本、场景参数与网页的公开复用许可尚未选定，不替用户擅自授予开源许可。
- 资料仅用于事实核对，网页没有复制原站插图或长篇文字。

事实来源（2026-11-07 核对）：

1. [AAOS — Common Knee Injuries, Anatomy section](https://www.orthoinfo.org/bodypart/kneelower-leg/common-knee-injuries/)
2. [Arthritis Foundation — Anatomy of the Knee](https://www.arthritis.org/health-wellness/about-arthritis/where-it-hurts/anatomy-of-the-knee)
3. [Z-Anatomy — official model repository and licenses](https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/Readme.md)

## 验证

运行 `node --test tests/*.test.mjs`。测试覆盖主题对应的显示结构、正确/错误答案及未知主题回退。已用连接的云端 Chrome 实际验证三组主题切换、正确/错误答题反馈、复制指令和桌面视觉。未进行移动视口目视验收。模块过渡时发现 CDN 混合旧脚本，已改为独立 app.mjs 入口并逐项重验。详细结果见 `browser-verification.json` 和 `anatomy-verification.json`。
