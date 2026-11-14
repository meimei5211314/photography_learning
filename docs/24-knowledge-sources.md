# 相机控制专题：事实来源与练习边界

核对日期：2026-11-14。新增阶段 6 的四课、四任务、八张回忆卡，均使用原创中文解释和对照练习。R6 三代的菜单与兼容性以当前官方手册为例；其他机型应查各自说明。

## 已读取的官方原始资料

| 来源 | 本课采用范围 |
|---|---|
| [Canon：CMOS 传感器技术访谈](https://global.canon/en/technology/canon-tech/interview/cmos/) | 光转换为电信号、像素和逐行读出的基本原理。文章涉及多种研发传感器，不引用其原型规格描述 R6 三代。 |
| [R6 III：静止图像画质](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0070.html) | RAW/C-RAW、双格式记录、扩展名与软件兼容性。 |
| [R6 III：RAW 图像处理](https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0180.html) | 同一原始记录可按不同白平衡和风格生成副本；处理副本与原始文件分开。 |
| [R6 III：裁切/长宽比](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0110.html) | 1.6 倍裁切与 RF-S/EF-S 不保留裁切外 RAW 区域；和仅设置长宽比信息分开解释。 |
| [R6 III：静止图像 ISO](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0180.html) | ISO、运动和噪点取舍；P/Av 的自动 ISO 最低快门可能在上限不足时被突破。 |
| [R6 III：自动对焦操作](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0040.html) | 单次/伺服、持续激活与伺服时未合焦仍可释放快门。 |
| [R6 III：自动对焦区域](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0060.html) | 区域、检测与全区域追踪的关系；严格限区须核对相关组合。 |
| [R6 III：快门模式](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0500.html) | 三种快门选择、电子前帘焦外表现和人工灯条纹等条件限制。 |
| [Canon Europe：电子与机械快门](https://www.canon-europe.com/pro/infobank/electronic-vs-mechanical-shutter/) | 曝光持续时间与逐行读出差异、滚动变形原理。不沿用文章中旧机型速度或“全部 EOS”概括。 |
| [R6 III：图像稳定器](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0530.html) | 镜头开关、机身设置、静态与短片选项的区别。 |
| [Canon Europe：RF 卡口](https://www.canon-europe.com/pro/infobank/rf-mount/) | RF/RF-S、EF/EF-S 和 EF-EOS R 转接关系；具体镜头与特殊附件仍查兼容性。 |
| [Canon RF Lens World：焦距与视野](https://files.canon-europe.com/files/webcontent/rf-lens-world/knowledge/focus/index.html) | 在相同画幅下比较焦距与范围，不把范围变化等同于机位改变。 |
| [Canon RF Lens World：景深](https://files.canon-europe.com/files/webcontent/rf-lens-world/knowledge/depth-of-field/index.html) | 对焦距离、光圈与清晰范围的关系，支持近摄和景深课的关联。 |
| [Nikon 官方 FAQ：自动对焦未合焦](https://onlinemanual.nikonimglib.com/faq/en/shooting_issues/af_target_not_in_focus.html) | 最近对焦距离由机内焦平面量到主体；与镜头前端的工作距离分开，不套用尼康专用菜单到佳能。 |

网页来源只提取必要事实并改写，不复制配图或长段正文。每课的 `sources` 字段保存具体来源，同时加入全站资料页，便于继续核对。

## 本站设计、推断与限制

- “原始记录—处理设置—输出副本”、两轮 AF 比较、支撑/条纹分组测试、同机位/移动机位对照是本站教学设计，不是标准实验室测量。记录条件与不确定性，不用几张试拍给相机性能排名。
- ISO 不产生额外入射光；用固定光圈、快门和光照的条件区分实际进光与呈现。没有宣称所有机型的噪点只取决于 ISO，也不保证低 ISO 一定更清楚。
- 50mm × 1.6 = 80mm 是视角换算示例，不把曝光、景深、噪点或记录细节一并按同一倍数换算。镜头名称 24–105mm、f/4、f/4–7.1 是读规格示例，不是配图 EXIF。
- 同机位裁切与变焦的比较使用几何关系推导，并要求实际重拍；忽略镜头畸变等差异时透视大体相同。移动机位另做一组，不把“长焦压缩”简化为焦距单独改变物体距离。
- 没有 RAW、连续 AF、可选快门方式或变焦镜头的设备，可做文中明确限定的替代观察；任务验收要求记录未验证的功能，不冒称完成了硬件测试。
- 静态与视频防抖不混用，脚架上的防抖按具体镜头说明。全电子不等于绝对静音或全局快门，机械快门也不保证所有灯具下无条纹。
- 复用 `landscape`、`portraitGroup`、`streetNight` 作为观察参照，署名许可沿用既有素材记录；不从单张图推断原始焦距、AF 模式、快门方式或 RAW 表现。
- 原有课、任务和检查项不移动、不改 ID。新任务沿用既有笔记与检查状态机制，备份格式不变。
