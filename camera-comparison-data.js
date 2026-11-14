/* 两机对照的索引与基础参数；官方依据见 docs/51-camera-comparison-sources.md。 */
(function (root) {
  'use strict';
  if (root.PHOTO_CAMERA_COMPARISON) throw new Error('两机配置对照已加载。');
  const data = root.PHOTO_DATA, r6Config = root.PHOTO_CAMERA_CONFIG;
  const foundation = root.PHOTO_R7_FOUNDATION, advanced = root.PHOTO_R7_ADVANCED;
  if (!data || !r6Config || !foundation || !advanced) throw new Error('请先加载课程、R6配置与两组R7配置数据。');
  const expected = ['controls','quality','exposure-modes','auto-iso','metering-compensation','autofocus','white-balance','drive-shutter','stabilization','playback','custom-controls','custom-modes'];
  const r7Topics = [...foundation.topics, ...advanced.topics];
  for (const topics of [r6Config.topics, r7Topics]) {
    if (topics.length !== expected.length || new Set(topics.map(t => t.id)).size !== expected.length || expected.some(id => !topics.some(t => t.id === id))) throw new Error('两机配置主题必须完整且一一对应。');
    for (const topic of topics) {
      for (const id of topic.lessonIds) if (!data.lessons.some(l => l.id === id)) throw new Error('配置对照缺少课程：' + id);
      if (!data.tasks.some(t => t.id === topic.taskId)) throw new Error('配置对照缺少任务：' + topic.taskId);
    }
  }
  const ref = (model, chapter, title, note) => ({title:'佳能 '+(model === 'C005' ? 'EOS R7' : 'EOS R6 Mark III')+' · '+title,url:'https://cam.start.canon/zh/'+model+'/manual/html/'+chapter+'.html',note});
  const refs = [
    ref('C005','UG-10_Reference_0100','规格','APS-C、普通照片尺寸、正常/扩展ISO、显示、存储介质与当前手册所列电池兼容性。'),
    ref('C022','UG-11_Reference_0090','规格','全画幅与1.6裁切记录尺寸、ISO、显示、卡槽与LP-E6P/NH/N限制；LP-E6不兼容。'),
    ref('C005','UG-05_AF-Drive_0130','驱动模式与连拍条件','机械/电子前帘/电子H+最高15/15/30张每秒；电池、快门、AF、镜头、缓存等会改变实速。'),
    ref('C022','UG-05_AF-Drive_0120','驱动模式与连拍条件','H+机械/前帘最高12张每秒、电子最高40张每秒；最高值有严格使用条件。'),
    ref('C005','UG-04_Shooting-1_0350','快门模式','R7电子最高1/16000秒的模式限制、电子快门条纹/形变及闪光限制。'),
    ref('C022','UG-04_Shooting_0500','快门模式','R6 III快门类型、最高速度及人工灯/大光圈使用条件。'),
    ref('C005','UG-04_Shooting-1_0090','ISO感光度','照片ISO、扩展与自动范围分别设置，最低快门只适用于对应模式且不是硬下限。'),
    ref('C022','UG-04_Shooting_0180','静止图像ISO感光度','正常/扩展/自动范围和高光优先等限制。'),
    ref('C005','UG-04_Shooting-1_0050','静止图像纵横比','R7的RAW保留APS-C 3:2并附长宽比信息。'),
    ref('C022','UG-04_Shooting_0110','静止图像裁切/长宽比','RF-S自动1.6裁切，RAW不记录区域以外画面。'),
    ref('C005','UG-01_Preparations_0110','基本操作','照片ON与短片位置、独立LOCK、两拨盘及Q/MENU操作。'),
    ref('C022','UG-01_Preparations_0110','基本操作','静止图像/短片开关、ON/LOCK与默认三拨盘。'),
    ref('C005','UG-08_Set-up_0280','对焦模式开关','R7机身AF/MF开关启用与关闭分支。'),
    ref('C005','UG-04_Shooting-1_0370','影像稳定器模式','无IS镜头与无IS开关镜头的机身设置；有IS开关的其他镜头另论。'),
    ref('C022','UG-04_Shooting_0530','影像稳定器模式','按镜头与机身实际可用项配置，不套其他镜头组合的最高防抖级数。'),
    ref('C005','UG-04_Shooting-2_0040','短片记录画质','4K普通与4K优的帧率和裁切条件，不能直接沿用照片配置。'),
    ref('C022','UG-04_Shooting_0050','短片记录画质','短片RAW/MP4、分辨率、帧率与实际菜单可用条件。'),
    ref('C022','UG-04_Shooting_0090','片门全开','RF-S镜头会禁用片门全开；4K优的其他限制另见短片记录画质0050页。')
  ];
  const basics = {
    id:'basics', title:'基础参数：读数、能力与换机影响', group:'基础参数',
    summary:'从已经熟悉的R6三代理解R7：数字先连同模式和使用条件阅读，再在实机上找到对应设置。以下以静止图像与现有两镜为主；R7仍是新增或借用时可参考的配置方案。',
    specs:[
      {name:'画幅与感光元件尺寸',r6:'全画幅，约35.9×23.9mm；最高约3250万有效像素。',r7:'APS-C，约22.3×14.8mm；最高约3250万有效像素。',meaning:'画幅影响同镜头取景与比较条件；有效像素不是所有记录模式的文件像素，也不等于一张照片的清晰细节。'},
      {name:'普通照片的记录像素',r6:'3:2全幅L、RAW/C-RAW：6960×4640（约3230万）；1.6裁切对应L、RAW/C-RAW：4320×2880（约1240万）。',r7:'3:2 L、RAW/C-RAW：6960×4640（约3230万）；其他JPEG尺寸/长宽比另计。',meaning:'宽×高是文件像素。R6裁切S2等规格另计；用原片确认后再按同样输出尺寸比较，避免把不同原片100%显示当成同一放大程度。'},
      {name:'RF卡口与现有两镜',r6:'RF50覆盖全画幅；RF-S18–150可直接安装并自动使用1.6倍裁切。',r7:'RF50与RF-S18–150均可直接安装，普通照片使用APS-C区域。',meaning:'两镜都无需转接；不要把RF-S当作EF-M。换镜按说明关机，检查区域、AF/MF与环用途。'},
      {name:'同一焦距的视角',r6:'RF50全幅为50mm视角；主动1.6裁切约80mm。RF-S18–150约等效全幅28.8–240mm。',r7:'RF50约等效全幅80mm；RF-S18–150约28.8–240mm，无需再乘一次1.6。',meaning:'等效数只描述视角，实际焦距和曝光f值不变；为匹配人物大小移动机位时，透视也随之改变。'},
      {name:'照片ISO正常与扩展范围',r6:'正常ISO 100–64000；扩展L约50、H约102400，需相应设置允许。',r7:'正常ISO 100–32000；扩展H约51200，需相应设置允许。',meaning:'正常范围、可手动选范围和AUTO范围分别设置。扩展不是更高画质的承诺；高光色调优先等功能会改变可选下限，最终看实际读数。'},
      {name:'快门时间与最短速度',r6:'机械/电子前帘1/8000–30秒及B；电子在允许条件下最高1/16000秒。',r7:'机械/电子前帘1/8000–30秒及B；电子在允许条件下可用1/16000秒，其余通常为1/8000–30秒及B。',meaning:'1/250秒约为0.004秒，屏幕带秒符号的读数要另辨认；B由操作控制时长。1/16000受Tv/M及关联功能限制，不能把两机电子快门可选档位当作完全相同。'},
      {name:'H+连拍最高速度',r6:'机械/电子前帘最高约12张/秒，电子最高约40张/秒。',r7:'机械/电子前帘最高约15张/秒，电子最高约30张/秒。',meaning:'张/秒描述拍摄频率，不是快门时间。电池、快门、镜头、AF、光圈、变焦和缓存均可能降速；不保证现有两镜每次达到最高值，先用短连拍核查时机和清晰率。'},
      {name:'AF、主体检测与释放',r6:'单次/伺服、区域、被摄体/眼睛分别设置；有“伺服自动对焦追踪全部区域”项目。',r7:'单次/伺服、区域、被摄体/眼睛分别设置；追踪项目名称为“被摄体追踪”，另有机身AF/MF开关。',meaning:'主体框出现不代表每张合焦；点屏一次与持续启动伺服有区别。先指定目标，再查实际试片，不按同名近似菜单盲搬。'},
      {name:'机身防抖与镜头IS',r6:'有机身防抖；RF50无镜头IS，RF-S18–150有镜头IS但无镜身IS开关。',r7:'同样有机身防抖；现有两镜均需在机身核对影像稳定器模式及可用项。',meaning:'防抖缓解相机抖动，人物运动需要足够快门。现有镜头会通信，不需手填等效焦距；照片IS与短片数码IS分别配置。'},
      {name:'文件格式',r6:'照片JPEG、HEIF、RAW/C-RAW（.CR3）；HEIF与HDR PQ设置相关。',r7:'照片JPEG、HEIF、RAW/C-RAW（.CR3）；HEIF与HDR PQ设置相关。',meaning:'C-RAW是较小文件的RAW，不等于较小像素JPEG；两机.CR3相同扩展名也不保证旧软件都能解码。双格式是文件选择，双卡复制是记录方式。'},
      {name:'卡槽与写入目标',r6:'槽1：CFexpress Type B；槽2：SD/SDHC/SDXC，兼容UHS-II。',r7:'槽1和槽2均为SD/SDHC/SDXC，兼容UHS-II。',meaning:'不能把R6的CFexpress卡放进R7。标准、自动切换、分别记录、多个媒体用途不同；拍一张后核对目标卡和格式，再检查回放卡。'},
      {name:'取景器与后屏',r6:'OLED取景器约369万点；后屏约7.5cm（3.0英寸）、约162万点。',r7:'OLED取景器约236万点；后屏约7.5cm（3.0英寸）、约162万点。',meaning:'显示点数不是照片像素。分别调整屈光度与显示亮度，让文字清楚；取景亮暗不能代替直方图、参数和重要高光检查。'},
      {name:'电池型号与互换边界',r6:'主用LP-E6P；LP-E6NH/LP-E6N可用但功能受限；不能使用LP-E6。',r7:'当前官方手册列出LP-E6P、LP-E6NH、LP-E6N、LP-E6兼容。',meaning:'先读电池标签与本机说明，能插入不代表所有功能/连拍/充电条件相同。不要把R7可用的LP-E6移给R6三代；兼容与USB充电需分别核查。'},
      {name:'照片与短片模式边界',r6:'照片/短片有独立切换；短片有RAW/MP4等记录选择，RF-S会限制片门全开与4K优等组合。',r7:'电源开关ON用于照片，短片位置用于录影；4K普通最高59.94/50p，4K优最高29.97/25p。',meaning:'这里只识别能力与入口。视频制式、帧率、裁切、数码IS、卡和供电需在短片菜单另行核验；不从照片1.6裁切推断每种视频视角。'}
    ],
    setup:[
      {title:'1．辨认机身与当前拍摄状态',r6:'确认型号，电源ON，静止图像/短片开关选静止图像；先记录原模式与自定义。',r7:'电源开关置ON，确认没有拨到短片；找主拨盘、速控转盘、ISO、LOCK、Q、MENU、INFO和AF-ON。',check:'能说出当前型号、照片模式及锁定状态，先不清除原配置。'},
      {title:'2．检查电池与存储位置',r6:'核对电池型号与剩余电量，辨认CFexpress槽1与SD槽2；看实际可写空间。',r7:'核对兼容电池及电量，辨认两个SD槽；看记录卡/回放卡和剩余空间。',check:'确认本次文件落在哪里；卡片有内容时先保护已有文件，不靠格式化排查。'},
      {title:'3．按用途设置画质',r6:'拍摄→图像画质；通常主拨盘选RAW类、速控转盘1选JPEG，SET确认；若各卡分别记录，先核对各卡分配和画质。',r7:'拍摄→图像画质；通常主拨盘选RAW类、速控转盘选JPEG/HEIF，SET确认。若是分别记录，先用速控转盘选卡1/卡2并按SET，再设各卡画质；需要JPEG时核对HDR PQ。',check:'各拍一张后用兼容软件检查真实扩展名和目标卡；尚未导入时如实记录待核查。'},
      {title:'4．检查记录区域与视角',r6:'RF50需要全幅时选择3:2全幅；RF-S自动1.6裁切，先接受对应文件尺寸。',r7:'普通照片从3:2开始，两镜都按原生APS-C取景；不寻找额外1.6裁切开关。',check:'同一50mm在两机上不一定同视角；写下实际镜头、区域和文件宽高。'},
      {title:'5．试出曝光拨轮的真实分工',r6:'M默认主拨盘快门、速控1光圈、速控2 ISO；改一档再恢复。',r7:'M默认主拨盘快门、速控转盘光圈；按ISO按钮后调整ISO，改一档再恢复。',check:'读到的参数与操作一致；遇到锁定/自定义先核对映射，不连续试拨。'},
      {title:'6．设置可解释的自然光起点',r6:'RF50静态人物可试M、1/250秒、f/2.8、AUTO ISO；确认原补偿并按光线调整。',r7:'用18–150时先选焦距和可用光圈；静物可试Av f/8，人物动作需检查快门，必要时M守住动作所需速度。',check:'不强求两机相同光圈或ISO。人物拖影、ISO到顶或高光丢失时按症状调整。'},
      {title:'7．让AF真正启动',r6:'现有两镜没有AF/MF开关，在AF→对焦模式选AF；按人物静动选择单次或伺服。',r7:'先查设置→对焦模式开关(AF/MF)是否启用：启用用前方开关，关闭则用AF→对焦模式。再核对区域、追踪、主体与眼睛。',check:'分别对近、远目标启动AF并试拍；需要伺服时持续半按或使用自己的AF启动键。'},
      {title:'8．补齐颜色、稳定与释放设置',r6:'核对拍摄→白平衡设置→白平衡、影像稳定器模式、驱动与快门模式。',r7:'核对拍摄→白平衡、影像稳定器模式、驱动与快门模式；临时自拍/静音可能遗留。',check:'同光线各拍参照，检查颜色、动作与人工灯条纹；两机同K值不保证完全同色。'},
      {title:'9．回放一张，找到关键问题',r6:'按放大后用速控转盘2调整倍率、多功能控制钮移动；INFO切拍摄信息。',r7:'按放大后用主拨盘调整倍率、多功能控制钮移动、速控转盘切图；INFO切拍摄信息。',check:'看关键眼睛/文字，再看完整画面、高光与真实参数，明确一项需要改进之处。'},
      {title:'10．分别保存和恢复常用起点',r6:'先记录并验证参数，再在本机注册C1–C3；设置文件的保存/加载只按同型号条件使用。',r7:'先记录并验证参数，再在本机注册C1–C3，核对自动更新；用逐项记录复用，不照抄R6保存到卡入口。',check:'切走再切回并试拍，核对恢复了什么。不能跨机载入设置；未有R7先保留待实测清单。'}
    ],
    pitfalls:[
      {symptom:'对照表两边都写3250万，RF-S照片为什么尺寸不同？',fix:'有效像素与当前记录区域不同。R6三代装RF-S自动裁切；R7按原生APS-C记录。按画质与长宽比查看原片宽高。'},
      {symptom:'R7没有教程中的第三拨盘、保存到卡或同名菜单。',fix:'查看本页R7列与对应官方章节；原R6手册的控件和配置文件能力不能按同系列相机推断。'},
      {symptom:'都设了AUTO ISO，拍摄结果为什么仍不同？',fix:'分别检查模式、实际光圈/快门、补偿、测光、锁定和ISO范围，确认构图与光线；先比较控制目的再比较数值。'}
    ], sources:refs
  };
  const topics = expected.map(id => {
    const r6 = r6Config.topics.find(t => t.id === id), r7 = r7Topics.find(t => t.id === id);
    if (!Array.isArray(r7.differences) || r7.differences.length < 2) throw new Error('缺少换机差异：' + id);
    return {id,title:r6.title,group:r6.group,summary:r7.summary,differences:r7.differences,r6,r7};
  });
  const allSources = [...refs,...r6Config.sources,...foundation.sources,...advanced.sources];
  const unique = new Map(allSources.map(s => [s.url,s]));
  const comparison = {
    id:'r6iii-r7-settings', title:'R7 与 R6 三代：基础参数和操作配置对照', checkedAt:'2026-11-14',
    summary:'基础参数与12项详细配置；按同一环节分别查看两台机身，依当前镜头、固件和自定义设置验证。阅读对照页不会改变学习记录。',
    basics,topics,sources:[...unique.values()],
    switchChecklist:[
      '先认机身与照片/短片状态，再确认本次镜头和记录区域。',
      '看模式、实际快门、光圈、ISO、补偿和AE锁，不只记上一台的数值。',
      '查R7 AF/MF开关是否启用，再查AF操作、区域、追踪、主体与眼睛。',
      '认清拨轮与镜头环职责，锁定和自定义可能改变操作反馈。',
      '检查驱动、自拍、快门类型、静音和防抖；静音不只是关声音。',
      '核对白平衡、画质、记录/回放卡与剩余空间；两机分别保存源文件。',
      '拍一张并放大关键位置，核对实际参数和高光，再开始正式拍摄。',
      '练习结束逐项恢复裁切、MF、补偿等临时值；各机C模式独立验证，不把同名C1当同步。'
    ]
  };
  const indexed = new Set(data.sources.map(s => s.url));
  data.sources.push(...comparison.sources.filter(s => !indexed.has(s.url)));
  root.PHOTO_CAMERA_COMPARISON = comparison;
  if (typeof module === 'object' && module.exports) module.exports = comparison;
})(typeof window !== 'undefined' ? window : globalThis);
