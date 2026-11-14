# R7 六项基础配置：来源与核验

核验日期：2026-11-14。需求与结构分别见 docs/47、docs/48。本文件对应 `r7-foundation-config.js` 的六个主题，提供 `PHOTO_R7_FOUNDATION`；不追加全局来源、不修改课程或进度。全局来源合并由对照聚合模块负责。

本轮阅读佳能 EOS R7 中文高级用户指南。该在线指南标示适用于固件 1.8.0 或更高版本；这是文档的适用说明，不代表检查过用户机身，也不等同于“1.8.0 是最新版本”。R6 Mark III 的对照以其独立中文指南为准，未将 R6 三代的按钮或菜单名称直接移植到 R7。

## 逐主题来源

|主题|官方原始来源|核验后采用的条件|
|---|---|---|
|文档范围|[R7 高级用户指南](https://cam.start.canon/zh/C005/manual/html/index.html)|确认机型与指南适用范围；未持有 R7 可做纸面路线和条件推演，不宣称实机验证。|
|controls|[基本操作](https://cam.start.canon/zh/C005/manual/html/UG-01_Preparations_0110.html)|主拨盘与一个速控转盘；ISO 按钮、M-Fn 与 LOCK。锁定后部分“先按按钮、再转盘”的操作仍可执行，LOCK 不是全部输入冻结。|
|controls|[菜单操作和设置](https://cam.start.canon/zh/C005/manual/html/UG-01_Preparations_0120.html)、[速控](https://cam.start.canon/zh/C005/manual/html/UG-01_Preparations_0130.html)|INFO 切换菜单主功能页、主拨盘切次级页、速控转盘选条目；Q/SET 是共享按钮。灰显可能由模式或功能冲突导致，并非每个条目都提供原因提示。|
|quality|[图像画质](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0030.html)|普通画质界面：主拨盘选 RAW，速控转盘选 JPEG/HEIF。分别记录须逐卡设置，不能两卡分别配 RAW 与 C-RAW。HEIF 与 HDR PQ 状态有关；BUSY 需要等待缓存写入。|
|quality|[选择记录方法](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0030.html)|标准、自动切换、分别记录、多个媒体不能混称“备份”；照片/短片分离状态也影响目标卡及可用记录选项。用少量文件验证，不要求清空卡。|
|quality|[静止图像长宽比](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0050.html)、[规格](https://cam.start.canon/zh/C005/manual/html/UG-10_Reference_0100.html)|普通 3:2 L、RAW/C-RAW 是 6960×4640。非 3:2 时，JPEG 按比例生成，RAW 保留 APS-C 3:2 数据及比例信息。C-RAW 文件更小不表示像素尺寸更小。|
|exposure-modes|[Av](https://cam.start.canon/zh/C005/manual/html/UG-03_CustomShooting_0050.html)、[Tv](https://cam.start.canon/zh/C005/manual/html/UG-03_CustomShooting_0040.html)|主拨盘选择优先项，半按后检查自动项及闪烁提示。可用光圈取决于镜头和焦段；没有给 RF-S18–150 的 150mm 端指定不可用的 f/4。|
|exposure-modes、metering-compensation|[M 手动曝光](https://cam.start.canon/zh/C005/manual/html/UG-03_CustomShooting_0060.html)|R7 默认 M：主拨盘快门、速控转盘光圈、ISO 按钮进入 ISO。M+AUTO 可以补偿；既有补偿可继承；默认单次 AF＋评价测光在合焦后持续半按会锁 ISO，AE 锁亦可锁 ISO。|
|auto-iso|[静止图像 ISO 感光度设置](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0090.html)|手动范围与自动范围分别设置。最低快门用于 P/Av，闪光时不适用；达到自动 ISO 上限后，快门仍可能慢于所设值。M+AUTO 可固定快门，但曝光不足仍需处理。|
|metering-compensation|[测光模式](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0160.html)、[曝光补偿](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0070.html)、[曝光锁](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0080.html)|点测光按中央区域使用，不写成跟随 AF 点。默认单次 AF＋评价测光的半按锁定与其他模式有别，并可能由自定义功能改变。补偿关机后仍保留，曝光锁有独立用途和提示。|
|white-balance|[白平衡](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0170.html)|R7 直接进入“拍摄→白平衡”，AWB 选项通过 AF 点选择按钮进入。自定义参考从“拍摄→自定义白平衡”导入，再回白平衡选自定义；导入与启用分开核查。|

## 对照侧依据

R7 主题中的 `differences` 用于解释换机动作。R6 三代资料由原 `PHOTO_CAMERA_CONFIG` 及本轮聚合模块共同索引，详见 docs/35 和 docs/51。核对入口如下：

- [R6 三代基本操作](https://cam.start.canon/zh/C022/manual/html/UG-01_Preparations_0110.html)、[菜单操作](https://cam.start.canon/zh/C022/manual/html/UG-01_Preparations_0120.html)：两个速控转盘、Q/SET 分离、多功能锁开关，与 R7 的控件对应不同。
- [R6 三代 M 模式](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html)、[ISO 设置](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0180.html)：默认 ISO 控制、M+AUTO 与最低快门的共同限制。
- [R6 三代裁切／长宽比](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0110.html)、[规格](https://cam.start.canon/zh/C022/manual/html/UG-11_Reference_0090.html)：1.6 裁切的普通 L/RAW 为 4320×2880，裁切区域外连 RAW 也不记录；卡槽分别是 CFexpress Type B 与 SD。不能套用 R7 的 RAW 长宽比处理结论。
- [R6 三代白平衡设置](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0340.html)：存在“白平衡设置”上级入口，AWB 优先项使用 INFO；R7 对应操作另写。

## 教学补充与边界

每主题至少 3 个设置项、6 个操作步骤、3 个核验点、2 个排障和2个恢复项。操作解释、场景与检查问题均为原创组织，没有复制厂商完整步骤。

- 100–6400 自动 ISO、缓慢动作 1/250 秒、RF50 的 f/4，以及白平衡 3500K/6500K 都是有条件的练习起点，不是厂商推荐的通用组合，也不保证清晰或准确颜色。
- 曝光比较优先选自然光与 1/3 级增量。M+AUTO 闪光时不应用该曝光补偿；1/2 级补偿配合 ISO 步进可能微调实际快门而显示不变，作为排障说明保留。
- 白平衡参考须在实际光源下正常曝光。未拥有合格中性参考时可观察相对冷暖，不宣称完成颜色校准；相同 K 值也不保证双机同色。自定义参考被覆盖后，恢复 WB 模式不会找回旧参考，需重新导入保留的原参考照片。
- 两机画幅与像素尺寸比较限定普通静止图像记录模式；导出缩图、视频和特殊模式不借用这些尺寸作保证。
- 读取手册、纸面预演和浏览器检查均不能替代真实机身按键、写卡和成片验证；模块不自动完成任何实拍任务。

## 独立验证记录

- 首次加载发现测光课程关联误写为 `metering`。根代理先在 docs/48 登记问题，再改为实际存在的 `metering-histogram`；重新加载成功。
- `node --check r7-foundation-config.js` 通过。
- `node --test tests/r7-foundation-config.test.cjs`：6 项通过。覆盖精确主题集合、环节深度、有效课程任务、官方来源与注释、关键操作边界、缺失依赖/关联及重复加载保护。
- 加载前后 `PHOTO_DATA` 全对象一致；本模块没有追加全局来源，也未创建或覆盖原 R6 配置。
- 本文件仅记本模块检查结果；全站聚合、界面与浏览器验证由根代理在 docs/52 记录。本轮未进行真实 R7 按键或文件采样测试。
