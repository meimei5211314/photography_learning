/* Photo-based teaching tools. Real photographs and simplified image processing are labelled separately. */
(function (root) {
  'use strict';
  const model = {
    exposureEV(aperture, seconds, iso, sceneEV) {
      if (![aperture, seconds, iso, sceneEV].every(Number.isFinite) || aperture <= 0 || seconds <= 0 || iso <= 0) throw new RangeError('Invalid exposure parameters');
      return sceneEV - Math.log2(aperture * aperture / seconds) + Math.log2(iso / 100);
    },
    horizontalFov(focal, sensorWidth = 36) {
      if (!Number.isFinite(focal) || !Number.isFinite(sensorWidth) || focal <= 0 || sensorWidth <= 0) throw new RangeError('Invalid lens parameters');
      return 2 * Math.atan(sensorWidth / (2 * focal)) * 180 / Math.PI;
    }
  };
  root.PhotoMath = model;
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  if (typeof document === 'undefined') return;

  const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
  const SHUTTERS = [1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4];
  const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];
  const TABS = { compare: '实拍对比', exposure: '曝光取舍', composition: '构图裁切', focal: '焦距视角', whitebalance: '白平衡' };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const shutterLabel = seconds => `1/${Math.round(1 / seconds)} s`;
  let host, controller, state;
  const q = selector => host?.querySelector(selector);
  const media = () => root.PHOTO_MEDIA || { assets: {}, comparisons: [], lessonImages: {} };
  const comparisons = () => media().comparisons || [];
  const asset = id => media().assets?.[id];
  const defaults = tab => ({ tab, comparison: comparisons()[0]?.id || '', reveal: 50, explained: false, prediction: '', aperture: 5, shutter: 4, iso: 0, scene: 13, focal: 24, kelvin: 5500, zoom: 1.25, positionX: 50, positionY: 50, grid: true, reference: null, original: false });
  const exposure = () => model.exposureEV(APERTURES[state.aperture], SHUTTERS[state.shutter], ISOS[state.iso], state.scene);
  function sceneAsset() {
    const m = media();
    return asset('landscape') || asset(m.hero) || asset(m.lessonImages?.composition) || Object.values(m.assets || {})[0];
  }

  function mount(container, initialTab = 'compare') {
    destroy();
    host = container;
    state = defaults(TABS[initialTab] ? initialTab : 'compare');
    controller = new AbortController();
    const options = { signal: controller.signal };
    host.addEventListener('click', onClick, options);
    host.addEventListener('input', onInput, options);
    host.addEventListener('keydown', onKey, options);
    host.addEventListener('pointerdown', onComparePointer, options);
    host.addEventListener('pointermove', onComparePointer, options);
    host.addEventListener('pointerup', endComparePointer, options);
    host.addEventListener('pointercancel', endComparePointer, options);
    host.addEventListener('load', onImageLoad, { ...options, capture: true });
    host.addEventListener('error', onImageError, { ...options, capture: true });
    render();
  }
  function destroy() {
    controller?.abort();
    host = null;
    controller = null;
    state = null;
  }
  function onImageLoad(event) {
    if (event.target.tagName === 'IMG') event.target.closest('.lab-photo-stage')?.classList.add('lab-loaded');
  }
  function onImageError(event) {
    if (event.target.tagName !== 'IMG') return;
    const stage = event.target.closest('.lab-photo-stage');
    stage?.classList.remove('lab-loaded');
    const status = stage?.querySelector('.lab-image-status');
    if (status) status.textContent = '照片暂未加载。请确认 assets 文件夹与网页一起保存；文字说明和参数练习仍可使用。';
  }
  function button(label, attrs = '') { return `<button type="button" class="lab-button" ${attrs}>${label}</button>`; }
  function slider(id, label, min, max, value, left, right, step = 1) {
    return `<div class="lab-control"><label for="lab-${id}"><span>${label}</span><output id="lab-value-${id}" for="lab-${id}"></output></label><input type="range" id="lab-${id}" data-setting="${id}" min="${min}" max="${max}" step="${step}" value="${value}"><div class="lab-range-labels"><span>${left}</span><span>${right}</span></div></div>`;
  }
  function credit(a) {
    if (!a) return '<p class="lab-credit">尚未载入照片资料。</p>';
    return `<p class="lab-credit">摄影：${esc(a.author)} · <a href="${esc(a.source)}" target="_blank" rel="noopener noreferrer">原作与拍摄说明 ↗</a> · <a href="${esc(a.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(a.license)}</a></p>`;
  }
  function photo(a, id = 'lab-photo', extraClass = '') {
    if (!a) return '<div class="lab-image-status">照片资料暂不可用，请返回知识速查阅读图解。</div>';
    return `<img draggable="false" id="${id}" class="lab-photo ${extraClass}" src="${esc(a.src)}" alt="${esc(a.alt)}" width="${a.width || 1600}" height="${a.height || 1067}" decoding="async">`;
  }
  function render() {
    const t = state.tab;
    host.innerHTML = `<section class="lab-root" aria-label="真实照片互动实验室"><div class="lab-tabs" role="tablist" aria-label="实验类型">${Object.entries(TABS).map(([key, label]) => `<button type="button" role="tab" id="lab-tab-${key}" data-tab="${key}" aria-selected="${key === t}" aria-controls="lab-panel" tabindex="${key === t ? 0 : -1}" class="lab-tab ${key === t ? 'is-active' : ''}">${label}</button>`).join('')}</div><div id="lab-panel" role="tabpanel" aria-labelledby="lab-tab-${t}">${t === 'compare' ? comparePanel() : experimentPanel()}</div></section>`;
    update();
    host.querySelectorAll('img').forEach(img => { if (img.complete && img.naturalWidth) img.closest('.lab-photo-stage')?.classList.add('lab-loaded'); });
  }
  function comparePanel() {
    const list = comparisons();
    const c = list.find(item => item.id === state.comparison) || list[0];
    if (!c) return '<div class="lab-empty"><h2>实拍素材正在准备</h2><p>当前未找到本地对照照片。可以先进入曝光取舍，练习参数之间的配合。</p></div>';
    state.comparison = c.id;
    const a = asset(c.assetId);
    const vertical = c.layout === 'vertical-pair';
    const layoutClass = vertical ? 'lab-vertical-source' : 'lab-horizontal-source';
    const before = c.beforeLabel || '照片 A', after = c.afterLabel || '照片 B';
    const title = c.title || '同一场景，比较真实变化';
    const topic = c.assetId === 'light' ? 'light' : 'depth';
    const lesson = topic === 'light' ? 'light' : 'aperture';
    return `<div class="lab-intro"><div><span class="lab-eyebrow">实拍拼接 / 观察 → 比较 → 解释</span><h2>${esc(title)}</h2><p>照片的区别，比参数的名字更值得先记住。</p></div>${button('↺ 重置观察', 'data-action="reset"')}</div>
      <div class="lab-comparison-choices" aria-label="选择对照案例">${list.map(item => button(esc(item.title), `data-comparison="${esc(item.id)}" aria-pressed="${item.id === c.id}"`)).join('')}</div>
      <div class="lab-compare-layout"><div class="lab-compare-main"><div class="lab-photo-stage lab-compare-stage" style="--photo-ratio:${Number(c.aspect) || 1.45}" role="img" aria-label="${esc(`${title}，左侧显示${before}，右侧显示${after}，可用下方滑杆改变分界`)}"><div class="lab-compare-layer lab-after ${layoutClass}">${photo(a, 'lab-after-image')}</div><div class="lab-compare-layer lab-before ${layoutClass}" id="lab-compare-before">${photo(a, 'lab-before-image')}</div>${c.assetId === 'bokeh' ? '<span class="lab-source-label-mask" aria-hidden="true">景深对照</span>' : ''}<span class="lab-photo-badge lab-photo-badge-left">${esc(before)}</span><span class="lab-photo-badge lab-photo-badge-right">${esc(after)}</span><div class="lab-compare-divider" id="lab-compare-divider"><span>↔</span></div><span class="lab-image-status">正在载入实拍照片…</span></div>
      <div class="lab-compare-slider">${slider('reveal', '拖动照片或滑杆，比较同一位置', 0, 100, state.reveal, `← ${before}`, `${after} →`)}<div class="lab-inline-buttons">${button('只看左侧结果', 'data-action="before"')}${button('各看一半', 'data-action="half"')}${button('只看右侧结果', 'data-action="after"')}</div></div>${credit(a)}<p class="lab-source-note">${esc(c.description || a?.note || '')} 两侧来自原图的不同区域，边框与轻微构图差异予以保留；不是像素级配准实验。${c.assetId === 'bokeh' ? ' 为避免左右原片文字拼成错误参数，界面遮挡了顶部中央的原图 f 值文字；请看上方两侧独立标签。' : ''} ${a ? `<a href="${esc(a.src)}" target="_blank" rel="noopener noreferrer">查看完整原图 ↗</a>` : ''}</p></div>
      <aside class="lab-observe-card"><span class="lab-step">01 / 先找证据</span><h3>${topic === 'light' ? '先看阴影，再看颜色。' : '先看主角，再看远处。'}</h3><p>${topic === 'light' ? '找到水果下方的阴影边缘。哪一张过渡更柔和？再比较反光的位置与大小。' : '先找两张都清楚的前景主体，再看它后面的物体。哪张背景细节更容易辨认？'}</p><span class="lab-step">02 / 做出预测</span><p>${topic === 'light' ? '如果想让阴影边缘更柔和，你会优先改变什么？' : '想让更多前后细节同时可辨认，在其他条件相近时，你会先尝试什么？'}</p><div class="lab-predictions">${(topic === 'light' ? [['a','增大主体看到的光源面积'],['b','只提高 ISO']] : [['a','缩小光圈（提高 f 值）'],['b','只提高 ISO']]).map(([value,label]) => button(label, `data-prediction="${value}" aria-pressed="${state.prediction === value}"`)).join('')}</div><p class="lab-prediction-feedback" id="lab-prediction-feedback" aria-live="polite"></p>${button(state.explained ? '收起观察提示 ↑' : '展开观察提示 ↓', 'data-action="explain" aria-expanded="'+state.explained+'"')}<div id="lab-explanation" class="lab-explanation" ${state.explained ? '' : 'hidden'}><h4>03 / 带走这个判断方法</h4><p>${topic === 'light' ? '柔光通常有渐变的阴影边缘；硬光的边缘更分明。光的软硬与光源对主体的相对大小有关，不等于亮暗。两张照片不是只变一个参数的严格标定。' : '景深描述可接受清晰的距离范围。比较前景与背景的清晰程度，别只记 f 数大小；光圈之外，对焦距离、焦距等也会影响结果。未提供参数的原图不补填虚构 f 值。'}</p><a href="#lesson/${lesson}">回到原理课，把观察说清楚 →</a></div></aside></div>
      <div class="lab-transfer"><strong>把这次观察带到现实里</strong><p>${topic === 'light' ? '在窗边拍一只杯子，再用较小的灯直射。保持杯子不动，比较阴影边缘与表面高光，写下你愿意用哪种光来表现材质。' : '固定相机、主体、焦距与对焦位置，分别拍最大光圈和 f/8。让自动曝光或快门补偿亮度，比较背景清晰度，而不是比较明暗。'}</p><a href="#practice">打开实战任务 →</a></div>`;
  }
  function experimentPanel() {
    const t = state.tab, a = sceneAsset();
    const copy = {
      exposure: ['曝光是选择，也是交换。', '以实拍照片作亮度参照，练习光圈、快门、ISO 的档位配合。', '亮度教学处理 · 参考参数不是原片 EXIF'],
      composition: ['留下什么，比装进多少更重要。', '裁切真实照片，观察主体、留白和画面边缘之间的关系。', '实拍照片 · 页面裁切，不改变拍摄位置'],
      focal: ['站在同一个位置，改变取景范围。', '用固定中心的裁切理解长焦的取景变化，区分变焦与走近。', '实拍底图 · 裁切视角示意'],
      whitebalance: ['相同的光景，也能拥有不同情绪。', '先观察原片，再比较冷暖补偿。用语言描述颜色带来的感受。', '实拍底图 · 冷暖后期示意，非色温标定']
    }[t];
    let controls = '';
    if (t === 'exposure') controls = `<div class="lab-scene-control"><label for="lab-scene">假设现场亮度 <small>EV100</small></label><select id="lab-scene" data-setting="scene"><option value="15" ${state.scene === 15 ? 'selected' : ''}>晴天 / 15</option><option value="13" ${state.scene === 13 ? 'selected' : ''}>明亮阴天 / 13</option><option value="10" ${state.scene === 10 ? 'selected' : ''}>室内窗边 / 10</option><option value="6" ${state.scene === 6 ? 'selected' : ''}>傍晚 / 6</option></select></div>${slider('aperture','光圈',0,7,state.aperture,'f/1.4 · 大开口','f/16 · 小开口')}${slider('shutter','快门时间',0,9,state.shutter,'1/2000 s','1/4 s')}${slider('iso','ISO',0,6,state.iso,'100','6400')}<div class="lab-inline-buttons">${button('保存当前设置为 A','data-action="save-a"')}${button('对照原片','data-action="original" aria-pressed="'+state.original+'"')}</div><p class="lab-control-note">这里只改变显示亮度，不制造“假景深”或“假噪点”。景深请看实拍对比，运动模糊请结合快门课。</p>`;
    if (t === 'composition') controls = `${slider('zoom','裁切放大',1,2.5,state.zoom,'完整画面','收紧画面',0.05)}${slider('positionX','保留位置 · 左右',0,100,state.positionX,'左侧','右侧')}${slider('positionY','保留位置 · 上下',0,100,state.positionY,'上方','下方')}<label class="lab-toggle"><input type="checkbox" data-setting="grid" ${state.grid?'checked':''}>显示三分参考线</label><div class="lab-inline-buttons">${button('居中观察','data-preset="center"')}${button('保留左侧','data-preset="left"')}${button('保留右侧','data-preset="right"')}</div><p class="lab-control-note">先放大，再移动保留位置。裁切会减少像素；拍摄时可以优先通过取景完成构图。</p>`;
    if (t === 'focal') controls = `${slider('focal','示意焦距',24,120,state.focal,'24 mm · 广角','120 mm · 长焦')}<div class="lab-focal-presets">${[24,35,50,85,120].map(n=>button(`${n} mm`,`data-focal="${n}"`)).join('')}</div><div class="lab-stat"><span>36 mm 宽传感器的理论水平视角</span><strong id="lab-fov"></strong></div><p class="lab-control-note">把完整底图当作 24 mm 的示意起点；这个设置不是在声称原图真的由 24 mm 拍摄。固定中心、同一机位，只观察取景范围。</p>`;
    if (t === 'whitebalance') controls = `${slider('kelvin','相机 K 值方向示意',2500,10000,state.kelvin,'更低 · 偏冷','更高 · 偏暖',100)}<div class="lab-inline-buttons">${button('偏冷','data-kelvin="3500"')}${button('原片','data-kelvin="5500"')}${button('偏暖','data-kelvin="7500"')}</div><div class="lab-wb-key"><span class="lab-cold-swatch"></span><span>原片</span><span class="lab-warm-swatch"></span></div><p class="lab-control-note">5500 K 在这里仅表示“恢复原片”的示意零点。原照片没有做光源色温标定；这里用简化覆盖展示调整方向，不等同于 RAW 白平衡算法。</p>`;
    return `<div class="lab-intro"><div><span class="lab-eyebrow">实拍底图 / 可控实验</span><h2>${copy[0]}</h2><p>${copy[1]}</p></div>${button('↺ 重置参数','data-action="reset"')}</div><div class="lab-workspace"><div class="lab-view"><div class="lab-view-header"><span>${copy[2]}</span></div><div class="lab-photo-stage lab-experiment-stage" style="--photo-ratio:${a && a.width && a.height ? a.width/a.height : 1.5}" ${t === 'composition' ? 'tabindex="0" role="group" aria-label="照片裁切区，可按方向键调整保留位置"' : ''}>${photo(a)}<div class="lab-wb-tint" id="lab-wb-tint"></div><div class="lab-grid" id="lab-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span class="lab-image-status">正在载入实拍照片…</span><span class="lab-image-label" id="lab-image-label"></span></div><div class="lab-view-footer" id="lab-view-footer"></div>${t === 'exposure' ? '<div class="lab-meter"><div><span>相对假设测光基准</span><strong id="lab-ev"></strong></div><div class="lab-meter-track"><i></i><span id="lab-meter-needle"></span></div><div class="lab-meter-labels"><span>−3 EV</span><span>0</span><span>+3 EV</span></div></div>' : ''}${credit(a)}<div id="lab-reference" class="lab-reference" hidden></div></div><aside class="lab-controls" aria-label="实验参数">${controls}</aside></div><div class="lab-feedback"><span>观察反馈</span><p id="lab-feedback" aria-live="polite"></p></div><div class="lab-bottom"><section class="lab-challenge"><span class="lab-step">下一步 / 用自己的话解释</span><h3>${t === 'exposure' ? '亮度不变，快门更短。' : t === 'composition' ? '你保留了什么，又舍弃了什么？' : t === 'focal' ? '变焦，能替代走近吗？' : '给一张照片，写两种情绪。'}</h3><p>${t === 'exposure' ? '假设现场是明亮阴天。把快门设为 1/500 s 或更短，再用光圈或 ISO 将曝光表调回 ±0.5 EV。这个挑战是在练习档位，不是判定原照片的“正确曝光”。' : t === 'composition' ? '分别保存一张完整画面和一张收紧的构图。说出主体更明确的原因，并检查四边是否切断了重要元素。三分法是参考，不是评分标准。' : t === 'focal' ? '比较 24、50 和 85 mm 的取景。相机没有移动，透视关系仍相同。真实拍摄时再走近主体，对比背景比例，辨认机位造成的变化。' : '先用偏冷、偏暖两个按钮比较，再回到原片。描述各自让你想到的时间或情绪；不要把“看着舒服”与“准确还原”混为一谈。'}</p>${t === 'exposure' ? button('检查我的设置','data-action="check"') : ''}<p id="lab-check-result" class="lab-check-result" aria-live="polite"></p></section><section class="lab-limit"><h3>这幅图能教你什么？</h3><p>${t === 'exposure' ? '能练习曝光档位的补偿关系。不能从静态滤镜观察主体运动、真实景深、传感器噪声或高光恢复。把鼠标移到“实拍对比”，观察相机真正记录的差异。' : t === 'composition' ? '能练习取舍、留白和边缘整理。不能代替拍摄时移动机位、改变前后关系；原片中没有的信息，裁切无法补回来。' : t === 'focal' ? '能理解固定机位时焦距变长、视角变窄。不模拟镜头畸变、真实焦距 EXIF、景深或机位变化；标出的角度来自全画幅的几何公式。' : '能记住同一场景中提高相机 K 值通常会让照片更暖。实际光源色温、色调轴、混合光源与色彩管理更复杂，不能用这一层覆盖精确模拟。'}</p><a href="#lesson/${t === 'focal'?'lens':t}">回到相关课程 →</a></section></div>`;
  }
  function onClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.tab) { state.tab = target.dataset.tab; render(); q(`#lab-tab-${state.tab}`).focus(); return; }
    if (target.dataset.comparison) { state.comparison = target.dataset.comparison; state.reveal = 50; state.prediction = ''; state.explained = false; render(); q(`[data-comparison="${state.comparison}"]`).focus(); return; }
    if (target.dataset.prediction) { state.prediction = target.dataset.prediction; update(); return; }
    if (target.dataset.focal) { state.focal = Number(target.dataset.focal); q('#lab-focal').value = state.focal; update(); return; }
    if (target.dataset.kelvin) { state.kelvin = Number(target.dataset.kelvin); q('#lab-kelvin').value = state.kelvin; update(); return; }
    if (target.dataset.preset) {
      state.zoom = 1.5; state.positionY = 50; state.positionX = target.dataset.preset === 'left' ? 20 : target.dataset.preset === 'right' ? 80 : 50;
      ['zoom','positionX','positionY'].forEach(name => { q(`#lab-${name}`).value = state[name]; }); update(); return;
    }
    const action = target.dataset.action;
    if (action === 'reset') { const oldComparison = state.comparison; state = defaults(state.tab); state.comparison = oldComparison; render(); q('[data-action="reset"]').focus(); return; }
    if (['before','half','after'].includes(action)) { state.reveal = action === 'before' ? 100 : action === 'after' ? 0 : 50; q('#lab-reveal').value = state.reveal; update(); }
    if (action === 'explain') { state.explained = !state.explained; q('#lab-explanation').hidden = !state.explained; target.setAttribute('aria-expanded',state.explained); target.textContent = state.explained ? '收起观察提示 ↑' : '展开观察提示 ↓'; }
    if (action === 'save-a') { state.reference = { aperture: APERTURES[state.aperture], shutter: SHUTTERS[state.shutter], iso: ISOS[state.iso], ev: exposure() }; update(); }
    if (action === 'original') { state.original = !state.original; update(); }
    if (action === 'check') {
      const ev = exposure();
      const fastEnough = SHUTTERS[state.shutter] <= 1 / 500;
      q('#lab-check-result').textContent = state.scene !== 13 ? '先把假设现场切回明亮阴天，再比较同一条件。' : !fastEnough ? '再试一次：快门时间先缩短到 1/500 s 或更短。' : Math.abs(ev) <= 0.5 ? '✓ 完成！快门更短、模拟亮度保持接近。现在说出代价：更大光圈通常减少景深；提高 ISO 不会增加入射光，画质还受光量与设备影响。' : ev < 0 ? '快门已足够短，当前偏暗。试着开大光圈（降低 f 值）或提高 ISO。' : '快门已足够短，当前偏亮。试着缩小光圈、降低 ISO，或进一步缩短快门。';
    }
  }
  function onComparePointer(event) {
    if (state.tab !== 'compare') return;
    const frame = event.target.closest('.lab-compare-stage');
    if (!frame) return;
    if (event.type === 'pointerdown') {
      if (event.button !== 0) return;
      frame.setPointerCapture(event.pointerId);
      frame.dataset.dragging = String(event.pointerId);
    } else if (frame.dataset.dragging !== String(event.pointerId)) return;
    const bounds = frame.getBoundingClientRect();
    if (!bounds.width) return;
    state.reveal = Math.round(clamp((event.clientX - bounds.left) / bounds.width * 100,0,100));
    q('#lab-reveal').value = state.reveal;
    update();
  }
  function endComparePointer(event) {
    const frame = event.target.closest('.lab-compare-stage');
    if (!frame || frame.dataset.dragging !== String(event.pointerId)) return;
    if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
    delete frame.dataset.dragging;
  }
  function onInput(event) {
    const name = event.target.dataset.setting;
    if (!name) return;
    state[name] = name === 'grid' ? event.target.checked : Number(event.target.value);
    if (q('#lab-check-result')) q('#lab-check-result').textContent = '';
    update();
  }
  function onKey(event) {
    if (event.target.dataset.tab && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      const tabs = Object.keys(TABS), index = tabs.indexOf(state.tab);
      state.tab = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      render(); q(`#lab-tab-${state.tab}`).focus(); return;
    }
    if (event.target.classList.contains('lab-experiment-stage') && state.tab === 'composition' && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
      event.preventDefault(); const d = event.shiftKey ? 10 : 2;
      if (event.key === 'ArrowLeft') state.positionX = clamp(state.positionX - d,0,100);
      if (event.key === 'ArrowRight') state.positionX = clamp(state.positionX + d,0,100);
      if (event.key === 'ArrowUp') state.positionY = clamp(state.positionY - d,0,100);
      if (event.key === 'ArrowDown') state.positionY = clamp(state.positionY + d,0,100);
      ['positionX','positionY'].forEach(name=> { q(`#lab-${name}`).value = state[name]; }); update();
    }
  }
  function update() {
    if (state.tab === 'compare') {
      if (!q('#lab-compare-before')) return;
      q('#lab-compare-before').style.clipPath = `inset(0 ${100-state.reveal}% 0 0)`;
      q('#lab-compare-divider').style.left = `${state.reveal}%`;
      q('#lab-value-reveal').textContent = `${state.reveal}% / ${100-state.reveal}%`;
      q('#lab-prediction-feedback').textContent = !state.prediction ? '先作出判断，再展开观察提示。' : state.prediction === 'a' ? '✓ 方向正确。请再指着照片，说出一个可见的证据。' : 'ISO 主要改变亮度呈现，不会直接改变景深或光源的相对大小。再观察清晰范围或阴影边缘。';
      host.querySelectorAll('[data-prediction]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.prediction === state.prediction));
      return;
    }
    const t = state.tab, image = q('#lab-photo');
    if (!image) return;
    image.style.transform = '';
    image.style.filter = '';
    q('#lab-wb-tint').style.background = 'transparent';
    q('#lab-grid').hidden = !(t === 'composition' && state.grid);
    if (t === 'exposure') {
      const N = APERTURES[state.aperture], seconds = SHUTTERS[state.shutter], iso = ISOS[state.iso], ev = exposure();
      q('#lab-value-aperture').textContent = `f/${N}`;
      q('#lab-value-shutter').textContent = shutterLabel(seconds);
      q('#lab-value-iso').textContent = iso;
      image.style.filter = state.original ? 'none' : `brightness(${clamp(Math.pow(2, ev),0.025,8)})`;
      q('#lab-ev').textContent = `${ev>=0?'+':''}${ev.toFixed(1)} EV`;
      q('#lab-meter-needle').style.left = `${50 + clamp(ev,-3,3)/3*49}%`;
      q('#lab-image-label').textContent = state.original ? '原片参照 · 非模拟结果' : '亮度教学处理';
      q('[data-action="original"]').setAttribute('aria-pressed',state.original);
      q('[data-action="original"]').textContent = state.original ? '返回模拟亮度' : '对照原片';
      q('#lab-view-footer').innerHTML = `<span><small>假设光圈</small>f/${N}</span><span><small>假设快门</small>${shutterLabel(seconds)}</span><span><small>假设 ISO</small>${iso}</span>`;
      q('#lab-feedback').textContent = `${Math.abs(ev)<0.5?'接近参考亮度。':ev<0?'相对参考偏暗。':'相对参考偏亮。'} ${seconds<=1/500?'若现场有运动主体，短曝光更有利于凝固动作。':'如果主体运动，较长时间可能留下拖影。'} ${N<4?'大光圈通常让景深变浅，但本图不伪造虚化。':''} ${iso>=1600?'提高 ISO 不增加入射光；本图未模拟噪点。':''}`;
      if (state.reference) {
        const r = state.reference, a = sceneAsset();
        q('#lab-reference').hidden = false;
        q('#lab-reference').innerHTML = `<div class="lab-reference-photo" style="aspect-ratio:${a.width/a.height}"><img src="${esc(a.src)}" alt="已保存的 A 设置亮度参照" width="320" height="213" style="filter:brightness(${clamp(Math.pow(2,r.ev),0.025,8)})"></div><div><strong>已保存 A / 参数对照</strong><p>f/${r.aperture} · ${shutterLabel(r.shutter)} · ISO ${r.iso}</p><p>A：${r.ev.toFixed(1)} EV → 当前：${ev.toFixed(1)} EV</p><p>亮度相近，也可能有不同的运动与景深取舍。</p></div>`;
      }
    }
    if (t === 'composition') {
      q('#lab-value-zoom').textContent = `${state.zoom.toFixed(2)}×`;
      q('#lab-value-positionX').textContent = `${state.positionX}%`;
      q('#lab-value-positionY').textContent = `${state.positionY}%`;
      image.style.transform = `scale(${state.zoom})`;
      image.style.transformOrigin = `${state.positionX}% ${state.positionY}%`;
      q('#lab-image-label').textContent = '裁切练习 · 拍摄机位不变';
      q('#lab-view-footer').innerHTML = `<span><small>裁切倍率</small>${state.zoom.toFixed(2)}×</span><span><small>保留位置</small>${state.positionX}% / ${state.positionY}%</span>`;
      q('#lab-feedback').textContent = state.zoom === 1 ? '当前显示完整底图；位置滑杆在没有裁切时不会改变画面。先放大一点，再选择保留位置。' : `你收紧了画面，正在保留${state.positionX<35?'偏左':state.positionX>65?'偏右':'中间'}的区域。检查主体是否明确、地平线是否合理，以及四边有没有被截断的重要元素。`;
    }
    if (t === 'focal') {
      q('#lab-value-focal').textContent = `${state.focal} mm`;
      q('#lab-fov').textContent = `${model.horizontalFov(state.focal).toFixed(1)}°`;
      image.style.transform = `scale(${state.focal/24})`; image.style.transformOrigin = '50% 50%';
      q('#lab-image-label').textContent = '同机位裁切 · 焦距为示意值';
      q('#lab-view-footer').innerHTML = `<span><small>示意焦距</small>${state.focal} mm</span><span><small>理论水平视角</small>${model.horizontalFov(state.focal).toFixed(1)}°</span>`;
      q('#lab-feedback').textContent = state.focal <= 35 ? '较宽的视角保留更多环境。想一想：哪些背景信息帮助交代故事，哪些是干扰？' : '视角收窄，画面中的景物变大。这里只裁切同一张照片，所以前后景的透视关系没有改变。';
      host.querySelectorAll('[data-focal]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.focal)===state.focal));
    }
    if (t === 'whitebalance') {
      const delta = state.kelvin - 5500;
      q('#lab-value-kelvin').textContent = `${state.kelvin} K`;
      q('#lab-wb-tint').style.background = delta<0?`rgba(42,105,225,${Math.min(.32,-delta/10000)})`:`rgba(249,153,43,${Math.min(.32,delta/14000)})`;
      q('#lab-image-label').textContent = delta===0?'原片参照 · 未标定光源':'冷暖教学处理 · 非真实 K 值标定';
      q('#lab-view-footer').innerHTML = `<span><small>示意设置</small>${state.kelvin} K</span><span><small>相对原片</small>${delta===0?'不做处理':delta<0?'偏冷':'偏暖'}</span>`;
      q('#lab-feedback').textContent = delta===0?'当前没有叠加冷暖处理，显示原片。这不代表原图的光源或相机设置恰好是 5500 K。':delta<0?'同一场景中，降低相机白平衡 K 值通常会使照片更冷。观察天空、亮部和绿色区域的变化。':'同一场景中，提高相机白平衡 K 值通常会使照片更暖。它与“光源色温升高偏蓝”是不同的观察方向。';
      host.querySelectorAll('[data-kelvin]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.kelvin)===state.kelvin));
    }
  }
  root.PhotoLabs = { mount, destroy };
})(typeof window === 'undefined' ? globalThis : window);
