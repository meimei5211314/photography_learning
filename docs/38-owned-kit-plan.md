# 现有两镜教程实施方案

先按 docs/37 的已确认器材实施。当前工作区从干净的 343bab3 开始。

## 数据与课程

1. `lens-practice-data.js` 追加阶段 10“用熟手中的两支镜头”。固定课程 ID：prime-working-distance、zoom-range-map、two-lens-comparison、two-lens-outing；任务 ID：prime-distance-focus、zoom-aperture-map、matched-lens-pairs、two-lens-field-story。达到 40 课、36 任务、80 卡。结构与现有课程一致，每课6段/5步/3误区/1自测/2卡，相关链接连接对应任务与先修。复用现有署名图片，只作观察。
2. `equipment-data.js` 导出 `PHOTO_EQUIPMENT`：id/title/checkedAt/camera/name 等器材资料与 sources，具体结构采用下列契约。模块仅增加来源索引，不写状态。所有镜头、裁切与菜单事实由官方来源核验；中间焦段光圈由读者实测，不猜。
   - `id: 'r6iii-two-lenses'`，`title`，`checkedAt`，`camera: {name, summary}`。
   - `lenses: [{id,name,role,coverage,aperture,stabilization,focus,closeFocus,filter,lessonId,sources}]`，ID 为 rf50、rfs18150。
   - `keyPoints: [{title,body}]`（记录区域、等效视角、像素/曝光边界）。
   - `viewAngles: [{lens,setting,recording,view,note}]`（50全幅、50裁切、变焦18/35/50/85/150；等效仅为视角）。
   - `scenarios: [{id,title,lens,settings,checks,changeWhen,lessonId}]`，六个具体场景，settings/checks 为字符串数组，其余文本。
   - `quickCheck: string[]`，`sources: [{title,url,note}]`。来源去重进入 PHOTO_DATA.sources。
3. 课程代理负责 lens-practice-data.js、docs/39、tests/lens-practice.test.cjs；器材代理负责 equipment-data.js、docs/40、tests/equipment-data.test.cjs。先核验再写文件，不改共享文件、不提交。

## 界面与集成

4. `equipment-guide.js/css` 提供 `PhotoEquipment.mount(container)`、destroy；路由 #kit 单页。展示已确认设备、重点裁切说明、两镜事实对照、同为50mm时全幅/裁切记录区域的原创 SVG、视角表、六个场景建议和四门正式课程/任务入口。场景用原生 details 控制篇幅；不另复制课程详情、不增加器材进度标记。移动端表格局部滚动或转卡片，导航与链接可键盘操作。
5. UI 代理负责 equipment-guide.js/css、guides.js 中上手页的 #kit 入口、模块测试和 scripts/check-browser.cjs。根代理负责 app/index/search、阶段10、首页/课程器材入口、README、全部集成测试与docs/41验证报告。#kit 在侧栏归学习路线激活，不扩充手机主导航格数。
6. 搜索增加“手头器材”类别，单条器材入口 href 为 #kit，完整型号/别名/场景及视角表可搜索；新增四课与任务沿用既有搜索。器材新模块在课程与配置数据之后、媒体映射之前加载。app 在 kit 切出时 destroy，不接触旧存储。

## 验证与提交

- 扩展现有 36 课兼容契约，保留全部旧自测与任务检查项语义；新增课程任务卡片身份唯一、来源和媒体真实有效。
- 结构与数学检查：1.6 倍视角换算只用于对应记录区域，50全幅和50裁切分开；同焦距对照不能漏掉裁切条件；参数任务不预填中间焦段光圈。
- 全部单元测试、根目录 JS 语法、diff检查；浏览器新增器材入口、四课、任务、阶段筛选、搜索、未知kit子路径恢复、桌面/手机和file://，保留原异常回归。
- 目视器材页与新课程；公开构建后最终提交，再重建比对 version.json 与 HEAD。本地小步提交，不推送。

## 验证发现与修正

先记录原因、修复方式与验证方法，再修改。
