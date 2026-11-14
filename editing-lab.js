/* Non-destructive JPEG display exercise. This is not a RAW developer. */
(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const WORKFLOW = [
    { id:'backup', title:'保留原片与备份', why:'先保留原始文件，并建立独立备份。后续调整和导出都另存，避免把唯一原片覆盖掉。', cue:'先让素材安全，再开始处理。' },
    { id:'select', title:'选片，检查清晰度', why:'先筛掉意外失焦、严重运动模糊和无用重复片。放大检查主体；不要在没有使用价值的照片上反复调色。', cue:'先选择值得处理的照片。' },
    { id:'geometry', title:'校正与整理构图', why:'检查镜头校正、水平、画面边缘，再决定裁切。先明确保留哪些内容，后续明暗和颜色判断才有对象。', cue:'先整理画面结构。' },
    { id:'whitebalance', title:'确定白平衡', why:'选择准确还原或有意偏暖、偏冷的方向。人像留意肤色，也要区分现场光色与错误偏色。', cue:'先建立颜色基准，再强化颜色。' },
    { id:'tone', title:'调整整体与局部明暗', why:'根据主体调整曝光、高光和阴影，必要时局部处理。真正没有记录下来的高光细节，不能靠降低亮度重新生成。', cue:'让主体可读，重要细节可见。' },
    { id:'color', title:'克制地处理色彩', why:'再判断饱和度、颜色关系和局部调整。人像注意肤色自然；不要用强饱和或强磨皮代替光线与表达。', cue:'颜色服务主题，而不是只求更鲜艳。' },
    { id:'output', title:'按用途检查并另存输出', why:'按观看尺寸检查降噪与锐化，再核对尺寸、色彩空间、压缩和用途。保留原片与编辑记录，导出另一个文件。', cue:'输出不是覆盖原片，而是交付一个版本。' }
  ];
  const GOALS = {
    natural: { title:'自然、耐看', prompt:'保留现场感，先让主体容易看清，再判断是否真的需要更多颜色。', check:'比较亮部细节、暗部层次，以及你能否用一句话解释每一个改动。' },
    subject: { title:'主体更明确', prompt:'让目光更容易找到主角。先试少量明暗或对比，避免把整张照片都推得很重。', check:'比较主体与背景的分离感。若全局调整同时强化了干扰，真实软件中应考虑局部处理或重新裁切。' },
    gentle: { title:'克制的色彩', prompt:'先看原片的主色，再轻调饱和与冷暖。颜色协调比颜色数量更重要。', check:'观察颜色是否抢走主题。人像尤其要检查肤色与背景是否一起被染色。' }
  };
  const sceneNames = { landscape:'风景 · 层次与颜色', portrait:'人像 · 肤色与背景', street:'街头 · 主体与环境' };
  let host, aborter, state;
  const q = selector => host?.querySelector(selector);
  const assets = () => root.PHOTO_MEDIA?.assets || {};
  const available = () => ['landscape','portrait','street'].filter(id => assets()[id]);
  function defaults(scene) {
    return { scene, exposure:0, contrast:100, saturation:100, warmth:0, reveal:50, goal:'natural', sequence:[], workflowMessage:'从最先该做的一步开始。选择下方步骤，搭起一条完整工作流。', workflowWrong:false, inspected:false };
  }
  function mount(container) {
    destroy(); host = container; state = defaults(available()[0] || 'landscape'); aborter = new AbortController();
    const options = { signal:aborter.signal };
    host.addEventListener('click', onClick, options);
    host.addEventListener('input', onInput, options);
    host.addEventListener('change', onChange, options);
    host.addEventListener('pointerdown', dragCompare, options);
    host.addEventListener('pointermove', dragCompare, options);
    host.addEventListener('pointerup', endDrag, options);
    host.addEventListener('pointercancel', endDrag, options);
    host.addEventListener('load', imageLoaded, { ...options, capture:true });
    host.addEventListener('error', imageFailed, { ...options, capture:true });
    render();
  }
  function destroy() { aborter?.abort(); host = null; aborter = null; state = null; }
  function imageLoaded(event) {
    if (event.target.tagName !== 'IMG' || !host?.contains(event.target)) return;
    updateImageStage(event.target.closest('.edit-photo-stage'));
  }
  function imageFailed(event) {
    if (event.target.tagName !== 'IMG' || !host?.contains(event.target)) return;
    event.target.dataset.imageFailed = 'true';
    updateImageStage(event.target.closest('.edit-photo-stage'));
  }
  function updateImageStage(stage) {
    if (!stage || !host?.contains(stage)) return;
    const images = [...stage.querySelectorAll('img')];
    const failed = !images.length || images.some(img => img.dataset.imageFailed === 'true' || (img.complete && !img.naturalWidth));
    const ready = !failed && images.every(img => img.complete && img.naturalWidth > 0);
    stage.classList.toggle('edit-loaded', ready);
    stage.setAttribute('aria-busy', String(!ready && !failed));
    const notice = stage?.querySelector('.edit-image-status');
    if (notice) notice.textContent = failed ? '照片未能完整加载，请确认 assets 文件夹完整，或恢复连接后重试。下方后期顺序练习仍可使用。' : '正在载入全部对比照片…';
    const retry = q('[data-action="reload-photo"]');
    if (retry) retry.hidden = !failed;
  }
  function button(text, attrs = '') { return `<button type="button" class="edit-button" ${attrs}>${text}</button>`; }
  function control(id, label, min, max, step, low, high, hint) {
    return `<div class="edit-control"><label for="edit-${id}"><span>${label}</span><output for="edit-${id}" id="edit-value-${id}"></output></label><input id="edit-${id}" type="range" min="${min}" max="${max}" step="${step}" value="${state[id]}" data-edit="${id}"><div class="edit-range-labels"><span>${low}</span><span>${high}</span></div><p>${hint}</p></div>`;
  }
  function credit(a) {
    return `<p class="edit-credit">照片：${esc(a.title)} · 作者：${esc(a.author)} · <a href="${esc(a.source)}" target="_blank" rel="noopener noreferrer">来源与拍摄说明 ↗</a> · <a href="${esc(a.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(a.license)}</a> · <a href="${esc(a.src)}" target="_blank" rel="noopener noreferrer">完整原图 ↗</a></p><p class="edit-credit-note">调整仅存在于本页面显示中，原文件未改变。显示处理不代表原作者的原始成片或认可；照片及展示改编沿用对应图片许可。</p>`;
  }
  function render() {
    const a = assets()[state.scene], choices = available();
    host.innerHTML = `<section class="edit-root" aria-label="摄影后期学习工作台"><div class="edit-intro"><div><span class="edit-eyebrow">观察原片 → 明确目标 → 少量调整 → 前后核对</span><h2>后期，让照片更接近你的想法。</h2><p>一次只改一个参数。先说出想改善什么，再判断这次改动是否真的有帮助。</p></div><span class="edit-mode-label">JPEG 屏幕练习</span></div><div class="edit-boundary"><strong>这里练判断，不模拟完整 RAW 处理器。</strong><p>曝光是显示亮度处理，冷暖是简化色彩覆盖。没有 RAW / CR3 解码、局部蒙版、真实高光恢复或文件导出，也不会修改原片。</p></div>
      <div class="edit-source-row"><div class="edit-scene-buttons" role="group" aria-label="选择练习照片">${choices.map(id => button(sceneNames[id], `data-scene="${id}" aria-pressed="${state.scene === id}"`)).join('')}</div>${button('↺ 重置全部调整', 'data-action="reset"')}</div>
      <div class="edit-workspace"><div class="edit-visual">${a ? `<div class="edit-photo-stage" tabindex="-1" style="--edit-ratio:${a.width / a.height || 1.5}" role="img" aria-label="同一张照片的前后对比，左侧原图、右侧调整图，拖动照片或下方滑杆改变分界"><div class="edit-photo-layer edit-after"><img id="edit-adjusted-image" src="${esc(a.src)}" alt="${esc(a.alt)}，当前调整版本" width="${a.width || 1600}" height="${a.height || 1067}" decoding="async" draggable="false"><div class="edit-warmth" id="edit-warmth-overlay"></div></div><div class="edit-photo-layer edit-before" id="edit-before"><img src="${esc(a.src)}" alt="${esc(a.alt)}，原片参照" width="${a.width || 1600}" height="${a.height || 1067}" decoding="async" draggable="false"></div><span class="edit-picture-label edit-original-label">原图</span><span class="edit-picture-label edit-adjusted-label">调整图</span><div class="edit-divider" id="edit-divider"><span>↔</span></div><span class="edit-image-status">正在载入照片…</span></div>${button('重新加载照片', 'data-action="reload-photo" hidden')}<div class="edit-compare-controls"><label for="edit-reveal">拖动分界，核对改变 <output id="edit-value-reveal" for="edit-reveal"></output></label><input id="edit-reveal" type="range" min="0" max="100" step="1" value="${state.reveal}" data-edit="reveal"><div class="edit-compare-buttons">${button('只看原图', 'data-view="100"')}${button('各看一半', 'data-view="50"')}${button('只看调整图', 'data-view="0"')}</div></div>${credit(a)}` : '<div class="edit-missing"><h3>本地照片暂不可用</h3><p>请确认 PHOTO_MEDIA 已先于后期工作台加载，或先完成下方的后期顺序练习。</p></div>'}<div class="edit-feedback" aria-live="polite"><span>当前调整的含义</span><p id="edit-live-feedback"></p></div></div>
      <aside class="edit-controls" aria-label="后期调整参数"><h3>先小幅度，再做比较</h3>${control('exposure','曝光（显示亮度）',-1.5,1.5,.1,'−1.5 EV','+1.5 EV','增加亮度不等于恢复传感器没记录下来的细节。')}${control('contrast','对比',70,130,1,'更柔和','更强烈','观察明暗关系；高对比可能让阴影与亮部更难分辨。')}${control('saturation','饱和',0,150,1,'无彩色','更鲜艳','颜色更多、更浓，不代表表达更好。留意肤色和主色。')}${control('warmth','冷暖倾向',-50,50,1,'偏冷','偏暖','以原片为零点，不把数值当作相机 K 值或准确白平衡。')}<div class="edit-preset-row"><span>体验一次调整，再说出取舍</span>${button('轻量示例', 'data-action="subtle"')}${button('查看过度调整示例', 'data-action="excessive"')}</div></aside></div>
      <section class="edit-goal"><div><span class="edit-eyebrow">带着目标观察</span><h3>你希望这次调整解决什么？</h3><label for="edit-goal">选择观察目标</label><select id="edit-goal">${Object.entries(GOALS).map(([id,g]) => `<option value="${id}" ${state.goal === id?'selected':''}>${g.title}</option>`).join('')}</select><p id="edit-goal-prompt"></p></div><div class="edit-goal-check"><h4>对照原片，问自己两个问题</h4><ol><li>主角更容易被看见了吗？</li><li>有没有为了一个变化，牺牲重要的细节或自然感？</li></ol>${button('检查我的调整思路', 'data-action="inspect"')}<p id="edit-goal-feedback" class="edit-goal-feedback" aria-live="polite"></p></div></section>
      <section class="edit-workflow"><div class="edit-section-head"><div><span class="edit-eyebrow">主动回忆 / 不看答案排一次</span><h3>把后期步骤连成一条路。</h3><p>这是适合入门的检查顺序，不是软件强制规则。真实编辑可以来回调整；每一步都要有理由。</p></div>${button('重新练一次', 'data-action="restart-order"')}</div><div id="edit-workflow-progress" class="edit-workflow-progress" aria-label="已选择的后期顺序"></div><div id="edit-workflow-options" class="edit-workflow-options"></div><p class="edit-order-feedback" id="edit-order-feedback" aria-live="polite"></p><details class="edit-workflow-answer"><summary>需要提示？查看完整流程与每步目的</summary><ol>${WORKFLOW.map(item => `<li><strong>${item.title}</strong><p>${item.why}</p></li>`).join('')}</ol></details></section>
      <section class="edit-takeaway"><div><h3>RAW 有余地，拍摄仍要到位。</h3><p>RAW 通常让白平衡与明暗调整更灵活，但不能保证修复严重失焦、主体拖影或真正丢失的高光。拍摄时先对准焦点、选择合适快门，并检查重要高光。</p><a href="#lesson/editing-basic">学习完整后期流程 →</a></div><div><h3>把今天的练习，带到自己的作品。</h3><p>选 3 张同一组照片，先统一基本亮度与颜色，再逐张检查主体。隔天不看调整记录，说出每张“为什么改、改了什么、保留了什么”。</p><a href="#lesson/editing-portrait">继续学习人像后期 →</a></div></section></section>`;
    update(); renderOrder();
    updateImageStage(q('.edit-photo-stage'));
  }
  function update() {
    const image = q('#edit-adjusted-image');
    if (image) {
      image.style.filter = `brightness(${Math.pow(2,state.exposure).toFixed(4)}) contrast(${state.contrast}%) saturate(${state.saturation}%)`;
      const warm = q('#edit-warmth-overlay');
      warm.style.background = state.warmth < 0 ? `rgba(47,105,226,${Math.abs(state.warmth)/220})` : `rgba(244,148,42,${state.warmth/220})`;
      q('#edit-before').style.clipPath = `inset(0 ${100-state.reveal}% 0 0)`;
      q('#edit-divider').style.left = `${state.reveal}%`;
      q('#edit-value-reveal').textContent = `原图 ${state.reveal}% / 调整图 ${100-state.reveal}%`;
      q('.edit-original-label').hidden = state.reveal === 0;
      q('.edit-adjusted-label').hidden = state.reveal === 100;
      const stage = q('.edit-photo-stage');
      stage.setAttribute('aria-label',`同一张照片前后比较，原图显示 ${state.reveal}%，调整图显示 ${100-state.reveal}%。曝光 ${state.exposure.toFixed(1)} EV，对比 ${state.contrast}%，饱和 ${state.saturation}%，冷暖 ${state.warmth}。`);
    }
    q('#edit-value-exposure').textContent = `${state.exposure>0?'+':''}${state.exposure.toFixed(1)} EV`;
    q('#edit-value-contrast').textContent = `${state.contrast}%`;
    q('#edit-value-saturation').textContent = `${state.saturation}%`;
    q('#edit-value-warmth').textContent = state.warmth === 0 ? '原片' : `${state.warmth<0?'偏冷':'偏暖'} ${Math.abs(state.warmth)}`;
    const changes = [];
    if (state.exposure) changes.push(`${state.exposure>0?'提亮':'压暗'}画面 ${Math.abs(state.exposure).toFixed(1)} EV（屏幕显示）`);
    if (state.contrast !== 100) changes.push(state.contrast>100?'增强整体明暗反差':'减弱整体明暗反差');
    if (state.saturation !== 100) changes.push(state.saturation===0?'移除画面的彩色成分':state.saturation>100?'提高颜色浓度':'降低颜色浓度');
    if (state.warmth) changes.push(state.warmth>0?'叠加暖色倾向':'叠加冷色倾向');
    q('#edit-live-feedback').textContent = changes.length ? `${changes.join('；')}。现在切回原图，检查变化是否符合你的意图。` : '当前没有调整，原图与调整图相同。先选一个想改善的问题，再小幅改变一个参数。';
    q('#edit-goal-prompt').textContent = GOALS[state.goal].prompt;
    if (state.inspected) inspect(); else q('#edit-goal-feedback').textContent = '';
  }
  function inspect() {
    const issues = [];
    if (Math.abs(state.exposure)>1) issues.push('亮度变化较大，重点检查亮部是否变成一片白、暗部是否失去层次');
    if (state.contrast>120) issues.push('对比较强，检查肤色过渡、衣物或阴影中的细节');
    if (state.saturation>125) issues.push('饱和度较高，检查颜色是否压过主体，尤其是肤色与绿植');
    if (Math.abs(state.warmth)>35) issues.push('冷暖改变明显，确认是有意表达，而不是把偏色当作风格');
    const unchanged = state.exposure===0 && state.contrast===100 && state.saturation===100 && state.warmth===0;
    q('#edit-goal-feedback').textContent = `${unchanged?'你保留了原片。若它已经符合意图，不改也是合理选择。':issues.length?`优先检查：${issues.join('；')}。`:'调整幅度比较克制，但数值温和不自动等于效果正确。'} ${GOALS[state.goal].check} 这里给出观察提示，不按参数给审美打分。`;
  }
  function syncControls() {
    ['exposure','contrast','saturation','warmth','reveal'].forEach(key=>{ const input=q(`#edit-${key}`); if(input) input.value=state[key]; });
  }
  function renderOrder() {
    q('#edit-workflow-progress').innerHTML = WORKFLOW.map((item,index)=>`<span class="edit-order-slot ${index<state.sequence.length?'is-filled':''}"><b>${String(index+1).padStart(2,'0')}</b>${index<state.sequence.length?esc(item.title):'待选择'}</span>`).join('');
    const shuffled = ['tone','select','output','backup','color','geometry','whitebalance'];
    q('#edit-workflow-options').innerHTML = shuffled.map(id=>{const step=WORKFLOW.find(x=>x.id===id);const done=state.sequence.includes(id);return button(`${done?'✓ ':''}${esc(step.title)}`,`data-order="${id}" ${done?'disabled':''}`);}).join('');
    const message = q('#edit-order-feedback'); message.textContent = state.workflowMessage;
    message.classList.toggle('is-wrong',state.workflowWrong);
  }
  function onClick(event) {
    const buttonNode = event.target.closest('button'); if(!buttonNode) return;
    if (buttonNode.dataset.scene) {
      const practice = { goal:state.goal, sequence:[...state.sequence], workflowMessage:state.workflowMessage, workflowWrong:state.workflowWrong };
      state = { ...defaults(buttonNode.dataset.scene), ...practice }; render(); q(`[data-scene="${state.scene}"]`)?.focus(); return;
    }
    if (buttonNode.dataset.view != null) { state.reveal=Number(buttonNode.dataset.view); syncControls(); update(); return; }
    if (buttonNode.dataset.order) {
      const id=buttonNode.dataset.order,expected=WORKFLOW[state.sequence.length]; if(!expected)return;
      if(id===expected.id){state.sequence.push(id);state.workflowWrong=false;state.workflowMessage=state.sequence.length===WORKFLOW.length?'✓ 已连成完整流程。记住：先保护原片，再判断、再调整，最后按用途另存输出。下一次试着不看选项，用自己的话复述。':`✓ ${expected.why} 下一步提示：${WORKFLOW[state.sequence.length].cue}`;}
      else {state.workflowWrong=true;state.workflowMessage=`这一步先稍后安排。当前先想：${expected.cue} 你可以再选一次，不会丢失已排好的步骤。`;}
      renderOrder(); const next=host.querySelector('[data-order]:not(:disabled)'); next?.focus({preventScroll:true}); return;
    }
    const action=buttonNode.dataset.action;
    if(action==='reload-photo'){render();q('.edit-photo-stage')?.focus({preventScroll:true});return;}
    if(action==='reset'){state.exposure=0;state.contrast=100;state.saturation=100;state.warmth=0;state.reveal=50;state.inspected=false;syncControls();update();}
    if(action==='subtle'){state.exposure=.2;state.contrast=105;state.saturation=104;state.warmth=8;state.reveal=50;syncControls();update();}
    if(action==='excessive'){state.exposure=1.3;state.contrast=130;state.saturation=145;state.warmth=45;state.reveal=50;state.inspected=true;syncControls();update();}
    if(action==='inspect'){state.inspected=true;inspect();}
    if(action==='restart-order'){state.sequence=[];state.workflowWrong=false;state.workflowMessage='重新开始。先回忆，再选出第一步。';renderOrder();}
  }
  function onInput(event) {
    const key=event.target.dataset.edit;
    if(!['exposure','contrast','saturation','warmth','reveal'].includes(key))return;
    state[key]=Number(event.target.value);update();
  }
  function onChange(event) { if(event.target.id==='edit-goal'){state.goal=event.target.value;update();} }
  function dragCompare(event) {
    const frame=event.target.closest('.edit-photo-stage');if(!frame)return;
    if(event.type==='pointerdown'){if(event.button!==0)return;frame.setPointerCapture(event.pointerId);frame.dataset.dragging=String(event.pointerId);}
    else if(frame.dataset.dragging!==String(event.pointerId))return;
    const rect=frame.getBoundingClientRect();if(!rect.width)return;
    state.reveal=Math.round(clamp((event.clientX-rect.left)/rect.width*100,0,100));syncControls();update();
  }
  function endDrag(event){const frame=event.target.closest('.edit-photo-stage');if(!frame||frame.dataset.dragging!==String(event.pointerId))return;if(frame.hasPointerCapture(event.pointerId))frame.releasePointerCapture(event.pointerId);delete frame.dataset.dragging;}
  root.PhotoEditing = { mount,destroy };
})(typeof window !== 'undefined' ? window : globalThis);
