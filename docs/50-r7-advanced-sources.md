# R7 对焦、释放与配置复用：核验来源

核验日期：2026-11-14。需求、契约见 docs/47、48；本说明对应 `r7-advanced-config.js` 与 `tests/r7-advanced-config.test.cjs`。用户已确认 R6 Mark III 和两支镜头，R7 仍是可选增购或借用情境。阅读和准备记录表不要求购买，实机验收需要实际操作，不能用纸面推演冒充完成。

模块只导出 `PHOTO_R7_ADVANCED = {model,checkedAt,topics,sources}`，不读取或修改学习状态，不追加 `PHOTO_DATA.sources`，不修改旧 43 课、39 任务、86 卡和原 R6 十二项配置。全局来源合并由根聚合模块在校验后处理。

## 六主题与原 R6 教程的对应

| R7 主题 | 需要独立教学的差异 | 实际验收与关联任务 |
|---|---|---|
| autofocus | 前方 AF/MF 开关的启用分支；“被摄体追踪”和眼检“启用”；区域快捷操作与大小调整 | 近远目标与连续小组核对真实 AF 启动和关键细节；af-tracking-test |
| drive-shutter | M-Fn 两个拨盘的分工；不同驱动/快门组合速度；电子 1/16000 的限制与闪光不可用 | 同场景检查动作、条纹、焦外及恢复状态；shutter-stability-test |
| stabilization | 现有两镜从机身控制；有 IS 开关的其他镜头分支；手填焦距仅用于不通信镜头 | 固定曝光的多张细字对照和主体运动分类；shutter-stability-test |
| playback | R7 主拨盘改放大倍率、速控转盘切图；初始位置与保持位置各自设置 | 能切图、查参数、高光和整图，并据此重拍；sharpness-check |
| custom-controls | 入口在自定义功能；设置菜单中的多功能锁与独立 LOCK；C.Fn 清除范围不同 | 记录一个控件改动，实测按下/按住/释放与恢复；dual-body-switch-check |
| custom-modes | 本机独立注册；R7重置名称为基本/其他设置；不编造保存/加载配置文件入口 | C模式切走/切回读数与试片，记录自动更新作用；readiness-rehearsal |

每主题至少两条差异、三项设置、六个操作步骤、三项检查、两种排障及两条定向恢复。课程与任务只链接已有记录，不改变检查标准。双机任务仍需要两台真实机身，只有 R7 或只有 R6 时可完成部分操作并明确未验证项。

## 官方资料与范围

全部采用 Canon EOS R7 的 C005 官方手册。索引说明适用于固件 1.8.0 或更高版本；这不等于核实了“最新固件”，也不能替代用户实际自定义状态。

