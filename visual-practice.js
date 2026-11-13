/* Observe real photos, make a decision, then inspect the evidence. */
(function (root) {
  'use strict';
  const questions = [
    {
      id: 'depth-evidence', lessonId: 'aperture', assetId: 'bokeh', label: '读懂景深',
      look: '比较上下两张图：先看红色订书机，再看它后方的计算器与桌面物品。',
      question: '哪一条观察最能说明上图的清晰范围更浅？',
      options: ['上图颜色更少，所以景深更浅。', '上图的订书机清楚，但后方办公物品明显模糊。', '上图只要有一个模糊物体，就一定是相机抖动。'],
      answer: 1,
      evidence: '上图订书机比后方办公物品更清楚，背景难以辨认；下图计算器、纸张等背景细节更可辨。观察“哪些距离清楚”，比只看某一处锐不锐更有用。',
      transfer: '下次拍杯子时固定机位、焦距与对焦距离，比较不同光圈下背景文字的清晰程度。这组实拍的机位存在小幅差异，用于理解趋势，不把它当作精确的镜头标定。'
    },
    {
      id: 'group-focus', lessonId: 'focus', assetId: 'bokeh', label: '把观察迁移到拍摄',
      look: '先找到红色订书机，再比较上下两图中它后方的办公物品能否看清。',
      question: '如果要拍前后错开的两个人，目标是两张脸都清楚，下面哪种做法更稳妥？',
      options: ['直接用最大光圈，只检查离自己最近的一只眼睛。', '只提高 ISO，就能把对焦范围自动变深。', '尽量让两张脸处在相近距离，适当收小光圈，再放大回看两张脸。'],
      answer: 2,
      evidence: '上图的红色订书机比后方办公物品更清楚；下图背景中的计算器、纸张等更容易辨认。浅景深能突出主体，也需要更留意清晰范围：不同距离的两张脸不一定都能拍清。',
      transfer: '把人物尽量安排在相近的对焦距离；光圈收小后若快门变慢，重新检查动作是否拍清。对焦、景深和快门要一起检查。'
    },
    {
      id: 'water-motion', lessonId: 'shutter', assetId: 'waterfallSlow', label: '看懂时间的痕迹',
      look: '观察水流的纹理，再看旁边固定岩石的边缘。',
      question: '想把流动的水拍出更多清晰瞬间，而不是连续的流动痕迹，首先该尝试什么？',
      options: ['缩短曝光时间，并重新检查亮度。', '延长曝光时间，让相机记录更多位移。', '只换成更暖的白平衡。'],
      answer: 0,
      evidence: '水在曝光期间持续移动，因此可能在照片中留下连续纹理。固定岩石与流动水可以分开观察：稳定相机能减少机身晃动，但不会让水停止运动。',
      transfer: '固定机位尝试几种快门，检查水纹变化。不同地点、水速和构图的照片不能当作只改变快门的严格对照。'
    },
    {
      id: 'light-edge', lessonId: 'light', assetId: 'light', label: '看阴影，不猜器材',
      look: '在两张水果照片里找同一处投影，比较阴影与亮面之间的过渡。',
      question: '判断光线更柔还是更硬，哪一种观察最有帮助？',
      options: ['看照片里水果的数量。', '看阴影边缘的过渡是否更宽、更渐变。', '只要整体更亮，就一定是更柔的光。'],
      answer: 1,
      evidence: '上图水果投影的边缘过渡更柔和；下图苹果左下方与李子前方有更明显的黑色硬边。柔光与硬光可从这些边缘区分。亮不亮与光的软硬是不同问题，不能用一个代替另一个。',
      transfer: '在窗边用同一个水果观察阴影。加入扩散材料或调整主体与光源关系后，再比较边缘；不要同时更换主体与背景。'
    },
    {
      id: 'frame-purpose', lessonId: 'composition', assetId: 'landscape', label: '用画面表达意图',
      look: '沿着湖面、山体与天空看一遍，找出最吸引你的部分，再观察画面边缘。',
      question: '如果这张风景让你想保留环境的开阔感，下一步怎样判断构图更合理？',
      options: ['任何照片都应把主体放在三分交点，居中就算错误。', '只要把所有山峰放进照片，画面一定更好。', '先决定想突出什么，再检查留白、地平线和边缘元素是否支持它。'],
      answer: 2,
      evidence: '这张照片同时包含湖面、山体和天空。它们的面积分配与相互关系会影响开阔感。三分法是一个观察工具，不能替代对主体与画面意图的判断。',
      transfer: '同一机位拍一张多留天空、一张多留前景。比较哪一张更接近你要表达的感受，而不是只检查主体有没有对上线。'
    },
    {
      id: 'white-balance-evidence', lessonId: 'whitebalance', assetId: 'light', label: '知道什么时候证据不足',
      look: '观察水果与背景的颜色，思考你是否知道这些物体在现场的真实颜色。',
      question: '能否仅凭这张水果照片，准确推断拍摄时应设置多少 K 的白平衡？',
      options: ['不能；没有已知中性参照或现场信息，不能可靠反推准确 K 值。', '能；画面里只要有黄色水果，就一定要用低 K 值。', '能；亮度最高的区域一定是纯白色参照。'],
      answer: 0,
      evidence: '照片里的颜色还受物体本色、现场光、相机处理与显示影响。“看起来偏暖”可以作为观察，但不能直接还原现场的精确色温。高光也未必是已知中性的物体。',
      transfer: '需要准确还原时，在同一光线下加入可信的中性灰卡；混合光源还需分别考虑。为了表达情绪而保留冷暖偏色，也是有意识的选择。'
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
    return media?.assets?.[question.assetId] || media?.assets?.[media.lessonImages?.[question.lessonId]];
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
        <section class="vp-decision" aria-labelledby="vp-question-title"><div class="vp-kicker">② 先做判断 / ${cursor + 1} · ${questions.length}</div><h2 id="vp-question-title" tabindex="-1">${escape(q.question)}</h2><p class="vp-predict">先在心里说出理由，再选择。照片能证明什么，也要与照片不能证明的事情分开。</p><div class="vp-options" role="group" aria-label="选择你的判断">${q.options.map((text, i) => `<button type="button" class="vp-option ${selected === i ? 'is-selected' : ''} ${checked && i === q.answer ? 'is-correct' : ''} ${checked && selected === i && i !== q.answer ? 'is-wrong' : ''}" data-vp-answer="${i}" aria-pressed="${selected === i}" ${checked || !asset ? 'disabled' : ''}><span>${String.fromCharCode(65 + i)}</span>${escape(text)}${checked && i === q.answer ? '<b>正确判断</b>' : ''}</button>`).join('')}</div>${!checked ? `<button type="button" class="vp-check" data-vp-action="check" ${selected === null || !asset ? 'disabled' : ''}>验证我的判断 →</button><p class="vp-status">${selected === null ? '选择后再查看解释，不急着揭晓。' : '已经选择，试着再说一句“因为我看到了……”'}</p>` : `<div class="vp-feedback ${selected === q.answer ? 'is-good' : 'needs-work'}" role="status"><strong>${selected === q.answer ? '✓ 判断正确，接着核对证据。' : '↻ 再观察一下，问题出在判断依据。'}</strong><h3>③ 回到照片找证据</h3><p>${escape(q.evidence)}</p><h3>下次拍摄怎么用</h3><p>${escape(q.transfer)}</p><a href="#lesson/${q.lessonId}">回到相关课程，补齐原理 ↗</a></div><div class="vp-actions"><button type="button" data-vp-action="retry">重新判断这题</button><button type="button" data-vp-action="next">${cursor === order.length - 1 ? '查看这一轮总结' : '下一题'} →</button></div>`}</section>
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

  const api = Object.freeze({ mount, destroy, questions: questions.map(({ id, lessonId, assetId }) => Object.freeze({ id, lessonId, assetId })) });
  root.PhotoPractice = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
