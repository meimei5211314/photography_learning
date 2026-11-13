# 第三版实施方案

## 信息组织
不把所有新增内容塞进基础课。保留前 12 课，新增第 4 阶段“专题与实战”6 课；首页提供 R6 三代、场景案例、后期练习的明显入口，导航加入相机指南与场景案例（移动端调整为 4×2）。后期工作台从实验室/课程/案例进入。

## 文件与协作
- `advanced-data.js`：加载于 data.js 后，追加 lessons/tasks/cards/sources；window.PHOTO_ADVANCED 包含 cases，课程扩展信息。已有 ID 不改，数据版本仍为 v2。六个新课 ID：r6-start、portrait、street、composition-story、editing-basic、editing-portrait；六个新任务：r6-first、portrait-outdoor、group-portrait、street-day、street-night、edit-series。每课 2 张卡。
- `guides.js/css`：根代理负责 R6 操作指南、案例列表/详情、与课程/任务的链接。`PhotoGuides.mount(container,type,arg)` / destroy；不另建学习存储。案例复盘复用任务现有状态。引用 PHOTO_ADVANCED.cases 与 PHOTO_MEDIA。
- `editing-lab.js/css`：交互代理负责 `PhotoEditing.mount(container)` / destroy，非破坏的原图/调整图比较、曝光/对比/饱和/冷暖、重置、目标提示；默认用素材 landscape，若新增 portrait 可选。明确是 JPEG 屏幕练习，无 RAW 解码或高光恢复承诺；可提供不依赖素材的编辑顺序练习。无上传、无网络请求或常驻动画。
- `media-v3.js`、`assets/`、`docs/11-v3-sources.md`：媒体由根代理统一集成；需要适合人像和街头分析的真实开放许可照片，记录作者/来源/许可/展示修改。不以旧尼康机身照片代表佳能；R6 教程用原创操作流程示意及官方链接，只有核实且可分发的机身照片才本地保存。
- 根代理修改 app.js/index.html/styles.css、数量、阶段、路由、课程与任务入口、搜索、测试及README。课程 `related` 可存链接数组 `{label,href}`，案例通过 lessonIds/taskId 关联。`lesson.observation` 提供照片观察问题，`lesson.mediaId` 指定资产（优先 portrait/street/landscape）；最终 media-v3 映射。

## 场景数据约定
`cases` 每项包含 id、title、category（人像/街拍/叙事）、summary、assetId（portrait/street/landscape）、intent、settings（数组：{label,value,reason}）、steps（字符串数组）、composition、editing（字符串数组）、troubleshooting（{symptom,action}数组）、criteria（字符串数组）、recall（{question,answer}）、lessonIds、taskId。参数均写起点，不伪造素材拍摄数据。

## 官方核对与内容策略
佳能中文 HTML 手册为首选；当前页说明固件 1.1.0 或更新，记录这个适用条件并提示核对自己固件及自定义状态。相机按钮/菜单用已核实的名字，避免未经验证的页签号。主要涉及 Av/Tv/M+自动 ISO、人物/眼睛检测与 Servo、AF 区域、电子快门限制、RAW、回放和直方图。后期采用 DPP 基础工作流，局部工具按 Lightroom 对应说明，不能把某软件没有的工具硬写进去。

## 学习设计
先观察→明确主题→选择参数并说理由→实拍→检查失败→处理与导出→隔天回忆。案例给起点、退路和验收标准。记忆卡以情境决策题为主，避免只背菜单路径。保持目前间隔复习算法，不另建与已有状态冲突的完成计数。

## 验证与交付
先提交本需求和方案，再实施代码。检查 18 课/14 任务/36 卡和 6 案例、旧 v1/v2 备份兼容、课程/案例/任务链接、素材许可、脚本加载顺序和语法。浏览器操作 R6 指南、案例选择、任务跳转、后期滑杆/重置/原图比较，检查两种屏宽。编写真实验证结果，正常提交并推送 origin/main，保留远端历史。
