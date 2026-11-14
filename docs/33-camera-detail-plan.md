# 相机基础参数与配置细化实施方案

先依据 docs/32 需求实施。数据、界面、集成分别负责，变更前工作区干净。

## 内容与实现

1. `camera-parameters-data.js` 加载在 curriculum-support.js 后，增强八门既有基础课的 sections、steps、mistakes、minutes、sources，并提供 `parameterTable: {caption, headers, rows}`，每行和表头同宽。保留原 quiz、ID、课程位置、卡片和任务检查项；不删除先前补充内容。原解释仍在，新增段落讲数值与操作，表格作对照。导出 `PHOTO_CAMERA_PARAMETERS` 供检查。
2. `camera-config-data.js` 导出 `PHOTO_CAMERA_CONFIG = {model, checkedAt, topics, sources}`。主题 ID 固定为 controls、quality、exposure-modes、auto-iso、metering-compensation、autofocus、white-balance、drive-shutter、stabilization、playback、custom-controls、custom-modes。每主题结构：id/title/summary/group/settings[{name,value,reason}]/steps[]/checks[]/pitfalls[{symptom,fix}]/restore/lessonIds[]/taskId/sources[{title,url}]。逐页核验官方来源，最少五步；不写死菜单页码，不混用别的机型。
3. `camera-manual.js/css` 提供 `PhotoCameraManual.mount(container,topicId)` 与 destroy；使用 #camera/<topic-id> 深链，未知主题显示可恢复入口。每页一个 h1，主题导航、可读设置表、步骤、验收、排错、逐项恢复、课程任务链接和来源。原 #camera 保留八步，并加入详细手册入口；guides.js 的 mount 在 camera 且有参数时调用详细手册，destroy 清理对应事件。不引入存储字段或外部依赖。
4. 根代理负责 app.js 参数表渲染、index 加载顺序、search 新类别、旧课配置入口、README、来源汇总与最终验证。内容代理各负责独立模块与来源/测试；UI 代理负责手册、guides.js、浏览器脚本与模块测试。所有代理不自行提交。
5. 八课与配置的对应：camera→controls，exposure→metering-compensation，aperture/shutter/modes→exposure-modes，iso→auto-iso，focus→autofocus，whitebalance→white-balance。新主题资料也纳入全站来源索引。

## 验证与提交

- 冻结 b8b9631 的课程/卡片/任务身份与旧任务检查项，以内容契约及既有备份测试保护。
- 检查参数表、主题结构、来源、内部目的地和搜索；检查曝光换算的明确例子，防止文字只变长而没有可操作细节。
- 扩展实际 Chromium 检查，遍历全部 12 主题、两种宽度、离线、键盘、深链刷新和未知主题；保留原异常流程回归，目视检查参数表与配置手机页。
- 全部单元测试、根目录 JavaScript 语法、diff 空白检查和公开构建；最终提交后重建并比较 version.json 与 HEAD。
- 资料核验记录 docs/34、35；实际验证 docs/36。本地小步提交，不推送。

## 验证中发现与修正

后续缺陷在本节先记录原因、修复和验证方式，再改代码。

- 首轮 Chromium 在 390px 的光圈课发现整页宽度达到 480px。只读逐元素诊断确认，表格仍在自己的滚动容器中；真正溢出来自正文无空格的 `f/1→f/1.4→…→f/32` 整档链（316px 段落内 scrollWidth 为 443px）。修复：仅为课程正文段落添加 `overflow-wrap:anywhere`，保留所有数值和表格的局部滚动；用 8 门基础课手机遍历、实际键盘横滚及全量浏览器回归验证，避免用页面裁剪掩盖内容。

- 参数内容复核发现快门秒号示例包含多余的可见反斜杠；按实际阅读文字改为 `0"5`、`15"`，检查运行时正文不显示转义符。
- ISO 表把数值比称为“输出亮度比例”容易误导为实际 JPEG 像素值或屏幕亮度按线性倍增，忽略色调曲线和裁切。改为标称 ISO 数值比与曝光档差，明确实际显示不保证相同比例；维持固定曝光与等亮对照两类练习。
- 参数模块的整档光圈测试误用 3% 容差，f/8 与 f/11 的标称取整面积比约 1.89，教程的“约一档”正确。仅对标称光圈链使用 7% 容差，具体曝光算例继续用 3%，重新运行模块验证。
