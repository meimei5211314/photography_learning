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
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js', 'shooting-depth-data.js', 'finishing-depth-data.js']) run(context, file);
  return context;
}
const topicIds = ['controls', 'quality', 'exposure-modes', 'auto-iso', 'metering-compensation', 'autofocus', 'white-balance', 'drive-shutter', 'stabilization', 'playback', 'custom-controls', 'custom-modes'];

test('camera configuration exposes twelve stable topics while preserving all existing learning records', () => {
  const context = baseline(), data = context.window.PHOTO_DATA;
  const before = plain({ lessons: data.lessons, tasks: data.tasks, cards: data.cards });
  run(context, 'camera-config-data.js');
  const config = context.window.PHOTO_CAMERA_CONFIG;
  assert.equal(config.model, 'Canon EOS R6 Mark III');
  assert.equal(config.checkedAt, '2026-11-14');
  assert.deepEqual(plain(config.topics.map(topic => topic.id)), topicIds);
  assert.equal(new Set(config.topics.map(topic => topic.id)).size, 12);
  assert.deepEqual(plain({ lessons: data.lessons, tasks: data.tasks, cards: data.cards }), before);
  assert.deepEqual([data.lessons.length, data.tasks.length, data.cards.length], [36, 32, 72]);
});

test('every configuration topic has usable choices, ordered operations, verification, recovery and valid learning destinations', () => {
  const context = baseline();
  run(context, 'camera-config-data.js');
  const data = context.window.PHOTO_DATA;
  for (const topic of context.window.PHOTO_CAMERA_CONFIG.topics) {
    assert.ok(topic.title && topic.summary.length >= 30 && topic.group, topic.id + ' context');
    assert.ok(topic.settings.length >= 2 && topic.settings.every(item => item.name && item.value && item.reason), topic.id + ' setting choices');
    assert.ok(topic.steps.length >= 5 && topic.steps.every(step => typeof step === 'string' && step.length >= 20), topic.id + ' concrete operations');
    assert.ok(topic.checks.length >= 3 && topic.checks.every(check => typeof check === 'string' && check.length >= 10), topic.id + ' observable checks');
    assert.ok(topic.pitfalls.length >= 2 && topic.pitfalls.every(item => item.symptom && item.fix.length >= 20), topic.id + ' diagnosis');
    assert.ok(Array.isArray(topic.restore) && topic.restore.length >= 2 && topic.restore.every(item => item.length >= 20), topic.id + ' targeted restoration');
    assert.ok(topic.lessonIds.length >= 1);
    for (const id of topic.lessonIds) assert.ok(data.lessons.some(item => item.id === id), topic.id + ' lesson ' + id);
    assert.ok(data.tasks.some(item => item.id === topic.taskId), topic.id + ' practice destination');
  }
});

test('camera topics cite the correct official model manual and index sources once with context notes', () => {
  const context = baseline();
  const existing = plain(context.window.PHOTO_DATA.sources);
  run(context, 'camera-config-data.js');
  const config = context.window.PHOTO_CAMERA_CONFIG;
  const sources = context.window.PHOTO_DATA.sources;
  assert.deepEqual(plain(sources.slice(0, existing.length)), existing);
  assert.equal(new Set(sources.map(source => source.url)).size, sources.length);
  for (const topic of config.topics) {
    assert.ok(topic.sources.length >= 1, topic.id + ' source');
    for (const source of topic.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.hostname, 'cam.start.canon');
      assert.ok(url.pathname.startsWith('/zh/C022/manual/html/'), topic.id + ' correct model');
      assert.ok(source.title && source.note);
      assert.ok(config.sources.some(item => item.url === source.url));
      assert.ok(sources.some(item => item.url === source.url));
    }
  }
});

test('configuration load failures do not partially append sources or publish an incomplete manual', () => {
  const noData = { window: {} };
  assert.throws(() => run(noData, 'camera-config-data.js'), /请先加载课程数据/);
  assert.equal(noData.window.PHOTO_CAMERA_CONFIG, undefined);
  const invalid = baseline();
  invalid.window.PHOTO_DATA.tasks = invalid.window.PHOTO_DATA.tasks.filter(task => task.id !== 'r6-first');
  const beforeInvalid = plain(invalid.window.PHOTO_DATA);
  assert.throws(() => run(invalid, 'camera-config-data.js'), /相机配置关联任务不存在/);
  assert.deepEqual(plain(invalid.window.PHOTO_DATA), beforeInvalid);
  assert.equal(invalid.window.PHOTO_CAMERA_CONFIG, undefined);
  const missingLesson = baseline();
  missingLesson.window.PHOTO_DATA.lessons = missingLesson.window.PHOTO_DATA.lessons.filter(lesson => lesson.id !== 'camera');
  const beforeLesson = plain(missingLesson.window.PHOTO_DATA);
  assert.throws(() => run(missingLesson, 'camera-config-data.js'), /相机配置关联课程不存在/);
  assert.deepEqual(plain(missingLesson.window.PHOTO_DATA), beforeLesson);
  const duplicate = baseline();
  run(duplicate, 'camera-config-data.js');
  const before = plain(duplicate.window.PHOTO_DATA);
  const exportBefore = duplicate.window.PHOTO_CAMERA_CONFIG;
  assert.throws(() => run(duplicate, 'camera-config-data.js'), /相机配置手册已加载/);
  assert.deepEqual(plain(duplicate.window.PHOTO_DATA), before);
  assert.equal(duplicate.window.PHOTO_CAMERA_CONFIG, exportBefore);
});