| 来源 | 用于哪些内容 |
|---|---|
| [R7 高级用户指南](https://cam.start.canon/zh/C005/manual/html/index.html) | 机型与适用版本说明。 |
| [自动对焦操作](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0040.html) | 单次、伺服、持续启动及合焦反馈。伺服下能释放不保证合焦。 |
| [选择自动对焦区域](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0070.html) | R7 的区域、被摄体追踪、人物/动物/车辆/无、眼睛检测、点屏单次对焦和灵活区域尺寸操作。不能用 R6 三代的菜单选项替代。 |
| [AF/MF 开关](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0280.html) | 无镜头对焦模式开关时，机身开关启用与关闭的两个控制分支。 |
| [自定义自动对焦功能](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0120.html) | 镜头有无 FOCUS/CONTROL 选择开关时的环用途设置。 |
| [选择驱动模式](https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0130.html) | M-Fn→速控选项目→主拨盘选模式；H+、H、低速和实际降速条件。 |
| [静止图像菜单](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0020.html) | 驱动、静音、快门、稳定入口与拍摄模式下的菜单差异。 |
| [快门模式](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0350.html) | 机械、前帘、电子的用途；焦外、滚动形变和闪烁光条纹边界，镜头稳定建议按具体镜头说明核对。 |
| [静音快门功能](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0340.html) | 会锁定电子并限制闪光、AF辅助光、长曝降噪等；不是仅关闭提示音。 |
| [R7 规格](https://cam.start.canon/zh/C005/manual/html/UG-10_Reference_0100.html) | 静止图像快门范围、Tv/M 电子1/16000条件、机械/前帘同步及电子不可闪光。 |
| [图像稳定器](https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0370.html) | 镜头控制分支、全时/仅拍摄时、不通信镜头焦距输入。 |
| [放大图像显示](https://cam.start.canon/zh/C005/manual/html/UG-06_Playback_0040.html) | 默认拨盘分工与初始倍率、位置、保持位置；MF照片从中央。 |
| [图像回放](https://cam.start.canon/zh/C005/manual/html/UG-06_Playback_0030.html) | 图像浏览、INFO与拍摄信息中的多功能控制钮。 |
| [回放菜单](https://cam.start.canon/zh/C005/manual/html/UG-06_Playback_0020.html) | 中文“播放信息显示”“高光警告”等项目名。 |
| [Playback Information Display](https://cam.start.canon/en/C005/manual/html/UG-06_Playback_0300.html) | 同编号中文正文本次抓取未成功，采用官方英文页核对：选择信息屏、SET勾选、确认及设置页INFO切亮度/RGB。中文菜单名由上一来源验证，不假称已读到中文正文。 |
| [显示高光警告](https://cam.start.canon/zh/C005/manual/html/UG-06_Playback_0310.html) | 启用位置与回放闪烁提示。 |
| [自定义功能设置项目](https://cam.start.canon/zh/C005/manual/html/UG-09_Custom_0030.html) | 自定义按钮/转盘、默认控件、INFO详细设置、清除自定义设置与清除全部C.Fn不同。 |
| [多功能锁](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0270.html) | 精确入口为设置→多功能锁，勾选后用独立LOCK按钮。基本操作页的相关图标标签存在不一致，入口以此专页和设置目录交叉核验。 |
| [基本操作](https://cam.start.canon/zh/C005/manual/html/UG-01_Preparations_0110.html) | 半按、AF-ON、M-Fn、ISO、LOCK及按按钮后调整的锁定例外；不把锁定描述为所有输入均失效。 |
| [自定义拍摄模式](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0330.html) | 注册、自动更新、清除与静止图像/短片独立状态。 |
| [重置相机](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0320.html) | 基本设置与其他设置，以及C模式重置的拍摄状态条件。 |
| [设置菜单](https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0020.html) | 与重置/C模式/LOCK专页交叉确认路径；当前目录未列出R6三代式设置文件保存/加载入口。 |

现有 RF50 和 RF-S18–150 的开关、环与 IS 事实沿用已核验镜头原说明书，见 docs/39、40；本模块不重新宣称不同镜头都具有相同开关。R6 并排侧保留既有 docs/35 的核验结果。

## 参数与恢复边界

- **驱动速度带条件。** H+机械/前帘/电子最快约15/15/30张每秒，H约6.5/8/15，低速约3；教程同时讲电源、曝光时间、AF、光圈、变焦、防闪烁和缓存影响。观察样本不能冒称实验室持续速度或AF命中率。
- **曝光时间与每秒张数分开。** 电子1/16000只在Tv/M及相关功能允许时可选，不能假定1/8000到1/16000之间有所有普通1/3档。机械1/250、前帘1/320为普通闪光同步条件；高速同步需另按闪光设备条件，电子快门不能照搬其他机型的闪光能力。
- **恢复要有原值。** 优先恢复测试项目，再试片；清除按钮/转盘、清除C.Fn、清除C模式、重置相机作用范围不同。清除只回默认，不是回到个人旧配置；本教程没有要求实际执行整体清除或格式化卡。
- **防抖用实际镜头与照片判断。** 不通信镜头才需要相关焦距输入；现有两镜不输入1.6倍等效焦距。不承诺防抖档数或统一安全快门，多张静物对照不能证明运动主体也清楚。
- **未核验入口不补猜测。** R7设置文件入口以当前手册目录的未列出事实表述，不推断所有未来固件永远不支持；用逐项记录与本机C模式完成可复现配置，不跨机加载。
- **内容为原创操作教学。** 固定目标、一次改一项、近远AF检查、切走切回与参数记录是教学设计；官方来源提供功能依据，不代表厂商规定必须按本练习顺序配置。

## 已完成验证

`node --check r7-advanced-config.js` 通过。

`node --test tests/r7-advanced-config.test.cjs`：6 项通过、0 失败，检查：旧43/39/86及原R6配置与来源不变；详细主题契约与引用；C005来源及英文回放核验说明；关键菜单和拨轮差异；快门与稳定条件；独立浏览器/CommonJS导出及重复加载保护。

没有操作用户实体相机、没有生成或假设样片EXIF、没有验证现场AF或连拍性能。全站、浏览器和构建结果由 docs/52 汇总，不把模块测试等同于实机验收。
