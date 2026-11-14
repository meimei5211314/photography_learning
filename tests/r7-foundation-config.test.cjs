'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const plain = value => JSON.parse(JSON.stringify(value));
const file = 'r7-foundation-config.js';
const run = (context, name) => vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', name), 'utf8'), context, { timeout: 1000 });
const topicIds = ['controls', 'quality', 'exposure-modes', 'auto-iso', 'metering-compensation', 'white-balance'];
function baseline() {
  const context = { window: {} };
  for (const name of ['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js', 'shooting-depth-data.js', 'finishing-depth-data.js']) run(context, name);
  return context;
}

test('R7 foundation exports exactly six topics without altering lessons, tasks, cards or global sources', () => {
  const context = baseline();
  const before = plain(context.window.PHOTO_DATA);
  run(context, file);
  const config = context.window.PHOTO_R7_FOUNDATION;
  assert.equal(config.model, 'Canon EOS R7');
  assert.equal(config.checkedAt, '2026-11-14');
  assert.deepEqual(plain(config.topics.map(topic => topic.id)), topicIds);
  assert.deepEqual(plain(context.window.PHOTO_DATA), before);
  assert.equal(context.window.PHOTO_CAMERA_CONFIG, undefined);
});

test('each topic supports setup, practice, verification, diagnosis, restoration and appropriate existing destinations', () => {
  const context = baseline();
  run(context, file);
  const data = context.window.PHOTO_DATA;
  for (const topic of context.window.PHOTO_R7_FOUNDATION.topics) {
    assert.ok(topic.title && topic.group && topic.summary.length >= 30, topic.id + ' context');
    assert.ok(topic.differences.length >= 2 && topic.differences.every(item => typeof item === 'string' && item.length >= 30), topic.id + ' useful comparison');
    assert.ok(topic.settings.length >= 3 && topic.settings.every(item => item.name && item.value && item.reason), topic.id + ' choices');
    assert.ok(topic.steps.length >= 6 && topic.steps.every(item => typeof item === 'string' && item.length >= 30), topic.id + ' operations');
    assert.ok(topic.checks.length >= 3 && topic.checks.every(item => typeof item === 'string' && item.length >= 15), topic.id + ' observable results');
    assert.ok(topic.pitfalls.length >= 2 && topic.pitfalls.every(item => item.symptom && item.fix.length >= 30), topic.id + ' diagnosis');
    assert.ok(Array.isArray(topic.restore) && topic.restore.length >= 2 && topic.restore.every(item => item.length >= 30), topic.id + ' reversible changes');
    assert.ok(topic.lessonIds.length >= 1);
    for (const id of topic.lessonIds) assert.ok(data.lessons.some(lesson => lesson.id === id), topic.id + ' lesson ' + id);
    assert.ok(data.tasks.some(task => task.id === topic.taskId), topic.id + ' task');
    assert.notEqual(topic.taskId, 'r6-first', topic.id + ' no R6-only practice requirement');
  }
});

test('all sources identify official manuals with context notes and no duplicate URLs', () => {
  const context = baseline();
  run(context, file);
  const config = context.window.PHOTO_R7_FOUNDATION;
  assert.equal(new Set(config.sources.map(source => source.url)).size, config.sources.length);
  for (const source of config.sources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'cam.start.canon');
    assert.match(url.pathname, /^\/zh\/C(?:005|022)\/manual\/html\//);
    assert.ok(source.title && source.note);
  }
  for (const topic of config.topics) {
    assert.ok(topic.sources.length >= 1);
    for (const source of topic.sources) assert.ok(config.sources.some(item => item.url === source.url), topic.id + ' indexed source');
  }
});

test('critical model differences and exceptions remain visible in the relevant topic', () => {
  const context = baseline();
  run(context, file);
  const byId = Object.fromEntries(context.window.PHOTO_R7_FOUNDATION.topics.map(topic => [topic.id, JSON.stringify(topic)]));
  assert.match(byId.controls, /Q\/SET/);
  assert.match(byId.controls, /ISO按钮/);
  assert.match(byId.controls, /LOCK/);
  assert.match(byId.controls, /先按.*再转/);
  assert.match(byId.quality, /6960×4640/);
  assert.match(byId.quality, /4320×2880/);
  assert.match(byId.quality, /裁切区域外连RAW也不记录/);
  assert.match(byId.quality, /R7.*RAW保留APS-C 3:2/);
  assert.match(byId['exposure-modes'], /继承/);
  assert.match(byId['exposure-modes'], /半按.*锁ISO/);
  assert.match(byId['auto-iso'], /上限.*变慢/);
  assert.match(byId['auto-iso'], /闪光.*不适用/);
  assert.match(byId['metering-compensation'], /闪光.*不会应用/);
  assert.match(byId['white-balance'], /AF点选择按钮/);
  assert.match(byId['white-balance'], /拍摄→自定义白平衡/);
  assert.match(byId['white-balance'], /相同K值.*不保证/);
  assert.match(byId.controls, /未持有R7/);
});

test('missing dependencies and missing lesson or task fail before publication, preserving original data', () => {
  const noData = { window: {} };
  assert.throws(() => run(noData, file), /请先加载课程数据/);
  assert.equal(noData.window.PHOTO_R7_FOUNDATION, undefined);
  for (const [collection, id, pattern] of [['lessons', 'camera', /关联课程不存在/], ['tasks', 'readiness-rehearsal', /关联任务不存在/]]) {
    const context = baseline();
    context.window.PHOTO_DATA[collection] = context.window.PHOTO_DATA[collection].filter(item => item.id !== id);
    const before = plain(context.window.PHOTO_DATA);
    assert.throws(() => run(context, file), pattern);
    assert.equal(context.window.PHOTO_R7_FOUNDATION, undefined);
    assert.deepEqual(plain(context.window.PHOTO_DATA), before);
  }
});

test('duplicate loading preserves the original export and global data', () => {
  const context = baseline();
  run(context, file);
  const config = context.window.PHOTO_R7_FOUNDATION;
  const before = plain(context.window.PHOTO_DATA);
  assert.throws(() => run(context, file), /R7基础配置已加载/);
  assert.equal(context.window.PHOTO_R7_FOUNDATION, config);
  assert.deepEqual(plain(context.window.PHOTO_DATA), before);
});
