# 已有两支镜头：官方依据与教学边界

核验日期：2026-11-14。需求与方案见 [37](37-owned-kit-requirements.md)、[38](38-owned-kit-plan.md)。用户已确认的器材为 **EOS R6 Mark III、RF50mm F1.8 STM、RF-S18-150mm F3.5-6.3 IS STM**。本轮仅围绕这套器材编写，不保留待确认的其他卡口版本，也不把添置器材作为完成练习的条件。

`equipment-data.js` 导出 `PHOTO_EQUIPMENT`，提供两镜事实、7 行视角对照、6 个场景起点和出门检查；正式课程与练习在 `lens-practice-data.js`。器材页不创建第二套学习状态，只把官方来源按 URL 去重加入既有索引。

## 已核验的事实

| 项目 | RF50mm F1.8 STM | RF-S18-150mm F3.5-6.3 IS STM | 依据 |
| --- | --- | --- | --- |
| 覆盖与本机记录范围 | 全画幅镜头；本机可全画幅记录，也可主动选择1.6倍裁切 | APS-C覆盖；本机自动选择1.6倍裁切 | [RF50官方规格](https://www.canon-europe.com/lenses/rf-50mm-f1-8-stm/specifications/)、[RF-S中文说明书](https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf)、[本机裁切章节](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0110.html) |
| 最大光圈 | f/1.8 | 18mm端f/3.5，150mm端f/6.3；中间焦段以机身实际显示为准 | [RF50规格](https://www.canon-europe.com/lenses/rf-50mm-f1-8-stm/specifications/)、[RF-S说明书](https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf) |
| 镜头防抖 | 无光学IS；不意味着R6 III机身防抖不存在 | 有镜头IS，没有镜头IS开关，由机身设置核对 | [RF50规格](https://www.canon-europe.com/lenses/rf-50mm-f1-8-stm/specifications/)、[RF-S说明书](https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf)、[R6 III机身防抖说明](https://www.canon.com.cn/product/r6iii/info1.html) |
| AF/MF入口 | 镜头无AF/MF开关，机身选择对焦模式 | 镜头无AF/MF开关，机身选择对焦模式 | 两镜说明书及[本机AF操作](https://cam.start.canon/zh/C022/manual/html/UG-05_AF-Drive_0040.html) |
| 对焦/控制环用途 | 用镜头FOCUS/CONTROL开关选择；它不是AF/MF开关 | 没有该实体选择开关，使用机身“对焦/控制环”项目 | [RF50中文说明书](https://gdlp01.c-wss.com/gds/5/0300040305/01/rf50f18stm-im-zh.pdf)、[RF-S说明书](https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf)、[R6 III自定义控制](https://cam.start.canon/zh/C022/manual/html/UG-09_Customize_0030.html) |
| 近摄边界 | 最近对焦0.30m，最大放大倍率0.25× | AF的18/35/50/150mm最近距离依次为0.17/0.17/0.18/0.45m | [RF50规格](https://www.canon-europe.com/lenses/rf-50mm-f1-8-stm/specifications/)、[RF-S说明书的规格表](https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf) |
| 滤镜口径 | 43mm | 55mm | 两镜官方规格与说明书；仅用于识别，不据此要求购买 |

所有最近对焦距离均从相机焦平面计算。主体到镜头前端的工作距离是另一项观察，不能将0.17m解读成镜头前端必须离物体17cm；实际还要留意镜头是否遮光、接触物体及构图是否成立。

## 容易教错的条件

1. **同为50mm仍要区分记录区域。** RF50全画幅记录对应50mm视角；RF50主动1.6倍裁切和RF-S变焦50mm自动裁切均约对应全画幅80mm视角。其余18/35/85/150mm的裁切视角约对应28.8/56/136/240mm。这里乘1.6的只有视角换算，不改写镜头实际焦距，也不把曝光使用的f值乘1.6。
2. **裁切RAW没有外侧画面。** [R6 III静止图像裁切章节](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0110.html)明确了记录范围限制。教程要求核对实际文件像素宽高、画质与裁切状态，不推算一个未经核验的固定“裁切像素数”，也不保证后期能恢复裁切外内容。换回RF50后仍应主动检查是否要恢复全画幅。
3. **两镜环用途的入口不同。** [当前机型自定义控制](https://cam.start.canon/zh/C022/manual/html/UG-09_Customize_0030.html)说明有镜头FOCUS/CONTROL开关时使用实体开关；没有时使用机身项目。不能把RF-S早期镜头说明书对旧机身的控制环限制照搬到R6 III。环设为FOCUS后，AF/MF和电子手动对焦条件仍由相机设置决定。
4. **RF-S特殊MF近摄是可选分支。** 说明书列出的18/35mm MF最近距离为0.12/0.13m，最大倍率分别0.44×/0.59×；这不代表全焦段或AF都能达到。进入AF范围之外后，要向无限远方向转动对焦环，回到AF可用范围再切AF。教学先在普通AF范围内完成桌面照片，不要求新手强行进入特殊近距，也不把特殊范围的画质表现视为普通距离的保证。
5. **防抖不能冻结人物动作。** [本机影像稳定器章节](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0530.html)用于核对当前镜头可见设置；厂家展示的最高防抖级数可能属于其他镜头与条件，未套用到这套设备。先用多张回放区分手抖、失焦、主体运动，再改变快门或对焦。
6. **对照实验不是保证画面逐像素一致。** 固定机位、统一记录区域与可用光圈能减少干扰；变焦50mm附近仍需检查EXIF，实际焦距、对焦呼吸和畸变校正可造成小差异。若为匹配主体大小而移动机位，透视也改变；应另列这种结果，不能与固定机位的对照混为一谈。

## 六个场景如何使用

场景覆盖窗边人像、室内走动、白天环境、远处细节、桌面小物和两镜50mm对照。快门、光圈与ISO都是原创练习的试拍起点，不是佳能推荐值或清晰度保证。每项同时给出回放检查和改变条件，避免一组参数适用所有光线。

有关M与AUTO ISO的自动曝光边界依据[手动曝光](https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html)；有关P/Av最低快门在ISO上限时仍可变慢的限制依据[ISO感光度设置](https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0180.html)。镜头最大光圈依当前焦段核对；例如变焦150mm不会被安排使用不可用的f/4。

## 数据验证范围

`tests/equipment-data.test.cjs`检查已确认型号、两镜与六场景结构、四课目的地、7行视角数学关系、来源去重与官方域名，以及缺少课程或重复加载时没有部分写入。已有课程、任务和复习卡应保持不变，器材数据不新增学习计数。

本轮依据官方资料编写，未开展实体机身、镜头或真实照片样本测试。既有课程配图用于观察，不冒充这两镜在R6 III上拍摄的实测。器材页布局、搜索、键盘、手机及file://的验证由本轮集成报告记录。

2026-11-14执行`node --test tests/equipment-data.test.cjs`：5项通过，0项失败；`node --check equipment-data.js`通过。验证加载后保持40课、36任务、80卡，来源复用已有索引，缺少任何关联新课时均在写入来源前拒绝加载。
