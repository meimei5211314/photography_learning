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
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js']) run(context, file);
  return context;
}

test('finishing depth appends independent learning records and preserves prior IDs, content and task criteria', () => {
  const context = baseline(), data = context.window.PHOTO_DATA;
  const prior = plain({ lessons: data.lessons, tasks: data.tasks, cards: data.cards });
  run(context, 'finishing-depth-data.js');
  const extension = context.window.PHOTO_FINISHING_DEPTH;
  assert.deepEqual(plain(extension.lessonIds), ['still-life-lighting', 'local-editing', 'color-output']);
  assert.deepEqual(plain(extension.taskIds), ['still-life-reflection-test', 'local-editing-check', 'color-output-proof']);
  assert.equal(extension.cards.length, 6);
  for (const key of ['lessons', 'tasks', 'cards']) {
    assert.deepEqual(plain(data[key].slice(0, prior[key].length)), prior[key], key + ' existing records');
    assert.equal(new Set(data[key].map(item => item.id)).size, data[key].length, key + ' unique identities');
  }
  assert.deepEqual([data.lessons.length, data.tasks.length, data.cards.length], [33, 29, 66]);
});

test('each finishing lesson connects substantive explanation, a valid task, two cards and an existing credited image', () => {
  const context = baseline();
  for (const file of ['finishing-depth-data.js', 'media.js', 'media-v3.js']) run(context, file);
  const data = context.window.PHOTO_DATA;
  const { lessons, tasks, cards } = context.window.PHOTO_FINISHING_DEPTH;
  for (const lesson of lessons) {
    assert.equal(lesson.stage, 9);
    assert.ok(lesson.sections.length >= 6);
    assert.ok(lesson.sections.every(section => section.title && section.body.length >= 80), lesson.id + ' explanations');
    assert.ok(lesson.steps.length >= 5 && lesson.mistakes.length >= 3);
    assert.ok(lesson.quiz.options.length >= 3 && Number.isInteger(lesson.quiz.answer));
    assert.ok(lesson.quiz.answer >= 0 && lesson.quiz.answer < lesson.quiz.options.length);
    assert.ok(lesson.quiz.explanation.length > 25);
    assert.ok(lesson.related.length >= 2 && lesson.observation.length > 30);
    const asset = context.window.PHOTO_MEDIA.assets[lesson.mediaId];
    assert.ok(asset, lesson.id + ' media ID resolves');
    assert.ok(fs.existsSync(path.join(__dirname, '..', asset.src)), lesson.id + ' local image exists');
    assert.ok(asset.source && asset.author && asset.license && asset.note, lesson.id + ' attribution retained');
    const taskLinks = lesson.related.filter(link => link.href.startsWith('#practice/'));
    assert.equal(taskLinks.length, 1);
    const task = tasks.find(item => '#practice/' + item.id === taskLinks[0].href);
    assert.ok(task && task.steps.length >= 5 && task.criteria.length >= 3 && task.reflection);
    assert.ok(task.description && task.settings && task.scene && task.time && task.difficulty);
    for (const link of lesson.related) {
      const [, route, id] = /^#(lesson|practice)\/(.+)$/.exec(link.href) || [];
      assert.ok(route && id, lesson.id + ' supported related route');
      const records = route === 'lesson' ? data.lessons : data.tasks;
      assert.ok(records.some(record => record.id === id), lesson.id + ' destination ' + link.href);
    }
    const recall = cards.filter(card => card.lessonId === lesson.id);
    assert.equal(recall.length, 2);
    assert.ok(recall.every(card => card.front && card.back.length > 35));
  }
});

test('finishing references retain primary source context and deduplicate shared sources in the site index', () => {
  const context = baseline();
  run(context, 'finishing-depth-data.js');
  const data = context.window.PHOTO_DATA;
  const official = new Set(['www.canon.com.hk', 'www.nikonusa.com', 'helpx.adobe.com']);
  for (const lesson of context.window.PHOTO_FINISHING_DEPTH.lessons) {
    assert.ok(lesson.sources.length >= 2);
    for (const source of lesson.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(official.has(url.hostname), source.url);
      assert.ok(source.title && source.note);
      assert.ok(data.sources.some(item => item.url === source.url));
    }
  }
  assert.equal(new Set(data.sources.map(source => source.url)).size, data.sources.length);
});

test('loading finishing depth twice rejects duplicates before mutating any existing content', () => {
  const context = baseline();
  run(context, 'finishing-depth-data.js');
  const before = plain(context.window.PHOTO_DATA);
  assert.throws(() => run(context, 'finishing-depth-data.js'), /成片深化内容标识重复/);
  assert.deepEqual(plain(context.window.PHOTO_DATA), before);
});
