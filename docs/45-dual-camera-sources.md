# 可选R7双机组合：依据与验证边界

核验日期：2026-11-14。需求与方案见 [42](42-dual-camera-requirements.md)、[43](43-dual-camera-plan.md)。`dual-camera-data.js` 导出独立的 `PHOTO_DUAL_CAMERA`，原有单机两镜资料 `PHOTO_EQUIPMENT` 保留。R7是用户提出的假设增加设备，未被记为已拥有；阅读和纸面演练不自动完成实拍任务。

资料以两机官方中文手册为主。当前[R7手册首页](https://cam.start.canon/zh/C005/manual/html/index.html)标注适用于固件1.8.0或更高版本；[R6 Mark III手册首页](https://cam.start.canon/zh/C022/manual/html/index.html)标注适用于固件1.1.0或更高版本。这是当前手册的适用条件，不是对用户实机固件或最新固件版本的判断。默认控制可能被个人自定义改变，教学要求先读实际设置。

## 四组合与记录尺寸

| 组合 | 普通照片的记录区域 | 全画幅等效视角 | 本轮采用的记录尺寸条件 |
| --- | --- | --- | --- |
| R6 III＋RF50 | 全画幅3:2 | 50mm | L、RAW/C-RAW：6960×4640，约3230万 |
| R6 III＋RF-S18–150 | 自动1.6倍裁切 | 约28.8–240mm | 裁切L、RAW/C-RAW：4320×2880，约1240万；S2另为2400×1600 |
| R7＋RF50 | 原生APS-C 3:2 | 约80mm | L、RAW/C-RAW：6960×4640，约3230万 |
| R7＋RF-S18–150 | 原生APS-C 3:2 | 约28.8–240mm | L、RAW/C-RAW：6960×4640，约3230万 |

依据：[R7规格](https://cam.start.canon/zh/C005/manual/html/UG-10_Reference_0100.html)、[R6 III规格](https://cam.start.canon/zh/C022/manual/html/UG-11_Reference_0090.html)、[R6 III静止图像裁切/长宽比](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0110.html)。这里使用官方记录尺寸，未用标称有效像素除以1.6的平方代替实际文件规格；记录像素的约3230万与有效像素的最高约3250万分开描述。

R6 III＋RF50也能主动裁切，届时约80mm视角，L与RAW/C-RAW为4320×2880。四组合表以它的全画幅状态为基准，另在说明中写主动裁切条件。R7搭配RF-S不会在原生APS-C上再乘一次1.6。所有视角换算都不改变镜头焦距刻度和曝光使用的f值。

[R7静止图像纵横比](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0050.html)说明RAW仍保存APS-C的3:2，并附长宽比信息；这与R6 III真正1.6倍裁切RAW不记录外侧区域不同。任何RAW都不能凭空补回传感器之外的画面。输出分辨率、后期裁剪、镜头校正和实际文件内容仍需检查。

## 操作差异的原始依据

| 教学项 | R7原始资料 | R6 III原始资料 | 核对要点 |
| --- | --- | --- | --- |
| AF/MF | [机身对焦模式开关](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0280.html)、[AF操作](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0040.html) | [AF操作](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0040.html) | R7开关启用时用前方实体开关，关闭后改菜单；这两镜无镜头AF/MF开关，FOCUS/CONTROL不承担AF/MF切换 |
| 对焦/控制环 | [自定义AF功能](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0120.html)、[自定义转盘](https://cam.start.canon/zh/C005/manual/html/UG-09_Custom_0030.html) | [自定义控制](https://cam.start.canon/zh/C022/manual/html/UG-09_Customize_0030.html) | RF50用镜头选择开关；RF-S在R7的AF菜单、R6 III的自定义控制菜单中选环用途；具体控制功能另行分配 |
| M与ISO | [M](https://cam.start.canon/zh/C005/manual/html/UG-03_CustomShooting_0060.html)、[ISO](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0090.html) | [M](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html) | R7按ISO按钮后转盘，R6 III默认速控转盘2；共同补偿入口、保留补偿、半按锁ISO和闪光例外均有条件 |
| 主体与眼睛 | [AF区域与追踪](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0070.html) | [区域与主体检测](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0060.html) | R7的“被摄体追踪”和R6 III的“伺服自动对焦追踪全部区域”分别定位；点屏一次不等于持续伺服 |
| 防抖 | [静止图像IS](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0370.html) | [影像稳定器模式](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0530.html) | RF50无镜头IS但两机都有机身防抖；RF-S有IS却无实体IS开关；不用短片数码IS的裁切描述照片 |
| 驱动与快门 | [驱动选择](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0130.html)、[快门模式](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0350.html) | [驱动菜单](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0460.html)、[快门模式](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0500.html) | 先练单拍/短序列；条纹、运动形状、焦外形状按实际快门类型试拍，不承诺最高帧数 |
| 卡片与记录 | [R7记录方法](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0030.html) | [R6 III记录方法](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0030.html) | R7双SD；R6 III的槽1为CFexpress Type B、槽2为SD。自动切换容量与同步记录副本不是同一功能 |

镜头覆盖、最大光圈、IS和实体开关依据沿用[RF50官方规格](https://www.canon-europe.com/lenses/rf-50mm-f1-8-stm/specifications/)及[RF-S18–150中文说明书](https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf)，更完整的两镜边界见 [40](40-owned-kit-sources.md)。中间焦段最大光圈让读者查看实际机身，不猜测f值；150mm端不安排不可用的f/4。

## 时间、白平衡与文件流程

- [R7日期/时间/区域](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0100.html)与[R6 III对应章节](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0100.html)支持逐机核对时区、夏令时和时刻。各拍同一时钟是教程设计的时间线校验方法，不声称两机自动同步。
- [R7白平衡](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0170.html)入口为“拍摄→白平衡”；[R6 III白平衡](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0340.html)入口为“拍摄→白平衡设置→白平衡”。R7不能使用其他相机照片导入自定义白平衡；两机各拍自身参照、导入后启用，临时切过MF要恢复。
- 同K值作为起点，不据此保证机身、镜头和处理不同的照片颜色完全一致。教程要求同光线中性参照与肤色检查，先统一颜色意图，再按共同输出尺寸比较。
- 日期/机身分目录、同名不覆盖、核对副本后处理卡片是本教程的归档流程，不冒充相机自动完成的功能。两机已有自定义逐项核对，不跨机加载配置文件。

## 建议与事实的边界

R6 III＋RF50、R7＋18–150的主分工，反向配镜和只带一机的取舍，都属于练习安排，不是购买建议。六个场景中的1/250秒、1/500秒、f/2.8、f/8等是有条件的试拍起点；动作、景深、光线、ISO上限和实际可用光圈决定后续调整。

同一镜头、同机位、同光圈、近似记录区域及相同输出尺寸可减少对照干扰，但仍不保证逐像素对齐。更多记录像素不自动等于更多有效细节；光线或主体变化较大的照片只用于使用体验，不能写成严格画质测试。没有R7时允许纸面预测，实拍检查仍保持未完成。

## 验证范围

专属测试覆盖独立资料导出、四组合记录尺寸、两机操作结构、六场景、三组课程任务引用、来源去重，以及依赖缺失和重复加载时的原子性。模块不得改动原单机资料、课程/任务/卡片或学习状态；全站计数由课程模块增加到43课、39任务、86卡。

此次完成的是官方资料核验和软件验证，未使用实体R7或双机样本进行实拍。界面、搜索、手机、键盘、file://与构建结果由本轮集成报告记录。

2026-11-14执行`node --test tests/dual-camera-data.test.cjs`：5项通过、0项失败。`node --check dual-camera-data.js`通过；三个新增文件以`git diff --no-index --check`检查，无空白错误。白平衡入口措辞问题已先记录于方案43，再明确为R7“拍摄→白平衡”与R6 III“拍摄→白平衡设置→白平衡”。
