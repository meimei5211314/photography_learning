'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const pairs = [['dual-body-assignment', 'dual-body-pairing-test'], ['dual-body-controls', 'dual-body-switch-check'], ['dual-body-field-workflow', 'dual-body-story']];

function fixture() {
  return {
    id: 'r6-r7', title: '如果增加 R7：双机练习', checkedAt: '2026-11-14', intro: '假设增加 R7，尚未拥有时先做纸面准备。',
    keyPoints: [{ title: '记录条件', body: '两机记录条件分别核对。' }],
    preferredPairing: [{ body: 'R6 Mark III', lens: 'RF50', role: '人物', start: '先试拍', check: '检查眼睛' }, { body: 'R7', lens: 'RF-S18–150', role: '环境', start: '先看构图', check: '检查实际读数' }],
    combinations: ['R6 + RF50', 'R6 + RF-S', 'R7 + RF50', 'R7 + RF-S'].map(body => ({ body, lens: '对应镜头', recording: '对应记录范围', view: '只比较视角', pixels: '记录模式与尺寸条件', note: '按相同输出比较' })),
    controls: Array.from({ length: 7 }, (_, index) => ({ id: 'control-' + index, title: '核对操作 ' + index, r6: 'R6 独立核对 ' + index, r7: 'R7 独立核对 ' + index, steps: ['记录状态', '试拍检查'], check: '对照实际结果' })),
    scenarios: Array.from({ length: 6 }, (_, index) => ({ id: 'scene-' + index, title: '场景 ' + index, pairing: '按目的分工', settings: ['检查实际设置'], checks: ['查看成片'], changeWhen: '条件变化时重新试拍', lessonId: pairs[index % 3][0] })),
    workflow: Array.from({ length: 4 }, (_, index) => ({ title: '流程 ' + index, steps: ['记录条件', '保留证据'] })),
    quickCheck: ['核对机型', '核对照片与文件'], practicePairs: pairs,
    sources: [{ title: '对应资料', url: 'https://example.com/manual', note: '区分机型' }]
  };
}
function load(dual = fixture(), equipment) {
  const window = { PHOTO_DUAL_CAMERA: dual, PHOTO_EQUIPMENT: equipment, PHOTO_DATA: { lessons: pairs.map(([id]) => ({ id, title: '课程 ' + id, subtitle: '先读条件' })), tasks: pairs.map(([, id]) => ({ id, title: '任务 ' + id })) } };
  Object.defineProperty(window, 'localStorage', { get() { throw new Error('Profile views must not access progress storage'); } });
  vm.runInNewContext(fs.readFileSync(path.join(root, 'equipment-guide.js'), 'utf8'), { window });
  return window;
}

test('optional dual profile keeps model-specific instructions, independent practices and native switching', () => {
  const window = load();
  const host = { innerHTML: '' };
  const before = JSON.stringify({ dual: window.PHOTO_DUAL_CAMERA, data: window.PHOTO_DATA });
  window.PhotoEquipment.mount(host, 'r6-r7');
  const html = host.innerHTML;
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.match(html, /可选方案 \/ 假设增加 EOS R7/);
  assert.match(html, /href="#kit\/r6-r7" aria-current="page"/);
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  assert.match(html, /href="#kit"/);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)[0].match(/<tr>/g) || []).length, 4);
  assert.equal((html.match(/data-dual-control=/g) || []).length, 7);
  assert.equal((html.match(/data-dual-scenario=/g) || []).length, 6);
  assert.equal((html.match(/class="eg-workflow-step"/g) || []).length, 4);
  for (let index = 0; index < 7; index++) {
    assert.ok(html.includes('R6 独立核对 ' + index));
    assert.ok(html.includes('R7 独立核对 ' + index));
  }
  for (const [lessonId, taskId] of pairs) {
    assert.ok(html.includes('href="#lesson/' + lessonId + '"'));
    assert.ok(html.includes('href="#practice/' + taskId + '"'));
  }
  assert.doesNotMatch(html, /data-eg-frame|data-equipment-lens|type="checkbox"|<input|已掌握/);
  window.PhotoEquipment.destroy();
  assert.equal(JSON.stringify({ dual: window.PHOTO_DUAL_CAMERA, data: window.PHOTO_DATA }), before);
});

