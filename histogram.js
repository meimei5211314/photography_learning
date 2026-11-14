/* Original synthetic histograms: reason from intent and evidence, then verify by shooting. */
(function (root) {
  'use strict';

  const sources = [
    { title: '佳能：亮度与 RGB 柱状图', url: 'https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0270.html' },
    { title: '佳能：显示高光警告', url: 'https://cam.start.canon/zh/C022/manual/html/UG-06_Playback_0280.html' }
  ];

  const scenarios = [
    {
      id: 'low-key', title: '低调：深色背景中的黑杯',
      summary: '像素集中在暗部，是否就该增加曝光？',
      intent: '你想拍出安静的暗调：黑色杯子放在深色桌布上，杯沿和杯身细纹是必须保留的细节。',
      observations: ['现场本来就有大面积深色物体。', '放大回放后，杯沿和需要保留的杯身细纹仍可分辨；暗背景不要求处处都有纹理。'],
      bins: [0, 6, 18, 36, 62, 84, 100, 96, 83, 65, 45, 31, 23, 18, 14, 11, 8, 6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      description: '多数像素集中在左侧的较暗区域，向中间逐渐减少，最左端没有明显堆积，右侧几乎没有像素。',
      question: '结合意图和回放证据，下一步最合理的是？',
      options: [
        { text: '一直增加曝光，直到最高的峰移到图表正中间。', feedback: '峰在中间不是通用标准。深色物体占多数，直方图偏左可以符合现场与表达；强行居中可能破坏暗调。' },
        { text: '保留暗调，继续检查重要细节；需要时拍一张稍亮的对照再决定。', feedback: '你同时考虑了意图与重要区域。既然杯子细节可辨，偏左本身不足以判定曝光失败。' },
        { text: '只要峰没有碰到最左端，所有暗部细节和噪点就都不用检查。', feedback: '图表只概括分布，不能保证某个局部的细节、噪点或最终输出效果；仍要放大看杯子。' }
      ],
      answer: 1,
      explanation: '低调画面可以有大量暗像素。判断的目标是保留你需要的杯子细节和暗调，而不是把每张照片的分布移到中央。若对照图更亮，也要比较它是否破坏了原来的表达。',
      takeaway: '偏左描述明暗分布，不自动等于欠曝。',
      steps: ['用深色物体和深色背景搭一个静物场景，先写下必须看见的两处细节。', '固定机位与光线，拍基准图和增加约一档曝光的对照；记录实际改变的参数。', '以相同显示条件比较重要细节、暗部噪点与整体暗调，说明你选择哪一张及原因。'],
      lessonId: 'metering-histogram', taskId: 'metering-bracket'
    },
    {
      id: 'high-key', title: '高调：白纸上的白花瓶',
      summary: '像素集中在亮部，是否就已经过曝？',
      intent: '你想让白花瓶和白纸呈现明亮轻盈的感觉，同时保留瓶口边缘、瓶身弧度和纸面纹理。',
      observations: ['白色物体和浅色背景占据了画面的大部分。', '放大回放仍能看到瓶身明暗变化和纸面纹理，重要区域没有变成一片没有层次的白色。'],
      bins: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 6, 8, 11, 14, 18, 23, 31, 45, 65, 83, 96, 100, 84, 62, 36, 18, 6, 2, 0],
      description: '多数像素集中在右侧的较亮区域，峰值没有贴住最右端；中间与左侧像素较少。',
      question: '为了保持这个拍摄意图，你会怎样判断？',
      options: [
        { text: '只要偏右就减少曝光，直到白纸看起来像中灰色。', feedback: '白纸占多数时，分布偏右有合理原因。把直方图拉回中间并不是保留白色明亮感觉的必要条件。' },
        { text: '把亮部推到最右端，让所有白色都没有纹理才算高调。', feedback: '高调不要求抹掉层次。本题明确要保留瓶身与纸面细节，不能把无纹理的纯白当作唯一目标。' },
        { text: '保留明亮效果，并结合高光提示和放大回放确认重要纹理。', feedback: '高调可以偏右。你检查了真正需要保留的区域，而没有只凭峰的位置下结论。' }
      ],
      answer: 2,
      explanation: '亮物体占多数时，偏右的分布可以符合场景。关键是重要区域是否仍有需要的层次。即使亮度图看起来正常，强烈的彩色物体也值得再查看 RGB 各通道。',
      takeaway: '高调与重要高光丢失要分开判断。',
      steps: ['用白色物体和浅色背景布置一个场景，指定两处需要保留的边缘或纹理。', '拍基准图与减少约一档曝光的对照，查看亮度图、高光提示和相同区域的放大回放。', '比较明亮感和纹理是否同时成立；不要因为其中一张分布更居中就自动选它。'],
      lessonId: 'metering-histogram', taskId: 'metering-bracket'
    },
    {
      id: 'highlight-clipping', title: '重要高光：白衣失去纹理',
      summary: '右端堆积与重要区域无层次同时出现，先验证什么？',
      intent: '你在阳光下拍一件有刺绣的白衣，需要让刺绣图案和布料褶皱清楚可辨。',
      observations: ['高光警告覆盖了需要保留的刺绣，放大回放时这片区域看不见纹理。', '图中的右端明显堆积；这是回放与图表共同提供的线索，还没有测试减少曝光后的结果。'],
      bins: [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 12, 14, 17, 20, 22, 25, 27, 28, 29, 27, 23, 19, 16, 14, 14, 16, 20, 28, 45, 100],
      description: '中间到亮部都有像素，最右端突然出现高柱，表示大量示意像素落在显示的最亮一级。',
      question: '哪种处理最有助于确认并保留白衣细节？',
      options: [
        { text: '减少曝光拍一张对照，重新检查刺绣与主体暗部，再决定取舍。', feedback: '这能验证重要亮部是否改善，同时让你看见减少曝光对暗部的代价。自动曝光可用负补偿；固定 ISO 的 M 模式需直接改实际曝光参数。' },
        { text: '已经拍了 RAW，所以这片白衣一定可以在后期完全恢复。', feedback: 'RAW 不能保证恢复已经丢失的细节。回放提示也不能精确告诉你 RAW 还有多少恢复余量，先用重拍验证更可靠。' },
        { text: '不断降低曝光，直到太阳、灯芯和所有反光点都没有任何警告。', feedback: '不是每个小亮点都需要纹理。本题要优先保护白衣刺绣；为了消除无关亮点而牺牲主体，可能违背拍摄目标。' }
      ],
      answer: 0,
      explanation: '只有图表右端堆积，还不能指出是哪一块画面出了问题。本题同时给出了刺绣无纹理与对应高光提示，因此值得减少曝光做对照。如果保住白衣后主体太暗，还需调整光线或位置。',
      takeaway: '把右端堆积定位到重要区域，再用重拍检验。',
      steps: ['选择带纹理的浅色物体，先指出必须保留的纹理；不要用无纹理的灯芯做判断标准。', '保持构图与光线，逐步减少曝光拍对照，记录实际参数；每次都放大检查同一块亮部。', '同时查看主体暗部，记录哪次曝光保住了重要细节，以及它带来的亮暗取舍。'],
      lessonId: 'metering-histogram', taskId: 'metering-bracket'
    },
    {
      id: 'high-contrast', title: '大反差：窗外与室内的取舍',
      summary: '两次试拍都顾此失彼，下一步还只改曝光吗？',
      intent: '你希望同一张照片中，窗外亮处的云层和室内人物的脸都能看清，并且不把人拍成剪影。',
      observations: ['已经试拍：保住窗外云层的一张，人物暗到不符合你的用途；按人脸调整的一张，重要云层失去层次。', '在你当前的单张拍摄与可接受处理范围内，两者仍难兼顾；下图只概括这种亮暗差异，结论还依赖上述试拍证据。'],
      bins: [90, 65, 35, 20, 12, 8, 5, 4, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 8, 12, 20, 35, 55, 75, 100],
      description: '较多像素分布在两端，最暗与最亮端都有明显高柱，中间亮度像素很少。仅凭两端高峰，不能确认场景是否超出可接受的记录范围。',
      question: '根据已经完成的试拍，哪一步最值得尝试？',
      options: [
        { text: '只把整体曝光再提高，云层和暗部就一定能同时改善。', feedback: '整体调整会改变两边的取舍。试拍已经显示提高曝光会损失云层，不能保证同时满足两个目标。' },
        { text: '让人物靠近窗光、适当补光或改变拍摄时间，再验证；无法兼顾时明确优先对象。', feedback: '改变照明或位置可以减小主体与背景的亮度差。若条件不允许，就重新决定取舍；本题不把未经验证的处理能力当作保证。' },
        { text: '只要直方图有两个峰，就直接认定相机的动态范围不够。', feedback: '双峰也可能来自本来就由深浅两类物体组成的正常场景。这里的取舍判断还依赖重要区域和两次试拍，不能只看图形。' }
      ],
      answer: 1,
      explanation: '当试拍已显示单张难以满足用途时，调整光线、位置或时间比反复推整体曝光更有针对性。两端分布只是线索，不是单凭一张图就能测出动态范围的工具。若你主动选择剪影，判断标准也会随意图改变。',
      takeaway: '分布提示差异，试拍验证取舍；需要时改变现场。',
      steps: ['在窗边安排一个静止主体，先定义窗外和主体各自需要保留的细节。', '分别按亮部与主体试拍并回放比较；只有实际不能满足用途，才记录“当前条件难兼顾”。', '让主体更靠近窗光或调整拍摄方向，保持其他条件尽量一致再拍；记录亮暗差与重要细节是否改善。'],
      lessonId: 'metering-histogram', taskId: 'metering-bracket'
    }
  ];

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  let host = null;
  let aborter = null;
  let current = null;
  let selected = null;
  let answered = false;

  function mount(container, id) {
    destroy();
    host = container;
    current = scenarios.find(scenario => scenario.id === id) || null;
    aborter = new AbortController();
    host.addEventListener('change', onChange, { signal: aborter.signal });
    host.addEventListener('submit', onSubmit, { signal: aborter.signal });
    host.addEventListener('click', onClick, { signal: aborter.signal });
    if (current) renderDetail();
    else renderList(Boolean(id));
  }

  function destroy() {
    aborter?.abort();
    host = null;
    aborter = null;
    current = null;
    selected = null;
    answered = false;
  }

  function bars(scenario, width, height) {
    const peak = Math.max(...scenario.bins);
    const step = width / scenario.bins.length;
    return scenario.bins.map((count, index) => {
      const barHeight = count / peak * height;
      return `<rect x="${(index * step).toFixed(2)}" y="${(height - barHeight).toFixed(2)}" width="${(step - 1).toFixed(2)}" height="${barHeight.toFixed(2)}" />`;
    }).join('');
  }

  function chart(scenario, miniature = false) {
    if (miniature) {
      return `<svg class="hg-mini-chart" viewBox="0 0 320 96" aria-hidden="true"><g transform="translate(0 5)">${bars(scenario, 320, 86)}</g><path class="hg-axis" d="M0 92H320" /></svg>`;
    }
    return `<figure class="hg-chart">
      <p class="hg-axis-label">纵轴：相对像素数量（示意）</p>
      <svg viewBox="0 0 640 248" role="img" aria-labelledby="hg-chart-title hg-chart-description">
        <title id="hg-chart-title">${escape(scenario.title)}的合成亮度分布</title>
        <desc id="hg-chart-description">${escape(scenario.description)}横轴从左到右由暗到亮，纵轴越高代表该亮度区间的相对像素越多。</desc>
        <defs><linearGradient id="hg-tone-scale"><stop offset="0" stop-color="#101412"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
        <path class="hg-gridline" d="M26 58H622M26 110H622M26 162H622"/>
        <g transform="translate(27 14)">${bars(scenario, 594, 200)}</g>
        <path class="hg-axis" d="M26 10V215H622"/>
        <rect x="26" y="226" width="596" height="16" rx="2" fill="url(#hg-tone-scale)" stroke="#b8c3b4"/>
      </svg>
      <div class="hg-axis-ends" aria-hidden="true"><span>较暗</span><span>横轴：亮度 →</span><span>较亮</span></div>
      <figcaption><strong>读图描述：</strong>${escape(scenario.description)}</figcaption>
      <p class="hg-chart-note">原创合成示意，不来自照片或 RAW 数据。每图按自己的最高柱缩放，不用于比较照片像素总数、精确曝光量或可恢复档数。</p>
    </figure>`;
  }

  function sourceLinks() {
    return sources.map(source => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${escape(source.title)} ↗</a>`).join('');
  }

  function renderList(notFound) {
    host.innerHTML = `<section class="hg-root">
      <header class="hg-heading"><span class="eyebrow">OBSERVE · PREDICT · VERIFY</span><h1>直方图读图练习</h1><p>先看拍摄意图，再看重要区域，最后结合分布作判断。四个情境帮助你把“偏左、偏右”变成可验证的下一步。</p></header>
      ${notFound ? '<p class="hg-notice" role="status">没有找到这个直方图情境，请从下面重新选择。</p>' : ''}
      <aside class="hg-intro"><h2>先认识两条轴</h2><p>横轴从左到右由暗到亮；纵轴越高，落在该亮度区间的像素越多。峰的位置不代表物体在照片中的位置，峰更高也不等于那里的物体更亮。</p><p>以下图表均为原创合成示意，不来自照片或 RAW 数据。图表本身不能定位脸、云层或衣服，也不提供精确的后期恢复余量。</p></aside>
      <div class="hg-scenario-grid">${scenarios.map((scenario, index) => `<a class="hg-card" href="#histogram/${scenario.id}"><span class="hg-number">情境 0${index + 1}</span>${chart(scenario, true)}<h2>${escape(scenario.title)}</h2><p>${escape(scenario.summary)}</p><span class="hg-card-action">观察 → 判断 → 对照实拍 <span aria-hidden="true">↗</span></span></a>`).join('')}</div>
      <section class="hg-reference"><h2>亮度图之后，还要看什么？</h2><p>亮度图概括整体明暗，RGB 图分别查看红、绿、蓝通道。遇到强烈的彩色物体时，要检查单个通道是否到达边缘；再用高光提示与放大回放定位重要区域。它们都不能替代你的拍摄意图。</p><div class="hg-links"><a href="#lesson/metering-histogram">阅读：测光、曝光补偿与直方图 ↗</a>${sourceLinks()}</div></section>
      <p class="hg-footnote">情境判断只用于当前练习，不计入课程完成或复习得分。实际拍摄结果可写入对应任务复盘。</p>
    </section>`;
  }

  function renderDetail() {
    const number = scenarios.indexOf(current) + 1;
    host.innerHTML = `<article class="hg-root hg-detail">
      <a class="back-link" href="#histogram">← 返回全部直方图情境</a>
      <header class="hg-heading"><span class="eyebrow">情境 ${number} / ${scenarios.length} · 原创合成示意</span><h1>${escape(current.title)}</h1><p>${escape(current.summary)}</p></header>
      <nav class="hg-scenario-nav" aria-label="选择直方图情境">${scenarios.map((scenario, index) => `<a href="#histogram/${scenario.id}"${scenario === current ? ' aria-current="page"' : ''}>${index + 1}. ${escape(scenario.title.split('：')[0])}</a>`).join('')}</nav>
      <div class="hg-detail-grid">
        <section class="hg-panel hg-evidence"><h2><span>01</span> 先读意图和观察</h2><p class="hg-intent">${escape(current.intent)}</p><ul>${current.observations.map(text => `<li>${escape(text)}</li>`).join('')}</ul>${chart(current)}</section>
        <section class="hg-panel hg-decision"><h2><span>02</span> 预测下一步</h2><form data-hg-form novalidate><fieldset id="hg-choices"><legend>${escape(current.question)}</legend><div class="hg-options">${current.options.map((option, index) => `<label class="hg-option"><input type="radio" name="histogram-answer" value="${index}" data-hg-choice="${index}" aria-describedby="hg-answer-status"><span>${escape(option.text)}</span></label>`).join('')}</div></fieldset><p id="hg-answer-status" class="hg-answer-status" role="status" aria-live="polite">先选择一个判断，再查看解释。</p><div class="hg-actions"><button class="primary" type="submit" id="hg-check">验证判断</button><button class="secondary" type="button" data-hg-reset hidden>重新判断</button></div></form><p class="hg-footnote">本题不自动判定真实照片的曝光，也不计算 RAW 恢复空间。选择结合了题目给出的现场证据。</p></section>
      </div>
      <section id="hg-feedback" class="hg-feedback" tabindex="-1" aria-labelledby="hg-feedback-title" hidden></section>
      <section class="hg-reference"><h2>查原理与相机回放</h2><p>亮度图查看整体明暗，RGB 图分别查看三个色彩通道。图表不显示物体在画面中的位置；高光提示帮助你回到重要区域，放大回放与对照拍摄继续验证。</p><div class="hg-links"><a href="#lesson/${current.lessonId}">阅读：测光、曝光补偿与直方图 ↗</a>${sourceLinks()}</div></section>
    </article>`;
  }

  function onChange(event) {
    const input = event.target.closest('[data-hg-choice]');
    if (!input || !current || answered) return;
    const value = Number(input.dataset.hgChoice);
    if (!Number.isInteger(value) || value < 0 || value >= current.options.length) return;
    selected = value;
    host.querySelector('#hg-answer-status').textContent = '已选择。点击“验证判断”查看解释。';
  }

  function onSubmit(event) {
    if (!event.target.closest('[data-hg-form]')) return;
    event.preventDefault();
    if (!current || answered) return;
    if (selected === null) {
      host.querySelector('#hg-answer-status').textContent = '请先选择一个判断，再验证。';
      host.querySelector('[data-hg-choice]').focus();
      return;
    }
    answered = true;
    const correct = selected === current.answer;
    const next = scenarios[scenarios.indexOf(current) + 1];
    const feedback = host.querySelector('#hg-feedback');
    feedback.innerHTML = `<div class="hg-feedback-summary"><span class="hg-result">${correct ? '判断有依据' : '再核对一下证据'}</span><h2 id="hg-feedback-title">${escape(current.takeaway)}</h2><p><strong>你的选择：</strong>${escape(current.options[selected].text)}</p><p>${escape(current.options[selected].feedback)}</p>${correct ? '' : `<p><strong>更有依据的下一步：</strong>${escape(current.options[current.answer].text)}</p>`}<p>${escape(current.explanation)}</p></div>
      <div class="hg-transfer"><h2><span>03</span> 去实拍验证</h2><ol>${current.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p class="hg-record">复盘写三句话：我需要保留什么？我改变了什么？重要区域发生了什么变化？</p><div class="hg-actions"><a class="primary" href="#practice/${current.taskId}">进入实拍记录 →</a>${next ? `<a class="secondary" href="#histogram/${next.id}">下一情境 →</a>` : '<a class="secondary" href="#histogram">返回全部情境</a>'}</div><p class="hg-footnote">本次判断不写入学习进度。把真实拍摄结果写进任务复盘，作为下次比较的依据。</p></div>`;
    feedback.hidden = false;
    host.querySelector('#hg-choices').disabled = true;
    host.querySelector('#hg-check').disabled = true;
    host.querySelector('[data-hg-reset]').hidden = false;
    host.querySelector('#hg-answer-status').textContent = correct ? '判断有依据，解释与实拍步骤已展开。' : '解释与实拍步骤已展开，请核对重要区域的证据。';
    feedback.focus();
  }

  function onClick(event) {
    if (!event.target.closest('[data-hg-reset]') || !current) return;
    selected = null;
    answered = false;
    host.querySelectorAll('[data-hg-choice]').forEach(input => { input.checked = false; });
    host.querySelector('#hg-choices').disabled = false;
    host.querySelector('#hg-check').disabled = false;
    host.querySelector('[data-hg-reset]').hidden = true;
    host.querySelector('#hg-answer-status').textContent = '先选择一个判断，再查看解释。';
    const feedback = host.querySelector('#hg-feedback');
    feedback.hidden = true;
    feedback.innerHTML = '';
    host.querySelector('[data-hg-choice]').focus();
  }

  for (const scenario of scenarios) {
    for (const key of ['bins', 'observations', 'steps']) Object.freeze(scenario[key]);
    scenario.options.forEach(Object.freeze);
    Object.freeze(scenario.options);
    Object.freeze(scenario);
  }
  const api = Object.freeze({ scenarios: Object.freeze(scenarios), mount, destroy });
  root.PhotoHistogram = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
