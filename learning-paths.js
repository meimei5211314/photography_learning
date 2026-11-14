/* Goal-oriented routes through existing lessons; progress is derived, never stored here. */
(function (root) {
  'use strict';
  const items = [
    {
      id: 'first-session', title: '第一次有意识地拍清楚', summary: '从拍前检查到曝光与对焦，带回能解释的一组对照。',
      audience: '刚开始使用相机，或经常拍完才发现焦点、曝光与意图不一致。',
      prerequisites: [], prerequisiteNote: '无需先学完其他阶段。先找到快门、对焦和放大回放；每次只完成下面一个步骤。',
      lessonIds: ['camera', 'camera-readiness', 'exposure', 'aperture', 'shutter', 'focus'],
      taskIds: ['readiness-rehearsal', 'sharpness-check'],
      evidence: ['拍前检查与试拍原片，标出光圈、快门、ISO 与对焦位置。', '一张失败照片与重拍图，写明观察到的差异和主要改动。', '拍摄结束前的回放记录：关键细节、重要高光与临时设置复位。'],
      questions: ['这次试拍中，你主动改变了哪个参数，相机又自动改变了什么？', '画面哪里清楚，哪里不清楚？这能支持哪一个假设？', '如果现场更暗，你会先保住什么，再牺牲什么？'],
      limitation: '手机也可练习取景、点击对焦、回放和对照。固定光圈手机不能完成真实的多光圈对照，应注明未验证项目；没有拍摄设备可先读图并写预测，不能据此自报已完成实拍。'
    },
    {
      id: 'people-action', title: '把人物与动作拍明白', summary: '从受光、表情到追焦和时机，把清晰度用在想表达的人身上。',
      audience: '希望拍自然人像、日常活动或可重复的人物运动。',
      prerequisites: ['exposure', 'focus'], prerequisiteNote: '先能解释曝光变量，分清对焦距离与主体拖影；不熟悉时从先修入口补一课。',
      lessonIds: ['light', 'portrait', 'af-tracking', 'action-panning', 'editing-portrait'],
      taskIds: ['window-portrait', 'af-tracking-test', 'panning-sequence'],
      evidence: ['同一个人在两种光线下的原片，标明人物与光源方向。', '一次可重复运动的短连拍，保留全部样本与清楚张数，不只展示最好的一张。', '最终选择及处理副本，说明眼睛、动作、背景与肤色的取舍。'],
      questions: ['是人物移动、相机晃动，还是焦点位置造成了这次发虚？', '为何选择这一个瞬间？画面有没有遮挡或切断重要动作？', '如果换成多人，你需要重新检查排列、对焦和景深中的哪些条件？'],
      limitation: '没有人物可用移动小物体练习时机与清晰度，但不能冒充人脸/眼睛识别或沟通练习。没有连续 AF 时记录限制；人像拍摄先与参与者约定拍摄和分享范围。'
    },
    {
      id: 'landscape-night', title: '旅行风景与夜景的取舍', summary: '安排近远、亮暗与静动，判断是否真的需要滤镜和长曝光。',
      audience: '希望在旅行、街景或日落后，带回层次清楚且时间表现有意图的照片。',
      prerequisites: ['exposure', 'lens'], prerequisiteNote: '先理解曝光组合、视角和机位；本路径不要求使用脚架或滤镜完成所有项目。',
      lessonIds: ['composition', 'metering-histogram', 'landscape-long-exposure', 'filters-exposure', 'night-scene', 'shutter-stabilization'],
      taskIds: ['landscape-pair', 'filter-comparison', 'night-comparison'],
      evidence: ['同机位的亮暗对照，指出重要高光、允许无细节的亮点和暗部代价。', '近处与远处细节的放大检查，以及同一移动元素的两种时间表现。', '写明现场光线、机位、支撑、附件与自动处理方式的拍摄记录。'],
      questions: ['为什么这一张选择保住天空、人物或其他区域？', '静物清楚但树叶或行人拖动时，你下一次具体改变什么？', '如果不带滤镜，你能否换时间、方向、构图或曝光策略？'],
      limitation: '窗边静物加移动小灯可替代部分亮暗与轨迹观察，不能直接推出真实街景的最佳参数。没有 ND/CPL 可以学会判断何时需要它们，但不能把网页滤镜当作光学效果实测。'
    },
    {
      id: 'tabletop', title: '用一张桌子练好光与细节', summary: '围绕普通物品安排光路、反光、背景和近距离清晰范围。',
      audience: '希望练习居家静物、食物、小物件或近摄，不依赖专门摄影棚。',
      prerequisites: ['aperture', 'focus'], prerequisiteNote: '先知道对焦位置与景深不同；从一个物体、一种主光源开始。',
      lessonIds: ['light', 'whitebalance', 'closeup', 'still-life-lighting', 'flash-basics'],
      taskIds: ['still-life-reflection-test', 'closeup-distance', 'flash-distance-test'],
      evidence: ['同一物体改变光向或反射条件前后的照片，并说明哪些地方改变。', '最近、中间与最远关键细节的检查，标明可合焦距离与挡光问题。', '保留亮度近似的颜色对照，区分还原目标与风格选择。'],
      questions: ['哪一处反光在帮助表达材质，哪一处遮住了重要文字或纹理？', '移动物体、光源或相机，哪一个最能验证你这次的假设？', '没有闪光灯的反射练习，能够验证什么，又不能验证什么？'],
      limitation: '窗光、白纸与普通物品足以练习光向和反射观察；这些替代不能验证 TTL、同步或闪光冻结运动。普通近摄也不能在没有标定依据时称为 1:1 微距。'
    },
    {
      id: 'editing-delivery', title: '把一张原片完成并交付', summary: '从 RAW 解释、局部调整到颜色、尺寸与恢复检查。',
      audience: '已经拍到可用原片，希望让处理有依据、导出可用、文件能找回。',
      prerequisites: ['exposure', 'whitebalance'], prerequisiteNote: '先能指出原片的一个具体问题；避免一进入编辑器就随意移动所有滑杆。',
      lessonIds: ['sensor-raw', 'editing-basic', 'local-editing', 'color-output', 'export-backup'],
      taskIds: ['local-editing-check', 'color-output-proof', 'export-verify'],
      evidence: ['原片、编辑记录与输出副本分别保留，能指出一项调整解决的具体问题。', '同一细节的前后对照，检查局部边界、颜色与过度处理痕迹。', '按使用目的重新打开导出文件，并从独立备份位置恢复一张副本。'],
      questions: ['这次问题需要全局调整还是局部处理？选择的理由是什么？', '接收者怎样观看或打印，为什么选择当前像素尺寸和色彩流程？', '如果编辑目录或工作磁盘不可用，哪些文件能帮助你恢复？'],
      limitation: '只有 JPEG 时仍可练习副本处理与导出，但不能证明 RAW 的调整余量。网页示意不代替真实编辑器、色彩管理或打印；没有独立备份位置时，恢复任务的相应检查项应保持未完成。'
    },
    {
      id: 'visual-story', title: '让一组照片讲清楚一件事', summary: '把主题、取景、时机、选片和顺序连起来，检查每张的作用。',
      audience: '能拍单张照片，想减少重复画面，完成可被别人理解的小组照。',
      prerequisites: ['composition', 'workflow'], prerequisiteNote: '先会说出单张照片的主体与取舍；选择可重复观察的日常过程。',
      lessonIds: ['street', 'composition-story', 'photo-series', 'export-backup'],
      taskIds: ['composition-walk', 'four-frame-story', 'edit-series'],
      evidence: ['一句主题、候选照片接触表，以及至少一张被删除照片的理由。', '两种排序的对照，指出不同顺序怎样影响理解。', '观看者的实际复述和据此所作的补拍或删改；说明安排、重演及可确认事实。'],
      questions: ['每张增加了什么信息，删掉它会失去什么？', '画面本身说明了什么，哪些背景事实仍需要文字交代？', '观看者是否看懂了你的主题？哪条反馈改变了最终选择？'],
      limitation: '手机与普通相册网格即可做组照与排序，不要求特定软件。无人物时可以记录物品变化；不能从表情编造动机，也不能把不同事件拼成未经证实的因果。'
    }
  ];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function getProgress(path, state = {}) {
    const item = typeof path === 'string' ? items.find(candidate => candidate.id === path) : path;
    if (!item) return null;
    const read = new Set(Array.isArray(state.completed) ? state.completed : []);
    return {
      read: item.lessonIds.filter(id => read.has(id)).length,
      quizCorrect: item.lessonIds.filter(id => state.quiz?.[id] === true).length,
      tasksReported: item.taskIds.filter(id => state.tasks?.[id]?.completed === true).length,
      lessonTotal: item.lessonIds.length,
      taskTotal: item.taskIds.length
    };
  }
  function progressMarkup(item, state) {
    const progress = getProgress(item, state);
    return `<dl class="lp-progress"><div><dt>已阅读</dt><dd>${progress.read} / ${progress.lessonTotal}</dd></div><div><dt>最近自测答对</dt><dd>${progress.quizCorrect} / ${progress.lessonTotal}</dd></div><div><dt>任务自报完成</dt><dd>${progress.tasksReported} / ${progress.taskTotal}</dd></div></dl>`;
  }
  function mount(container, id, { data = root.PHOTO_DATA, state = {} } = {}) {
    const current = items.find(item => item.id === id);
    if (!current) {
      container.innerHTML = `<section class="lp-root"><header class="lp-heading"><span class="eyebrow">LEARN FOR A PURPOSE</span><h1>先选目标，再安排学习</h1><p>不必按目录读完全部课程。选一个想拍好的目标，穿插阅读、判断与实拍；已经会的部分可以回顾后跳过。</p></header>${id ? '<p class="lp-notice" role="status">没有找到这条路径，请从下面重新选择。</p>' : ''}<aside class="lp-intro"><h2>这三种记录，各自说明什么？</h2><p>已阅读表示你做过阅读标记；最近自测答对表示一次判断结果；任务自报完成来自你对作品的检查。它们都不能单独证明掌握，也不会合成一个认证分数。</p><p>路径只读取现有课程和任务记录。换一条路径不会清除进度；同一课程或任务在不同路径中共用记录。</p></aside><div class="lp-grid">${items.map((item, index) => `<a class="lp-card" href="#paths/${item.id}"><span class="lp-number">目标 ${String(index + 1).padStart(2, '0')}</span><h2>${escape(item.title)}</h2><p>${escape(item.summary)}</p>${progressMarkup(item, state)}<span class="lp-action">查看顺序与作品证据 →</span></a>`).join('')}</div></section>`;
      return;
    }
    if (!data?.lessons || !data?.tasks) throw new Error('学习路径需要完整课程与任务数据。');
    const read = new Set(Array.isArray(state.completed) ? state.completed : []);
    const lesson = value => data.lessons.find(candidate => candidate.id === value);
    const task = value => data.tasks.find(candidate => candidate.id === value);
    const lessonLink = value => `<a href="#lesson/${value}?path=${current.id}">${escape(lesson(value)?.title || value)} ↗</a>`;
    container.innerHTML = `<article class="lp-root lp-detail"><a class="back-link" href="#paths">← 返回全部学习目标</a><header class="lp-heading"><span class="eyebrow">A ROUTE TO YOUR NEXT PHOTO</span><h1>${escape(current.title)}</h1><p>${escape(current.summary)}</p></header><section class="lp-intro"><h2>从你的目标出发</h2><p>${escape(current.audience)}</p>${progressMarkup(current, state)}<p class="lp-note">这里只展示已有记录，不自动评价照片或认定掌握。状态来自课程自测与任务自检，返回本页时会重新读取。</p></section><section class="lp-section"><h2>先确认这些基础</h2><p>${escape(current.prerequisiteNote)}</p>${current.prerequisites.length ? `<ul class="lp-prerequisites">${current.prerequisites.map(value => `<li>${lessonLink(value)} <span>${read.has(value) ? '已标记阅读' : '可先补读'}</span></li>`).join('')}</ul>` : ''}</section><section class="lp-section"><h2>建议顺序：边读边验证</h2><p>顺序用于组织练习，不锁定课程。阅读时先说出预测，拍摄后再回到相关段落核对。</p><ol class="lp-lessons">${current.lessonIds.map(value => `<li>${lessonLink(value)}<div class="lp-lesson-status"><span>${read.has(value) ? '已阅读' : '未标记阅读'}</span><span>${state.quiz?.[value] === true ? '最近自测答对' : state.quiz?.[value] === false ? '自测待巩固' : '尚未自测'}</span></div></li>`).join('')}</ol></section><section class="lp-section"><h2>把学习带到这些实拍任务</h2><p>可以先挑一个任务开始。保留照片与记录，再依据任务检查项自检；勾选是你的判断，网站没有检查原片。</p><div class="lp-task-grid">${current.taskIds.map(value => `<a class="lp-task" href="#practice/${value}?path=${current.id}"><h3>${escape(task(value)?.title || value)}</h3><p>${escape(task(value)?.description || '进入任务查看拍摄步骤、检查项与复盘。')}</p><span>${state.tasks?.[value]?.completed === true ? '已自报完成 · 可以再次练习' : '待完成自检 · 打开任务 →'}</span></a>`).join('')}</div></section><section class="lp-section lp-evidence"><h2>结束时，拿出这些证据</h2><ul>${current.evidence.map(text => `<li>${escape(text)}</li>`).join('')}</ul><h3>对着自己的作品回答</h3><ol>${current.questions.map(text => `<li>${escape(text)}</li>`).join('')}</ol><p>不能回答的地方不急着勾选完成。指出缺少哪张对照或哪条记录，安排一次重拍；记录保存在相应任务的“拍摄复盘”。</p></section><aside class="lp-limit"><h2>手边器材不足时怎样练</h2><p>${escape(current.limitation)}</p></aside><p class="lp-bottom"><a href="#paths">换一个学习目标 →</a><a href="#review">复习已学课程的记忆卡 →</a></p></article>`;
  }
  // No listeners, timers, mutable view state, or storage are created by this module.
  function destroy() {}
  for (const item of items) {
    for (const key of ['prerequisites', 'lessonIds', 'taskIds', 'evidence', 'questions']) Object.freeze(item[key]);
    Object.freeze(item);
  }
  const api = Object.freeze({ items: Object.freeze(items), getProgress, mount, destroy });
  root.PhotoPaths = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
