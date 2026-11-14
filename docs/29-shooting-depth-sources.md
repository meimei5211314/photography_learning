# 准备与现场控制：资料核验与原创练习

核验日期：2026-11-14。对应 `shooting-depth-data.js` 的阶段8三课、三任务、六卡。逐页读取以下原始资料，保留课末入口；机型细节以 R6 Mark III 为例，通用概念不保证其他机型具有同一菜单。

| 官方资料 | 核对与采用范围 |
|---|---|
| [Canon：记录方法与存储卡](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0030.html) | 自动切换延续容量、分别记录可设不同画质、记录到多个媒体同画质同存；两卡记录中某卡已满与实际文件核对。没有写成“插双卡即备份”。 |
| [Canon：静止图像画质与最大连拍数量](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0070.html) | 暂存、BUSY、暂停后写入恢复和画质/驱动影响。术语上区分剩余卡容量、拍摄频率、缓存与单张曝光时间，不提供脱离测试条件的最大张数。 |
| [Canon：存储卡格式化](https://cam.start.canon/zh/C022/manual/html/UG-08_Set-up_0070.html) | 格式化删除图像及数据，包括受保护图像；本任务只需验证副本，不要求执行格式化或清空卡。 |
| [FUJIFILM：滤镜类型及强度](https://www.fujifilm-x.com/en-gb/learning-centre/the-filters-you-need-to-own/) | ND 允许延长时间/保留大光圈；1、2、3档对应2、4、8倍率，和光学密度名称区分。没有采纳文章的购买导向或对所有 AF 设备的简单二分。 |
| [Canon Academy：偏振滤镜实拍](https://www.academy.canon-me.com/en/fundamentals/polarizing-filters-in-practice) | 旋转和角度影响反射、不同天空方向产生不均匀效果、CPL损失进光。课程不保证所有材质或角度均可去反光，也不保证自动曝光在边界外仍能补足。 |
| [Nikon：追随拍摄](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/10-tips-for-better-camera-panning) | 拍前开始、拍后继续跟随；根据动作选择时间，指定需要可读的主体细节。没有复制照片、专家引语或宣称慢快门能保证成功。 |
| [Canon Hong Kong：追随流程](https://www.canon.com.hk/en/club/article/itemDetail.do?itemId=10427&page=1) | 横向跟随、较慢时间与背景方向性模糊，以及主体/背景分别检查。旧文中的 IS Mode 2 与特定 AF 设置不套给所有设备，课程改为查具体说明。 |
| [Canon：自动对焦操作](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0040.html) | 伺服需要持续激活；即使未合焦也可能释放快门，必须回看验证。 |

## 原创部分与使用边界

“拍一张—查去向—打开副本”、两轮动作验证、分类统计失败与纸上ND换算是本站原创教学组织，不是厂商实验室标准。例子 `1/125 × 2³ ≈ 1/15 秒` 是根据档数定义做的近似换算；灯光、光圈、ISO保持不变是前提，最后仍需实拍确认。不能从产品名字里单个数字猜减光档数。

ND 与 CPL 分开验证，均匀 ND 不会自动改变场景亮暗比。无附件时，反射角度观察与数学换算能完成概念训练，但不能测量滤镜透过率、偏色和偏振性能。自动设备无法直接控制时间时，追随任务只验证取景与时机，记录其限制。网站不代替实物测试。

准备课复用 `camera` 图（Nikon D850，非 R6 三代布局）；滤镜课用 `landscape` 观察湖面与天空；动作课用 `streetNight` 区分主体拖影，明确它不是追随成功证据。原照片署名/许可不变，不从图片推断未提供的 EXIF 或滤镜。

来源筛选排除了不可靠的简化：不同文献对 ND 产品数字的写法可能混淆倍率与档数，课程统一按明确的减光档数计算；连拍速度不能替代单张曝光时间；专用防抖模式不能假定所有镜头具备；没有把双卡同存替代独立备份。

## 基础课细化与学习目标

`curriculum-support.js` 给最初 12 课补充可观察目标、建议先修和对应任务，不改变原任务检查项。构图课新增颜色面积/位置对照与建筑线条观察，用光课新增距离与亮度分开比较，白平衡课新增实际光源下的中性参考验证。

- [Canon R6 Mark III：白平衡设置](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0340.html)：本轮已读取自定义白平衡、参考曝光与混合光限制；按实际光线拍参考，注册后选择相应模式，不能把普通纸与肉眼观察当作测量校准。
- [Adobe Lightroom Classic：Guided Upright](https://helpx.adobe.com/lightroom-classic/desktop/process-and-develop-photos/guided-upright-perspective-correction.html)：本轮已读取水平/垂直参照、不同校正模式、变换后裁切与边界检查。教学比较保留和校正两种表达，不规定所有汇聚线都要消除。

颜色背景、灯与物体距离的两组对照是原创观察任务，不作固定颜色心理或普适逆平方光量推断；记录亮度补偿、环境反光和天气变化。新目标描述与路径自评属于教学组织，不是相机测评或掌握认证。
