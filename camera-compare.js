/* Read-only, model-by-model camera configuration. No progress or browser state. */
(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const items = value => Array.isArray(value) ? value : value ? [value] : [];
  const list = value => items(value).map(item => `<li>${esc(item)}</li>`).join('');
  const route = id => '#camera-compare/' + encodeURIComponent(id);
  const recordRoute = (page, id) => '#' + page + '/' + encodeURIComponent(id);
  const models = [['r6', 'EOS R6 Mark III'], ['r7', 'EOS R7']];

  function directory(topics, selected, open = false) {
    const groups = [...new Set(topics.map(topic => topic.group))];
    return `<details class="cc-directory"${open ? ' open' : ''}><summary>选择参数或配置主题 <span>共 ${topics.length} 项</span></summary><nav aria-label="两机配置对照主题">${groups.map(group => `<div class="cc-topic-group"><h2>${esc(group || '配置对照')}</h2>${topics.filter(topic => topic.group === group).map(topic => `<a href="${route(topic.id)}"${topic.id === selected ? ' aria-current="page"' : ''}><span>${String(topics.indexOf(topic) + 1).padStart(2, '0')}</span>${esc(topic.title)}</a>`).join('')}</div>`).join('')}</nav></details>`;
  }

  function sourceList(sources) {
    return items(sources).filter(source => /^https?:\/\//i.test(source.url)).map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>${source.note ? `<p>${esc(source.note)}</p>` : ''}</li>`).join('');
  }

  function modelPane(key, name, content) {
    return `<section class="cc-model" data-camera-model="${key}"><h3>${name}</h3>${content}</section>`;
  }

  function modelSection(topic, key, title, render, note = '') {
    return `<section class="cc-section cc-${key}" data-compare-section="${key}"><h2>${title}</h2>${note ? `<p class="cc-note">${note}</p>` : ''}<div class="cc-model-grid">${models.map(([model, name]) => modelPane(model, name, render(topic[model]))).join('')}</div></section>`;
  }

  function pitfalls(values) {
    return `<dl class="cc-pitfall-list">${items(values).map(item => `<div><dt>${esc(item.symptom)}</dt><dd>${esc(item.fix)}</dd></div>`).join('')}</dl>`;
  }

  function practice(topic, data) {
    const task = (data.tasks || []).find(item => item.id === topic.taskId);
    const lessons = items(topic.lessonIds).map(id => (data.lessons || []).find(item => item.id === id)).filter(Boolean);
    return `${task ? `<a class="cc-task" href="${recordRoute('practice', task.id)}">实拍：${esc(task.title)} →</a>` : '<p>可先按本页步骤试拍，并保留实际设置与结果。</p>'}${lessons.length ? `<h4>回到相关原理</h4><ul>${lessons.map(lesson => `<li><a href="${recordRoute('lesson', lesson.id)}">${esc(lesson.title)} →</a></li>`).join('')}</ul>` : ''}`;
  }

  function basicsContent(topic) {
    return `<section class="cc-section cc-specs" data-compare-section="specs"><h2>参数、条件和换机后的影响</h2><p class="cc-note">把数值连同记录模式、镜头和限制一起读。表格用于理解设置，不把规格直接当作成片质量排名。</p><table role="table"><caption>EOS R6 Mark III 与 EOS R7：基础参数及使用条件</caption><thead role="rowgroup"><tr role="row"><th scope="col">参数</th><th scope="col">EOS R6 Mark III</th><th scope="col">EOS R7</th><th scope="col">换机时怎样理解</th></tr></thead><tbody role="rowgroup">${items(topic.specs).map(spec => `<tr role="row" data-compare-spec><th scope="row" role="rowheader">${esc(spec.name)}</th><td role="cell" data-label="EOS R6 Mark III">${esc(spec.r6)}</td><td role="cell" data-label="EOS R7">${esc(spec.r7)}</td><td role="cell" data-label="换机时怎样理解">${esc(spec.meaning)}</td></tr>`).join('')}</tbody></table></section>
      <section class="cc-section cc-setup" data-compare-section="setup"><h2>拿起相机后，按顺序建立起点</h2><p class="cc-note">先记原值，再逐项调整；试拍确认后才把它作为自己的起点。</p>${items(topic.setup).map(step => `<section class="cc-setup-step" data-compare-setup><h3>${esc(step.title)}</h3><div class="cc-model-grid">${models.map(([key, name]) => `<div class="cc-model" data-camera-model="${key}"><h4>${name}</h4><p>${esc(step[key])}</p></div>`).join('')}</div><p class="cc-result"><strong>确认结果：</strong>${esc(step.check)}</p></section>`).join('')}</section>
      <section class="cc-section cc-basics-pitfalls" data-compare-section="pitfalls"><h2>常见误读，先核对再调整</h2>${pitfalls(topic.pitfalls)}</section>
      <section class="cc-section cc-basics-sources" data-compare-section="sources"><h2>核对规格与官方依据</h2><p class="cc-note">本页可离线阅读，打开官方原文需要联网。具体功能仍需结合机身固件和当前模式确认。</p><ul class="cc-source-list">${sourceList(topic.sources)}</ul></section>`;
  }

  function topicContent(topic, data) {
    if (!topic.r6 || !topic.r7) return '<section class="cc-section cc-incomplete"><h2>此主题的机型资料尚不完整</h2><p>请先查看基础参数或原有R6三代手册，重新打开完整项目后再试。</p><a href="#camera-compare/basics">返回基础参数 →</a></section>';
    return `<section class="cc-section cc-differences"><h2>换机时，先记住这些差异</h2><ul>${list(topic.differences)}</ul><a class="cc-original" href="${recordRoute('camera', topic.id)}">单独查看 R6 三代此主题 →</a></section>` +
      modelSection(topic, 'settings', '选项、入口与取舍', model => `<p class="cc-model-summary">${esc(model.summary)}</p><dl class="cc-setting-list">${items(model.settings).map(setting => `<div><dt>${esc(setting.name)}</dt><dd><p class="cc-setting-value">${esc(setting.value)}</p><p>${esc(setting.reason)}</p></dd></div>`).join('')}</dl>`, '同一拍摄目的可能对应不同按钮或菜单。以下按机型分别列入口与理由。') +
      modelSection(topic, 'steps', '拿起对应机身，逐步操作', model => `<ol class="cc-step-list">${list(model.steps)}</ol>`, '先完成当前机身这一环节，再换到另一台核对；默认分配可能已被自定义改变。') +
      modelSection(topic, 'checks', '试拍后，检查实际结果', model => `<ul>${list(model.checks)}</ul>`, '本页只提供现场自查方法，不会自动记为任务完成。没有对应机身时，可先记录待验证项。') +
      modelSection(topic, 'pitfalls', '遇到问题，按本机条件排查', model => pitfalls(model.pitfalls)) +
      modelSection(topic, 'restore', '结束练习，逐项恢复与复查', model => `<ul>${list(model.restore)}</ul>`, '按练习前记录恢复需要还原的项目，再拍一张确认；不以清空全部设置代替逐项核对。') +
      modelSection(topic, 'practice', '把这一项配置用于实拍', model => practice(model, data), '课程和任务沿用已有学习记录；选择任务后再记录实际完成的证据。') +
      modelSection(topic, 'sources', '分别核对两机官方说明', model => `<ul class="cc-source-list">${sourceList(model.sources)}</ul>`, '本页可离线阅读，外部官方原文需要联网；具体功能以对应型号、固件和当前模式为准。');
  }

  function neighbors(topics, topic) {
    const index = topics.indexOf(topic), previous = topics[index - 1], next = topics[index + 1];
    return `<nav class="cc-neighbors" aria-label="相邻对照主题">${previous ? `<a href="${route(previous.id)}"><small>上一主题</small>${esc(previous.title)} ←</a>` : '<a href="#camera"><small>R6 三代</small>回到快速上手 ←</a>'}${next ? `<a href="${route(next.id)}"><small>下一主题</small>${esc(next.title)} →</a>` : '<a href="#kit/r6-r7"><small>双机实拍</small>回到两机两镜的分工 →</a>'}</nav>`;
  }

  function mount(container, topicId) {
    destroy();
    if (!container) return;
    const config = root.PHOTO_CAMERA_COMPARISON;
    const back = '<a class="cc-back" href="#camera">← 返回 R6 三代快速上手</a>';
    if (!config || !config.basics || !Array.isArray(config.topics)) {
      container.innerHTML = `<section class="cc-root cc-missing">${back}<h1>两机配置对照暂不可用</h1><p>请先查看已有相机手册，或重新打开完整项目后再试。</p><a class="cc-text-link" href="#kit/r6-r7">查看双机组合 →</a></section>`;
      return;
    }
    const topics = [config.basics, ...config.topics];
    const selected = topicId || 'basics';
    const topic = topics.find(item => item.id === selected);
    if (!topic) {
      container.innerHTML = `<section class="cc-root cc-missing">${back}<h1>选择一个两机对照主题</h1><p>没有找到这个配置主题。请从下方目录进入基础参数或具体操作。</p>${directory(topics, '', true)}<a class="cc-text-link" href="#camera-compare/basics">查看基础参数 →</a></section>`;
      return;
    }
    const data = root.PHOTO_DATA || { lessons: [], tasks: [] };
    container.innerHTML = `<article class="cc-root cc-detail" data-compare-topic="${esc(topic.id)}">
      <header class="cc-heading">${back}<p class="cc-kicker">R6 三代 × R7 / 参数与操作对照 / ${String(topics.indexOf(topic) + 1).padStart(2, '0')} · ${esc(topic.group)}</p><h1>${esc(topic.title)}</h1><p class="cc-summary">${esc(topic.summary)}</p><p class="cc-meta">资料核对于 ${esc(config.checkedAt)}。两机以静止图像和默认控制为起点；先确认当前模式、自定义和实际可见项目。</p></header>
      ${directory(topics, topic.id, topic.id === 'basics')}
      ${topic.id === 'basics' ? basicsContent(topic) : topicContent(topic, data)}
      <details class="cc-switch-checklist"><summary>换机前后，快速核对一次</summary><ol>${list(config.switchChecklist)}</ol><p>按实际读数与试片判断，保留自己的设置记录。</p><a class="cc-text-link" href="#kit/r6-r7">回到双机配镜与场景练习 →</a></details>
      ${neighbors(topics, topic)}
    </article>`;
  }

  // Native links and details own interaction. Reading creates no saved state.
  function destroy() {}
  const api = { mount, destroy };
  root.PhotoCameraCompare = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