test('missing optional data remains explicitly optional and supplies the existing-kit recovery link', () => {
  const window = load(null);
  const host = { innerHTML: '' };
  window.PhotoEquipment.mount(host, 'r6-r7');
  assert.match(host.innerHTML, /双机方案资料暂不可用/);
  assert.match(host.innerHTML, /假设增加 R7/);
  assert.match(host.innerHTML, /返回已有器材方案/);
  assert.equal((host.innerHTML.match(/<h1>/g) || []).length, 1);
  assert.doesNotThrow(() => window.PhotoEquipment.mount(null, 'r6-r7'));
});

test('default and unknown profile ids retain the confirmed equipment content without acquiring an optional camera', () => {
  const equipment = { title: '原器材', checkedAt: '2026-11-14', camera: { name: 'R6 III', summary: '已确认两镜' }, keyPoints: [], lenses: [], viewAngles: [], scenarios: [], quickCheck: [], sources: [] };
  const window = load(fixture(), equipment);
  const host = { innerHTML: '' };
  const before = JSON.stringify(equipment);
  window.PhotoEquipment.mount(host);
  const original = host.innerHTML;
  assert.match(original, /data-kit-profile="confirmed"/);
  assert.match(original, /href="#kit" aria-current="page"/);
  assert.doesNotMatch(original, /data-dual-control|data-dual-lesson/);
  window.PhotoEquipment.mount(host, 'r6-r7');
  assert.match(host.innerHTML, /data-kit-profile="r6-r7"/);
  window.PhotoEquipment.mount(host, '<script>unknown</script>');
  assert.equal(host.innerHTML, original);
  assert.equal(JSON.stringify(equipment), before);
});

test('optional configuration labels are escaped and unsafe sources are omitted', () => {
  const dual = fixture();
  dual.title = '<b>双机</b>';
  dual.controls[0].r7 = '<script>R7</script>';
  dual.scenarios[0].pairing = 'R6 & R7';
  dual.sources.push({ title: 'unsafe', url: 'javascript:alert(1)' });
  const window = load(dual);
  const host = { innerHTML: '' };
  window.PhotoEquipment.mount(host, 'r6-r7');
  assert.match(host.innerHTML, /&lt;b&gt;双机&lt;\/b&gt;/);
  assert.match(host.innerHTML, /&lt;script&gt;R7&lt;\/script&gt;/);
  assert.match(host.innerHTML, /R6 &amp; R7/);
  assert.doesNotMatch(host.innerHTML, /<script>|javascript:|unsafe/);
});

test('real dual configuration renders against the fixed course contract without depending on saved progress', () => {
  const equipment = { id: 'confirmed-equipment' };
  const window = load(null, equipment);
  window.PHOTO_DATA.sources = [];
  vm.runInNewContext(fs.readFileSync(path.join(root, 'dual-camera-data.js'), 'utf8'), { window });
  const before = JSON.stringify({ equipment, dual: window.PHOTO_DUAL_CAMERA, data: window.PHOTO_DATA });
  const host = { innerHTML: '' };
  window.PhotoEquipment.mount(host, 'r6-r7');
  assert.equal((host.innerHTML.match(/data-dual-control=/g) || []).length, 7);
  assert.equal((host.innerHTML.match(/data-dual-scenario=/g) || []).length, 6);
  assert.equal((host.innerHTML.match(/data-dual-lesson=/g) || []).length, 3);
  assert.equal((host.innerHTML.match(/class="eg-workflow-step"/g) || []).length, 4);
  assert.match(host.innerHTML, /4320×2880/);
  assert.match(host.innerHTML, /6960×4640/);
  assert.match(host.innerHTML, /原生APS-C/);
  assert.match(host.innerHTML, /不表示你已拥有R7/);
  assert.equal(JSON.stringify({ equipment, dual: window.PHOTO_DUAL_CAMERA, data: window.PHOTO_DATA }), before);
});
