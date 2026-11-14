# 相机详细配置手册：资料核验与边界

核验日期：2026-11-14。需求与实施方案见 [32](32-camera-detail-requirements.md)、[33](33-camera-detail-plan.md)。模块为 `camera-config-data.js`，导出 `PHOTO_CAMERA_CONFIG`；仅提供教学数据与来源索引，不操作实体相机，也不新增课程、任务或复习卡。

## 机型与依据

只用佳能 **EOS R6 Mark III** 的 C022 官方手册核对菜单与控制。当前[中文手册首页](https://cam.start.canon/zh/C022/manual/html/index.html)写明适用固件 1.1.0 或更高版本，文档号 CT2-D374-B；这是手册适用条件，不能据此宣布最新固件。全部说明以静止图像和默认控制为起点；镜头、拍摄模式、固件与个人自定义设置影响可用项目。

正文为原创操作练习，没有转载官方截图或完整章节。菜单名称与必要的操作事实用于定位，试拍对象、对照步骤、检查证据和逐项恢复是本教程的教学安排。示例参数和1/3级对照不作为厂商推荐或清晰度保证。

## 主题与原始章节

| 主题 ID | 已核验原始资料 | 教学采用内容 |
| --- | --- | --- |
| `controls` | [基本操作](https://cam.start.canon/zh/C022/manual/html/UG-01_Preparations_0110.html)、[菜单](https://cam.start.canon/zh/C022/manual/html/UG-01_Preparations_0120.html)、[速控](https://cam.start.canon/zh/C022/manual/html/UG-01_Preparations_0130.html) | 默认拨盘、Q与MENU分工、SET确认、基本拍摄区隐藏菜单和灰显限制排查；先核对自定义与锁定 |
| `quality` | [画质](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0070.html)、[记录方法](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0030.html) | 图像格式与卡片分工分别检查；标准、自动切换、分别记录和多个媒体含义不同；实际文件验收 |
| `exposure-modes` | [Av](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0220.html)、[Tv](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0210.html)、[M](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html) | 模式分配、默认三拨盘、半按读数、闪烁提示和镜头极限；M的固定ISO与AUTO分开 |
| `auto-iso` | [ISO设置](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0180.html)、[M](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html) | 手动范围/自动范围分开；P/Av最低快门可被ISO上限突破，闪光不应用；默认单次AF与评价测光可能锁ISO |
| `metering-compensation` | [测光](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0230.html)、[补偿](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0150.html)、[曝光锁](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0250.html)、[M](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html) | 取样、补偿与锁定职责；M AUTO补偿入口和闪光例外；关机/切模式不能当作归零 |
| `autofocus` | [AF操作](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0040.html)、[区域、主体与眼睛](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0060.html) | 镜头AF入口、持续启动、四层控制与全区域跟踪关系；以回放验收而不是蓝框 |
| `white-balance` | [白平衡设置](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0340.html) | 白平衡设置→白平衡的完整路径，AWB优先、色温、自定义导入后启用，参照曝光与混合光边界 |
| `drive-shutter` | [驱动菜单](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0460.html)、[驱动选择](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0120.html)、[快门](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0500.html)、[静音](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0490.html)、[画质与缓存](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0070.html) | 帧数与曝光时间分开，静音的关联限制，人工灯及焦外对照，连拍速度为有条件能力 |
| `stabilization` | [图像稳定器](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0530.html)、[快门](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0500.html) | 镜头IS开关与机身项目的可用条件，静止图像IS生效时机；用多张对照区分抖动和主体运动 |
| `playback` | [放大显示](https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0040.html)、[播放信息](https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0270.html)、[高光警告](https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0280.html) | 初始倍率/位置/保持位置，默认切图和移动，信息屏与柱状图设置，结合重要细节判断 |
| `custom-controls` | [自定义控制](https://cam.start.canon/zh/C022/manual/html/UG-09_Customize_0030.html)、[基本操作](https://cam.start.canon/zh/C022/manual/html/UG-01_Preparations_0110.html) | 拍摄与回放分配、拨盘/控制环、锁定范围与清除全部控制；逐个控件记录并验证 |
| `custom-modes` | [C1–C3](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0290.html)、[设置文件](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0300.html)、[重置相机](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0280.html) | 注册、调用、自动更新、清除和卡中配置文件各自用途；优先逐项还原，不以出厂重置开始排错 |

## 易误教的条件

1. **菜单与默认控制**：按名称定位，不填写易随模式变化的页签编号。灰显项目可能提供限制原因，也可能不显示完整原因；Q布局和拨盘可能已自定义，不能把自己机身的现象当所有机身默认行为。
2. **M + AUTO ISO**：仍有自动曝光；切入时可能保留原补偿。默认单次AF、评价测光和曝光锁规则下，合焦后保持半按会锁ISO，检查时应松开再重测。自动ISO闪光摄影不应用这里的补偿；1/2级补偿还可能微调实际快门而显示不变。基础对照因此选自然光、1/3级，并写清可见读数的边界。
3. **AF四层与跟踪**：严格限制选区需同时处理“伺服自动对焦追踪全部区域”和“检测的被摄体”，选择无也关闭眼检的条件。点屏的一次AF不等于持续伺服，绿色/蓝色框与照片的实际清晰度需要分别判断。
4. **白平衡完整闭环**：从卡片导入自定义参照后，还要在白平衡中选择自定义；为拍参照切过MF时，正式拍摄前应恢复所需AF状态。参考物、光源和曝光错误不能由菜单名称修复。
5. **防抖**：中文页还将静止图像与短片选项放在同章；同时核对了[同型号英文版](https://cam.start.canon/en/C022/manual/html/UG-04_Shooting_0530.html)，但不据此扩展未经验证的功能。教程只要求处理当前镜头和静止图像界面实际可见的项目，不从其他R6型号推导菜单，也不把被摄体追踪IS当人物眼睛AF。
6. **恢复范围**：按钮还原优先于清除全部控制；临时C模式恢复取决于自动更新状态，已保存的改动需重新建立基准。C模式清除不能找回旧的个人配置。加载卡中设置会应用保存状态，只允许同型号且仍可能有固件兼容问题；相机设置文件不是照片备份。

## 验证范围

模块应保持36课、32任务、72卡的内容与身份不变。加载前检查重复发布、主题唯一性及课程/任务目的地，确认通过后才按URL去重追加来源；全站索引需要的`note`字段一并保留。

`tests/camera-config.test.cjs`验证12主题、设置/步骤/检查/排错/恢复结构、官方型号路径、既有数据不变，以及重复或缺少关联数据时不发生部分修改。界面、搜索、键盘、390px和file://验证由集成报告记录。未开展实体R6 Mark III、镜头、存储卡或固件刷写测试，不将文档核验写成真机操作验证。

2026-11-14执行`node --test tests/camera-config.test.cjs`：4项通过，0项失败；`node --check camera-config-data.js`与本次文件的`git diff --check`通过。此结果不替代全站界面与构建验收。
