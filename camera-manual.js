/* Topic-by-topic camera configuration guide. Reading never changes learning records. */
(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const route = (kind, id) => '#' + kind + '/' + encodeURIComponent(id);
  const list = items => (Array.isArray(items) ? items : items ? [items] : []).map(item => `<li>${esc(item)}</li>`).join('');

  function directory(topics, selected) {
    const groups = [...new Set(topics.map(topic => topic.group))];
    return `<details class="cm-directory"${selected ? '' : ' open'}><summary>切换配置主题 <span>共 ${topics.length} 项</span></summary><nav aria-label="相机配置主题">${groups.map(group => `<div class="cm-topic-group"><h2>${esc(group || '相机配置')}</h2>${topics.filter(topic => topic.group === group).map(topic => `<a href="${route('camera', topic.id)}"${topic.id === selected ? ' aria-current="page"' : ''}><span>${String(topics.indexOf(topic) + 1).padStart(2, '0')}</span>${esc(topic.title)}</a>`).join('')}</div>`).join('')}</nav></details>`;
  }

  function sources(items) {
    return (items || []).filter(source => /^https?:\/\//i.test(source.url)).map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>${source.note ? `<p>${esc(source.note)}</p>` : ''}</li>`).join('');
  }

  function mount(container, topicId) {
    destroy();
    if (!container) return;
    const config = root.PHOTO_CAMERA_CONFIG || {};
    const topics = config.topics || [];
    const topic = topics.find(item => item.id === (topicId || 'controls'));
    const back = '<a class="cm-back" href="#camera">← 返回 8 步快速上手</a>';
    if (!topic) {
      container.innerHTML = `<section class="cm-root cm-missing">${back}<h1>${topics.length ? '选择一个配置主题' : '配置手册暂不可用'}</h1><p>${topics.length ? '没有找到这个配置主题。请选择下方主题继续查阅，也可以返回快速上手。' : '请返回快速上手继续学习；重新打开完整项目后可再试一次。'}</p>${topics.length ? directory(topics) : ''}</section>`;
      return;
    }
    const index = topics.indexOf(topic);
    const data = root.PHOTO_DATA || { lessons: [], tasks: [] };
    const lessons = (topic.lessonIds || []).map(id => data.lessons.find(item => item.id === id)).filter(Boolean);
    const task = data.tasks.find(item => item.id === topic.taskId);
    const previous = topics[index - 1], next = topics[index + 1];
    container.innerHTML = `<article class="cm-root cm-detail" data-camera-topic="${esc(topic.id)}">
      <header class="cm-heading">${back}<p class="cm-compare-entry"><a href="#camera-compare/${encodeURIComponent(topic.id)}">对照 R7 的同一项设置 →</a></p><p class="cm-kicker">相机配置手册 · ${String(index + 1).padStart(2, '0')} / ${topics.length} · ${esc(topic.group)}</p><h1>${esc(topic.title)}</h1><p class="cm-summary">${esc(topic.summary)}</p><p class="cm-meta">${esc(config.model)} · 资料核对于 ${esc(config.checkedAt)}。以下以静止图像和默认控制为例；自定义后以机身为准。</p></header>
      ${directory(topics, topic.id)}
      <section class="cm-section cm-settings"><h2>选项与取舍</h2><table role="table"><caption>${esc(topic.title)}：设置对照</caption><thead role="rowgroup"><tr role="row"><th scope="col">设置项</th><th scope="col">选项或起点</th><th scope="col">为什么这样选</th></tr></thead><tbody role="rowgroup">${(topic.settings || []).map(setting => `<tr role="row"><th scope="row" role="rowheader">${esc(setting.name)}</th><td role="cell" data-label="选项或起点">${esc(setting.value)}</td><td role="cell" data-label="为什么这样选">${esc(setting.reason)}</td></tr>`).join('')}</tbody></table></section>
      <section class="cm-section cm-steps"><h2>拿起相机，逐步操作</h2><ol>${list(topic.steps)}</ol></section>
      <section class="cm-section cm-checks"><h2>试拍后这样确认</h2><ul>${list(topic.checks)}</ul><p class="cm-note">先看实际读数与拍摄结果，再决定是否保留设置。这些检查供现场自查，不会自动记为任务完成。</p></section>
      <section class="cm-section cm-pitfalls"><h2>遇到问题，逐项排查</h2><dl>${(topic.pitfalls || []).map(item => `<div><dt>${esc(item.symptom)}</dt><dd>${esc(item.fix)}</dd></div>`).join('')}</dl></section>
      <section class="cm-section cm-restore"><h2>练习结束，检查与恢复</h2><ul>${list(topic.restore)}</ul></section>
      <section class="cm-section cm-practice"><h2>把配置用于一次拍摄</h2>${task ? `<a class="primary cm-task" href="${route('practice', task.id)}">开始任务：${esc(task.title)} →</a><p>在任务页保留试拍检查与复盘。</p>` : ''}${lessons.length ? `<h3>需要时，回到原理</h3><ul>${lessons.map(lesson => `<li><a href="${route('lesson', lesson.id)}">${esc(lesson.title)} →</a></li>`).join('')}</ul>` : ''}</section>
      <section class="cm-section cm-sources"><h2>核对官方资料</h2><p class="cm-note">精确功能以对应机型、镜头、固件和当前菜单为准。离线时可阅读本页；打开下列外部资料需要联网。</p><ul>${sources(topic.sources)}</ul></section>
      <nav class="cm-neighbors" aria-label="相邻配置主题">${previous ? `<a href="${route('camera', previous.id)}"><small>上一主题</small>${esc(previous.title)} ←</a>` : '<a href="#camera"><small>快速上手</small>回到 8 步流程 ←</a>'}${next ? `<a href="${route('camera', next.id)}"><small>下一主题</small>${esc(next.title)} →</a>` : '<a href="#camera"><small>快速上手</small>带着配置再拍一次 →</a>'}</nav>
    </article>`;
  }

  // No listeners, timers or saved state: native links/details own their interaction.
  function destroy() {}
  const api = { mount, destroy };
  root.PhotoCameraManual = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
