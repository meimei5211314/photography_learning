'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function load(files, values = {}) {
  const window = { ...values };
  Object.defineProperty(window, 'localStorage', { get() { throw new Error('Equipment reading must not access storage'); } });
  const context = { window };
  for (const file of files) vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  return window;
}
function curriculum() {
  return load(['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js', 'shooting-depth-data.js', 'finishing-depth-data.js', 'lens-practice-data.js', 'equipment-data.js', 'equipment-guide.js']);
}

test('confirmed kit hub connects two lenses, six scenarios and four independent practices without changing data', () => {
  const window = curriculum();
  const { PHOTO_EQUIPMENT: kit, PHOTO_DATA: data, PhotoEquipment: guide } = window;
  const before = JSON.stringify({ kit, data });
  const host = { innerHTML: '' };
  guide.mount(host);
  const html = host.innerHTML;
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.equal((html.match(/data-equipment-lens=/g) || []).length, 2);
  assert.equal((html.match(/data-equipment-scene=/g) || []).length, 6);
  assert.equal((html.match(/data-equipment-lesson=/g) || []).length, 4);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, kit.viewAngles.length);
  for (const id of ['prime-distance-focus', 'zoom-aperture-map', 'matched-lens-pairs', 'two-lens-field-story']) assert.ok(html.includes('href="#practice/' + id + '"'), id);
  for (const scene of kit.scenarios) assert.ok(html.includes('href="#lesson/' + scene.lessonId + '"'));
  assert.match(html, /role="region" aria-label="镜头实际焦距、记录模式与视角对照" tabindex="0"/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /data-finish-task|type="checkbox"|已掌握|<input/);
  guide.destroy();
  assert.equal(JSON.stringify({ kit, data }), before);
});

test('record-area diagram shows centered 1.6 crop with an accessible explanation rather than simulated photographs', () => {
  const window = curriculum();
  const host = { innerHTML: '' };
  window.PhotoEquipment.mount(host);
  const rectangles = {};
  for (const name of ['full', 'crop']) {
    const rect = host.innerHTML.match(new RegExp('<rect data-eg-frame="' + name + '"[^>]*>'))[0];
    rectangles[name] = Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, Number(rect.match(new RegExp(' ' + key + '="([\\d.]+)"'))[1])]));
  }
  const { full, crop } = rectangles;
  assert.equal(crop.width / full.width, 1 / 1.6);
  assert.equal(crop.height / full.height, 1 / 1.6);
  assert.equal(crop.x + crop.width / 2, full.x + full.width / 2);
  assert.equal(crop.y + crop.height / 2, full.y + full.height / 2);
  assert.match(host.innerHTML, /role="img" aria-labelledby="eg-area-title eg-area-description"/);
  assert.match(host.innerHTML, /原创记录区域示意 · 非样片或光学仿真/);
  assert.match(host.innerHTML, /同一机位，两镜都设为 50mm/);
  assert.match(host.innerHTML, /实际焦距仍是 50mm/);
});

test('equipment labels are escaped and unsafe source protocols are omitted', () => {
  const data = curriculum();
  const kit = JSON.parse(JSON.stringify(data.PHOTO_EQUIPMENT));
  kit.title = '<script>kit</script>';
  kit.lenses[0].name = '<b>镜头</b>';
  kit.scenarios[0].settings[0] = 'A & B';
  kit.sources.push({ title: '危险链接', url: 'javascript:alert(1)' });
  const window = load(['equipment-guide.js'], { PHOTO_EQUIPMENT: kit, PHOTO_DATA: data.PHOTO_DATA });
  const host = { innerHTML: '' };
  window.PhotoEquipment.mount(host);
  assert.match(host.innerHTML, /&lt;script&gt;kit&lt;\/script&gt;/);
  assert.match(host.innerHTML, /&lt;b&gt;镜头&lt;\/b&gt;/);
  assert.match(host.innerHTML, /A &amp; B/);
  assert.doesNotMatch(host.innerHTML, /<script>|javascript:|危险链接/);
});

test('missing equipment data gives a recoverable page and lifecycle needs no storage or browser callbacks', () => {
  const { PhotoEquipment: guide } = load(['equipment-guide.js']);
  const host = { innerHTML: '' };
  guide.mount(host);
  assert.match(host.innerHTML, /器材练习资料暂不可用/);
  assert.match(host.innerHTML, /href="#home"/);
  const rendered = host.innerHTML;
  guide.destroy();
  guide.destroy();
  assert.equal(host.innerHTML, rendered);
  assert.doesNotThrow(() => guide.mount(null));
});
