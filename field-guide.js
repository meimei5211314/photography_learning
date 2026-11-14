/* Select an observed symptom, then verify it in a controlled comparison. */
(function (root) {
  'use strict';
  const items = [
    {
      id: 'subject-motion', title: '背景清楚，人物却有拖影', category: '清晰度',
      summary: '先区分主体运动与对焦偏移，再决定是否缩短曝光时间。',
      evidence: ['静止招牌或墙边较清楚，移动的脸、手或车轮出现方向性的拉长。', '同一组里动作较小的瞬间更清楚；仅凭缩略图还不能排除同时失焦。'],
      checks: ['放大主体边缘，再比较同一画面的静止背景。', '固定机位和对焦目标，把曝光时间缩短一档；按模式补偿 ISO 或光圈，使亮度可比较。', '重拍相似动作，记录拖影是否减少，同时检查实际焦点。'],
      actions: ['需要凝固动作时继续缩短曝光时间，直到结果满足用途；接受必要的 ISO 提升或寻找更好的光。', '想表达运动时可以保留拖影，但用稳定背景和清楚的构图让意图成立。'],
      mistakes: ['三脚架和防抖不能让移动人物静止。', '不能从一张成片的拖影反推出唯一快门值。'],
      lessonIds: ['sharpness-diagnosis', 'shutter'], taskId: 'sharpness-check'
    },
    {
      id: 'camera-shake', title: '静止背景也出现重影', category: '清晰度',
      summary: '用稳定支撑与短快门对照，排查相机在曝光期间的移动。',
      evidence: ['画面中不同距离的静止边缘都出现相似方向的重影或拖动。', '同一静物连续几张清晰程度不一致，可能与持机、按键动作或震动有关。'],
      checks: ['选择静止且有细节的物体，确认对焦位置，排除物体自身移动。', '保持构图和对焦，稳定支撑相机，用延时拍摄减少按快门时的扰动。', '再缩短曝光时间重拍，以相同观看倍率比较；按镜头手册核对支撑时的防抖设置。'],
      actions: ['支撑后改善，优先调整持机、支撑和触发方式，再考虑更短快门。', '支撑后仍不清楚，转到焦点与景深检查，不要把所有模糊归给防抖。'],
      mistakes: ['“焦距倒数”只是经验起点，不能保证每个人每张都清楚。', '增大锐化不能重新得到明显拖影已经混合的细节。'],
      lessonIds: ['sharpness-diagnosis', 'landscape-long-exposure'], taskId: 'sharpness-check'
    },
    {
      id: 'focus-position', title: '耳朵或背景清楚，眼睛不清楚', category: '清晰度',
      summary: '找出真正清楚的距离，检查焦点目标和拍摄时的位置变化。',
      evidence: ['至少有一处静止细节清楚，但它不是你希望强调的眼睛或物体。', '背景比人物更锐，或近眼与远眼的清晰程度差异明显。'],
      checks: ['以相同倍率检查近眼、耳朵和背景，找出清晰范围实际落在哪里。', '把对焦目标明确指定到关键眼睛或细节；移动主体按需求使用连续对焦。', '先避免合焦后大幅重新构图，保持距离拍一张，再适当收光圈比较。'],
      actions: ['焦点选错时重新指定目标；相机持续追错目标时收紧对焦区域或调整主体检测。', '焦点正确而另一只眼仍模糊时，调整人物角度或景深，并重新检查快门。'],
      mistakes: ['检测框出现不等于每张照片已经准确合焦。', '把 ISO 调低不能改变对焦平面。'],
      lessonIds: ['focus', 'sharpness-diagnosis'], taskId: 'sharpness-check'
    },
    {
      id: 'group-depth', title: '合影只有前排清楚', category: '清晰度',
      summary: '先整理人物距离，再协调景深、快门与对焦位置。',
      evidence: ['较近的一排脸清楚，后排脸更模糊；清晰差异大体跟距离变化一致。', '先确认目标是人人清楚，而不是故意用清晰范围突出某个人。'],
      checks: ['放大检查每张脸，区分后排失焦和个别人移动的拖影。', '请大家尽量站在相近距离平面；维持相似机位拍一张。', '适当收小光圈并保持足够短的快门，再逐人回放检查；记录 ISO 的代价。'],
      actions: ['优先整理排列和距离，必要时后退并重新构图，观察清晰范围。', '多排人物无法靠拢时，试不同对焦位置与光圈，用实际回放决定，而不是只检查最近眼睛。'],
      mistakes: ['f/8 只是可能的起点，不是全员清楚的保证。', '更高连拍速度不会自动增加景深。'],
      lessonIds: ['portrait', 'aperture'], taskId: 'group-portrait'
    },
    {
      id: 'highlight-detail', title: '白衣、云层或灯牌没有层次', category: '曝光与色彩',
      summary: '先确定哪些亮部重要，再用回放和不同曝光的对照判断。',
      evidence: ['你希望保留的白衣、云层或文字变成一片亮白，纹理难以分辨。', '高光警告或 RGB 柱状图边缘堆积提供线索，但必须回到对应的画面区域检查。'],
      checks: ['指出必须保留的亮部；灯芯、太阳或反光点不一定都要有纹理。', '查看回放高光提示与亮度/RGB 柱状图，再拍一张减少曝光的对照。', '在相同观看条件下比较重要亮部和主体暗部，判断现场反差是否超出可接受范围。'],
      actions: ['自动曝光模式中可尝试负补偿；固定 ISO 的 M 模式应直接调整实际曝光参数。', '保住亮部后主体太暗时，考虑改变光线、位置或时间；先保留 RAW，再评估合理的后期空间。'],
      mistakes: ['直方图偏右不等于照片必然失败，高调场景本来就有较多亮像素。', 'RAW 不能保证恢复已经饱和丢失的细节；回放也不是 RAW 余量的精密测量。'],
      lessonIds: ['metering-histogram', 'editing-basic'], taskId: 'metering-bracket'
    },
    {
      id: 'shadow-noise', title: '暗部一提亮，颗粒就很明显', category: '曝光与色彩',
      summary: '比较原片曝光和输出用途，不要为了低 ISO 牺牲必要的进光。',
      evidence: ['暗部提亮后颗粒或彩色斑点更显眼，细节边缘变得粗糙。', '同一文件放到很大时明显，缩到交付尺寸后可能已经能够接受。'],
      checks: ['先比较未调整原片，确认是不是为了保护亮部而让主体过暗。', '在不损失重要高光、不引入运动模糊的条件下，尝试增加现场光或实际进光量重拍。', '按最终像素尺寸检查，再比较适度降噪前后是否还保留纹理。'],
      actions: ['拍运动主体时守住需要的快门；有噪点但清楚的照片可能更符合意图。', '静止场景可用稳定支撑延长曝光，但仍检查树叶、水面等移动部分。'],
      mistakes: ['只降低 ISO 而让主体更暗，再大幅提亮，不保证更好的结果。', '过度降噪容易把细纹理抹掉，不能只看画面是否光滑。'],
      lessonIds: ['iso', 'landscape-long-exposure'], taskId: 'landscape-pair'
    },
    {
      id: 'mixed-light', title: '一边肤色正常，另一边偏色', category: '曝光与色彩',
      summary: '区分整体白平衡与不同光源对局部的影响。',
      evidence: ['同一张脸或同一中性物体的不同位置，受到明显不同的颜色照明。', '调整全局白平衡后，一处改善而另一处更偏。'],
      checks: ['观察窗光、室内灯、屏幕和有颜色的墙面分别照到了哪里。', '在同一主光下加入可信的中性参照；不能把任意白衣或最高亮点当作准确中性。', '可控制环境时暂时关闭一个光源，或移动人物到单一主光下，拍对照。'],
      actions: ['先统一光源或改变人物位置；保留有意的暖灯与冷天空，不必把所有颜色变中性。', '仍需修正时，在支持的软件中做局部白平衡或色彩调整，检查蒙版边缘。'],
      mistakes: ['一个 K 值不一定能同时校正混合光。', '从照片的总体冷暖不能唯一推断现场色温。'],
      lessonIds: ['whitebalance', 'editing-portrait'], taskId: 'color-story'
    },
    {
      id: 'light-banding', title: '室内出现明暗横条纹', category: '曝光与色彩',
      summary: '先把光源闪烁与快门方式作为验证对象，别急着判断机身损坏。',
      evidence: ['人工照明下出现规则明暗条纹，不一定与场景物体边缘对应。', '换光源或快门方式后条纹可能变化；屏幕预览与保存的照片也应分别检查。'],
      checks: ['查看保存的原始照片，确认条纹不只是拍摄屏幕时产生的现象。', '记录当前快门方式与速度，在同一光源下尝试机械快门或电子前帘，逐张比较。', '保持曝光可比较，尝试不同曝光时间或更稳定的光源，并核对机型防闪烁功能的适用条件。'],
      actions: ['根据实拍结果选择快门和光源组合；R6 三代的具体限制查官方快门模式说明。', '若不同光源、不同快门下仍重复出现异常，保存原片与设置供进一步检查。'],
      mistakes: ['静音通常会改变快门行为，并不只是关闭提示音。', '机械快门或某个固定快门值不能保证消除所有 LED 光源条纹。'],
      lessonIds: ['r6-start', 'shutter'], taskId: 'r6-first',
      source: { title: '佳能 R6 三代：快门模式与电子快门注意事项', url: 'https://cam.start.canon/zh/C022/manual/html/UG-04_Shooting_0500.html' }
    },
    {
      id: 'export-soft', title: '电脑里清楚，发出去却糊了', category: '完成与交付',
      summary: '把原片、导出副本与接收文件分开检查，定位缩放或压缩发生在哪一步。',
      evidence: ['编辑软件中细节清楚，另一个文件或接收端的显示更模糊。', '导出或接收文件的像素尺寸明显更小，或细线周围出现压缩痕迹。'],
      checks: ['分别查看原片、导出副本和接收文件的像素尺寸，确认没有拿缩略图当原图。', '用同一查看器和相同显示大小比较三个文件，排除观看倍率差异。', '按接收用途重新导出一份 JPEG，检查尺寸、压缩品质和色彩空间，再通过原文件方式传输验证。'],
      actions: ['为屏幕分享明确长边像素要求，重新打开导出文件检查，而不是只相信导出对话框。', '保留原始照片、编辑记录及独立备份，分享用副本；若平台再次压缩，按实际接收效果调整。'],
      mistakes: ['只把 PPI 数字从 72 改到 300，不会凭空增加像素细节。', '高品质导出无法修复原片严重失焦；放大尺寸也不等于新增真实细节。'],
      lessonIds: ['export-backup', 'editing-basic'], taskId: 'export-verify',
      source: { title: 'Adobe：Lightroom Classic 导出文件与图像尺寸', url: 'https://helpx.adobe.com/lightroom-classic/desktop/export-photos/export-files-disk-or-cd.html' }
    }
  ];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  let host = null, aborter = null, current = null, checked = new Set();

  function mount(container, id) {
    destroy();
    host = container;
    checked = new Set();
    current = items.find(item => item.id === id) || null;
    aborter = new AbortController();
    host.addEventListener('change', onCheck, { signal: aborter.signal });
    host.addEventListener('click', onClick, { signal: aborter.signal });
    if (current) renderDetail();
    else renderList(Boolean(id));
  }

  function destroy() {
    aborter?.abort();
    host = null; aborter = null; current = null; checked = new Set();
  }

  function renderList(notFound) {
    const categories = [...new Set(items.map(item => item.category))];
    host.innerHTML = `<section class="fg-root"><header class="fg-heading"><span class="eyebrow">OBSERVE · CHECK · TRY AGAIN</span><h1>先找证据，再改一个变量。</h1><p>选择你在照片里看到的现象。这里提供现场检查步骤，由你通过对照拍摄验证原因。</p></header>${notFound ? '<p class="fg-notice" role="status">没有找到这项排障，请从下面重新选择。</p>' : ''}<aside class="fg-intro"><strong>每次只解决一个问题</strong><p>先说出你想要的画面，再放大比较主体与背景。改变一个主要变量，重拍并记录：哪些证据变了？模糊、噪点或剪影也可能是有意的表达。</p></aside>${categories.map(category => `<section class="fg-category"><h2>${escape(category)}</h2><div class="fg-grid">${items.filter(item => item.category === category).map(item => `<a class="fg-card" href="#diagnose/${item.id}"><h3>${escape(item.title)} <span aria-hidden="true">↗</span></h3><p>${escape(item.summary)}</p><small>观察证据 → 对照验证 → 实拍记录</small></a>`).join('')}</div></section>`).join('')}<p class="fg-footnote">暂时无法判断时，保留原片和实际设置，先回到对应课程。不要仅凭一张缩略图就认定唯一原因。</p></section>`;
  }

  function renderDetail() {
    const data = root.PHOTO_DATA;
    const lessonLinks = current.lessonIds.map(id => {
      const lesson = data?.lessons.find(item => item.id === id);
      return `<a href="#lesson/${id}">${escape(lesson?.title || '打开相关课程')} ↗</a>`;
    }).join('');
    const task = data?.tasks.find(item => item.id === current.taskId);
    host.innerHTML = `<article class="fg-root fg-detail"><a class="back-link" href="#diagnose">← 返回全部排障</a><header class="fg-heading"><span class="eyebrow">${escape(current.category)} / 现场检查</span><h1>${escape(current.title)}</h1><p>${escape(current.summary)}</p></header><div class="fg-columns"><div><section class="fg-panel"><h2><span>01</span> 先核对画面证据</h2><ul>${current.evidence.map(text => `<li>${escape(text)}</li>`).join('')}</ul></section><section class="fg-panel"><h2><span>02</span> 做最小对照</h2><p>逐项试过后勾选；勾选表示你做了检查，并不自动证明原因。</p><div class="fg-checks">${current.checks.map((text, index) => `<label class="fg-check"><input type="checkbox" data-fg-check="${index}"><span>${escape(text)}</span></label>`).join('')}</div><p class="fg-check-status" id="fg-check-status" role="status" aria-live="polite">已检查 0 / ${current.checks.length} 项。观察变化后，再决定下一步。</p><button class="secondary" type="button" data-fg-reset>重新检查</button></section><section class="fg-panel"><h2><span>03</span> 按结果调整</h2><ul>${current.actions.map(text => `<li>${escape(text)}</li>`).join('')}</ul><p class="fg-record-prompt">记录：原来的现象是什么？我只改了什么？重拍后哪些细节改变了？下次还要验证什么？</p><a class="primary" href="#practice/${current.taskId}">进入实拍记录：${escape(task?.title || '对应任务')} →</a><p class="fg-footnote">这里的勾选只用于本次检查。把比较结果写进任务复盘，留作下次拍摄的依据。</p></section></div><aside><section class="fg-panel fg-caution"><h2>容易误判的地方</h2><ul>${current.mistakes.map(text => `<li>${escape(text)}</li>`).join('')}</ul></section><section class="fg-panel fg-links"><h2>补齐原理</h2>${lessonLinks}${current.source ? `<a href="${escape(current.source.url)}" target="_blank" rel="noopener noreferrer">${escape(current.source.title)} ↗</a>` : ''}<a href="#reference">知识速查与资料来源 ↗</a></section></aside></div></article>`;
  }

  function onCheck(event) {
    const input = event.target.closest('[data-fg-check]');
    if (!input || !current) return;
    const index = Number(input.dataset.fgCheck);
    if (!Number.isInteger(index) || index < 0 || index >= current.checks.length) return;
    if (input.checked) checked.add(index); else checked.delete(index);
    updateStatus();
  }

  function updateStatus() {
    const status = host.querySelector('#fg-check-status');
    status.textContent = `已检查 ${checked.size} / ${current.checks.length} 项。${checked.size === current.checks.length ? '对照后把变化写入任务复盘；没有改善时，继续检查其他可能原因。' : '观察变化后，再决定下一步。'}`;
  }

  function onClick(event) {
    if (!event.target.closest('[data-fg-reset]') || !current) return;
    checked.clear();
    host.querySelectorAll('[data-fg-check]').forEach(input => { input.checked = false; });
    updateStatus();
  }

  for (const item of items) {
    for (const key of ['evidence', 'checks', 'actions', 'mistakes', 'lessonIds']) Object.freeze(item[key]);
    if (item.source) Object.freeze(item.source);
    Object.freeze(item);
  }
  const api = Object.freeze({ items: Object.freeze(items), mount, destroy });
  root.PhotoFieldGuide = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
