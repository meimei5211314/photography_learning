# R7详细配置对照实施方案

需求见docs/47。基线为干净的 `80e2512`。先写需求和本方案，再实现代码；本地提交，不推送。

## 数据及分工

1. 器材代理负责 `r7-foundation-config.js`，导出 `PHOTO_R7_FOUNDATION = {model,checkedAt,topics,sources}`，包含 controls、quality、exposure-modes、auto-iso、metering-compensation、white-balance 六主题；独占docs/49及tests/r7-foundation-config.test.cjs。只导出模块，不追加PHOTO_DATA.sources，不改旧课程和配置。
2. 课程代理负责 `r7-advanced-config.js`，导出 `PHOTO_R7_ADVANCED`，同结构，包含 autofocus、drive-shutter、stabilization、playback、custom-controls、custom-modes 六主题；独占docs/50及tests/r7-advanced-config.test.cjs。只导出模块，不修改旧数据。
3. 每个R7主题契约与原R6主题一致：id/title/group/summary/settings:[{name,value,reason}]/steps/checks/pitfalls:[{symptom,fix}]/restore/lessonIds/taskId/sources，另加 `differences:string[]`（至少2条，明确与R6的差异或相同条件）。至少3设置项、6操作步骤、3检查、2排障、2恢复，引用实际课程任务；不要求新增课程或变更检查项。R6专用任务应换成适用的现有通用或双机任务。所有文字需原创解释，精确功能有官方依据。
4. 根代理负责 `camera-comparison-data.js`：依赖PHOTO_DATA、PHOTO_CAMERA_CONFIG与两组R7数据，校验12个ID精确对应后按R6顺序组成 `PHOTO_CAMERA_COMPARISON`。结构：
   - id:'r6iii-r7-settings', title, checkedAt, summary。
   - basics:{id:'basics',title,group,summary,specs:[{name,r6,r7,meaning}],setup:[{title,r6,r7,check}],pitfalls:[{symptom,fix}],sources}。
   - topics:[{id,title,group,summary,differences,r6:<原R6主题>,r7:<对应R7主题>}]。
   - switchChecklist:string[], sources:[{title,url,note}]。来源去重追加全局索引；全部依赖/引用验证通过后才导出及追加来源。
   - 基础规格面向静止图像，视频仅交代模式、帧率/裁切/记录格式需独立核查，不引入完整视频课程。

## 界面与集成

5. UI代理负责 `camera-compare.js/css` 和tests/camera-compare.test.cjs，提供PhotoCameraCompare.mount(container,topicId)/destroy()。默认basics；基础页规格对照和起步步骤，12主题每个环节双列R6/R7，手机同环节堆叠。目录13项、差异摘要、相邻主题、原R6同主题和相关实拍入口；来源过滤/文本转义；不读写存储，不增加监听依赖。未知主题显示明确恢复入口与目录。
6. 根代理负责app/index/search、guides/camera-manual/equipment-guide入口、README、共享测试与浏览器脚本。新route `#camera-compare/<id>` 主导航归相机入口，breadcrumb使用具体标题。搜索第9个可选参数接收对照数据，增加13条“换机配置”记录；旧调用保持可用。
   UI代理完成界面后协助扩展浏览器脚本，根代理负责统一运行、内容复核与结果汇总。
7. 加载顺序：旧配置与双机课程/数据之后、glossary/media之前加载两组R7数据及comparison-data；camera-compare.js在app前。既有R6主题只增加对应对照链接，不改旧主题数据、题目、任务或状态格式。

## 验证与交付

- 两组R7模块独立结构与来源检查；聚合映射完整、缺失/重复保护；对照页内链、逃逸处理、失配回退、无状态变化。旧43课/39任务/86卡、原12项R6配置保持兼容。
- 新增13主题及未知路由的浏览器覆盖：双侧步骤、手机标签、标题/ID/溢出、键盘目录与相邻导航、刷新/历史、搜索与file://。保留原异常回归；读取前后原存储串不变。
- 全量Node测试、JS语法/diff检查；桌面基础参数与操作/回放页、手机页面和展开内容目视。发现问题先在本方案记录，再修正并做适当验证。
- docs/51记录基础规格依据，docs/52记录真实验证；构建、本地提交后重建并比对version.json与HEAD。

## 验证发现与修正

待实际验证后记录。

- 基础参数初稿自查发现1/250秒的中文分数说明不准确。改为明确的“1/250秒约为0.004秒”，并以数值计算及页面原文核验，避免把快门时间与连拍频率混淆。
- 界面与真实数据对齐时发现初次设置标题已有1—10编号，界面再加01标记会重复。去掉界面额外编号，保留数据标题；用真实聚合数据渲染和浏览器目视确认。
- R7基础模块首次独立加载发现测光关联课ID写成不存在的 `metering`。核准现有课程后改为实际测光课程ID，重新执行模块加载与全部课程/任务引用检查，确保失败不会修改全局资料。
- 浏览器脚本自查发现新增断言在Node环境引用了页面全局 `innerWidth`。改用 `page.viewportSize().width` 读取本次视口宽度；先检查脚本语法，再执行实际手机布局回归。
- 独立内容复核发现R6 III的0090官方页实际为“片门全开”，初稿来源标题误叫“短片裁切”；改正来源标题与适用注释，RF-S的4K优限制另由0050短片画质页支撑。同时给R7初次设置第3步补上“分别记录”时先选卡1/卡2再设各卡画质的分支。对照两机官方页面、渲染真实文本及相关模块检查确认。
- 首轮全量测试中，新43课状态兼容断言把VM内数组与主进程数组直接做严格原型比较，结构相同仍失败。修正测试边界：将预期状态转换为普通JSON对象再比较，继续完整检查所有值；不修改学习存储代码。重跑该集成测试与全量测试确认。
- 117路由浏览器回归通过后，目视手机回放步骤截图发现键盘测试留下的“跳到学习内容”焦点提示覆盖正文。该提示本身是预期无障碍行为；在保存对照页截图前将焦点移到main，再定向重拍并检查提示未覆盖正文。保持网站键盘提示行为不变。
- 定向复查确认焦点已在main，跳转链接实际边界也完全在视口外，但长元素截图仍包含该固定元素。因此修正截图处理：仅在保存对照截图时，用Playwright临时样式隐藏未获焦的跳转链接；页面CSS与键盘交互保持原样。重拍桌面/手机并检查截图，附实际焦点/视口外边界和页面无溢出检查结果。
