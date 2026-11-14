# 控制光线与成片：资料与教学边界

核验日期：2026-11-14。对应方案见 [系统审查实施方案](27-systematic-audit-plan.md)。新增教学文字、练习与自测为原创中文整理，参考下列厂商原始资料；未复制整篇文章、官方示例图或商业软件界面。来源也随课程记录在 `finishing-depth-data.js`，显示于课程与资料索引。

## 补充内容与验收证据

| 课程 / 任务 | 解决的学习缺口 | 学习者保留的证据 |
| --- | --- | --- |
| `still-life-lighting` / `still-life-reflection-test` | 看到反光却不知来自哪里，缺少材质、光向与卡片的单项对照 | 初始、角度、卡片三张对照；机位/光源/物体草图；标签、材质与边缘的取舍说明 |
| `local-editing` / `local-editing-check` | 认识后期滑杆却未区分输入色调与空间选区，缺少蒙版检查 | 原片与基准、调整副本、选区说明；边缘/噪点/全图检查；收益与代价 |
| `color-output` / `color-output-proof` | 会导出文件却不知配置文件的职责，缺少软打样及实际输出核对 | 输出需求单、源/目标配置与显示条件记录、校样副本；有条件时的实物小样及观察条件 |

每课有 6 个解释段落、5 个操作步骤、3 个误区、1 道情境题、1 个独立任务和 2 张回忆卡。新内容仅追加，不更改旧任务检查项顺序和原有 ID。课程中的替代练习必须注明执行范围，不用一次勾选证明摄影技能或颜色准确性。

## 已核验的官方资料

| 原始资料 | 用于课程的事实 | 采用范围与限制 |
| --- | --- | --- |
| [Canon Hong Kong：产品拍摄](https://www.canon.com.hk/en/club/article/itemDetail.do?itemId=10468) | 相机、物体、环境与光源的空间关系决定亮面反射；角度、背景和卡片能改变反射的形状与可读性 | 讲解反射来源与单项对照，不照搬示例灯位；不把所有高光都当作缺陷，也不保证压暗可以还原被遮住的文字 |
| [Nikon：Create Your Light — Food Photography at Home](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/create-your-light-food-photography-at-home) | 窗光可作为主光，白卡可在另一侧补光；方向与物体关系需要观察 | 单一光源是便于学习排查的起点；不沿用“正面照明永远不适合食物”等绝对建议，不引入购买要求 |
| [Adobe Lightroom Classic：图像色调与颜色](https://helpx.adobe.com/lightroom-classic/desktop/process-and-develop-photos/image-tone-color.html) | 色调曲线横轴代表输入明暗、纵轴代表输出；控制点影响相应色调；通道曲线还会影响颜色 | 区分色调范围与照片空间位置；不提供跨软件通用的固定曲线数值，不把 S 曲线当作每张图的目标 |
| [Adobe Lightroom Classic：蒙版](https://helpx.adobe.com/lightroom-classic/desktop/process-and-develop-photos/masking.html) | 蒙版限定局部处理，可查看叠加、添加与减去选区；画笔羽化与渐变用于过渡 | 自动选区仍要查边缘；是否支持各工具以实际软件和版本为准，不声称本站可做真实蒙版或 RAW 编辑 |
| [Adobe Photoshop：更改文档颜色配置](https://helpx.adobe.com/photoshop/desktop/adjust-color/color-profiles/change-color-profile-for-documents.html) | 指定配置改变颜色数值的解释；转换配置按目标空间处理颜色；保存可嵌入配置 | 先确认源配置与交付要求，保留原版；不把直接更换 ICC 标签称作正确转换，不根据鲜艳程度猜缺失的源配置 |
| [Adobe Lightroom Classic：色彩管理](https://helpx.adobe.com/lightroom-classic/desktop/workspace/color-management.html) | 图像、显示器与输出设备具有不同颜色能力，配置文件协助解释与转换；观看条件和校准影响判断 | 采用职责与流程原则，不沿用页面中的旧操作系统菜单或旧显示技术建议；肉眼调得相似不等于测量校准 |
| [Adobe Lightroom Classic：修改照片模块与软打样](https://helpx.adobe.com/lightroom-classic/desktop/process-and-develop-photos/develop-module-options.html) | 软打样选择目标配置，可比较色域警告、渲染意图和适用时的纸墨模拟，可建立校样副本 | 目标配置必须对应预期输出条件；功能选项取决于配置与版本；模拟不能保证纸张与屏幕肉眼完全一致 |
| [Adobe Lightroom Classic：打印基本流程](https://helpx.adobe.com/lightroom-classic/desktop/help/printing-photos-basic-workflow.html) | 由 Lightroom Classic 管理颜色时，要避免打印驱动重复管理，并匹配相关纸张与质量设置 | 自行打印和外包交付分开；输出服务要求优先，不能擅自把任意打印配置转换进交付文件；实际小样仍需核对 |

这些资料在核验时读取了原文相应段落。站内教程是对适用原则的解释与实践安排，不能代替某一具体软件版本或打印机驱动的说明书。没有访问成功的候选文章未列入课程引用。

## 照片、软件与设备的真实边界

- 静物课复用 `light` 水果照片，其署名与许可见 [素材说明](07-media-credits.md)。只观察亮斑、投影和软硬差异，不虚构原作者完整灯位或认定它已验证本课的亮面杯子布置。
- 局部调整课复用 `landscape` 冰碛湖照片，观察岸边石块和天空的处理目标；没有把照片另行处理成假造的曲线或蒙版对照。局部处理需要学习者已有的兼容编辑工具。
- 色彩输出课复用 `streetNight` 夜街照片，其署名与许可见 [新增照片说明](12-v3-media-credits.md)。暖色街灯、偏冷天空与暗部用于选择希望保留的关系；照片不是校准图、色卡、软打样证明或实物校样。
- 没有相机时，可以移动观察位置、画光路与反射草图；必须记录“未拍摄/未完成曝光验证”。没有曲线或蒙版工具时，可以标注目标与保护区域、列出待检查边缘；必须记录“计划未实施”。
- 没有测量设备或打印条件时，可以核对交付需求、文件空间、工具支持和观看设置；不能声称完成测量校准或实物验证。支持软打样也不代表已经打印；三者分别记录。
- 本轮没有实际操作第三方编辑器、校准仪或打印机，也没有将网页的视觉模拟当作这些工具的输出。

## 模块验证

`tests/finishing-depth.test.cjs` 验证追加记录与原内容不变、每课的解释/自测/任务/卡片闭环、关联目的地、官方来源进入索引、图片资产和本地文件存在，以及重复加载在修改数据前报错。2026-11-14 执行 `node --test tests/finishing-depth.test.cjs`，4 项通过、0 项失败；`node --check finishing-depth-data.js` 与本次文件的 `git diff --check` 通过。浏览器、移动端、构建和旧备份兼容的结果由全站集成验证另行记录，不以本模块测试代替。

验证发现 `color-output` 初稿误将课程名 `whitebalance` 用作媒体 ID；已先记录到实施方案，再改用现有 `streetNight` 资产并按实际画面重写观察提示。此问题由模块图片检查持续覆盖。
