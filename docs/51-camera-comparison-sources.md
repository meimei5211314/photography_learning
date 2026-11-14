# R7 / R6 三代基础参数与聚合对照依据

核验于2026-11-14。需求/方案见docs/47–48；R7前六主题依据见[49](49-r7-foundation-sources.md)，后六主题见[50](50-r7-advanced-sources.md)，原R6主题依据保留在[35](35-camera-configuration-sources.md)。R7是可选新增机身，不把用户拥有状态自动改为双机。

`camera-comparison-data.js`把两个独立R7配置模块按原R6的12个ID一一配对，原R6主题对象及其教学内容保留。基础页另提供14项参数说明与10步初次设置流程。两个完整操作序列并列呈现，不把R6同名项目推断为R7相同能力。

## 基础参数

| 项目 | 官方依据及采用边界 |
| --- | --- |
| 画幅、文件像素与镜头视角 | [R7规格](https://cam.start.canon/zh/C005/manual/html/UG-10_Reference_0100.html)、[R6 III规格](https://cam.start.canon/zh/C022/manual/html/UG-11_Reference_0090.html)。有效像素与记录像素分开；6960×4640、4320×2880只按普通静止图像、相应3:2/L/RAW条件说明，不泛化到所有尺寸。RF50和RF-S视角沿前轮已核实资料，实际焦距与曝光f值不变。 |
| 裁切与长宽比 | [R7纵横比](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0050.html)、[R6 III裁切](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0110.html)。R7原生APS-C不再裁一次；R6自动/手动1.6裁切的RAW不保存外侧。 |
| ISO | [R7 ISO](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0090.html)、[R6 III ISO](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0180.html)。正常上限32000/64000与扩展51200/102400分开；R6扩展L50有条件。自动范围、高光优先和拍摄模式另行核查，扩展不代表更高画质。 |
| 快门与连拍 | [R7快门](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0350.html)、[R7驱动](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0130.html)、[R6 III快门](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0500.html)、[R6 III驱动](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0120.html)。最短1/16000秒与各挡位/模式限制分开；H+最高15/30和12/40张每秒附电池、快门、AF、镜头、缓存等条件。1/250秒为0.004秒，张/秒不是曝光时长。 |
| 显示、卡槽、电池 | 两机规格页：R7 EVF约236万点、R6 III约369万点，后屏均约162万点；显示点数不是照片像素。R7双SD，R6 III为CFexpress Type B＋SD。R7当前手册列P/NH/N/LP-E6，R6 III主用P，NH/N有限制且不能用LP-E6；不据“兼容”推断USB充电、供电或全部功能相同。 |
| AF与IS | [R7 AF](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0070.html)、[R6 III AF](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0060.html)、[R7 IS](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0370.html)、[R6 III IS](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0530.html)。两机追踪项目名称不同，主体框不保证成片清晰；两机具有机身IS，但不引用其他组合的最高防抖级数保证现有镜头性能。 |
| 视频识别边界 | [R7短片画质](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-2_0040.html)、[R6 III短片画质](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0050.html)、[R6 III片门全开](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0090.html)。只说明照片/视频独立设置、R7普通4K与4K优帧率差异、RF-S对R6片门全开及4K优限制；不把照片1.6裁切套到所有视频组合。 |

## 操作与教学取舍

- 初次设置流程是原创练习顺序：辨认机身、供电/卡、画质、区域、拨轮、曝光起点、AF、颜色/稳定/释放、回放、独立保存。具体操作依据来自上述页面和两组R7模块、原R6配置的官方章节。
- M＋AUTO ISO、1/250秒、f/2.8和Av f/8都是附条件的观察起点。现有18–150最大光圈随焦距变化，不预填中间焦距数值，也不要求两机ISO相同。
- R7两拨盘及ISO按钮、独立LOCK、前方AF/MF开关、回放主拨盘与R6第三拨盘区分；默认控制可能已被自定义，先读当前分配再操作。
- R7当前设置目录未列R6的保存/加载设置文件入口，因此提供逐项记录与本机C1–C3验证；不据当前手册推断未来固件永久不支持，也不建议跨机导入文件。
- 规格以对应手册当前内容为依据。手册适用固件与用户实机固件不同，不能称已确认用户版本或“最新版本”。外部参考需联网，本地对照内容可离线阅读。

没有复制厂商插图、拍摄用户样片、实际操纵相机或验证镜头性能。学习记录与相机配置是不同对象；浏览器不连接相机，不自动写入菜单，不将阅读算作实拍完成。模块与整站真实验证结果见docs/52。
