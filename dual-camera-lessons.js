/* 可选增购/借用 R7 的原创双机教学；事实与边界见 docs/44-dual-camera-lesson-sources.md。 */
(function (root) {
  'use strict';
  const data = root.PHOTO_DATA;
  if (!data) throw new Error('请先加载课程数据，再加载可选双机课程。');
  const refs = {
    r7Specs: { title: 'Canon EOS R7 · 技术规格', url: 'https://cam.start.canon/zh/C005/manual/html/UG-10_Reference_0100.html', note: 'APS-C 传感器与 RF/RF-S 镜头兼容；普通 3:2 静止图像 L、RAW/C-RAW 为 6960×4640，记录像素与有效像素分开。' },
    r6Specs: { title: 'Canon EOS R6 Mark III · 技术规格', url: 'https://cam.start.canon/zh/C022/manual/html/UG-11_Reference_0090.html', note: '普通 3:2 全幅 L、RAW/C-RAW 为 6960×4640；1.6 倍裁切为 4320×2880。其他尺寸与模式不能套此表。' },
    r6Crop: { title: 'Canon R6 Mark III · 静止图像裁切/长宽比', url: 'https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0110.html', note: 'RF-S 自动裁切；裁切 RAW 不保存外圈；RF50 换回后需核对是否仍主动设置裁切。' },
    r7Aspect: { title: 'Canon EOS R7 · 静止图像长宽比', url: 'https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0050.html', note: '原生 APS-C 的长宽比设置与 R6 三代的 1.6 倍裁切不同；R7 RAW 以 3:2 记录并附长宽比信息。' },
    r6M: { title: 'Canon R6 Mark III · M 手动曝光', url: 'https://cam.start.canon/zh/C022/manual/html/UG-02_ShootingStill_0230.html', note: '默认曝光拨轮、自动 ISO 和曝光补偿；自定义和测光锁定可能改变操作或反馈。' },
    r7M: { title: 'Canon EOS R7 · M 手动曝光', url: 'https://cam.start.canon/zh/C005/manual/html/UG-03_CustomShooting_0060.html', note: '默认主拨盘调快门，速控转盘调光圈；自动 ISO、补偿与半按测光条件要一起核对。' },
    r7Controls: { title: 'Canon EOS R7 · 基本操作', url: 'https://cam.start.canon/zh/C005/manual/html/UG-01_Preparations_0110.html', note: 'ISO 按钮、拨盘与半按快门操作；不把 R6 三代第三拨盘操作直接移植过来。' },
    r7Switch: { title: 'Canon EOS R7 · 对焦模式开关 AF/MF', url: 'https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0280.html', note: '机身 AF/MF 开关启用时用实体开关；关闭其功能后才由 AF 菜单中的对焦模式设置。' },
    r7Af: { title: 'Canon EOS R7 · 自动对焦操作', url: 'https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0040.html', note: '无镜头 AF/MF 开关时的机身设置，以及单次/伺服 AF 的用途和释放边界。' },
    r7Ring: { title: 'Canon EOS R7 · 自定义自动对焦功能', url: 'https://cam.start.canon/zh/C005/manual/html/UG-05_AF-Drive_0120.html', note: '带 FOCUS/CONTROL 开关的镜头使用镜头开关；不带该开关的兼容镜头可在机身选择环用途。' },
    prime: { title: 'Canon · RF50mm F1.8 STM 中文说明书', url: 'https://gdlp01.c-wss.com/gds/5/0300040305/01/rf50f18stm-im-zh.pdf', note: '镜头 FOCUS/CONTROL 不等于 AF/MF，换机仍需检查实际对焦状态和环职责。' },
    zoom: { title: 'Canon · RF-S18-150mm F3.5-6.3 IS STM 中文说明书', url: 'https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf', note: '无镜头 AF/MF 与 FOCUS/CONTROL 开关；环用途、AF 与 IS 从兼容机身核对，中间焦段光圈由实际读数确定。' },
    r7Is: { title: 'Canon EOS R7 · 影像稳定器模式', url: 'https://cam.start.canon/zh/C005/manual/html/UG-04_Shooting-1_0370.html', note: '无镜头 IS 的 RF50 与有 IS 但无实体 IS 开关的 RF-S18–150，都需检查机身稳定设置；不将防抖视为冻结主体动作。' },
    r7Custom: { title: 'Canon EOS R7 · 自定义拍摄模式 C1–C3', url: 'https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0330.html', note: '各机分别注册与核对，自动更新设置可能保留后续修改；同名 C1 不代表相同配置。' },
    r7Clock: { title: 'Canon EOS R7 · 日期/时间/区域', url: 'https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0100.html', note: '照片附带拍摄时间；日期、时区和夏令时应一致核对，同拍时钟只作排序偏差检查。' },
    r7Names: { title: 'Canon EOS R7 · 文件名', url: 'https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0060.html', note: '默认标识与用户注册名称有区别，不假设两机出厂文件名必然重复；独立导入目录仍用于来源追踪与避免重名覆盖。' },
    r7Cards: { title: 'Canon EOS R7 · 记录功能与存储卡选择', url: 'https://cam.start.canon/zh/C005/manual/html/UG-08_Set-up_0030.html', note: '标准、自动切换、分别记录和多媒体记录用途不同，逐卡核对实际文件；两台机身记录不同画面不等于互相备份。' }
  };
  const lessons = [
    {
      id: 'dual-body-assignment', title: '若加入 R7：两台机身怎样分工', subtitle: '先看记录区域与任务，再决定镜头留在哪台机身',
      stage: 11, minutes: 29, tag: '可选双机', art: 'lens', mediaId: 'portrait',
      observation: '配图仅供观察主体与环境的信息取舍，不是 R6 三代或 R7 的双机样片，也不能由配图推断镜头、记录区域和拍摄参数。',
      intro: '你已确认拥有 R6 Mark III、RF50mm F1.8 STM 和 RF-S18-150mm F3.5-6.3 IS STM；本课讨论若增购或借用 R7 后的可选组合。原有单机课程仍然有效。双机的价值要由少换镜、及时取景和真实文件验证，不能只凭机身数量判断。',
      prerequisites: ['lens-system','sensor-raw','two-lens-outing'], outcomes: ['解释四种机身与镜头组合的视角和普通静止图像记录尺寸。', '按同一拍摄主题安排两机分工，并说明何时反配或只带一机更合适。'],
      sections: [
        { title: '先给两台机身不同的信息任务', body: '以一次附近散步为例，可让 R6 三代配 RF50，负责适合 50mm 全幅视角的人物、局部环境和需要较大光圈的场景；若有 R7，让它配 RF-S18–150，负责迅速改变取景与较远细节。这是练习起点，不是所有题材的最佳组合。先列出环境、人物、动作和细节四项，再判断每台是否增加必要信息；狭窄室内若两组都不够广，增加第二台机身也不能凭空得到超广视角。' },
        { title: '四种组合，裁切因子只用于一次视角换算', body: 'R7 本身是 APS-C，RF50 在它上的视角约相当于全画幅 80mm，RF-S18–150 约相当于 28.8–240mm；不需要再开启一次 1.6 倍裁切，也不能重复乘 1.6。R6 三代配 RF50 可用全画幅 50mm 视角，配 RF-S 则自动进入 1.6 倍裁切。实际焦距不因机身改变，f 数也不为设置曝光而乘 1.6；把视角参照与镜头上的数值分别写入记录。' },
        { title: '同样接近的取景，不代表同样的记录像素', body: '下表只列普通静止图像的 3:2 L、RAW/C-RAW 条件，不包括其他尺寸和模式。R7 原生 APS-C 的 6960×4640 约为 3230 万记录像素；R6 三代 1.6 倍裁切的 4320×2880 约为 1240 万。机身所称约 3250 万有效像素不是每一种输出文件的像素数。较多记录像素可能给裁切和输出提供空间，但清晰细节还取决于镜头、对焦、动作、光线和处理，不能据此保证画质排名。' },
        { title: '反过来搭配，有收益也有代价', body: '若需要更窄的人物取景，可尝试 R7 配 RF50，并让 R6 三代配 RF-S18–150。保持机位时 RF50 在 R7 上收入的范围更窄；若想保持与全幅近似的人物占幅，通常需要后退，环境和透视也随机位改变。另一台此时仍是 RF-S 自动裁切，不会获得全画幅 18mm 广角，也不会恢复裁切外的 RAW。空间不足或需要轻装时，继续用 R6 三代单机换镜是合理选项。' },
        { title: '在固定位置验证分工，再做同构图补充', body: '若实际借到或拥有 R7，选稳定光线和有近远层次的静物，标记机位，先拍主线两组合并记真实焦距、区域和文件宽高。要比较两机搭载同一支 RF-S 的范围，可保持机位和焦距另拍，观察接近的视角；标称裁切、校正和对焦呼吸等使边缘不必逐像素重合。同构图需要移动时另作一组，记录距离，不把机位变化造成的比例差异归成镜头本身改变了透视。' },
        { title: '未有 R7 时，可预演什么、还缺什么证据', body: '目前只有 R6 三代也可先完成分工草图：RF50 的全幅与手动 1.6 倍裁切可帮助预览两种大致视角，再用现有变焦检查题材需要的范围。这个预演不能代替 R7 实际的按钮、AF、噪声、记录像素或双机切换试验，任务中的实拍验收保持未完成，并注明哪些仍待借机验证。练习后恢复 RF50 所需的全画幅，核对照片尺寸，不让临时裁切影响下一次拍摄。' }
      ],
      parameterTable: { caption: '普通静止图像 3:2、L 或 RAW/C-RAW；视角为全画幅参照，实际焦距不变。请再核对自己的原片尺寸。', headers: ['组合','实际记录区域','视角参照','记录宽×高'], rows: [['R6 三代＋RF50','全画幅（确认未手动裁切）','50mm','6960×4640'],['R6 三代＋RF-S18–150','自动 1.6 倍裁切','约 28.8–240mm','4320×2880'],['R7＋RF50','原生 APS-C','约 80mm','6960×4640'],['R7＋RF-S18–150','原生 APS-C','约 28.8–240mm','6960×4640']] },
      steps: ['写主题及环境、人物、动作、细节的信息需求；标明 R7 是已借到/已持有，还是仅作预演。', '为主线 R6＋RF50、R7＋RF-S18–150 分配任务，另写反配或只用一机的适用条件。', '有两台机身时固定机位拍组合取景，逐张读取真实机身/镜头/焦距、记录区域与像素；不由配图猜 EXIF。', '需要同构图时另拍并记录机位变化；按相同输出大小查看一项优势及一项限制，避免只比像素数。', '填写分工结论与未验证项，恢复临时裁切；只有单机则保留预演笔记，不勾选实际双机检查项。'],
      mistakes: ['把 R7 的原生 APS-C 当成先有一次 1.6、再给 RF-S 乘一次 1.6。', '认为 R6 三代装 RF-S 后仍能记录全幅 18mm 视角，或裁切 RAW 可以恢复外圈。', '把约 3250 万有效像素当作所有照片尺寸，或把单机预演记成实际双机完成。'],
      mnemonic: '先分信息，再查区域；倍率只算一次，像素读原片。',
      quiz: { question: '同一支 RF-S18–150 在 R7 上设为 18mm，应怎样理解它的视角和普通 3:2 L 文件？', options: ['再乘两次 1.6，约等效 46mm，文件只剩 1240 万', '原生 APS-C 视角约等效 28.8mm，普通 L 为 6960×4640，实际焦距仍为 18mm', '因为是 RF 卡口，所以与全画幅 18mm 的范围相同'], answer: 1, explanation: 'R7 原生 APS-C 与 RF-S 的匹配不再追加一次裁切因子。约 28.8mm 只是视角参照；R6 三代的 4320×2880 裁切记录不能直接套给 R7。' },
      lab: '', related: [{ label: '实测双机分工与记录区域', href: '#practice/dual-body-pairing-test' }, { label: '复习两镜可比条件', href: '#lesson/two-lens-comparison' }, { label: '查看可选 R7 双机配置', href: '#kit/r6-r7' }], sources: [refs.r7Specs,refs.r6Specs,refs.r6Crop,refs.r7Aspect,refs.prime,refs.zoom]
    },
    {
      id: 'dual-body-controls', title: '从 R6 三代切到 R7：设置怎样核对', subtitle: '统一拍摄意图，分别确认拨轮、对焦与当前读数',
      stage: 11, minutes: 32, tag: '换机操作', art: 'camera', mediaId: 'camera',
      observation: '配图只是相机观察示例，不是 R6 三代或 R7 的按钮位置图。实际开关、菜单和自定义功能须在对应机身及官方手册核对。',
      intro: '若增购或借用 R7，两机菜单看起来熟悉仍会出现肌肉记忆误操作。本课用一次“R6 三代→R7→R6 三代”的试拍，把拍摄意图、实际控制和结果对应起来；没有 R7 时只写核对单，等有实机再完成验收。',
      prerequisites: ['camera','modes','focus','dual-body-assignment'], outcomes: ['按各机默认或真实自定义设置，分别调整快门、光圈、ISO 与 AF/MF。', '切换机身后用读数和试片发现残留设置，并建立各自的可恢复起点。'],
      sections: [
        { title: '先统一目的，不把同名模式当成同一配置', body: '选较静止人物或文字静物，先写“关键细节清楚、避免动作拖影、保留重要高光”，再为各机选参数。练习可用 M、1/250 秒、自动 ISO 作为观察起点，光圈按景深与镜头当前能力选择；不是所有动作都适用 1/250。采用默认 1/3 档、自然光无闪光、未 AE 锁，每次释放半按后重新测光，读实际 ISO 和补偿。变焦改变最大光圈及画面明暗，不能要求两机 ISO 永远一致。' },
        { title: '两机默认 M 拨轮不同，边转边读显示', body: '未自定义时，R6 三代在 M 下以主拨盘调快门、速控转盘 1 调光圈、速控转盘 2 调 ISO；R7 默认主拨盘调快门、速控转盘调光圈，ISO 可按 ISO 按钮再转拨盘。拿起每台，先把一项改一档并确认显示，再改回；如果读数没变，查锁定、当前模式和自定义分配。借来的机身尤其不能假设默认配置，更不要通过跨机载入配置文件来“同步”。' },
        { title: 'R7 的前方 AF/MF 开关，要与启用状态一起看', body: '现有两支镜头都没有镜头 AF/MF 开关。R7 机身前方有 AF/MF 开关：在“设置→对焦模式开关(AF/MF)”启用时，以这个实体开关选择；若关闭该开关功能，则在“AF→对焦模式”选择 AF/MF。R6 三代按自己的机身对焦菜单核对。RF50 镜身的 FOCUS/CONTROL 只选择环用途，不是 AF/MF；RF-S18–150 没有这个环用途开关，需在对应机身检查对焦/控制环设置。' },
        { title: 'AF 开着，还要验证目标与启动方式', body: '为静物核对单次 AF，为距离变化的人物核对伺服 AF，并确认区域、主体识别与具体目标；默认半按快门和 AF-ON 的作用也可能被自定义改变。先对一个明显的近处目标启动 AF，再换远处目标，观察是否真的重新合焦；随后拍小组检查眼睛或文字。检测框出现和快门能释放都不等于每张合焦，切到 MF 的机身尤其不能只凭取景器中的框判断状态。' },
        { title: '把驱动、快门、稳定和文件设置留在核对单', body: '切换后查是否残留自拍、过高连拍、曝光包围或不适合灯光的快门方式；先拍试片检查条纹与动作变形，而不是照抄最高连拍速度。R7 的“拍摄→影像稳定器模式”用于核对这两支镜头的稳定设置：RF50 无镜头 IS，RF-S 有 IS 但无实体 IS 开关，仍按实际机身与镜头状态确认。防抖不能冻结走动人物。最后查文件格式、质量、记录卡和 R6 三代裁切，防止拍到了却没有预期文件。' },
        { title: '分别保存起点，再做往返核对', body: '可在各机分别整理一个日常起点并注册到合适的自定义模式，记录主要参数及 AF、驱动、文件设置。不要假设同叫 C1 就相同，也不要承诺所有菜单项目都会保存；在 R7 核对自定义模式的“自动更新设置”，避免临时修改意外成为新起点。按 R6→R7→R6 顺序各拍一张，口头读出快门、光圈、实际 ISO、补偿和目标，检查真实结果。记录发现的差异；没有错误也要写已验证项，不必故意制造失误。' }
      ],
      steps: ['写清主体、动作和清晰细节，确认有两台实机；未有 R7 时只准备核对单。', '在各机逐项识别 M 的快门/光圈/ISO 控制，临时改一档后改回，并记录实际自定义差异。', '核对 R7 前方 AF/MF 开关的启用状态及两镜环用途，验证近远目标的 AF 启动和实际合焦。', '按 R6→R7→R6 各拍小组，每次读曝光、补偿、AF 目标，检查驱动、快门方式、稳定、记录卡与区域。', '放大关键细节，写一次发现的差异或已验证无误的项目；分别恢复并试拍自己的起点设置。'],
      mistakes: ['在 R7 上沿用 R6 三代第三拨盘调 ISO 的动作，却不看实际改了什么。', '只拨 R7 的 AF/MF 而不查该开关是否启用，或把 RF50 的 FOCUS/CONTROL 当成对焦模式。', '把两机同名 C1 当成自动同步，忽略自定义、自动更新或临时补偿残留。'],
      mnemonic: '拿起先读数，AF 真启动；每机有起点，往返拍验证。',
      quiz: { question: 'R7 前方 AF/MF 开关拨到 AF，但机身设置中已关闭这个开关功能。此时怎样恢复自动对焦最有依据？', options: ['继续反复拨动实体开关，它一定优先', '在 AF→对焦模式中选 AF，或先启用实体开关功能再用它选择，并试拍确认', '把 RF50 的环切到 CONTROL，自动对焦就会恢复'], answer: 1, explanation: '实体开关的作用受“对焦模式开关(AF/MF)”设置控制。关闭时从 AF 菜单选模式；FOCUS/CONTROL 只是环用途，最后仍需实际启动并检查合焦。' },
      lab: '', related: [{ label: '练习两机往返核对', href: '#practice/dual-body-switch-check' }, { label: '复习模式与参数联动', href: '#lesson/modes' }, { label: '查看两机各自操作入口', href: '#kit/r6-r7' }], sources: [refs.r6M,refs.r7M,refs.r7Controls,refs.r7Switch,refs.r7Af,refs.r7Ring,refs.prime,refs.zoom,refs.r7Is,refs.r7Custom,refs.r6Crop]
    },
    {
      id: 'dual-body-field-workflow', title: '双机出行：从切换到文件复盘', subtitle: '少漏画面、辨清来源，再用相同输出判断照片',
      stage: 11, minutes: 30, tag: '双机流程', art: 'composition', mediaId: 'street',
      observation: '配图仅用于观察街头画面信息，不是 R6 三代与 R7 的实拍组照。任务需要你自己的文件和拍摄记录，不补写不存在的 EXIF。',
      intro: '若实际拥有或借到 R7，双机练习应交付一组信息互补、来源清楚的照片。本课把拍摄时的切换、拍摄时间、独立导入和同尺度选片连起来；目前只有 R6 三代时可写流程并练习单机归档，但不能据此宣称已完成双机实拍。',
      prerequisites: ['dual-body-assignment','dual-body-controls','photo-series','export-backup'], outcomes: ['按信息需求完成一次可重复的双机拍摄并记录切换收益或遗漏。', '独立导入两机原片，核对时间和来源，以一致输出尺度完成组照与恢复检查。'],
      sections: [
        { title: '先写六张需要的信息，不要求两台各拍一半', body: '选择附近散步或一次生活过程，列开场环境、主要人物、动作、细节、关系和结束六种作用。把 R6 三代＋RF50 与可选 R7＋RF-S18–150 分配给适合的画面，但允许现场调整；不要为了两台均分张数重复同一个内容。如果一台已经能完成将发生的关键动作，先拍再决定是否切换，记录一次切换带来的收益及一次保留当前机身的理由。' },
        { title: '切换前让下一台处于能拍的状态', body: '在安稳的位置安排两机携带方式，按所用背带或支撑的说明确认固定，拿起下一台后先看它是哪台、哪支镜头与当前区域。用课程核对单读快门、光圈、实际 ISO、补偿和目标，先拍试片；不要在追随主体时忙于回忆拨轮。若临时互换镜头，按镜头说明关机拆装，重查 AF、环用途和记录区域；R6 三代换回 RF50 时尤其检查是否仍手动 1.6 倍裁切。' },
        { title: '时间与白平衡统一意图，结果仍要实测', body: '出发前分别核对两机日期、时间、时区和夏令时，拍同一个外部时钟作参照，结束时可再拍一次以发现偏差。它帮助排序，不是快门同步；若后期修正时间，在副本或可追踪的目录记录中保留原时间与偏移。为后期一致性，在同一光线下各拍中性参考并记录白平衡意图；同一 K 值不保证两机、镜头及处理配置呈现完全相同颜色，RAW 也需要分别检查。' },
        { title: '按机身和存储卡独立导入，再合并选片', body: '先建立“日期_主题/R6III/卡1”和“日期_主题/R7/卡1”等来源目录，按实际卡数扩展，核对文件数量并各抽查原片可打开。不要声称两机出厂文件名必定相同；不过自定义命名、编号重置和导入规则仍可能造成重名，独立目录能避免覆盖并保留来源。合并浏览时保留机身型号、镜头、真实焦距、曝光、时间、原片宽高与目录关系，重命名副本也不要伪造元数据。' },
        { title: '同一输出目的比较，保留两种观看尺度', body: '先在同样的最终输出尺寸下选表达和整体质量，再按需要放大查关键眼睛、拖影、噪声与处理边缘。R7 原片和 R6 三代裁切原片的记录像素不同，直接把两者都显示为 100% 会得到不同整体放大程度；它可以检查像素细节，却不能独自回答同尺寸输出哪张更合适。统一目标明暗与肤色，检查各机中性参考、相机配置文件和镜头校正，保留独立调整，不强求相同滑块数值。' },
        { title: '两台相机不是彼此的备份，复盘到可恢复为止', body: '两台机身拍了不同照片，就没有互相保存对方的原片。逐机核对记录卡模式：自动换卡接着存与同时记录两份并非同一回事；检查实际卡内文件，再做独立副本。选六张信息不同的作品，写机身分工是否减少漏拍，附一张失败或不合意原片及原因；若没有明显失败，就记仍待验证的条件。最后从备份位置恢复一张到临时目录并打开，核对来源，恢复临时设置，才完成这次流程练习。' }
      ],
      steps: ['列六种信息和双机分工，核对日期/时间/时区与中性参考；没有 R7 只做单机流程预演。', '两台实机各拍同一外部时钟并保留原片，确认各自记录卡、镜头、区域、曝光和 AF。', '拍摄中按需求切换，记录一次切换与一次不切换理由，以及漏拍或设置差异的真实证据。', '按机身/卡独立导入，核对文件数量并打开抽查；保留原始元数据和时间修正记录，再合并浏览。', '选六张互补画面按统一输出尺寸处理，确认两机各有符合分工的照片；从独立备份恢复一张打开，写下一次改进。'],
      mistakes: ['认为带着两台就自动互为备份，或把自动切换存储卡当成同时写两份。', '只看文件名合并导入而丢失机身来源，或修改原始时间却不记录偏移。', '把不同像素文件的 100% 显示当作相同输出尺寸，或认为同 K 值和同滑块必然同色彩。'],
      mnemonic: '分工拍信息，归档留来源；同尺度选片，备份能恢复。',
      quiz: { question: 'R6 三代和 R7 分别拍到不同画面，回家准备合并整理。哪一步最完整？', options: ['两台已经互为备份，直接按文件名混到一个目录', '按机身和卡独立导入并核对原片、时间与元数据，制作独立备份，再按相同输出目的选片', '把所有文件都放大到 100%，像素多的一组直接评为更好的作品'], answer: 1, explanation: '不同画面的原片不会因有两台机身就互相复制。独立来源与时间记录避免混淆，实际备份和恢复检查保障文件可用；选片还需要表达和一致的输出尺度。' },
      lab: '', related: [{ label: '完成一次双机六张组照', href: '#practice/dual-body-story' }, { label: '复习导出与备份', href: '#lesson/export-backup' }, { label: '查看可选双机出行核对单', href: '#kit/r6-r7' }], sources: [refs.r7Clock,refs.r7Names,refs.r7Cards,refs.r7Specs,refs.r6Specs,refs.r6Crop,refs.prime,refs.zoom]
    }
  ];
  const tasks = [
    {
      id: 'dual-body-pairing-test', title: '可选双机：分工与取景实测', scene: '稳定光线下有近远层次的静物或生活场景', difficulty: '进阶', time: '40–50 分钟',
      description: '若已拥有或借到 R7，用真实文件检验 R6 三代＋RF50 与 R7＋RF-S18–150 的分工；未有 R7 时只写预演笔记，实际双机验收保持未完成。',
      settings: '普通静止图像 3:2 L 或 RAW/C-RAW；R6＋RF50 确认全幅，R7 原生 APS-C；参数随主体与光线调整，记录真实文件宽高。',
      steps: ['写主题和两机各负责的信息，另列一个反配或只带一机的条件。', '有两台实机时，标记机位拍主线两组合，记录真实机身、镜头、焦距、区域与尺寸。', '把同一支 RF-S 按说明换装两机，在固定机位、接近实际焦距下比较范围，注明不是实验室画质测试。', '若另拍同构图组，记实际机位变化；按一致输出尺寸检查关键细节与信息作用。', '写一项收益、一项限制和未验证条件，核对并恢复裁切；单机预演不勾下面实拍检查项。'],
      criteria: ['两台真实机身的主线组合各有原片与机身/镜头/焦距/区域记录，未用单机裁切代替 R7 结果。', 'R7 原生 APS-C 与 R6 三代 RF-S 自动裁切区分清楚，实际原片尺寸已核对，没有重复乘 1.6。', '同机位与另作的同构图组有条件说明，未把像素数或机位变化直接当作画质或镜头透视结论。', '有分工收益、限制与反配/单机条件，并已恢复临时裁切设置。'],
      reflection: '双机真正增加了哪种信息或保住哪次时机？哪一种需求仍不能由这两支镜头解决？', lessonIds: ['dual-body-assignment','two-lens-comparison','sensor-raw']
    },
    {
      id: 'dual-body-switch-check', title: '可选双机：往返操作与试片核对', scene: '固定文字目标与可重复的缓慢动作', difficulty: '进阶', time: '35–45 分钟',
      description: '若有两台实机，练习 R6→R7→R6 的真实控制与结果；没有 R7 时只制作核对单，不将按钮或 AF 的纸面推演算成实机完成。',
      settings: '自然光无闪光、默认 1/3 档、每次重新测光；M＋自动 ISO 可作起点，快门/光圈依动作和景深选择，先核对实际自定义。',
      steps: ['分别写两机控制映射及当前 AF/MF、补偿、驱动、记录区域和卡状态。', '每台依次改一档快门/光圈/ISO 再恢复，确认读数；R7 查前方 AF/MF 开关启用状态与菜单分支。', '验证近远目标能实际启动 AF，核对单次/伺服、区域与镜头环用途。', '按 R6→R7→R6 拍摄静物和缓慢动作小组，每次读实际参数并放大查目标，不比赛切换速度。', '写一处发现的差异或已验证项，恢复各自起点并试拍；检查自定义模式自动更新是否符合意图。'],
      criteria: ['两台真实机身均完成控制与读数核对，记录默认或已自定义映射，没有照搬第三拨盘操作。', 'R7 AF/MF 实体开关启用/关闭分支与镜头环用途已分清，并实际验证 AF 启动及目标合焦。', 'R6→R7→R6 有实际试片，曝光、补偿、目标与记录设置均有核对记录。', '说明发现的差异或无误证据，两机起点分别恢复并试拍，未假设同名 C1 自动同步。'],
      reflection: '切换时哪项最容易凭习惯操作？你的读数与试片怎样确认这项设置真的正确？', lessonIds: ['dual-body-controls','modes','focus']
    },
    {
      id: 'dual-body-story', title: '可选双机：六张组照与独立归档', scene: '附近散步或一次能重复的生活过程', difficulty: '综合', time: '75–100 分钟',
      description: '若有 R7，与 R6 三代共同拍摄信息互补的六张作品，留下时间、切换、导入与恢复证据；仅有单机可预演流程，实际双机检查项保持未完成。',
      settings: '按题材分工；两机分别核对日期/时间/时区、文件与卡模式；各拍时钟和同光线中性参考，原片按机身/卡分目录。',
      steps: ['列六种信息及机身分工，核对两机时间/时区和中性参考，拍同一外部时钟保留原片。', '按需求切换，记录一次切换与一次不切换理由；保留失败、不合意或仍待验证的真实条件。', '拍摄结束分别导入到机身/卡目录，核对数量和可打开情况，保留原片来源、元数据与必要时间偏移说明。', '合并浏览，按同一输出尺寸选六张不同作用的照片，检查肤色、亮度与关键细节，不追求两机均分张数。', '生成独立备份，从备份恢复一张到临时目录并打开；写切换收益或漏拍原因，恢复临时设置。'],
      criteria: ['两台真实机身各有时钟参照与符合分工的原片，时间/时区和任何修正可追踪，未虚构 EXIF。', '六张作品各增加信息，包含两机实际作品，并记录切换与不切换理由及限制。', '按机身/卡独立导入并检查数量和可打开，原始元数据与来源保留，输出比较尺度一致。', '有独立备份并成功恢复打开一张；能解释两台不同画面的原片并非彼此备份，临时设置已恢复。'],
      reflection: '多一台机身是否减少了遗漏，还是增加了检查负担？下一次应调整分工、核对顺序还是携带数量？', lessonIds: ['dual-body-field-workflow','photo-series','export-backup']
    }
  ];
  const cards = [
    { id: 'dual-assign-view', front: 'RF-S18–150 在 R7 上，需要把 1.6 乘两次吗？', back: '不需要。R7 原生 APS-C，约全幅 28.8–240mm 只是一次视角参照，实际焦距仍是 18–150mm；f 数也不为曝光设置乘 1.6。R6 三代装这支镜头则自动使用 1.6 倍裁切。', lessonId: 'dual-body-assignment' },
    { id: 'dual-assign-pixels', front: 'R7 原生 APS-C 和 R6 三代 1.6 裁切，普通 L/RAW 尺寸相同吗？', back: '不同。普通 3:2 L、RAW/C-RAW：R7 为 6960×4640，R6 三代 1.6 裁切为 4320×2880；R6 全幅同为 6960×4640。有效像素、记录像素和导出像素需分开，像素多不直接保证画质。', lessonId: 'dual-body-assignment' },
    { id: 'dual-control-af', front: 'R7 这两支镜头如何确认 AF/MF？', back: '两镜都无镜头 AF/MF 开关。R7 的机身 AF/MF 开关启用时用实体开关，关闭时从 AF→对焦模式设置。RF50 的 FOCUS/CONTROL 只管环用途；最后启动 AF 并拍照检查。', lessonId: 'dual-body-controls' },
    { id: 'dual-control-dials', front: '从 R6 三代换到 R7，M 模式调 ISO 先查什么？', back: '默认 R6 三代速控转盘 2 调 ISO；R7 可按 ISO 按钮再转拨盘。核对实际自定义与锁定，边操作边看读数。两机分别保存和试拍起点，同名 C1 不代表同配置，不跨机载入配置文件。', lessonId: 'dual-body-controls' },
    { id: 'dual-file-clock', front: '双机日期和 K 值都相同，是否就无需检查排序和颜色？', back: '仍要核对时区/夏令时，以同一个外部时钟观察时间偏差，并保留修正记录；这不是快门同步。同 K 值不保证同色，用同光线中性参考和实际照片分别校正，保留原片元数据。', lessonId: 'dual-body-field-workflow' },
    { id: 'dual-file-backup', front: '两台机身拍到不同照片，能算彼此备份吗？', back: '不能。先按机身与卡独立导入并核对文件，另外制作可恢复副本；自动换卡和同时记录也不同。双机组照按相同最终输出尺寸比较，100% 显示可查细节，却不是相同整体放大尺度。', lessonId: 'dual-body-field-workflow' }
  ];
  for (const [key,list] of [['lessons',lessons],['tasks',tasks],['cards',cards]]) {
    const ids = new Set(data[key].map(item => item.id));
    if (list.some(item => ids.has(item.id)) || new Set(list.map(item => item.id)).size !== list.length) throw new Error('可选双机内容标识重复，未追加数据。');
  }
  const sources = [...new Map(lessons.flatMap(lesson => lesson.sources).map(item => [item.url,item])).values()];
  data.lessons.push(...lessons); data.tasks.push(...tasks); data.cards.push(...cards);
  const known = new Set(data.sources.map(item => item.url));
  for (const item of sources) if (!known.has(item.url)) { data.sources.push(item); known.add(item.url); }
  root.PHOTO_DUAL_LESSONS = { lessons,tasks,cards,sources,lessonIds:lessons.map(item => item.id),taskIds:tasks.map(item => item.id),cardIds:cards.map(item => item.id) };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.PHOTO_DUAL_LESSONS;
})(typeof window !== 'undefined' ? window : globalThis);
