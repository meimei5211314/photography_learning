'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const plain = value => JSON.parse(JSON.stringify(value));
const run = (context, file) => vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { timeout: 1000 });
const pairs = [
  ['dual-body-assignment', 'dual-body-pairing-test'],
  ['dual-body-controls', 'dual-body-switch-check'],
  ['dual-body-field-workflow', 'dual-body-story']
];
function baseline() {
  const context = { window: {} };
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js', 'shooting-depth-data.js', 'finishing-depth-data.js', 'lens-practice-data.js', 'dual-camera-lessons.js', 'camera-config-data.js', 'equipment-data.js']) run(context, file);
  return context;
}

test('optional dual-camera data preserves owned equipment, learning records and storage', () => {
  const context = baseline(), data = context.window.PHOTO_DATA;
  const existing = plain({ equipment: context.window.PHOTO_EQUIPMENT, lessons: data.lessons, tasks: data.tasks, cards: data.cards });
  Object.defineProperty(context.window, 'localStorage', { get() { throw new Error('dual-camera data must not access progress storage'); } });
  context.module = { exports: {} };
  run(context, 'dual-camera-data.js');
  const dual = context.window.PHOTO_DUAL_CAMERA;
  assert.equal(dual.id, 'r6-r7');
  assert.match(dual.intro, /可选/);
  assert.match(dual.intro, /不表示你已拥有R7/);
  assert.match(dual.intro, /纸面.*不能代替.*实拍/);
  assert.match(dual.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(context.module.exports, dual);
  assert.deepEqual(plain({ equipment: context.window.PHOTO_EQUIPMENT, lessons: data.lessons, tasks: data.tasks, cards: data.cards }), existing);
  assert.deepEqual([data.lessons.length, data.tasks.length, data.cards.length], [43, 39, 86]);
});

test('four body and lens combinations distinguish native APS-C from full-frame crop dimensions', () => {
  const context = baseline();
  run(context, 'dual-camera-data.js');
  const combinations = context.window.PHOTO_DUAL_CAMERA.combinations;
  assert.equal(combinations.length, 4);
  assert.equal(new Set(combinations.map(item => item.body + ':' + item.lens)).size, 4);
  for (const body of ['EOS R6 Mark III', 'EOS R7']) {
    for (const lens of ['RF50mm F1.8 STM', 'RF-S18-150mm F3.5-6.3 IS STM']) {
      const item = combinations.find(row => row.body === body && row.lens === lens);
      assert.ok(item, body + ' ' + lens);
      for (const key of ['recording', 'view', 'pixels', 'note']) assert.ok(typeof item[key] === 'string' && item[key].trim());
      assert.match(item.pixels, /L.*RAW\/C-RAW/);
      const dimensions = /([0-9]+)×([0-9]+)/.exec(item.pixels).slice(1).map(Number);
      const cropped = body === 'EOS R6 Mark III' && lens.startsWith('RF-S');
      assert.deepEqual(dimensions, cropped ? [4320, 2880] : [6960, 4640]);
      assert.match(item.view, /视角/);
      if (body === 'EOS R7') {
        assert.match(item.recording, /原生APS-C/);
        assert.doesNotMatch(item.recording, /裁切/);
      }
      if (lens.startsWith('RF-S')) assert.match(item.view, /28\.8[–-]240mm/);
      else assert.match(item.view, body === 'EOS R7' ? /80mm/ : /50mm/);
      if (cropped) assert.match(item.recording, /自动1\.6倍裁切/);
    }
  }
});

test('model-specific operations and six scenes provide checks and valid practice destinations', () => {
  const context = baseline();
  run(context, 'dual-camera-data.js');
  const dual = context.window.PHOTO_DUAL_CAMERA, data = context.window.PHOTO_DATA;
  assert.equal(dual.preferredPairing.length, 2);
  for (const item of dual.preferredPairing) for (const key of ['body', 'lens', 'role', 'start', 'check']) assert.ok(typeof item[key] === 'string' && item[key]);
  assert.equal(dual.controls.length, 7);
  assert.equal(new Set(dual.controls.map(item => item.id)).size, 7);
  for (const item of dual.controls) {
    assert.ok(item.title && item.r6 && item.r7 && item.check);
    assert.ok(item.steps.length >= 3 && item.steps.every(step => typeof step === 'string' && step.trim()));
  }
  const focus = dual.controls.find(item => item.id === 'focus-mode');
  assert.match(focus.r7, /启用.*机身前方开关/);
  assert.match(focus.r7, /关闭.*AF→对焦模式/);
  const storage = dual.controls.find(item => item.id === 'quality-storage');
  assert.match(storage.r6, /卡槽1.*CFexpress Type B.*卡槽2.*SD/);
  assert.match(storage.r7, /两个卡槽均为SD/);
  assert.equal(dual.scenarios.length, 6);
  assert.equal(new Set(dual.scenarios.map(item => item.id)).size, 6);
  for (const item of dual.scenarios) {
    assert.ok(item.title && typeof item.pairing === 'string' && item.changeWhen);
    assert.ok(item.settings.length >= 3 && item.settings.every(step => typeof step === 'string' && step.trim()));
    assert.ok(item.checks.length >= 2 && item.checks.every(step => typeof step === 'string' && step.trim()));
    assert.ok(data.lessons.some(lesson => lesson.id === item.lessonId), item.id + ' lesson destination');
  }
  assert.deepEqual(plain(dual.practicePairs), pairs);
  for (const [lessonId, taskId] of dual.practicePairs) {
    assert.ok(data.lessons.some(item => item.id === lessonId));
    assert.ok(data.tasks.some(item => item.id === taskId));
  }
  assert.ok(dual.keyPoints.length >= 3 && dual.keyPoints.every(item => item.title && item.body));
  assert.equal(dual.workflow.length, 4);
  for (const item of dual.workflow) assert.ok(item.title && item.steps.length >= 3 && item.steps.every(step => typeof step === 'string' && step.trim()));
  assert.ok(dual.quickCheck.length >= 6);
});

test('official sources include both correct model manuals and preserve earlier source notes', () => {
  const context = baseline(), data = context.window.PHOTO_DATA;
  const existing = plain(data.sources);
  run(context, 'dual-camera-data.js');
  const dual = context.window.PHOTO_DUAL_CAMERA, manuals = new Set();
  assert.deepEqual(plain(data.sources.slice(0, existing.length)), existing);
  assert.equal(new Set(data.sources.map(item => item.url)).size, data.sources.length);
  assert.equal(new Set(dual.sources.map(item => item.url)).size, dual.sources.length);
  for (const item of dual.sources) {
    assert.ok(item.title && item.note);
    const url = new URL(item.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(['cam.start.canon', 'www.canon-europe.com', 'gdlp01.c-wss.com'].includes(url.hostname));
    if (url.hostname === 'cam.start.canon') {
      assert.match(url.pathname, /^\/zh\/(C005|C022)\/manual\/html\//);
      manuals.add(url.pathname.split('/')[2]);
    }
    assert.ok(data.sources.some(source => source.url === item.url));
  }
  assert.deepEqual([...manuals].sort(), ['C005', 'C022']);
});

test('missing dependencies and repeated loading never partially publish dual-camera data', () => {
  const noData = { window: {} };
  assert.throws(() => run(noData, 'dual-camera-data.js'), /请先加载课程和现有器材资料/);
  const noEquipment = baseline();
  delete noEquipment.window.PHOTO_EQUIPMENT;
  const beforeMissingEquipment = plain(noEquipment.window.PHOTO_DATA);
  assert.throws(() => run(noEquipment, 'dual-camera-data.js'), /请先加载课程和现有器材资料/);
  assert.deepEqual(plain(noEquipment.window.PHOTO_DATA), beforeMissingEquipment);
  for (const [lessonId, taskId] of pairs) {
    for (const [key, id, message] of [['lessons', lessonId, /双机组合关联课程不存在/], ['tasks', taskId, /双机组合关联任务不存在/]]) {
      const missing = baseline();
      missing.window.PHOTO_DATA[key] = missing.window.PHOTO_DATA[key].filter(item => item.id !== id);
      const before = plain(missing.window.PHOTO_DATA), equipment = plain(missing.window.PHOTO_EQUIPMENT);
      assert.throws(() => run(missing, 'dual-camera-data.js'), message);
      assert.deepEqual(plain(missing.window.PHOTO_DATA), before);
      assert.deepEqual(plain(missing.window.PHOTO_EQUIPMENT), equipment);
      assert.equal(missing.window.PHOTO_DUAL_CAMERA, undefined);
    }
  }
  const duplicate = baseline();
  run(duplicate, 'dual-camera-data.js');
  const before = plain(duplicate.window.PHOTO_DATA), exported = duplicate.window.PHOTO_DUAL_CAMERA;
  assert.throws(() => run(duplicate, 'dual-camera-data.js'), /双机组合资料已加载/);
  assert.deepEqual(plain(duplicate.window.PHOTO_DATA), before);
  assert.equal(duplicate.window.PHOTO_DUAL_CAMERA, exported);
});
