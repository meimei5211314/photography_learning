'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function load(files, values = {}) {
  const window = { ...values };
  Object.defineProperty(window, 'localStorage', { get() { throw new Error('Manual must not access storage'); } });
  const context = { window };
  for (const file of files) vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  return window;
}
function curriculum() {
  return load(['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js', 'shooting-depth-data.js', 'finishing-depth-data.js', 'camera-config-data.js', 'camera-manual.js']);
}

test('all configuration topics render one complete manual page with correct routes and no learning mutation', () => {
  const window = curriculum();
  const { PHOTO_CAMERA_CONFIG: config, PHOTO_DATA: data, PhotoCameraManual: manual } = window;
  const before = JSON.stringify({ config, data });
  assert.equal(config.topics.length, 12);
  const host = { innerHTML: '' };
  for (const topic of config.topics) {
    manual.mount(host, topic.id);
    const html = host.innerHTML;
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
    assert.ok(html.includes(`href="#camera/${topic.id}" aria-current="page"`));
    assert.equal((html.match(/role="rowheader"/g) || []).length, topic.settings.length);
    for (const section of ['settings', 'steps', 'checks', 'pitfalls', 'restore', 'practice', 'sources']) assert.ok(html.includes('cm-' + section), topic.id + ' section ' + section);
    assert.ok(html.includes('href="#practice/' + topic.taskId + '"'));
    for (const id of topic.lessonIds) assert.ok(html.includes('href="#lesson/' + id + '"'), topic.id + ' lesson ' + id);
    assert.match(html, /target="_blank" rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /type="checkbox"|<input|data-finish-task/);
    assert.match(html, /不会自动记为任务完成/);
    manual.destroy();
  }
  assert.equal(JSON.stringify({ config, data }), before);
});

test('unknown and absent configuration data have recoverable navigation without echoing an unknown route', () => {
  const window = curriculum();
  const host = { innerHTML: '' };
  window.PhotoCameraManual.mount(host, '<img src=x onerror=alert(1)>');
  assert.match(host.innerHTML, /没有找到这个配置主题/);
  assert.match(host.innerHTML, /class="cm-directory" open/);
  assert.match(host.innerHTML, /href="#camera\/controls"/);
  assert.match(host.innerHTML, /href="#camera"/);
  assert.doesNotMatch(host.innerHTML, /onerror|aria-current=/);
  const unavailable = load(['camera-manual.js']);
  unavailable.PhotoCameraManual.mount(host, 'controls');
  assert.match(host.innerHTML, /配置手册暂不可用/);
  assert.match(host.innerHTML, /href="#camera"/);
  assert.doesNotThrow(() => unavailable.PhotoCameraManual.mount(null, 'controls'));
});

test('manual escapes labels and rejects unsafe external source protocols without requiring browser state', () => {
  const topic = { id: 'controls', group: '测试 & 分组', title: '<b>配置</b>', summary: '<script>alert(1)</script>', settings: [{ name: '<操作>', value: 'A & B', reason: '先 "检查"' }], steps: ['<步骤>'], checks: ['<检查>'], pitfalls: [{ symptom: '<故障>', fix: '<修复>' }], restore: '<恢复>', lessonIds: ['camera'], taskId: 'r6-first', sources: [{ title: '正确 & 来源', url: 'https://example.com/?a=1&b=2' }, { title: '不安全来源', url: 'javascript:alert(1)' }] };
  const window = load(['camera-manual.js'], { PHOTO_CAMERA_CONFIG: { model: '相机', checkedAt: '2026-11-14', topics: [topic] }, PHOTO_DATA: { lessons: [{ id: 'camera', title: '<原理>' }], tasks: [{ id: 'r6-first', title: '<实拍>' }] } });
  const host = { innerHTML: '' };
  window.PhotoCameraManual.mount(host);
  assert.match(host.innerHTML, /&lt;b&gt;配置&lt;\/b&gt;/);
  assert.match(host.innerHTML, /&lt;恢复&gt;/);
  assert.match(host.innerHTML, /&lt;原理&gt;/);
  assert.match(host.innerHTML, /A &amp; B/);
  assert.match(host.innerHTML, /https:\/\/example.com\/\?a=1&amp;b=2/);
  assert.doesNotMatch(host.innerHTML, /<script>|javascript:|不安全来源/);
  const before = host.innerHTML;
  window.PhotoCameraManual.destroy();
  assert.equal(host.innerHTML, before);
});

test('guide deep links delegate the topic id and clean up the manual when leaving', () => {
  const calls = [];
  const window = load(['guides.js'], { PhotoCameraManual: { mount: (host, id) => calls.push(['mount', host, id]), destroy: () => calls.push(['destroy']) } });
  const host = { innerHTML: '' };
  window.PhotoGuides.mount(host, 'camera', 'autofocus');
  assert.equal(calls.filter(call => call[0] === 'destroy').length, 1);
  assert.deepEqual(calls.find(call => call[0] === 'mount'), ['mount', host, 'autofocus']);
  assert.equal(host.innerHTML, '', 'quick start is not rendered over the selected manual');
  window.PhotoGuides.destroy();
  assert.equal(calls.filter(call => call[0] === 'destroy').length, 2);
});
