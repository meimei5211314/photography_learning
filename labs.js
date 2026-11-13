/* Teaching illustrations, not a physical camera or RAW renderer. No external assets. */
(function (root) {
  'use strict';
  const MathModel = {
    // sceneEV is scene brightness expressed as EV100. Positive return = brighter than meter reference.
    exposureEV(aperture, seconds, iso, sceneEV) {
      if (![aperture, seconds, iso, sceneEV].every(Number.isFinite) || aperture <= 0 || seconds <= 0 || iso <= 0) throw new RangeError('Invalid exposure parameters');
      return sceneEV - Math.log2(aperture * aperture / seconds) + Math.log2(iso / 100);
    },
    horizontalFov(focal, sensorWidth = 36) {
      if (!Number.isFinite(focal) || !Number.isFinite(sensorWidth) || focal <= 0 || sensorWidth <= 0) throw new RangeError('Invalid lens parameters');
      return 2 * Math.atan(sensorWidth / (2 * focal)) * 180 / Math.PI;
    }
  };
  root.PhotoMath = MathModel;
  if (typeof module !== 'undefined' && module.exports) module.exports = MathModel;
  if (typeof document === 'undefined') return;

  const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
  const SHUTTERS = [1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4];
  const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];
  const TABS = { exposure: '曝光三要素', composition: '构图取景', focal: '焦距与视角', whitebalance: '白平衡' };
  let host, aborter, frame, lastTime = 0, elapsed = 0, state;
  let bgCanvas, bgContext;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const shutterLabel = (n) => '1/' + Math.round(1 / n) + ' s';
  const defaults = (tab) => ({ tab, aperture: 5, shutter: 4, iso: 0, scene: 13, focal: 35, kelvin: 5500, subjectX: 0.5, subjectY: 0.63, grid: true, paused: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
  const q = (s) => host.querySelector(s);
  const button = (text, attributes = '') => `<button class="lab-button" type="button" ${attributes}>${text}</button>`;

  function mount(container, initialTab = 'exposure') {
    destroy();
    host = container;
    state = defaults(TABS[initialTab] ? initialTab : 'exposure');
    aborter = new AbortController();
    elapsed = 0;
    lastTime = 0;
    bgCanvas = document.createElement('canvas');
    bgCanvas.width = 960; bgCanvas.height = 600;
    bgContext = bgCanvas.getContext('2d');
    render();
    host.addEventListener('click', onClick, { signal: aborter.signal });
    host.addEventListener('input', onInput, { signal: aborter.signal });
    host.addEventListener('keydown', onKey, { signal: aborter.signal });
    host.addEventListener('pointerdown', onPointer, { signal: aborter.signal });
    frame = requestAnimationFrame(tick);
  }

  function destroy() {
    if (aborter) aborter.abort();
    if (frame) cancelAnimationFrame(frame);
    host = null; frame = null; aborter = null;
  }

  function slider(id, name, min, max, value, explanation, endLabels, step = 1) {
    return `<div class="lab-control"><label for="lab-${id}"><span>${name}</span><output id="lab-value-${id}" for="lab-${id}"></output></label><input id="lab-${id}" data-setting="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><div class="lab-range-labels"><span>${endLabels[0]}</span><span>${endLabels[1]}</span></div><p>${explanation}</p></div>`;
  }

  function render() {
    const t = state.tab;
    const headings = {
      exposure: ['一张照片，三种取舍。', '先预测，再拖动滑块。一次只改一个参数，观察画面与曝光表。'],
      composition: ['挪动主体，改变叙事。', '点击画面放置人物，也可以聚焦画面后按方向键微调。'],
      focal: ['站在原地，看得远一点。', '固定机位与传感器，只改变焦距，比较取景范围。'],
      whitebalance: ['让白色，回到白色。', '光源固定为 5500 K 日光。尝试改变相机白平衡，看画面偏色。']
    };
    let controls = '';
    if (t === 'exposure') controls = `
      <div class="lab-scene-control"><label for="lab-scene">场景光线 <span>EV100</span></label><select id="lab-scene" data-setting="scene"><option value="15" ${state.scene === 15 ? 'selected' : ''}>晴朗日光 · 15</option><option value="13" ${state.scene === 13 ? 'selected' : ''}>明亮阴天 · 13</option><option value="10" ${state.scene === 10 ? 'selected' : ''}>室内窗边 · 10</option><option value="6" ${state.scene === 6 ? 'selected' : ''}>傍晚街道 · 6</option></select></div>
      ${slider('aperture', '光圈', 0, 7, state.aperture, 'f 值越小，开口越大；在本场景中背景也更虚。', ['f/1.4 · 大开口', 'f/16 · 小开口'])}
      ${slider('shutter', '快门时间', 0, 9, state.shutter, '时间越长，画面越亮；移动的骑行者拖影越明显。', ['1/2000 s · 凝固', '1/4 s · 拖影'])}
      ${slider('iso', 'ISO', 0, 6, state.iso, '提高 ISO 会提亮输出；噪点仅为趋势示意。ISO 不增加入射光量。', ['100 · 低', '6400 · 高'])}`;
    if (t === 'composition') controls = `<div class="lab-mini-title">取景练习</div><p class="lab-control-intro">把人物放在右下方的三分交点附近，给视线方向留出空间。然后试试居中构图，比较感受。</p>
      ${slider('subjectX', '主体横向位置', 0.08, 0.92, state.subjectX, '左右移动主体，观察两侧留白。', ['画面左侧', '画面右侧'], 0.01)}
      ${slider('subjectY', '主体纵向位置', 0.15, 0.85, state.subjectY, '这里允许自由摆放以观察布局，人物大小保持固定。', ['画面上方', '画面下方'], 0.01)}
      <label class="lab-toggle"><input type="checkbox" data-setting="grid" ${state.grid ? 'checked' : ''}> 显示三分线与交点</label><div class="lab-memory"><span>构图口诀</span><strong>先找主体，再看背景，最后整理四角。</strong></div>`;
    if (t === 'focal') controls = `${slider('focal', '镜头焦距', 24, 120, state.focal, '相机不移动：焦距越长，视角越窄，主体在画面中越大。', ['24 mm · 广角', '120 mm · 长焦'])}<div class="lab-stat"><span>水平视角 / 全画幅 36 mm</span><strong id="lab-fov"></strong></div><div class="lab-memory"><span>观察重点</span><strong>同机位改变焦距，改变取景范围；透视关系由拍摄位置决定。</strong></div><p class="lab-control-intro">实拍对照：固定站位，拍 24 mm 与 85 mm；再走远，用 85 mm 把主体拍成相同大小。第二组里，改变透视的是你的位置。</p>`;
    if (t === 'whitebalance') controls = `${slider('kelvin', '相机白平衡', 2500, 10000, state.kelvin, '固定日光下，设得更低会偏蓝，设得更高会偏暖。', ['2500 K · 冷', '10000 K · 暖'], 100)}<div class="lab-white-cards"><span><i style="background:#adc6dc"></i>偏蓝</span><span><i style="background:#f6f2e7"></i>中性</span><span><i style="background:#e6b981"></i>偏暖</span></div><div class="lab-memory"><span>不要记反</span><strong>光源色温，与相机用来补偿的 K 值，不是同一个观察方向。</strong></div><p class="lab-control-intro">练习：先把画面调回中性，再故意做出温暖的黄昏感。白平衡既能校正，也能表达情绪。</p>`;
    host.innerHTML = `<section class="lab-root" aria-label="交互相机实验室"><div class="lab-tabs" role="tablist" aria-label="实验类型">${Object.entries(TABS).map(([key, text]) => `<button type="button" role="tab" aria-selected="${t === key}" aria-controls="lab-panel" id="lab-tab-${key}" data-tab="${key}" class="lab-tab ${t === key ? 'is-active' : ''}">${text}</button>`).join('')}</div>
      <div id="lab-panel" role="tabpanel" aria-labelledby="lab-tab-${t}"><div class="lab-intro"><div><span class="lab-eyebrow">PLAY · OBSERVE · UNDERSTAND</span><h2>${headings[t][0]}</h2><p>${headings[t][1]}</p></div>${button('↺ 重置参数', 'data-action="reset"')}</div>
      <div class="lab-workspace"><div class="lab-view"><div class="lab-view-header"><span><i></i> LIVE VIEW <small>教学示意</small></span>${t === 'exposure' ? button(state.paused ? '▷ 播放运动' : 'Ⅱ 暂停运动', 'data-action="pause"') : '<span class="lab-fixed">固定机位</span>'}</div><div class="lab-canvas-wrap"><canvas id="lab-canvas" width="960" height="600" role="img" aria-label="山湖风景与骑行者的教学示意画面" ${t === 'composition' ? 'tabindex="0" aria-describedby="lab-canvas-help"' : ''}></canvas><div class="lab-viewfinder lab-viewfinder-tl"></div><div class="lab-viewfinder lab-viewfinder-tr"></div><div class="lab-viewfinder lab-viewfinder-bl"></div><div class="lab-viewfinder lab-viewfinder-br"></div><span class="lab-scene-label">FIELD STUDY / 001</span></div>
      <div class="lab-view-footer" id="lab-view-footer"></div>
      ${t === 'exposure' ? '<div class="lab-meter"><div class="lab-meter-heading"><span>相对示意测光基准</span><strong id="lab-ev"></strong></div><div class="lab-meter-track"><span id="lab-meter-needle"></span><i></i></div><div class="lab-meter-labels"><span>−3 EV · 暗</span><span>0</span><span>+3 EV · 亮</span></div></div>' : ''}
      <p class="lab-canvas-help" id="lab-canvas-help">${t === 'composition' ? '点击画面或使用下面的滑块移动人物。画面获得键盘焦点后可用方向键移动，按 Shift 加速。三分法是工具，不是好照片的判分标准。' : '所有景物均由代码绘制。画面变化用于比较趋势，不用于预测真实相机成片。'}</p></div><aside class="lab-controls" aria-label="实验参数">${controls}</aside></div>
      <div class="lab-observation"><span class="lab-observation-icon">↗</span><div><h3>这次变化告诉你什么？</h3><p id="lab-feedback" aria-live="polite"></p></div></div>
      <div class="lab-bottom"><div class="lab-challenge"><span class="lab-eyebrow">TRY THIS / 小挑战</span><h3>${t === 'exposure' ? '让骑行者清晰，又保留正常亮度。' : t === 'composition' ? '用留白，引导看照片的人。' : t === 'focal' ? '不走近，也能突出主体吗？' : '给同一张照片，两种情绪。'}</h3><p>${t === 'exposure' ? '保持明亮阴天，先将快门调到 1/500 s 或更快；再用光圈或 ISO 把曝光表调回 ±0.5 EV。完成后，说出你做出的取舍。' : t === 'composition' ? '分别把人物放在中心、左下三分点、右下三分点。哪一张更平衡？哪一张让你想看向远方？没有唯一答案。' : t === 'focal' ? '比较 24、50、85 mm，数一数画面里消失了哪些背景元素。试着用一句话解释“长焦更容易整理背景”。' : '分别设置 3500 K 和 7500 K，再回到 5500 K。解释为什么较高的相机 K 值在同一光源下会让画面更暖。'}</p>${t === 'exposure' ? button('检查我的设置', 'data-action="check"') : ''}<p id="lab-check-result" class="lab-check-result" aria-live="polite"></p></div><div class="lab-limit"><h3>把实验带回真实相机</h3><p>${t === 'exposure' ? '这里固定主体距离、镜头和对焦位置。虚化也受焦距、距离等影响；实际噪声取决于入射光量、传感器与处理。场景 EV 值是练习设定。曝光表归零只是测光建议，创作意图可以不同。' : t === 'focal' ? '本图是固定机位的画面裁切示意，水平视角按全画幅宽度 36 mm 计算。没有模拟镜头畸变、景深或不同镜头的光学特性。APS-C 的相同焦距视角更窄。' : t === 'whitebalance' ? '这里使用简化的暖冷色覆盖，未模拟光谱、色彩管理或绿—品红色调轴。真实混合光源未必能靠一个 K 值全部校正；可用灰卡和 RAW 提高调整余地。' : '真实拍摄时通过站位与取景调整构图；本实验只做平面布局。还要检查背景干扰、地平线、人物视线和画面边缘。'}</p><a href="${t === 'focal' ? 'https://www.sony.com/electronics/support/articles/00268239' : t === 'whitebalance' ? 'https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/setting-white-balance' : t === 'composition' ? 'https://en.nikon.ca/learn-and-explore/c/tips-and-techniques/5-easy-composition-guidelines' : 'https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/a-basic-look-at-the-basics-of-exposure'}" target="_blank" rel="noopener noreferrer">延伸阅读 · ${t === 'focal' ? 'Sony 镜头基础' : t === 'whitebalance' ? 'Nikon 白平衡' : t === 'composition' ? 'Nikon 构图指南' : 'Nikon 曝光基础'} ↗</a></div></div></div></section>`;
    update();
  }

  function onClick(e) {
    const tab = e.target.closest('[data-tab]');
    if (tab) { state.tab = tab.dataset.tab; render(); q(`#lab-tab-${state.tab}`).focus(); return; }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'reset') { state = defaults(state.tab); elapsed = 0; render(); q('[data-action="reset"]').focus(); }
    if (action === 'pause') { state.paused = !state.paused; e.target.closest('button').textContent = state.paused ? '▷ 播放运动' : 'Ⅱ 暂停运动'; }
    if (action === 'check') {
      const ev = MathModel.exposureEV(APERTURES[state.aperture], SHUTTERS[state.shutter], ISOS[state.iso], state.scene);
      const pass = SHUTTERS[state.shutter] <= 1 / 500 && Math.abs(ev) <= 0.5 && state.scene === 13;
      q('#lab-check-result').textContent = pass ? '✓ 完成！曝光在目标范围内，快门也足够短。现在解释：你用更大的光圈，还是更高的 ISO，换回了亮度？' : state.scene !== 13 ? '先把场景切回“明亮阴天”，再完成同一条件下的挑战。' : SHUTTERS[state.shutter] > 1 / 500 ? '再试一次：快门时间需要缩短到 1/500 s 或更短，然后补偿亮度。' : ev < -0.5 ? '动作已凝固，画面还偏暗：开大光圈（降低 f 值）或提高 ISO。' : '动作已凝固，画面还偏亮：缩小光圈、降低 ISO，或进一步加快快门。';
    }
  }

  function onInput(e) {
    const name = e.target.dataset.setting;
    if (!name) return;
    state[name] = name === 'grid' ? e.target.checked : Number(e.target.value);
    if (q('#lab-check-result')) q('#lab-check-result').textContent = '';
    update();
  }

  function onPointer(e) {
    if (e.target.id !== 'lab-canvas' || state.tab !== 'composition') return;
    const rect = e.target.getBoundingClientRect();
    state.subjectX = clamp((e.clientX - rect.left) / rect.width, 0.08, 0.92);
    state.subjectY = clamp((e.clientY - rect.top) / rect.height, 0.15, 0.85);
    q('#lab-subjectX').value = state.subjectX;
    q('#lab-subjectY').value = state.subjectY;
    e.target.focus(); update();
  }

  function onKey(e) {
    const tab = e.target.closest('[role="tab"]');
    if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const keys = Object.keys(TABS), i = keys.indexOf(state.tab);
      state.tab = e.key === 'Home' ? keys[0] : e.key === 'End' ? keys[3] : keys[(i + (e.key === 'ArrowRight' ? 1 : 3)) % 4];
      render(); q(`#lab-tab-${state.tab}`).focus(); return;
    }
    if (e.target.id !== 'lab-canvas' || !e.key.startsWith('Arrow')) return;
    e.preventDefault();
    const delta = e.shiftKey ? 0.05 : 0.01;
    if (e.key === 'ArrowLeft') state.subjectX = clamp(state.subjectX - delta, 0.08, 0.92);
    if (e.key === 'ArrowRight') state.subjectX = clamp(state.subjectX + delta, 0.08, 0.92);
    if (e.key === 'ArrowUp') state.subjectY = clamp(state.subjectY - delta, 0.15, 0.85);
    if (e.key === 'ArrowDown') state.subjectY = clamp(state.subjectY + delta, 0.15, 0.85);
    q('#lab-subjectX').value = state.subjectX; q('#lab-subjectY').value = state.subjectY; update();
  }

  function update() {
    if (!host) return;
    const t = state.tab;
    const N = APERTURES[state.aperture], sec = SHUTTERS[state.shutter], iso = ISOS[state.iso];
    const ev = MathModel.exposureEV(N, sec, iso, state.scene);
    if (t === 'exposure') {
      q('#lab-value-aperture').textContent = `f/${N}`;
      q('#lab-value-shutter').textContent = shutterLabel(sec);
      q('#lab-value-iso').textContent = iso;
      q('#lab-ev').textContent = `${ev >= 0 ? '+' : ''}${ev.toFixed(1)} EV`;
      q('#lab-meter-needle').style.left = `${50 + clamp(ev, -3, 3) / 3 * 48}%`;
      q('#lab-feedback').textContent = `${Math.abs(ev) <= 0.5 ? '亮度接近示意测光基准。' : ev < 0 ? '当前画面偏暗，可以增加进光量或提高 ISO。' : '当前画面偏亮，可以减少进光量或降低 ISO。'} ${N <= 2.8 ? '大光圈让背景明显虚化。' : N >= 8 ? '较小光圈让背景更易辨认。' : '中等光圈保留了部分背景细节。'} ${sec >= 1 / 60 ? '慢快门记录了移动轨迹。' : '短曝光时间更容易凝固运动。'}${iso >= 1600 ? '高 ISO 下增加了可见噪点示意。' : ''}`;
      q('#lab-view-footer').innerHTML = `<span><small>APERTURE</small>f/${N}</span><span><small>SHUTTER</small>${shutterLabel(sec)}</span><span><small>ISO</small>${iso}</span><span class="lab-mode">M</span>`;
      q('#lab-canvas').setAttribute('aria-label', `曝光示意：光圈 f/${N}，快门 ${shutterLabel(sec)}，ISO ${iso}，相对测光 ${ev.toFixed(1)} EV。${q('#lab-feedback').textContent}`);
    } else if (t === 'composition') {
      q('#lab-value-subjectX').textContent = `${Math.round(state.subjectX * 100)}%`;
      q('#lab-value-subjectY').textContent = `${Math.round(state.subjectY * 100)}%`;
      const nearThird = [1 / 3, 2 / 3].some(x => Math.abs(x - state.subjectX) < 0.055) && [1 / 3, 2 / 3].some(y => Math.abs(y - state.subjectY) < 0.065);
      q('#lab-feedback').textContent = nearThird ? '主体靠近三分交点。再观察画面另一侧是否有元素呼应，避免只追求“对准线”。' : Math.abs(state.subjectX - 0.5) < 0.06 ? '主体居中，强调稳定和直接。试着检查左右是否平衡，居中同样可以形成有力构图。' : `主体偏${state.subjectX < 0.5 ? '左' : '右'}，另一侧留白更多。想想这片留白能否交代环境或引导视线。`;
      q('#lab-view-footer').innerHTML = `<span><small>SUBJECT</small>${Math.round(state.subjectX * 100)}% / ${Math.round(state.subjectY * 100)}%</span><span><small>GRID</small>${state.grid ? '三分法参考线' : '自由观察'}</span>`;
      q('#lab-canvas').setAttribute('aria-label', `可移动人物的构图示意，横向 ${Math.round(state.subjectX * 100)}%，纵向 ${Math.round(state.subjectY * 100)}%。`);
    } else if (t === 'focal') {
      const fov = MathModel.horizontalFov(state.focal);
      q('#lab-value-focal').textContent = `${state.focal} mm`;
      q('#lab-fov').textContent = `${fov.toFixed(1)}°`;
      q('#lab-feedback').textContent = state.focal < 35 ? '广角容纳更多环境，前景与背景都能参与叙事。注意画面边缘的无关元素。' : state.focal <= 60 ? '中等焦距收窄了取景范围。背景与主体仍保持同机位的透视关系。' : '长焦把更窄的一部分场景填满画面，背景元素减少，主体更突出。相机没移动，透视关系也没有改变。';
      q('#lab-view-footer').innerHTML = `<span><small>FOCAL LENGTH</small>${state.focal} mm</span><span><small>HORIZONTAL FOV</small>${fov.toFixed(1)}°</span><span><small>SENSOR</small>36 mm 宽</span>`;
    } else {
      q('#lab-value-kelvin').textContent = `${state.kelvin} K`;
      q('#lab-feedback').textContent = Math.abs(state.kelvin - 5500) <= 300 ? '接近日光基准，灰白色区域接近中性。真实拍摄可以借助中性灰卡确认。' : state.kelvin < 5500 ? '你设置的 K 值低于当前日光：相机按较暖光源去补偿，画面因此偏蓝。' : '你设置的 K 值高于当前日光：相机按较冷光源去补偿，画面因此偏暖。';
      q('#lab-view-footer').innerHTML = `<span><small>LIGHT SOURCE</small>5500 K 日光</span><span><small>CAMERA WB</small>${state.kelvin} K</span><span><small>TINT</small>${Math.abs(state.kelvin - 5500) <= 300 ? '接近中性' : state.kelvin < 5500 ? '偏冷' : '偏暖'}</span>`;
    }
    draw();
  }

  function path(ctx, points, fill, stroke, width = 1) {
    ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  }

  function circle(ctx, x, y, r, fill, stroke, width = 1) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  }

  function landscape(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, 600);
    sky.addColorStop(0, '#b4cbd2'); sky.addColorStop(0.65, '#e4e5d5'); sky.addColorStop(1, '#eee8d3');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, 960, 600);
    circle(ctx, 738, 105, 43, '#f7efd0');
    ctx.fillStyle = '#e6ece5';
    [[120, 93, 94, 10], [207, 106, 130, 6], [470, 60, 70, 5]].forEach(([x, y, w, h]) => { ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2); ctx.fill(); });
    path(ctx, [[0, 320], [80, 252], [145, 280], [280, 112], [400, 268], [505, 190], [610, 290], [737, 153], [855, 260], [960, 200], [960, 430], [0, 430]], '#a7b8b0');
    path(ctx, [[211, 198], [280, 112], [344, 194], [300, 177], [272, 191], [252, 180]], '#e2e5d8');
    path(ctx, [[686, 218], [737, 153], [802, 219], [759, 201], [730, 215]], '#e2e5d8');
    path(ctx, [[0, 346], [90, 299], [170, 345], [294, 248], [419, 333], [570, 278], [690, 340], [820, 252], [960, 321], [960, 450], [0, 450]], '#718d7b');
    path(ctx, [[0, 382], [110, 346], [250, 369], [378, 328], [531, 376], [660, 348], [820, 379], [960, 333], [960, 450], [0, 450]], '#416854');
    const lake = ctx.createLinearGradient(0, 370, 0, 550);
    lake.addColorStop(0, '#8fb1ac'); lake.addColorStop(1, '#b9c8ad');
    path(ctx, [[0, 400], [350, 381], [640, 391], [960, 376], [960, 566], [0, 566]], lake);
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 24; i++) { const y = 398 + i * 5; path(ctx, [[120 + (i * 73) % 330, y], [530 + (i * 41) % 320, y]], null, '#eff2db', 1); }
    ctx.globalAlpha = 1;
    path(ctx, [[0, 470], [170, 443], [345, 489], [590, 470], [810, 448], [960, 462], [960, 600], [0, 600]], '#89966c');
    path(ctx, [[0, 526], [150, 490], [350, 514], [625, 503], [805, 484], [960, 488], [960, 522], [800, 514], [630, 536], [350, 547], [150, 524], [0, 566]], '#d6c4a0');
    for (let i = 0; i < 10; i++) {
      const x = 14 + i * 44, y = 396 - Math.sin(i * 1.6) * 13;
      path(ctx, [[x, y], [x + 13, y - 47 - (i % 3) * 9], [x + 26, y]], '#325a48');
    }
    // Distant lookout hut and a white neutral reference wall.
    ctx.fillStyle = '#eeeade'; ctx.fillRect(755, 344, 58, 47);
    path(ctx, [[746, 345], [784, 321], [823, 345]], '#364b42');
    ctx.fillStyle = '#566b64'; ctx.fillRect(780, 365, 13, 26);
    ctx.fillStyle = '#9aa39a'; ctx.fillRect(762, 354, 10, 10); ctx.fillRect(797, 354, 10, 10);
    // Foreground grasses.
    for (let i = 0; i < 28; i++) {
      const x = (i * 91) % 960, y = 571 + (i * 17) % 40;
      path(ctx, [[x - 7, y - 16], [x, y], [x + 5, y - 23]], null, '#5c7450', 2);
    }
  }

  function cyclist(ctx, x, y, alpha = 1) {
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= alpha;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    circle(ctx, -28, 23, 22, null, '#273f37', 4);
    circle(ctx, 36, 23, 22, null, '#273f37', 4);
    path(ctx, [[-28, 23], [-10, -10], [10, 23], [-28, 23], [23, -10], [36, 23]], null, '#dfe1b5', 4);
    path(ctx, [[23, -10], [18, -23], [29, -23]], null, '#273f37', 3);
    path(ctx, [[-10, -10], [-13, -21], [-21, -21]], null, '#273f37', 3);
    path(ctx, [[-6, -27], [10, -6], [0, 22]], null, '#273f37', 9);
    path(ctx, [[-6, -27], [-16, -3], [-9, 20]], null, '#40594b', 9);
    path(ctx, [[-8, -28], [0, -55], [20, -38], [24, -23]], null, '#dace65', 15);
    path(ctx, [[4, -51], [20, -36], [24, -23]], null, '#d3b08c', 6);
    circle(ctx, 9, -69, 11, '#d3b08c');
    path(ctx, [[-2, -72], [1, -80], [17, -80], [23, -70]], '#f5efcf');
    ctx.restore();
  }

  function person(ctx, x, y) {
    ctx.save(); ctx.translate(x, y);
    ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(35,59,47,.17)'; ctx.beginPath(); ctx.ellipse(2, 47, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
    path(ctx, [[-7, 17], [-11, 44]], null, '#2b453a', 8);
    path(ctx, [[7, 17], [14, 44]], null, '#2b453a', 8);
    path(ctx, [[-13, -13], [10, -13], [14, 19], [-15, 19]], '#e2b85a');
    path(ctx, [[-13, -8], [-22, 15]], null, '#d6b38d', 6);
    path(ctx, [[12, -8], [21, 12]], null, '#d6b38d', 6);
    circle(ctx, 0, -27, 11, '#d6b38d');
    path(ctx, [[-14, -30], [-8, -40], [6, -40], [16, -30]], '#e8e4ce');
    ctx.restore();
  }

  function draw() {
    const canvas = q('#lab-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d'), t = state.tab;
    ctx.clearRect(0, 0, 960, 600);
    ctx.fillStyle = '#89966c'; ctx.fillRect(0, 0, 960, 600);
    bgContext.clearRect(0, 0, 960, 600);
    landscape(bgContext);
    ctx.save();
    if (t === 'focal') {
      const zoom = state.focal / 24;
      // Crop the same perspective projection around a fixed point.
      ctx.translate(480, 300); ctx.scale(zoom, zoom); ctx.translate(-480, -465);
    }
    if (t === 'exposure') {
      const blur = Math.max(0, (8 - APERTURES[state.aperture]) * 0.65);
      ctx.filter = `blur(${blur}px)`;
    }
    ctx.drawImage(bgCanvas, -6, -6, 972, 612); ctx.filter = 'none';
    if (t === 'composition') person(ctx, state.subjectX * 960, state.subjectY * 600);
    else {
      const x = t === 'exposure' ? 480 + Math.sin(elapsed * 0.00035) * 95 : 480;
      if (t === 'exposure') {
        const trail = clamp(SHUTTERS[state.shutter] * 550, 0, 135);
        if (trail > 3) for (let i = 9; i >= 1; i--) cyclist(ctx, x - trail * i / 9, 475, 0.055 + 0.12 * (1 - i / 10));
      }
      cyclist(ctx, x, 475);
    }
    ctx.restore();
    if (t === 'exposure') {
      const ev = MathModel.exposureEV(APERTURES[state.aperture], SHUTTERS[state.shutter], ISOS[state.iso], state.scene);
      if (ev < 0) { ctx.fillStyle = `rgba(10,19,23,${1 - Math.pow(2, Math.max(-8, ev) / 1.7)})`; ctx.fillRect(0, 0, 960, 600); }
      else if (ev > 0) { ctx.fillStyle = `rgba(255,253,241,${1 - Math.pow(2, -Math.min(8, ev) / 2.2)})`; ctx.fillRect(0, 0, 960, 600); }
      const noiseStrength = state.iso * 0.026;
      if (noiseStrength) {
        let seed = 27713;
        for (let i = 0; i < 6500; i++) {
          seed = (seed * 16807) % 2147483647;
          const x = seed % 960;
          seed = (seed * 16807) % 2147483647;
          const y = seed % 600;
          ctx.fillStyle = i % 2 ? `rgba(255,255,255,${noiseStrength})` : `rgba(0,0,0,${noiseStrength})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    if (t === 'whitebalance') {
      const delta = state.kelvin - 5500;
      ctx.fillStyle = delta < 0 ? `rgba(52,118,221,${Math.min(0.4, -delta / 8500)})` : `rgba(247,161,48,${Math.min(0.4, delta / 12500)})`;
      ctx.fillRect(0, 0, 960, 600);
      // A neutral gray card gives a stable comparison object.
      ctx.fillStyle = '#e5e1d7'; ctx.fillRect(45, 54, 98, 60);
      ctx.fillStyle = delta < 0 ? `rgba(52,118,221,${Math.min(0.5, -delta / 7000)})` : `rgba(247,161,48,${Math.min(0.5, delta / 9500)})`; ctx.fillRect(45, 54, 98, 60);
      ctx.font = '15px sans-serif'; ctx.fillStyle = '#334f43'; ctx.fillText('中性参考', 64, 91);
    }
    if (t === 'composition' && state.grid) {
      ctx.strokeStyle = 'rgba(255,255,242,.78)'; ctx.lineWidth = 1.4; ctx.setLineDash([8, 6]);
      [320, 640].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke(); });
      [200, 400].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(960, y); ctx.stroke(); });
      ctx.setLineDash([]);
      [320, 640].forEach(x => [200, 400].forEach(y => circle(ctx, x, y, 8, 'rgba(228,234,173,.35)', '#eff2c9', 2)));
    }
  }

  function tick(time) {
    if (!host || !host.isConnected) return;
    const delta = lastTime ? Math.min(time - lastTime, 100) : 0;
    lastTime = time;
    if (state.tab === 'exposure' && !state.paused) { elapsed += delta; draw(); }
    frame = requestAnimationFrame(tick);
  }

  root.PhotoLabs = { mount, destroy };
})(typeof window === 'undefined' ? globalThis : window);

