/* A local practice hub for the confirmed camera and lenses; no saved state. */
(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const list = values => (values || []).map(value => `<li>${esc(value)}</li>`).join('');
  const link = (page, id) => '#' + page + '/' + encodeURIComponent(id);
  const practice = [
    ['prime-working-distance', 'prime-distance-focus'],
    ['zoom-range-map', 'zoom-aperture-map'],
    ['two-lens-comparison', 'matched-lens-pairs'],
    ['two-lens-outing', 'two-lens-field-story']
  ];

  function profileNavigation(selected) {
    return `<nav class="eg-profile-nav" aria-label="选择器材方案"><a href="#kit"${selected === 'confirmed' ? ' aria-current="page"' : ''}><small>已确认的器材</small><strong>R6 三代与现有两镜</strong></a><a href="#kit/r6-r7"${selected === 'r6-r7' ? ' aria-current="page"' : ''}><small>假设增加 R7</small><strong>查看可选双机方案</strong></a></nav>`;
  }

  function dualTitle(title) {
    const parts = String(title ?? '').split('：');
    if (parts.length !== 2) return esc(title);
    return `<span class="eg-title-phrase">${esc(parts[0])}：</span><span class="eg-title-phrase">${esc(parts[1])}</span>`;
  }

  function dualPractice(pairs, data) {
    return pairs.map(([lessonId, taskId], index) => {
      const lesson = data.lessons.find(item => item.id === lessonId);
      const task = data.tasks.find(item => item.id === taskId);
      if (!lesson || !task) return '';
      return `<article class="eg-course" data-dual-lesson="${esc(lessonId)}"><span class="eg-label">练习 ${String(index + 1).padStart(2, '0')}</span><h3>${esc(lesson.title)}</h3><p>${esc(lesson.subtitle || lesson.intro)}</p><a href="${link('lesson', lessonId)}">阅读课程 →</a><a href="${link('practice', taskId)}">实拍：${esc(task.title)} →</a></article>`;
    }).join('');
  }

  function renderDual(container) {
    const kit = root.PHOTO_DUAL_CAMERA;
    if (!kit) {
      container.innerHTML = `<section class="eg-root eg-dual-missing">${profileNavigation('r6-r7')}<h1>双机方案资料暂不可用</h1><p>这是“假设增加 R7”的可选内容。可以先回到已确认的 R6 三代与两镜方案继续练习。</p><a class="eg-text-link" href="#kit">返回已有器材方案 →</a></section>`;
      return;
    }
    const data = root.PHOTO_DATA || { lessons: [], tasks: [] };
    container.innerHTML = `<article class="eg-root eg-dual" data-kit-profile="r6-r7">
      <header class="eg-heading"><a class="eg-back" href="#home">← 返回学习路线</a>${profileNavigation('r6-r7')}<p class="eg-kicker">可选方案 / 假设增加 EOS R7</p><h1>${dualTitle(kit.title)}</h1><p class="eg-camera">EOS R6 Mark III ＋ EOS R7</p><p>${esc(kit.intro)}</p><p class="eg-meta">资料核对于 ${esc(kit.checkedAt)}。按现场目的验证分工；当前单机与两镜的课程仍可独立完成。</p></header>
      <section class="eg-section eg-boundaries"><h2>先分清记录区域，再安排双机</h2><div class="eg-key-points">${kit.keyPoints.map(point => `<div><h3>${esc(point.title)}</h3><p>${esc(point.body)}</p></div>`).join('')}</div></section>
      <section class="eg-section eg-pairings"><h2>先从这样的分工试拍</h2><p>这是一套练习起点，按拍摄目的和现场限制调整。</p><div class="eg-pairing-grid">${kit.preferredPairing.map(item => `<article class="eg-pairing"><h3>${esc(item.body)}</h3><p class="eg-pairing-lens">${esc(item.lens)}</p><p>${esc(item.role)}</p><dl><div><dt>起步与调整</dt><dd>${esc(item.start)}</dd></div><div><dt>试拍后检查</dt><dd>${esc(item.check)}</dd></div></dl></article>`).join('')}</div></section>
      <section class="eg-section eg-combinations"><h2>四种搭配，分别读记录条件</h2><p class="eg-note">视角、记录尺寸和可用细节回答不同问题。表中像素要连同模式与限制阅读；窄屏可横向滚动对照表。</p><div class="eg-combinations-scroll" role="region" aria-label="双机四种机身镜头组合的记录条件" tabindex="0"><table class="eg-combination-table"><caption>机身与镜头搭配、记录区域、视角和记录像素</caption><thead><tr><th scope="col">机身</th><th scope="col">镜头</th><th scope="col">记录区域</th><th scope="col">视角参照</th><th scope="col">记录像素与条件</th><th scope="col">比较边界</th></tr></thead><tbody>${kit.combinations.map(item => `<tr><th scope="row">${esc(item.body)}</th><td>${esc(item.lens)}</td><td>${esc(item.recording)}</td><td>${esc(item.view)}</td><td>${esc(item.pixels)}</td><td>${esc(item.note)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="eg-section eg-controls"><h2>拿起另一台机身，重新核对操作</h2><p>按当前机型展开，分别核查开关、菜单和拨轮。默认操作可能被自定义改变。</p><div class="eg-control-list">${kit.controls.map(item => `<details class="eg-control" data-dual-control="${esc(item.id)}"><summary>${esc(item.title)}</summary><div class="eg-control-body"><div class="eg-control-models"><section><h3>EOS R6 Mark III</h3><p>${esc(item.r6)}</p></section><section><h3>EOS R7</h3><p>${esc(item.r7)}</p></section></div><h3>对照着做一次</h3><ol>${list(item.steps)}</ol><p class="eg-control-check"><strong>检查结果：</strong>${esc(item.check)}</p></div></details>`).join('')}</div></section>
      <section class="eg-section eg-dual-scenarios"><h2>按场景决定两台机身的分工</h2><div class="eg-scene-grid">${kit.scenarios.map(scene => `<details class="eg-scene" data-dual-scenario="${esc(scene.id)}"><summary><span>${esc(scene.title)}</span><small>${esc(scene.pairing)}</small></summary><div class="eg-scene-body"><h3>从这些设置开始</h3><ul>${list(scene.settings)}</ul><h3>试拍后检查</h3><ul>${list(scene.checks)}</ul><h3>什么时候调整分工</h3><p>${esc(scene.changeWhen)}</p><a class="eg-text-link" href="${link('lesson', scene.lessonId)}">进入对应课程 →</a></div></details>`).join('')}</div></section>
      <section class="eg-section eg-workflow"><h2>从出门前到照片归档</h2><p>让两台机身的拍摄条件和文件都能追溯，再比较成片。</p>${kit.workflow.map((item, index) => `<details class="eg-workflow-step"><summary><span>${String(index + 1).padStart(2, '0')}</span>${esc(item.title)}</summary><ol>${list(item.steps)}</ol></details>`).join('')}</section>
      <section class="eg-section eg-dual-practice"><h2>带着三个问题完成正式练习</h2><p>有相应机身时记录实拍证据；尚未具备的条件如实注明，先完成已有器材可做的部分。</p><div class="eg-course-grid">${dualPractice(kit.practicePairs, data)}</div></section>
      <section class="eg-section eg-check eg-dual-check"><h2>换机前后，用一张试拍确认</h2><ol>${list(kit.quickCheck)}</ol><a class="eg-text-link" href="#kit">回到已确认的单机两镜方案 →</a></section>
      <details class="eg-sources"><summary>双机方案资料来源</summary><p>来源分别对应机身与镜头。离线时可阅读本页，外部原文需要联网；具体功能以实际机身、固件和自定义设置为准。</p><ul>${kit.sources.filter(source => /^https?:\/\//i.test(source.url)).map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>${source.note ? `<p>${esc(source.note)}</p>` : ''}</li>`).join('')}</ul></details>
    </article>`;
  }

  function recordArea() {
    return `<figure class="eg-record-area"><svg viewBox="0 0 640 400" role="img" aria-labelledby="eg-area-title eg-area-description"><title id="eg-area-title">同机位、同为 50mm 时的全画幅与 1.6 倍裁切记录区域</title><desc id="eg-area-description">外框代表 RF50 使用全画幅记录；内框代表 RF-S18–150 设为 50mm 的裁切记录，内框宽和高均为外框的 62.5%。镜头实际焦距仍为 50mm，裁切取景视角约对应全画幅 80mm；这不是两镜画质、虚化或透视的模拟。</desc><rect data-eg-frame="full" x="80" y="40" width="480" height="320" rx="0" fill="#edf3e6" stroke="#335b47" stroke-width="3"/><path d="M80 200H560M320 40V360" stroke="#b6c9a4" stroke-width="2" stroke-dasharray="8 7"/><text x="100" y="79" fill="#335b47" font-size="34">全画幅记录</text><rect data-eg-frame="crop" x="170" y="100" width="300" height="200" rx="0" fill="#dce8bf" fill-opacity=".75" stroke="#ac673b" stroke-width="3"/><text x="320" y="181" text-anchor="middle" fill="#314d38" font-size="36">1.6× 裁切</text><text x="320" y="230" text-anchor="middle" fill="#314d38" font-size="32">只记录内框区域</text></svg><p class="eg-area-ratio">内框的宽、高各为外框的 <strong>62.5%</strong>。</p><figcaption><strong>原创记录区域示意 · 非样片或光学仿真</strong><p>同一机位，两镜都设为 50mm：外框是 RF50 的全画幅记录，内框是 RF-S18–150 的 1.6 倍裁切记录。RF50 若手动启用同样裁切，也只取内框区域。图中不比较画质、虚化和透视；实际焦距仍是 50mm。</p></figcaption></figure>`;
  }

  function lensCard(lens) {
    return `<article class="eg-lens" data-equipment-lens="${esc(lens.id)}"><h3>${esc(lens.name)}</h3><p class="eg-lens-role">${esc(lens.role)}</p><dl><div><dt>记录范围</dt><dd>${esc(lens.coverage)}</dd></div><div><dt>光圈选择</dt><dd>${esc(lens.aperture)}</dd></div></dl><details><summary>查看防抖、对焦与近摄条件</summary><dl>${[['防抖', lens.stabilization], ['对焦与操作', lens.focus], ['近摄条件', lens.closeFocus], ['滤镜口径', lens.filter]].map(([name, value]) => `<div><dt>${name}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></details><a class="eg-text-link" href="${link('lesson', lens.lessonId)}">把这支镜头用熟 →</a></article>`;
  }

  function mount(container, profileId) {
    destroy();
    if (!container) return;
    if (profileId === 'r6-r7') { renderDual(container); return; }
    const kit = root.PHOTO_EQUIPMENT;
    if (!kit) {
      container.innerHTML = '<section class="eg-root"><h1>器材练习资料暂不可用</h1><p>请重新打开完整项目，或先回到课程继续学习。</p><a class="eg-text-link" href="#home">返回学习路线 →</a></section>';
      return;
    }
    const data = root.PHOTO_DATA || { lessons: [], tasks: [] };
    container.innerHTML = `<article class="eg-root" data-kit-profile="confirmed">
      <header class="eg-heading"><a class="eg-back" href="#home">← 返回学习路线</a>${profileNavigation('confirmed')}<p class="eg-kicker">已确认的器材 / 按手头设备练习</p><h1>${esc(kit.title)}</h1><p class="eg-camera">${esc(kit.camera.name)}</p><p>${esc(kit.camera.summary)}</p><p class="eg-meta">资料核对于 ${esc(kit.checkedAt)}。以下围绕静止图像练习；现场仍要检查光线、动作与相机实际读数。</p></header>
      <section class="eg-section eg-boundaries"><h2>先看记录范围，再比较镜头</h2><div class="eg-key-points">${kit.keyPoints.map(point => `<div><h3>${esc(point.title)}</h3><p>${esc(point.body)}</p></div>`).join('')}</div></section>
      <section class="eg-section eg-lenses"><h2>两支镜头，各自从哪里用起</h2><div class="eg-lens-grid">${kit.lenses.map(lensCard).join('')}</div></section>
      <section class="eg-section eg-view"><h2>同为 50mm，先确认记录区域</h2>${recordArea()}<h3>把镜头刻度和取景视角分开读</h3><p class="eg-note">表中“视角”用于比较取景范围，不改变实际焦距，也不直接换算曝光设置。窄屏可横向滚动表格。</p><div class="eg-angle-scroll" role="region" aria-label="镜头实际焦距、记录模式与视角对照" tabindex="0"><table class="eg-angle-table"><caption>在已确认机身上的记录范围与视角对照</caption><thead><tr><th scope="col">镜头</th><th scope="col">实际焦距</th><th scope="col">记录区域</th><th scope="col">视角参照</th><th scope="col">使用边界</th></tr></thead><tbody>${kit.viewAngles.map(row => `<tr><th scope="row">${esc(row.lens)}</th><td>${esc(row.setting)}</td><td>${esc(row.recording)}</td><td>${esc(row.view)}</td><td>${esc(row.note)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="eg-section eg-scenarios"><h2>这次想拍什么</h2><p>按场景展开起点，先试拍、再看结果；没有一组数值适用于所有现场。</p><div class="eg-scene-grid">${kit.scenarios.map(scene => `<details class="eg-scene" data-equipment-scene="${esc(scene.id)}"><summary><span>${esc(scene.title)}</span><small>${esc(scene.lens)}</small></summary><div class="eg-scene-body"><h3>从这些设置开始</h3><ul>${list(scene.settings)}</ul><h3>试拍后检查</h3><ul>${list(scene.checks)}</ul><h3>什么时候调整或换镜</h3><p>${esc(scene.changeWhen)}</p><a class="eg-text-link" href="${link('lesson', scene.lessonId)}">进入对应课程 →</a></div></details>`).join('')}</div></section>
      <section class="eg-section eg-course-section"><h2>把经验留在四次正式练习里</h2><p>先读对应课程，再带着独立任务拍摄。保留原片、条件和结论，方便下次比较。</p><div class="eg-course-grid">${practice.map(([lessonId, taskId], index) => {
        const lesson = data.lessons.find(item => item.id === lessonId);
        const task = data.tasks.find(item => item.id === taskId);
        if (!lesson || !task) return '';
        return `<article class="eg-course" data-equipment-lesson="${esc(lessonId)}"><span class="eg-label">练习 ${String(index + 1).padStart(2, '0')}</span><h3>${esc(lesson.title)}</h3><p>${esc(lesson.subtitle || lesson.intro)}</p><a href="${link('lesson', lessonId)}">阅读课程 →</a><a href="${link('practice', taskId)}">实拍：${esc(task.title)} →</a></article>`;
      }).join('')}</div></section>
      <section class="eg-section eg-check"><h2>换镜后，用一张试拍重新确认</h2><ol>${list(kit.quickCheck)}</ol><a class="eg-text-link" href="#camera">回看相机操作与配置 →</a></section>
      <details class="eg-sources"><summary>资料来源与核验说明</summary><p>以下为官方资料；本页内容可离线查阅，打开外部原文需要联网。通用课程中的 24–105 示例仍有其适用范围，本页提供这套已确认器材的练习入口。</p><ul>${kit.sources.filter(source => /^https?:\/\//i.test(source.url)).map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>${source.note ? `<p>${esc(source.note)}</p>` : ''}</li>`).join('')}</ul></details>
    </article>`;
  }

  // Native disclosure/link behavior needs no listeners, timers or progress state.
  function destroy() {}
  const api = { mount, destroy };
  root.PhotoEquipment = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
