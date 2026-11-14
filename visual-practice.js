/* Observe real photos, make a decision, then inspect the evidence. */
(function (root) {
  'use strict';
  const questions = [
    {
      id: 'depth-evidence', lessonId: 'aperture', taskId: 'three-apertures', assetId: 'bokeh', label: '读懂景深',
      look: '比较上下两张图：先看红色订书机，再看它后方的计算器与桌面物品。',
      question: '哪一条观察最能说明上图的清晰范围更浅？',
      options: ['上图颜色更少，所以景深更浅。', '上图的订书机清楚，但后方办公物品明显模糊。', '上图只要有一个模糊物体，就一定是相机抖动。'],
      answer: 1,
      evidence: '上图订书机比后方办公物品更清楚，背景难以辨认；下图计算器、纸张等背景细节更可辨。观察“哪些距离清楚”，比只看某一处锐不锐更有用。',
      transfer: '下次拍杯子时固定机位、焦距与对焦距离，比较不同光圈下背景文字的清晰程度。这组实拍的机位存在小幅差异，用于理解趋势，不把它当作精确的镜头标定。'
    },
    {
      id: 'group-focus', lessonId: 'focus', taskId: 'group-portrait', assetId: 'bokeh', label: '把观察迁移到拍摄',
      look: '先找到红色订书机，再比较上下两图中它后方的办公物品能否看清。',
      question: '如果要拍前后错开的两个人，目标是两张脸都清楚，下面哪种做法更稳妥？',
      options: ['直接用最大光圈，只检查离自己最近的一只眼睛。', '只提高 ISO，就能把对焦范围自动变深。', '尽量让两张脸处在相近距离，适当收小光圈，再放大回看两张脸。'],
      answer: 2,
      evidence: '上图的红色订书机比后方办公物品更清楚；下图背景中的计算器、纸张等更容易辨认。浅景深能突出主体，也需要更留意清晰范围：不同距离的两张脸不一定都能拍清。',
      transfer: '把人物尽量安排在相近的对焦距离；光圈收小后若快门变慢，重新检查动作是否拍清。对焦、景深和快门要一起检查。'
    },
    {
      id: 'water-motion', lessonId: 'shutter', taskId: 'stop-time', assetId: 'waterfallSlow', label: '看懂时间的痕迹',
      look: '观察水流的纹理，再看旁边固定岩石的边缘。',
      question: '想把流动的水拍出更多清晰瞬间，而不是连续的流动痕迹，首先该尝试什么？',
      options: ['缩短曝光时间，并重新检查亮度。', '延长曝光时间，让相机记录更多位移。', '只换成更暖的白平衡。'],
      answer: 0,
      evidence: '水在曝光期间持续移动，因此可能在照片中留下连续纹理。固定岩石与流动水可以分开观察：稳定相机能减少机身晃动，但不会让水停止运动。',
      transfer: '固定机位尝试几种快门，检查水纹变化。不同地点、水速和构图的照片不能当作只改变快门的严格对照。'
    },
    {
      id: 'light-edge', lessonId: 'light', taskId: 'window-portrait', assetId: 'light', label: '看阴影，不猜器材',
      look: '在两张水果照片里找同一处投影，比较阴影与亮面之间的过渡。',
      question: '判断光线更柔还是更硬，哪一种观察最有帮助？',
      options: ['看照片里水果的数量。', '看阴影边缘的过渡是否更宽、更渐变。', '只要整体更亮，就一定是更柔的光。'],
      answer: 1,
      evidence: '上图水果投影的边缘过渡更柔和；下图苹果左下方与李子前方有更明显的黑色硬边。柔光与硬光可从这些边缘区分。亮不亮与光的软硬是不同问题，不能用一个代替另一个。',
      transfer: '在窗边用同一个水果观察阴影。加入扩散材料或调整主体与光源关系后，再比较边缘；不要同时更换主体与背景。'
    },
    {
      id: 'frame-purpose', lessonId: 'composition', taskId: 'composition-walk', assetId: 'landscape', label: '用画面表达意图',
      look: '沿着湖面、山体与天空看一遍，找出最吸引你的部分，再观察画面边缘。',
      question: '如果这张风景让你想保留环境的开阔感，下一步怎样判断构图更合理？',
      options: ['任何照片都应把主体放在三分交点，居中就算错误。', '只要把所有山峰放进照片，画面一定更好。', '先决定想突出什么，再检查留白、地平线和边缘元素是否支持它。'],
      answer: 2,
      evidence: '这张照片同时包含湖面、山体和天空。它们的面积分配与相互关系会影响开阔感。三分法是一个观察工具，不能替代对主体与画面意图的判断。',
      transfer: '同一机位拍一张多留天空、一张多留前景。比较哪一张更接近你要表达的感受，而不是只检查主体有没有对上线。'
    },
    {
      id: 'white-balance-evidence', lessonId: 'whitebalance', taskId: 'color-story', assetId: 'light', label: '知道什么时候证据不足',
      look: '观察水果与背景的颜色，思考你是否知道这些物体在现场的真实颜色。',
      question: '能否仅凭这张水果照片，准确推断拍摄时应设置多少 K 的白平衡？',
      options: ['不能；没有已知中性参照或现场信息，不能可靠反推准确 K 值。', '能；画面里只要有黄色水果，就一定要用低 K 值。', '能；亮度最高的区域一定是纯白色参照。'],
      answer: 0,
      evidence: '照片里的颜色还受物体本色、现场光、相机处理与显示影响。“看起来偏暖”可以作为观察，但不能直接还原现场的精确色温。高光也未必是已知中性的物体。',
      transfer: '需要准确还原时，在同一光线下加入可信的中性灰卡；混合光源还需分别考虑。为了表达情绪而保留冷暖偏色，也是有意识的选择。'
    },
    {
      id: 'portrait-attention', lessonId: 'portrait', taskId: 'window-portrait', assetId: 'portrait', label: '人像的视觉主次',
      look: '先看眼睛和脸部的明暗，再找人物两侧的白色窗框与绿色背景。',
      question: '如果你希望视线更集中在脸部，下一次现场拍摄最值得先比较什么？',
      options: ['把饱和度加到最大，所有颜色越鲜艳越能突出脸。', '微调机位，比较明亮窗框与头部的关系，同时确认眼睛和表情。', '只要背景虚化了，就无需再看亮度和画面边缘。'],
      answer: 1,
      evidence: '绿色背景虽已虚化，人物两侧仍有明亮的竖向窗框；脸部也保留了明显的明暗变化。虚化、亮度与几何线条会一起影响观看顺序，不能只检查背景是否模糊。',
      transfer: '请配合的模特保持姿态，左右移动机位各拍一张。比较头部周围的亮线与表情，不把作者现有的构图直接判为错误；按自己的表达意图选择。'
    },
    {
      id: 'backlight-evidence', lessonId: 'metering-histogram', taskId: 'portrait-outdoor', assetId: 'portraitBacklight', label: '逆光里的证据边界',
      look: '观察发丝与手臂边缘、左上方高亮区域和画面中的红绿光斑。',
      question: '这张背向观者的人像，能支持哪一项判断？',
      options: ['人物正面的眼睛一定已经准确对焦。', '只要有光斑，就能证明相机传感器故障。', '可观察到轮廓亮边和眩光，但不能据此确认不可见的正脸曝光与对焦。'],
      answer: 2,
      evidence: '发丝、手臂边缘有亮线，左上区域强亮，画面可见红绿色眩光；人物背向我们，正面眼睛没有展示。看到轮廓光，并不能证明脸部一定保留了需要的细节。',
      transfer: '自己拍摄逆光正面人像时，同时检查脸部和重要亮部。先微调角度比较眩光，再决定是否调整曝光或借环境反射补光；不要把参考照片的未知参数当作配方。'
    },
    {
      id: 'group-distance-evidence', lessonId: 'sharpness-diagnosis', taskId: 'group-portrait', assetId: 'portraitGroup', label: '多人清晰范围',
      look: '比较近处两个人与后方两个人的面部清晰程度，再看他们沿海岸的前后位置。',
      question: '如果你的下一张要让四个人都清楚，最合理的起点是什么？',
      options: ['先让人物距离更接近，再适当收光圈并逐人检查，同时守住动作所需的快门。', '保持站位，只加大锐化就能让后排重新清楚。', '始终用最大光圈，合焦在最近的眼睛就足够。'],
      answer: 0,
      evidence: '四个人前后错开，近处的人脸与后方人脸的清晰程度不同。原片可以用这种差异表达主次；只有当你的目标变成全员清楚时，才需要重新安排距离和清晰范围。',
      transfer: '先拍原站位，再让大家尽量靠近同一距离平面拍一张，最后比较收光圈后的效果。每次记录快门，排除行走造成的拖影，不凭图片猜唯一光圈值。'
    },
    {
      id: 'street-edge-timing', lessonId: 'street', taskId: 'street-day', assetId: 'street', label: '街头的边缘与时机',
      look: '看摊车周围的人物关系，再观察右边缘的行人和背景招牌。',
      question: '想把主题集中在摊车周围的关系，下一张最值得尝试什么？',
      options: ['直接断言右边缘行人的身份和故事，再写进照片说明。', '保持安全站位，等待前景行人的位置变化，比较轮廓、间隙与画面边缘。', '无论主题是什么，都先把所有背景裁掉。'],
      answer: 1,
      evidence: '摊车旁有多位穿鲜明颜色衣服的人，右侧还有靠近画面边缘的行人。不同人物的位置和轮廓是否重叠，会影响我们把谁看作主角；照片没有提供足够信息来断言他们的关系或对话。',
      transfer: '在一个不妨碍他人的位置观察一分钟，固定一种取景范围，等待人物进入或离开某个空隙。比较三张不同瞬间，说明哪一种空间关系最支持主题。'
    },
    {
      id: 'night-subject-motion', lessonId: 'sharpness-diagnosis', taskId: 'street-night', assetId: 'streetNight', label: '夜街中谁在移动',
      look: '比较中央前景骑车人的轮廓与左侧建筑窗框，再看灯光和偏冷的天空。',
      question: '如果下一张需要让骑车人更清楚，首先应该验证哪一项？',
      options: ['仅把所有灯光调成白色，运动边缘就会变清晰。', '架好三脚架后仍保持同样的曝光时间，人物就一定清楚。', '尝试缩短曝光时间并重新检查亮度、对焦，用静止背景区分主体移动与持机问题。'],
      answer: 2,
      evidence: '前景骑车人的轮廓有明显拖动，建筑窗框仍相对可辨。这能引导我们先检查主体运动，但不能仅凭这一张图排除所有持机与对焦因素，也不能反推出准确快门。',
      transfer: '安全位置上先确定需要的动作表现。缩短曝光时间后，可按相机模式让 ISO 或光圈补偿；检查主体边缘和重要灯光。想表达流动时，也可有意保留拖影。'
    },
    {
      id: 'portrait-edit-restraint', lessonId: 'editing-portrait', taskId: 'edit-series', assetId: 'portrait', label: '后期先决定改什么',
      look: '观察脸上保留的阴影、黑色衣服的褶皱和窗框的亮部，想想你希望观看者先看到哪里。',
      question: '要让脸部更容易看清，同时保留原有体积，怎样开始后期更合理？',
      options: ['保留原片，先明确脸部的调整目标；适度试调并前后比较，同时检查亮部和肤色。', '先把所有阴影拉到最亮，因为阴影越少越专业。', '只要显示器上变亮，就能证明 RAW 中所有细节已恢复。'],
      answer: 0,
      evidence: '脸部有亮暗过渡，衣服仍可见褶皱，窗框已经很亮。把整张一味提亮，会同时影响这些区域；是否需要处理、处理多少，应取决于你希望保留的表情、光感和重点。',
      transfer: '在支持的软件里保留原始文件和编辑记录，比较温和的整体调整与局部调整。放大检查肤质，缩小检查主次；网页 JPEG 演示不能证明这张参考图具有多少 RAW 恢复余量。'
    }
  ];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  let host = null, aborter = null, onResult = null, results = {}, order = [], cursor = 0, selected = null, checked = false;

  function mount(container, options = {}) {
    destroy();
    host = container;
    onResult = typeof options.onResult === 'function' ? options.onResult : () => {};
    results = {};
    for (const question of questions) {
      if (typeof options.results?.[question.id] === 'boolean') results[question.id] = options.results[question.id];
    }
    // Retry the most recent errors before unanswered and already-correct items.
    const priority = question => results[question.id] === false ? 0 : results[question.id] === undefined ? 1 : 2;
    order = questions.slice().sort((a, b) => priority(a) - priority(b));
    cursor = 0; selected = null; checked = false;
    aborter = new AbortController();
    host.addEventListener('click', handleClick, { signal: aborter.signal });
    render();
  }

  function destroy() {
    aborter?.abort();
    host = null; aborter = null; onResult = null;
  }

  function getAsset(question) {
    const media = root.PHOTO_MEDIA;
    // A question's evidence is tied to its explicit photograph. Falling back to
    // a course illustration would let a different image receive the same score.
    if (question.assetId) return media?.assets?.[question.assetId];
    return media?.assets?.[media.lessonImages?.[question.lessonId]];
  }

  function render() {
    const q = order[cursor], asset = getAsset(q);
    const correctCount = questions.filter(x => results[x.id] === true).length;
    const errors = questions.filter(x => results[x.id] === false).length;
    host.innerHTML = `<section class="vp-root" aria-label="看图判断训练">
      <div class="vp-summary"><div><strong>${correctCount}<span> / ${questions.length}</span></strong><p>最近一次答对</p></div><div><strong>${errors}</strong><p>仍需再练</p></div><p class="vp-summary-note">先观察，再选答案。答错时找出画面证据，比记住选项更重要。<br>这里只记录最近结果；答对一题并不代表已经掌握实拍。</p></div>
      <nav class="vp-question-nav" aria-label="选择训练题目">${order.map((item, index) => `<button type="button" data-vp-jump="${index}" class="vp-question ${index === cursor ? 'is-current' : ''}" ${index === cursor ? 'aria-current="step"' : ''}><span>${String(index + 1).padStart(2, '0')}</span>${escape(item.label)}<small>${results[item.id] === true ? '✓ 最近答对' : results[item.id] === false ? '↻ 还需练习' : '待观察'}</small></button>`).join('')}</nav>
      <div class="vp-workspace">
        <div class="vp-evidence"><figure>${asset ? `<a class="vp-full-image" href="${escape(asset.src)}" target="_blank" rel="noopener" aria-label="在新标签页查看完整照片"><img src="${escape(asset.src)}" alt="${escape(asset.alt)}" loading="eager" decoding="async"></a><figcaption><strong>照片观察 · 来源见下</strong><span>${escape(asset.title)}</span><span>摄影 / ${escape(asset.author)} · <a href="${escape(asset.source)}" target="_blank" rel="noopener noreferrer">来源</a> · <a href="${escape(asset.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(asset.license)}</a></span></figcaption>` : '<div class="vp-missing"><p>这道题的照片尚未加载。</p><p>请确认项目 assets 文件夹与 media.js 完整，再开始判断。</p></div>'}</figure><div class="vp-observe"><span>① 先看哪里</span><p>${escape(q.look)}</p></div>${asset?.note ? `<p class="vp-media-note">素材说明：${escape(asset.note)}</p>` : ''}</div>
        <section class="vp-decision" aria-labelledby="vp-question-title"><div class="vp-kicker">② 先做判断 / ${cursor + 1} · ${questions.length}</div><h2 id="vp-question-title" tabindex="-1">${escape(q.question)}</h2><p class="vp-predict">先在心里说出理由，再选择。照片能证明什么，也要与照片不能证明的事情分开。</p><div class="vp-options" role="group" aria-label="选择你的判断">${q.options.map((text, i) => `<button type="button" class="vp-option ${selected === i ? 'is-selected' : ''} ${checked && i === q.answer ? 'is-correct' : ''} ${checked && selected === i && i !== q.answer ? 'is-wrong' : ''}" data-vp-answer="${i}" aria-pressed="${selected === i}" ${checked || !asset ? 'disabled' : ''}><span>${String.fromCharCode(65 + i)}</span>${escape(text)}${checked && i === q.answer ? '<b>正确判断</b>' : ''}</button>`).join('')}</div>${!checked ? `<button type="button" class="vp-check" data-vp-action="check" ${selected === null || !asset ? 'disabled' : ''}>验证我的判断 →</button><p class="vp-status">${selected === null ? '选择后再查看解释，不急着揭晓。' : '已经选择，试着再说一句“因为我看到了……”'}</p>` : `<div class="vp-feedback ${selected === q.answer ? 'is-good' : 'needs-work'}" role="status"><strong>${selected === q.answer ? '✓ 判断正确，接着核对证据。' : '↻ 再观察一下，问题出在判断依据。'}</strong><h3>③ 回到照片找证据</h3><p>${escape(q.evidence)}</p><h3>下次拍摄怎么用</h3><p>${escape(q.transfer)}</p><div class="vp-related"><a href="#lesson/${q.lessonId}">回到相关课程，补齐原理 ↗</a><a href="#practice/${q.taskId}">把判断带到实拍，记录一次对照 →</a></div></div><div class="vp-actions"><button type="button" data-vp-action="retry">重新判断这题</button><button type="button" data-vp-action="next">${cursor === order.length - 1 ? '查看这一轮总结' : '下一题'} →</button></div>`}</section>
      </div></section>`;
  }

  function handleClick(event) {
    const jump = event.target.closest('[data-vp-jump]');
    if (jump) { cursor = Number(jump.dataset.vpJump); selected = null; checked = false; render(); focusQuestion(); return; }
    const choice = event.target.closest('[data-vp-answer]');
    if (choice && !checked) {
      selected = Number(choice.dataset.vpAnswer);
      render();
      host.querySelector(`[data-vp-answer="${selected}"]`)?.focus({ preventScroll: true });
      return;
    }
    const action = event.target.closest('[data-vp-action]')?.dataset.vpAction;
    if (action === 'check' && selected !== null && !checked) {
      const q = order[cursor];
      if (!getAsset(q)) return;
      checked = true;
      const correct = selected === q.answer;
      results[q.id] = correct;
      onResult({ id: q.id, correct, lessonId: q.lessonId });
      render();
      host.querySelector('.vp-feedback')?.scrollIntoView({ block: 'nearest' });
    } else if (action === 'retry') {
      selected = null; checked = false; render(); focusQuestion();
    } else if (action === 'next') {
      if (cursor === order.length - 1) renderSummary();
      else { cursor++; selected = null; checked = false; render(); focusQuestion(); }
    } else if (action === 'restart') {
      const callback = onResult, recorded = { ...results }, container = host;
      mount(container, { onResult: callback, results: recorded });
      focusQuestion();
    }
  }

  function focusQuestion() {
    host.querySelector('#vp-question-title')?.focus({ preventScroll: true });
    host.querySelector('.vp-workspace')?.scrollIntoView({ block: 'start' });
  }

  function renderSummary() {
    const correct = questions.filter(q => results[q.id] === true).length;
    const wrong = questions.filter(q => results[q.id] === false);
    const unanswered = questions.filter(q => results[q.id] === undefined).length;
    host.innerHTML = `<section class="vp-root vp-finish"><span class="vp-kicker">把判断，带到下一次拍摄</span><h2>${correct} / ${questions.length} 道题最近答对</h2><p>${wrong.length ? `还有 ${wrong.length} 道题值得再观察一次。` : '再把这些判断用到自己的照片里。'}${unanswered ? `另有 ${unanswered} 道尚未作答。` : ''} 这里汇总的是保存的最近结果，不是本轮考试分数。</p>${wrong.length ? `<div class="vp-revisit"><h3>建议回到这些知识</h3>${wrong.map(q => `<a href="#lesson/${q.lessonId}">${escape(q.label)} <span>打开课程 ↗</span></a>`).join('')}</div>` : ''}<div class="vp-actions"><button type="button" data-vp-action="restart">${wrong.length ? '先练错题，再练其他' : '再做一轮'}</button><a href="#practice">去完成一次实拍 →</a></div><p class="vp-summary-note">下一轮会把最近答错的题放在前面。最好隔一段时间再做，避免只记住答案的位置。</p></section>`;
  }

  for (const question of questions) {
    Object.freeze(question.options);
    Object.freeze(question);
  }
  const api = Object.freeze({ mount, destroy, questions: Object.freeze(questions) });
  root.PhotoPractice = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
