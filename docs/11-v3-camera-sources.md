# 第三版佳能操作资料核验

核验日期：2026-11-13。仅依据佳能官方中文 HTML 高级用户指南；以下为改写摘要与教学边界，不转载手册全文或官方商品图。

## 型号与适用条件

- 正式型号为 [EOS R6 Mark III](https://www.canon.com.cn/product/r6iii/)。“R63”只是本教程对用户简称的理解，进入指南时应提示核对机身型号。
- [中文高级用户指南](https://cam.start.canon/zh/C022/manual/html/index.html)当前写明适用固件 **1.1.0 或更高版本**，文档号 CT2-D374-B。这不等于声称 1.1.0 是最新固件。
- [官方入口](https://cam.start.canon/zh/C022/index.html)提供 [PDF](https://cam.start.canon/zh/C022/manual/c022.pdf)。PDF 因文件较大未在本次工具中读出，不根据搜索摘要判断其当前版次。
- 操作按静止图像拍摄、默认按键/拨盘分配说明；镜头、固件、基本/创意模式和自定义设置可能影响可用项目。使用菜单名称，不写未经验证的页签编号。

## 操作与链接

| 学习目标 | 已核验的简要路径 | 原始资料 |
| --- | --- | --- |
| 认识机身 | 静止图像/短片开关先切至静止图像；辨认主拨盘、速控转盘 1/2、Q、INFO、回放、放大按钮 | [部件名称](https://cam.start.canon/zh/C022/manual/html/UG-00_Before_0120.html) |
| Av | 模式转盘 Av → 主拨盘选光圈 → 半按对焦并检查相机给出的快门；快门闪烁表示曝光范围受限 | [Av](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0220.html) |
| Tv | 模式转盘 Tv → 主拨盘选快门 → 半按并检查自动光圈；光圈闪烁需调整快门/ISO | [Tv](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0210.html) |
| M + 自动 ISO | 主拨盘选快门、速控转盘 1 选光圈、速控转盘 2 选 AUTO；曝光补偿可在 Q、点击曝光标尺或“拍摄 → 曝光补偿/AEB”设置 | [M](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html) |
| ISO 自动范围 | 拍摄 → 静止图像 ISO 感光度设置 → 自动范围。P/Av 的“最低快门速度”不是硬下限：ISO 达上限而曝光不足时仍可能变慢 | [静止图像 ISO](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0180.html) |
| 启动连续 AF | 有 AF/MF 开关的镜头先拨 AF；无开关兼容镜头使用“AF → 对焦模式”。AF → 自动对焦操作 → 伺服自动对焦；持续半按启动持续对焦 | [自动对焦操作](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0040.html) |
| 人物眼睛 | AF → 检测的被摄体 → 人物；AF → 眼睛检测 → 自动，也可设左眼/右眼。被摄体检测为“无”时不检测眼睛 | [被摄体/眼睛](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0060.html) |
| AF 区域 | AF → 自动对焦区域；可选整个区域、单点、扩展、灵活区域等。允许跨区域追踪时开启“伺服自动对焦追踪全部区域”；严格限在选定区域时需同时关闭它并将被摄体检测设为“无” | [选择 AF 区域](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0060.html) |
| 快门方式 | 拍摄 → 快门模式 → 机械/电子前帘/电子 | [快门模式](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0500.html) |
| RAW + JPEG | 拍摄 → 图像画质；主拨盘选择 RAW，速控转盘 1 选择 JPEG 画质，SET 确认；两项同时选择会同时记录 .CR3 与 .JPG | [图像画质](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0070.html) |
| 回放检查眼睛 | 回放 → 放大/缩小；速控转盘 2 调倍率，多功能控制钮移动位置，放大中速控转盘 1 切照片 | [放大显示](https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0040.html) |
| 直方图/高光 | 回放按 INFO 切信息；回放 → 播放信息显示勾选屏幕，在该设置页出现 INFO 提示时切亮度/RGB 柱状图；回放 → 高光警告 → 启用 | [信息显示](https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0270.html)、[高光警告](https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0280.html) |
| C1–C3 | 先配置拍摄状态，再“设置 → 自定义拍摄模式(C1-C3) → 注册设置 → 选择 C1/C2/C3 → 确定”；静止图像/短片可分别注册；自动更新启用会保存 C 模式内的更改 | [C1–C3](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0290.html) |

## 审校边界

1. Servo 蓝框表示伺服操作启动，不保证每张准确合焦；即使未合焦也能释放快门。触摸屏点击对焦本身采用单次 AF，不能把“点一下眼睛”教成持续追踪。运动练习继续半按并检查回放。
2. M + AUTO 由相机改变 ISO；它仍含自动曝光。该组合的曝光补偿不适用于自动 ISO 闪光摄影。默认单次 AF + 评价测光合焦后保持半按会锁定 ISO，见 M 章节。
3. [电子快门不支持闪光摄影](https://cam.start.canon/zh/C022/manual/html/UG-11_Reference_0090.html)。机械/电子前帘最高 1/8000 秒；电子最高 1/16000 秒仅在 Tv/M 等规定条件下可用，不能写成所有模式通用。
4. 电子快门在闪烁照明下可能出现条纹；电子前帘在大光圈、高速快门下可能使焦外光斑不完整。快门方式需按场景选择，不能简单说电子更高级。
5. [静音快门功能](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0490.html)会强制电子快门，并关闭闪光、AF 辅助光等，不只是关闭提示音。
6. 官方规格标明电子快门采用卷帘读取；[HDR 移动被摄体章节](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0310.html)提醒高速主体可能失真。扩展到一般“果冻效应”时注明是成像原理解释，不把该 HDR 条件下的原文扩写成厂家通用保证。
7. C-RAW 文件较小但不能说成低像素 RAW：[规格](https://www.canon.com.cn/product/r6iii/spec.html)中 RAW/C-RAW 的记录像素相同。软件需支持该机 .CR3；画质章节建议最新兼容 DPP。
8. 课程参数只作为练习起点，需按镜头最大光圈、光线、人物动作与成片要求调整；不得将练习参数称为素材原图 EXIF、佳能官方推荐或唯一答案。

## 后期资料交接

后期课程代理另行核验 [DPP 官方手册](https://cam.start.canon/en/S002/manual/html/index.html)中的工具调色板、配方、保存/转换导出。DPP 确实有局部调整画笔，不应误写“DPP 没有局部调整工具”。具体路径以课程引用的相应章节为准。
