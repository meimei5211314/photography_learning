'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const plain = value => JSON.parse(JSON.stringify(value));
const run = (context, file) => vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { timeout: 1000 });
function baseline() {
  const context = { window: {} };
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js', 'shooting-depth-data.js', 'finishing-depth-data.js', 'lens-practice-data.js']) run(context, file);
  return context;
}
const lessonIds = ['prime-working-distance', 'zoom-range-map', 'two-lens-comparison', 'two-lens-outing'];

test('owned kit confirms exactly two lenses and preserves every learning item', () => {
  const context = baseline(), data = context.window.PHOTO_DATA;
  const before = plain({ lessons: data.lessons, tasks: data.tasks, cards: data.cards });
  run(context, 'equipment-data.js');
  const kit = context.window.PHOTO_EQUIPMENT;
  assert.equal(kit.id, 'r6iii-two-lenses');
  assert.equal(kit.camera.name, 'EOS R6 Mark III');
  assert.match(kit.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual(plain(kit.lenses.map(lens => [lens.id, lens.name])), [
    ['rf50', 'RF50mm F1.8 STM'], ['rfs18150', 'RF-S18-150mm F3.5-6.3 IS STM']
  ]);
  assert.deepEqual(plain({ lessons: data.lessons, tasks: data.tasks, cards: data.cards }), before);
  assert.deepEqual([data.lessons.length, data.tasks.length, data.cards.length], [40, 36, 80]);
});

test('lens facts and six scene starting points lead to the four actual practice lessons', () => {
  const context = baseline();
  run(context, 'equipment-data.js');
  const kit = context.window.PHOTO_EQUIPMENT, data = context.window.PHOTO_DATA;
  const destinations = new Set();
  for (const lens of kit.lenses) {
    for (const key of ['name', 'role', 'coverage', 'aperture', 'stabilization', 'focus', 'closeFocus', 'filter']) {
      assert.ok(typeof lens[key] === 'string' && lens[key].trim(), lens.id + ' ' + key);
    }
    assert.ok(lens.sources.length >= 2, lens.id + ' primary sources');
    destinations.add(lens.lessonId);
  }
  assert.equal(kit.scenarios.length, 6);
  assert.equal(new Set(kit.scenarios.map(scene => scene.id)).size, 6);
  for (const scene of kit.scenarios) {
    assert.ok(scene.title && scene.lens && scene.changeWhen, scene.id + ' context and adaptation');
    assert.ok(scene.settings.length >= 3 && scene.settings.every(text => typeof text === 'string' && text.trim()), scene.id + ' settings');
    assert.ok(scene.checks.length >= 2 && scene.checks.every(text => typeof text === 'string' && text.trim()), scene.id + ' observable checks');
    destinations.add(scene.lessonId);
  }
  assert.deepEqual([...destinations].sort(), lessonIds.slice().sort());
  for (const id of destinations) assert.ok(data.lessons.some(lesson => lesson.id === id), id + ' valid destination');
  assert.ok(kit.keyPoints.length >= 3 && kit.keyPoints.every(item => item.title && item.body));
  assert.ok(kit.quickCheck.length >= 6 && kit.quickCheck.every(text => typeof text === 'string' && text.trim()));
});

test('field-of-view conversions distinguish full frame from manual and automatic crop', () => {
  const context = baseline();
  run(context, 'equipment-data.js');
  const kit = context.window.PHOTO_EQUIPMENT;
  assert.equal(kit.viewAngles.length, 7);
  const prime = kit.viewAngles.filter(row => row.lens === kit.lenses[0].name);
  const zoom = kit.viewAngles.filter(row => row.lens === kit.lenses[1].name);
  assert.deepEqual(plain(prime.map(row => row.recording)), ['全画幅', '手动1.6倍裁切']);
  assert.equal(zoom.length, 5);
  assert.deepEqual(plain(zoom.map(row => parseFloat(row.setting))), [18, 35, 50, 85, 150]);
  for (const row of kit.viewAngles) {
    assert.ok(row.note && /视角/.test(row.view), row.setting + ' conversion scope');
    const equivalent = /全画幅([\d.]+)mm/.exec(row.view);
    assert.ok(equivalent, row.setting + ' comparison value');
    const crop = row.recording === '全画幅' ? 1 : 1.6;
    assert.ok(Math.abs(Number(equivalent[1]) - parseFloat(row.setting) * crop) < 1e-9, row.setting + ' correct multiplier');
  }
  for (const row of zoom) assert.equal(row.recording, '自动1.6倍裁切');
});

test('kit primary sources keep existing notes and deduplicate by URL', () => {
  const context = baseline();
  run(context, 'camera-config-data.js');
  const existing = plain(context.window.PHOTO_DATA.sources);
  run(context, 'equipment-data.js');
  const kit = context.window.PHOTO_EQUIPMENT, sources = context.window.PHOTO_DATA.sources;
  assert.deepEqual(plain(sources.slice(0, existing.length)), existing);
  assert.equal(new Set(sources.map(source => source.url)).size, sources.length);
  assert.equal(new Set(kit.sources.map(source => source.url)).size, kit.sources.length);
  const officialHosts = new Set(['cam.start.canon', 'gdlp01.c-wss.com', 'www.canon-europe.com', 'www.canon.com.cn']);
  for (const source of [...kit.sources, ...kit.lenses.flatMap(lens => lens.sources)]) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(officialHosts.has(url.hostname), source.title + ' original official source');
    assert.ok(source.title && source.note, source.url + ' usable source index');
    assert.ok(kit.sources.some(item => item.url === source.url));
    assert.ok(sources.some(item => item.url === source.url));
    if (url.hostname === 'cam.start.canon') assert.ok(url.pathname.startsWith('/zh/C022/manual/html/'));
  }
});

test('missing dependencies and duplicate kit loads are atomic', () => {
  const noData = { window: {} };
  assert.throws(() => run(noData, 'equipment-data.js'), /请先加载课程数据/);
  assert.equal(noData.window.PHOTO_EQUIPMENT, undefined);
  for (const lessonId of lessonIds) {
    const missing = baseline();
    missing.window.PHOTO_DATA.lessons = missing.window.PHOTO_DATA.lessons.filter(lesson => lesson.id !== lessonId);
    const before = plain(missing.window.PHOTO_DATA);
    assert.throws(() => run(missing, 'equipment-data.js'), /现有器材关联课程不存在/);
    assert.deepEqual(plain(missing.window.PHOTO_DATA), before);
    assert.equal(missing.window.PHOTO_EQUIPMENT, undefined);
  }
  const duplicate = baseline();
  run(duplicate, 'equipment-data.js');
  const before = plain(duplicate.window.PHOTO_DATA), exported = duplicate.window.PHOTO_EQUIPMENT;
  assert.throws(() => run(duplicate, 'equipment-data.js'), /现有器材资料已加载/);
  assert.deepEqual(plain(duplicate.window.PHOTO_DATA), before);
  assert.equal(duplicate.window.PHOTO_EQUIPMENT, exported);
});
