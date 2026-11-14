/* 已确认器材的教学索引。官方依据与条件见 docs/40-owned-kit-sources.md。 */
(function (root) {
  'use strict';
  if (root.PHOTO_EQUIPMENT) throw new Error('现有器材资料已加载，不能重复追加。');
  const data = root.PHOTO_DATA;
  if (!data) throw new Error('请先加载课程数据，再加载 equipment-data.js。');
  const manual = 'https://cam.start.canon/zh/C022/manual/html/';
  const refs = {
    primeSpec: { title: '佳能 RF50mm F1.8 STM · 官方规格', url: 'https://www.canon-europe.com/lenses/rf-50mm-f1-8-stm/specifications/', note: '全画幅覆盖、无镜头光学IS、0.30m最近对焦、0.25倍放大倍率与43mm滤镜口径。' },
    primeManual: { title: '佳能 RF50mm F1.8 STM · 中文使用说明书', url: 'https://gdlp01.c-wss.com/gds/5/0300040305/01/rf50f18stm-im-zh.pdf', note: 'FOCUS/CONTROL选择开关只切环的用途；AF/MF在机身设置，电子环行为依机身设置。' },
    zoomManual: { title: '佳能 RF-S18-150mm F3.5-6.3 IS STM · 中文使用说明书', url: 'https://gdlp01.c-wss.com/gds/3/0300044243/01/rfs18-150f35-63isstm-im-chi.pdf', note: 'APS-C覆盖、机身设置对焦/控制环与IS、各焦段AF/MF近摄范围及退出MF专用范围方法；不混用EF-M版本。' },
    crop: { title: '佳能 EOS R6 Mark III · 静止图像裁切/长宽比', url: manual + 'UG-04_Shooting_0110.html', note: 'RF-S自动1.6倍裁切；裁切RAW不保存区域外数据，RF镜头也能主动选择裁切。' },
    controls: { title: '佳能 EOS R6 Mark III · 对焦/控制环与自定义控制', url: manual + 'UG-09_Customize_0030.html', note: '有镜头FOCUS/CONTROL开关时使用镜头开关；没有该开关时通过机身对焦/控制环项目设置。' },
    af: { title: '佳能 EOS R6 Mark III · AF操作', url: manual + 'UG-05_AF-Drive_0040.html', note: '没有AF/MF开关的RF镜头由机身对焦模式控制；移动人物需持续启动伺服并检查实际照片。' },
    stabilization: { title: '佳能 EOS R6 Mark III · 影像稳定器模式', url: manual + 'UG-04_Shooting_0530.html', note: '镜头与拍摄状态影响可用防抖设置；按实际可见项目核对，不将防抖当主体冻结。' },
    camera: { title: '佳能 EOS R6 Mark III · 机身防抖说明', url: 'https://www.canon.com.cn/product/r6iii/info1.html', note: '机身具有防抖机构，镜头无光学IS不等于整套无防抖；不借用其他镜头组合的最高级数作承诺。' },
    exposure: { title: '佳能 EOS R6 Mark III · M与自动ISO', url: manual + 'UG-02_ShootingStill_0230.html', note: '同时控制快门和光圈时可使用自动ISO；核查补偿、锁定和实际曝光边界。' },
    autoIso: { title: '佳能 EOS R6 Mark III · 自动ISO范围与最低快门', url: manual + 'UG-04_Shooting_0180.html', note: 'P/Av最低快门策略可被ISO上限突破；场景起点仍需读实际快门和ISO。' }
  };
  const equipment = {
    id: 'r6iii-two-lenses', title: '用好 R6 三代和手头两支镜头', checkedAt: '2026-11-14',
    camera: { name: 'EOS R6 Mark III', summary: '已确认机身与两镜：RF50mm F1.8 STM、RF-S18-150mm F3.5-6.3 IS STM。以下以静止图像为主，先按记录区域选构图，再按人物动作、景深和现场光线调整；不需要先购买其他器材。' },
    lenses: [
      {
        id: 'rf50', name: 'RF50mm F1.8 STM', role: '用定焦练习站位、主体与背景关系；暗处可以用更大的光圈，但要核对清楚范围。',
        coverage: '全画幅覆盖。在R6 III选全画幅记录时为50mm视角；主动设1.6倍裁切后，视角才约等效全画幅80mm。换回此镜后检查裁切状态。',
        aperture: '最大光圈f/1.8。人像先比较f/1.8、f/2.8和f/4的清楚范围与背景，不把最大光圈当所有照片的默认答案。',
        stabilization: '镜头没有光学IS；R6 III具有机身防抖。检查机身实际设置并拍多张验证，防抖不能消除人物运动造成的模糊。',
        focus: '镜头没有AF/MF开关，AF→对焦模式在机身设置。镜头上的FOCUS/CONTROL切换环的用途：FOCUS用于手动对焦，CONTROL用于已分配的控制；不能把它当成AF/MF切换。',
        closeFocus: '最近对焦约0.30m，最大放大倍率0.25×。距离从机身焦平面算，不是镜头前端；拍小物先后退到能合焦的位置，再细调构图。',
        filter: '滤镜口径43mm；与18-150的55mm不同。这里只用于识别规格，不要求新增滤镜。',
        lessonId: 'prime-working-distance', sources: [refs.primeSpec, refs.primeManual, refs.crop, refs.camera, refs.af]
      },
      {
        id: 'rfs18150', name: 'RF-S18-150mm F3.5-6.3 IS STM', role: '用一支变焦完成环境、人物关系和远处细节；练习先选择位置，再选焦段，而非只站在原地拉近。',
        coverage: 'APS-C覆盖，在R6 III上自动使用1.6倍裁切。18–150mm的视角约对应全画幅28.8–240mm，镜头实际焦距仍是18–150mm。',
        aperture: '最大光圈随焦段变化：18mm端f/3.5、150mm端f/6.3。35/50/85mm附近能开多大，请看机身读数并记录，不预填未经核实的中间数值。',
        stabilization: '镜头带IS并可与有机身防抖的相机协同；此镜没有独立IS开关，通过机身影像稳定器设置核对。先区分手抖和主体动作，再决定快门。',
        focus: '没有AF/MF开关，也没有FOCUS/CONTROL切换开关。AF→对焦模式选择AF/MF；自定义控制→对焦/控制环选择环的用途。先变焦再重新对焦。',
        closeFocus: 'AF最近距离随焦段变：18/35/50/150mm约为0.17/0.17/0.18/0.45m，均从机身焦平面测量。新手先留在AF范围；18/35mm另有更近的MF范围，进入后若不能切回AF，向无限远转动对焦环，先退回AF可用范围再切换。',
        filter: '滤镜口径55mm；辨认口径即可，不将加附件作为完成近摄或防抖练习的前提。',
        lessonId: 'zoom-range-map', sources: [refs.zoomManual, refs.crop, refs.controls, refs.af, refs.stabilization]
      }
    ],
    keyPoints: [
      { title: '同样写50mm，先查记录区域', body: 'RF50在全画幅记录时，比RF-S18-150设50mm的画面更宽。后者在本机强制1.6倍裁切，视角约等效全画幅80mm。它们不是同一取景条件，不能仅凭画面紧一些就判断变焦改变了透视或镜头更“长”。' },
      { title: '视角换算不改变镜头焦距和f值', body: '表中1.6倍只用来沟通视角：35mm裁切约等效全画幅56mm视角。它不会把镜头刻度变成56mm，也不把f/3.5的曝光读数改成f/5.6。画质、景深和总进光量比较还须说明记录区域、距离、光圈和输出尺寸。' },
      { title: '裁切范围外没有RAW可救回', body: 'RF-S自动裁切及手动1.6倍裁切时，RAW不记录区域以外的画面。打开实际文件核对像素宽高、画质与裁切状态；不把机身全画幅标称像素当成每张照片的输出像素，也不预填未经核对的裁切像素数。' },
      { title: '两镜对照先说明要回答哪个问题', body: '比较镜头成像时，可先让RF50也设1.6倍裁切，再与变焦50mm固定机位、使用双方均可用的相同光圈和曝光条件。比较各自实际用途时，则保留各自常用记录区域与参数，并标明差别。匹配主体大小而移动机位的比较，还会同时改变透视。' },
      { title: '把换镜当成一次小检查', body: '换回RF50后核查是否仍在1.6倍裁切；换到变焦后看当前焦段可用光圈、实际快门和ISO。两镜控制环入口不同，还要核对AF/MF与环用途。拍一张、回放一次，比记一组永不变化的参数更可靠。' }
    ],
    viewAngles: [
      { lens: 'RF50mm F1.8 STM', setting: '50mm', recording: '全画幅', view: '全画幅50mm视角', note: '这支镜头在本机的全画幅基准；先确认没有遗留手动裁切。' },
      { lens: 'RF50mm F1.8 STM', setting: '50mm', recording: '手动1.6倍裁切', view: '约等效全画幅80mm视角', note: '用于和变焦50mm做相同记录区域对照；裁切外RAW不记录。' },
      { lens: 'RF-S18-150mm F3.5-6.3 IS STM', setting: '18mm', recording: '自动1.6倍裁切', view: '约等效全画幅28.8mm视角', note: '从环境关系开始；不是全画幅18mm的视角。' },
      { lens: 'RF-S18-150mm F3.5-6.3 IS STM', setting: '35mm', recording: '自动1.6倍裁切', view: '约等效全画幅56mm视角', note: '适合比较主体与环境占比；可用最大光圈看实际读数。' },
      { lens: 'RF-S18-150mm F3.5-6.3 IS STM', setting: '50mm', recording: '自动1.6倍裁切', view: '约等效全画幅80mm视角', note: '同机位比RF50全画幅取景更紧；匹配测试先统一记录区域。' },
      { lens: 'RF-S18-150mm F3.5-6.3 IS STM', setting: '85mm附近', recording: '自动1.6倍裁切', view: '约等效全画幅136mm视角', note: '变焦刻度不要求刚好85mm；记录实际拍摄焦距。' },
      { lens: 'RF-S18-150mm F3.5-6.3 IS STM', setting: '150mm', recording: '自动1.6倍裁切', view: '约等效全画幅240mm视角', note: '便于提取远处细节；检查抖动、动作、遮挡和光线。' }
    ],
    scenarios: [
      {
        id: 'window-person', title: '窗边静态人像：先保住眼睛与表情', lens: 'RF50mm F1.8 STM',
        settings: ['先确认全画幅记录；选能保留需要背景的拍摄距离，不靠得过近裁掉想表达的环境。', 'M + AUTO ISO：1/250秒、f/2.8起步，再比较f/1.8与f/4；这是试拍起点。', '人物/眼睛检测；轻微移动时持续启动伺服，ISO上限按实际成片接受程度设置。'],
        checks: ['放大近侧眼睛，并检查另一只眼睛、鼻尖与希望清楚的细节。', '检查背景杂物、头顶留白与实际ISO；记录哪张光圈更符合意图。'],
        changeWhen: '人物动作增大时先加快快门；要让更多前后细节清楚时收光圈并核对ISO。f/1.8只在需要它的进光或虚化效果且清楚范围允许时使用。', lessonId: 'prime-working-distance'
      },
      {
        id: 'indoor-walking', title: '室内走动人物：光圈与动作一起取舍', lens: 'RF50mm F1.8 STM',
        settings: ['全画幅记录；预先选择有光的行走路线和背景，确认站位有空间。', 'M + AUTO ISO：1/500秒、f/2.8作为走动起点；人物更快时重试更快快门。', '伺服AF + 人物 + 眼睛检测，持续启动AF后短连拍，不把防抖当作冻结人物。'],
        checks: ['分清背景也抖、眼睛失焦和只有人物肢体拖影。', '检查ISO是否到顶、曝光是否不足，以及短序列中哪些瞬间真正可用。'],
        changeWhen: 'ISO到顶时先考虑靠近现有光源、选择动作稍缓的瞬间，或在景深允许时开大光圈。快门能否降低要看动作，不能只为降低ISO让人物模糊。', lessonId: 'two-lens-outing'
      },
      {
        id: 'travel-environment', title: '白天外出环境照：让人物与地点有关系', lens: 'RF-S18-150mm F3.5-6.3 IS STM',
        settings: ['先在18–35mm附近观察；本机自动裁切，按实际取景组织环境层次。', 'Av、f/8、AUTO ISO作为明亮白天的观察起点；有走动人物时核对实际快门至少从约1/250秒开始试。', '先站位再变焦，变焦后重新对焦；画面复杂时主动选择人物或对焦区域。'],
        checks: ['人物是否太小，边缘是否切到手脚，前景与背景是否遮挡。', '记录实际焦距、光圈、快门和ISO，确认最低快门策略没有在缺光时变慢。'],
        changeWhen: '进入室内或傍晚后不要照搬f/8；先根据需要的景深使用当前焦段允许的更大光圈，再检查动作与ISO。站位可改变时，先改善遮挡而不只是继续变焦。', lessonId: 'two-lens-outing'
      },
      {
        id: 'distant-detail', title: '远处细节：用长端排除杂物', lens: 'RF-S18-150mm F3.5-6.3 IS STM',
        settings: ['从85mm附近逐步到150mm选择画面；150mm端最大光圈为f/6.3，中间焦段读机身。', 'M + AUTO ISO：固定或缓慢变化对象可从1/500秒、当前可用较大光圈试拍。', '核对影像稳定器设置；握稳并短序列拍摄，必要时使用现场已有的稳定支撑。'],
        checks: ['放大看文字、枝叶或主体边缘，比较多张清晰率。', '检查前方遮挡与远处空气造成的细节损失，并核对ISO和高光。'],
        changeWhen: '快速主体需要更快快门；静物可以在多张对照后尝试较慢快门。光线不足且没有必要远摄时，改变题材或距离，不靠盲目提高锐化弥补未记录细节。', lessonId: 'zoom-range-map'
      },
      {
        id: 'tabletop-object', title: '桌面小物：先在AF范围找到清楚平面', lens: 'RF-S18-150mm F3.5-6.3 IS STM',
        settings: ['先用35–50mm附近，在AF可用距离外对焦；35mm约0.17m、50mm约0.18m，从机身焦平面计算。', 'Av、f/8、AUTO ISO作为景深对照起点；借现有窗光，查看相机给出的实际快门。', '固定物体，选择单次AF与明确对焦点；先拍整体再靠近，不要求进入MF专用近距范围。'],
        checks: ['检查前后边缘与文字是否都在需要的清楚范围，避免只看中央。', '确认镜头前端没有遮光或碰到物体，并记录对焦距离与拍摄倍率只能依据实际结果判断。'],
        changeWhen: '不能合焦时先后退，检查AF/MF与最近距离；若曾进入MF专用范围，向无限远方向转环回到AF范围再切AF。快门太慢时增加现有光线、稳定相机或调整光圈。', lessonId: 'zoom-range-map'
      },
      {
        id: 'same-fifty', title: '同一只杯子的50mm对照：先统一问题', lens: 'RF50mm F1.8 STM 与 RF-S18-150mm F3.5-6.3 IS STM',
        settings: ['先拍RF50全画幅与变焦50mm附近自动裁切，固定机位，只用于认识记录范围差异；变焦焦距以照片EXIF核对。', '再把RF50主动设为1.6倍裁切，与变焦50mm附近固定机位、同一对焦位置比较；例如选双方均可用的f/8。', '稳定光线后用相同手动快门、光圈和固定ISO作对照，先试拍确认曝光合理；保留原文件及裁切记录。'],
        checks: ['记录每张使用的镜头、EXIF焦距、裁切、像素宽高和观看尺寸；实际焦距、对焦呼吸及畸变校正会带来小差别，不要求逐像素对齐。', '区分同记录区域对照、为了匹配主体大小而移动机位、各自最大光圈三种问题。'],
        changeWhen: '如果目的是实际选镜，可以另拍各自常用设置的照片，但须标明光圈与记录区域不同。比较结束换回RF50后检查是否需要恢复全画幅。', lessonId: 'two-lens-comparison'
      }
    ],
    quickCheck: [
      '镜头是哪支、现在多少mm？确认RF-S自动裁切；换回RF50时核对是否要恢复全画幅。',
      '这一张想表达环境、人物还是细节？先看站位和边缘，再决定变焦或换镜。',
      '当前焦段实际能用多大光圈？先明确景深，再看快门和ISO有没有碰到边界。',
      'AF/MF在哪里设置、对焦/控制环目前做什么？两镜都没有AF/MF开关，但环用途的切换方法不同。',
      '主体是否在最近对焦范围外？距离从机身焦平面计算，镜头前端还要留出工作空间。',
      '防抖是否适用于当前拍摄？静物的手抖与人物动作分别判断，不能用稳定取景代替成片检查。',
      '拍一张回放：先看关键清晰点，再看整图与重要高光；换光线后重测白平衡和曝光。',
      '对照或交付时记录裁切与实际像素宽高；测试完成恢复有意改变的设置，保留原片与复盘。'
    ],
    sources: Object.values(refs)
  };
  for (const item of [...equipment.lenses, ...equipment.scenarios]) {
    if (!data.lessons.some(lesson => lesson.id === item.lessonId)) throw new Error('现有器材关联课程不存在：' + item.lessonId);
  }
  for (const key of ['lenses', 'scenarios']) {
    const ids = new Set();
    for (const item of equipment[key]) {
      if (ids.has(item.id)) throw new Error('现有器材条目标识重复：' + item.id);
      ids.add(item.id);
    }
  }
  data.sources.push(...equipment.sources.filter(source => !data.sources.some(existing => existing.url === source.url)));
  root.PHOTO_EQUIPMENT = equipment;
  if (typeof module === 'object' && module.exports) module.exports = equipment;
})(typeof window !== 'undefined' ? window : globalThis);
