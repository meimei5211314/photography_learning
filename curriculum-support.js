/* Observable learning goals; no new progress fields or mastery claims. */
(function (root) {
  'use strict';
  const data = root.PHOTO_DATA;
  const basics = {
    camera: { prerequisites: [], taskId: 'r6-first', outcomes: ['独立找到模式、曝光、对焦和放大回放入口，拍一张可检查的照片。', '能把取景、对焦、曝光分别解释给别人，并指出自己的设备有哪些不同。'] },
    exposure: { prerequisites: ['camera'], taskId: 'metering-bracket', outcomes: ['拍摄前说出最需要保留的细节，解释光圈、时间和 ISO 的取舍。', '做一组曝光对照，记录真实参数并用重要区域说明选择。'] },
    aperture: { prerequisites: ['exposure'], taskId: 'three-apertures', outcomes: ['固定主体与机位比较三种光圈，分别检查主体和背景。', '指出景深变化和亮度补偿各来自哪个参数，解释为何选择这一张。'] },
    shutter: { prerequisites: ['exposure'], taskId: 'stop-time', outcomes: ['区分主体运动和相机晃动，用同场景两种快门提供证据。', '说明本次意图是凝固还是拖影，并检查自动补偿的代价。'] },
    iso: { prerequisites: ['exposure'], taskId: 'night-comparison', outcomes: ['在快门和光圈受限时说明提高 ISO 的理由，不把它说成增加入射光。', '以相同观看尺寸比较噪点、细节和运动清晰度。'] },
    focus: { prerequisites: ['aperture','shutter'], taskId: 'sharpness-check', outcomes: ['选出要清楚的部位，说明静止和距离变化时如何维持对焦。', '从失败原片提出一个原因，再用一次有控制的重拍验证。'] },
    lens: { prerequisites: ['camera'], taskId: 'focal-distance', outcomes: ['分别比较同机位变焦与移动机位，指出背景相对关系的变化。', '写清画幅、焦距和位置，不从一张照片猜唯一拍摄参数。'] },
    composition: { prerequisites: ['camera'], taskId: 'composition-walk', outcomes: ['说出第一视觉落点，沿四边检查干扰、切断和相切。', '为同一主体拍两个构图，并用表达意图解释删去的元素。'] },
    light: { prerequisites: ['exposure'], taskId: 'window-portrait', outcomes: ['根据阴影判断主要光向与软硬，分别描述亮度和光质。', '改变人物或物体的位置做对照，用阴影和细节说明改善。'] },
    whitebalance: { prerequisites: ['exposure','light'], taskId: 'color-story', outcomes: ['区分光源色温与相机白平衡设置，不把两者变化方向混为一谈。', '为同一画面做两种有理由的冷暖解释，并指出混合光的局部限制。'] },
    modes: { prerequisites: ['aperture','shutter','iso'], taskId: 'metering-bracket', outcomes: ['按景深或动作意图选择自动与手动变量，并检查是否达到范围边界。', '用照片和实际参数解释曝光补偿是否生效，拍后复位临时设置。'] },
    workflow: { prerequisites: ['focus','composition','whitebalance'], taskId: 'edit-series', outcomes: ['从候选中筛出服务主题的照片，保留原片和处理决定。', '打开实际导出文件检查，再写出下一次只改一项的行动。'] }
  };
  for (const [id, support] of Object.entries(basics)) Object.assign(data.lessons.find(item => item.id === id), support);
  const wbSource = {title:'Canon R6 Mark III · 自定义白平衡',url:'https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0340.html',note:'在实际光源下拍摄参考图、注册并选择自定义白平衡，参考曝光也需检查。'};
  const uprightSource = {title:'Adobe Lightroom Classic · Upright 透视校正',url:'https://helpx.adobe.com/lightroom-classic/desktop/process-and-develop-photos/guided-upright-perspective-correction.html',note:'用水平/垂直参照校正透视，并检查变换后的边界与裁切；本课只设计观察对照。'};
  const supplements = {
    composition: [
      {title:'颜色也在安排视线：先观察面积与位置',body:'挑一个颜色明显的小物体，先放在相近色背景前，再放到颜色差异更大的背景前，尽量固定机位、曝光与白平衡。比较第一眼落点是否改变，再试着移动背景中的一个亮色干扰物。写下颜色、亮度、面积和位置各自可能起的作用，不把“某种颜色永远代表某种情绪”当作规则；这是一组构图观察，也不是通过随意加饱和度就能补救杂乱的配方。'},
      {title:'建筑线条：先决定是否需要端正，再校正',body:'拍同一门框或建筑立面，比较相机朝向较平与明显仰拍时的竖线关系，再检查画面是否横向歪斜。不要把所有线条变化都归因于镜头畸变，也不要认定有汇聚就一定错误。若需要端正记录，可先调整拍摄位置与朝向并预留四周；使用软件透视校正时按真实竖线或水平线设参照，检查变换后裁掉了什么、主体比例是否自然。保留原图与校正副本，解释为什么改。'}
    ],
    light: [{title:'把光源距离与亮度变化分开比较',body:'固定一个静物和机位，在同一侧光方向下改变灯或物体的相对距离，先观察阴影方向、边缘和亮面反射，再记录实际曝光变化。若想比较光质，可另做亮度接近的副本，并说明用了哪些曝光补偿；不要把变暗直接叫变柔。窗光会随天气与位置改变，反光墙面也参与照明，因此一次试拍只对当前条件成立。把位置图、原片和观察一起留下，再到静物布光课处理具体材质。'}],
    whitebalance: [{title:'中性参考要与主体处在同一种光下',body:'希望得到可比较的颜色时，在主体所处光线下拍参考，而不是去另一盏灯旁随手拍白纸。以 R6 三代为例，按手册拍摄标准曝光的白色参考图，注册其白平衡数据后还要选择自定义白平衡；参考严重过曝或过暗可能失效。回到同一场景验证中性区域与主体颜色，换光后重新检查。普通纸可作练习参照，但不要把未经测量的纸面与肉眼观察称作精确色彩校准；混合光不同区域仍可能需要分别处理。'}]
  };
  for(const [id, sections] of Object.entries(supplements)) data.lessons.find(item=>item.id===id).sections.push(...sections);
  for(const [id, source] of [['composition',uprightSource],['whitebalance',wbSource]]) {
    const lesson=data.lessons.find(item=>item.id===id);
    lesson.sources=[...(lesson.sources||[]),source];
    if(!data.sources.some(item=>item.url===source.url))data.sources.push(source);
  }
  const extensions = {
    camera: [['出门前检查记录与设置','camera-readiness']],
    'r6-start': [['补全拍前与存储检查','camera-readiness']],
    shutter: [['练习追随和动作预判','action-panning']],
    'af-tracking': [['把追焦用于追随拍摄','action-panning']],
    'landscape-long-exposure': [['分清 ND 与 CPL 的用途','filters-exposure']],
    'lens-system': [['检查附件带来的变化','filters-exposure']],
    light: [['控制静物反光与光路','still-life-lighting']],
    closeup: [['细化材质与反光观察','still-life-lighting']],
    'editing-basic': [['实际检查曲线与蒙版','local-editing']],
    'editing-portrait': [['验证局部调整边缘','local-editing']],
    'export-backup': [['理解色彩配置与软打样','color-output']]
  };
  for (const [id, links] of Object.entries(extensions)) {
    const lesson = data.lessons.find(item => item.id === id);
    lesson.related = [...(lesson.related || []), ...links.map(([label, target]) => ({label, href: '#lesson/' + target}))];
  }
  const cameraTopics = {
    camera: 'controls', exposure: 'metering-compensation', aperture: 'exposure-modes',
    shutter: 'exposure-modes', iso: 'auto-iso', focus: 'autofocus',
    whitebalance: 'white-balance', modes: 'exposure-modes', 'r6-start': 'controls'
  };
  for (const [id, topic] of Object.entries(cameraTopics)) {
    const lesson = data.lessons.find(item => item.id === id);
    lesson.related = [...(lesson.related || []), {label:'逐项设置：入口、检查与恢复', href:'#camera/' + topic}];
  }
  for (const id of ['camera','lens','aperture','focus','r6-start','portrait','street','lens-system','closeup','sensor-raw']) {
    const lesson = data.lessons.find(item => item.id === id);
    lesson.related = [...(lesson.related || []), {label:'用你的 RF50 与 RF-S18–150 实拍', href:'#kit'}];
  }
})(typeof window !== 'undefined' ? window : globalThis);
