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
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js']) run(context, file);
  return context;
}

test('photography extension appends its independent lessons, tasks and recall cards without changing prior content', () => {
  const context = baseline(), data = context.window.PHOTO_DATA;
  const prior = plain({ lessons: data.lessons, tasks: data.tasks, cards: data.cards });
  run(context, 'photography-extension.js');
  const extension = context.window.PHOTO_PHOTOGRAPHY;
  assert.deepEqual(plain(extension.lessonIds), ['flash-basics', 'closeup', 'night-scene', 'photo-series']);
  assert.equal(extension.tasks.length, 4);
  assert.equal(extension.cards.length, 8);
  for (const key of ['lessons', 'tasks', 'cards']) {
    assert.deepEqual(plain(data[key].slice(0, prior[key].length)), prior[key], key + ' existing records');
    assert.equal(new Set(data[key].map(item => item.id)).size, data[key].length, key + ' unique identities');
  }
  assert.equal(data.lessons.length, 30);
  assert.equal(data.tasks.length, 26);
  assert.equal(data.cards.length, 60);
});

test('photography topics connect substantive teaching, misconceptions, a recordable task and two recall cards', () => {
  const context = baseline();
  run(context, 'photography-extension.js');
  for (const file of ['media.js', 'media-v3.js']) run(context, file);
  const { lessons, tasks, cards } = context.window.PHOTO_PHOTOGRAPHY;
  for (const lesson of lessons) {
    assert.equal(lesson.stage, 7);
    assert.ok(lesson.sections.length >= 5);
    assert.ok(lesson.sections.every(section => section.title && section.body.length >= 80), lesson.id + ' explanations');
    assert.ok(lesson.steps.length >= 4 && lesson.mistakes.length >= 3);
    assert.ok(lesson.quiz.options.length >= 3 && Number.isInteger(lesson.quiz.answer));
    assert.ok(lesson.quiz.answer >= 0 && lesson.quiz.answer < lesson.quiz.options.length);
    assert.ok(lesson.quiz.explanation.length > 25);
    assert.ok(lesson.related.length >= 2 && lesson.observation.length > 30);
    assert.ok(context.window.PHOTO_MEDIA.assets[lesson.mediaId], lesson.id + ' licensed reference photo');
    const taskLinks = lesson.related.filter(link => link.href.startsWith('#practice/'));
    assert.equal(taskLinks.length, 1);
    const task = tasks.find(item => '#practice/' + item.id === taskLinks[0].href);
    assert.ok(task && task.steps.length >= 4 && task.criteria.length >= 3 && task.reflection);
    assert.ok(task.description && task.settings && task.scene && task.time && task.difficulty);
    assert.equal(cards.filter(card => card.lessonId === lesson.id).length, 2);
    assert.ok(cards.filter(card => card.lessonId === lesson.id).every(card => card.front && card.back.length > 35));
  }
});

test('photography sources are traceable primary references and are included in the site index', () => {
  const context = baseline();
  run(context, 'photography-extension.js');
  const data = context.window.PHOTO_DATA;
  const official = new Set(['cam.start.canon', 'www.canon.com.au', 'www.canon-europe.com', 'files.canon-europe.com', 'www.nikon.co.uk', 'www.nikonusa.com', 'onlinemanual.nikonimglib.com', 'helpx.adobe.com']);
  for (const lesson of context.window.PHOTO_PHOTOGRAPHY.lessons) {
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

test('loading photography twice rejects duplicate IDs before partially mutating site content', () => {
  const context = baseline();
  run(context, 'photography-extension.js');
  const before = plain(context.window.PHOTO_DATA);
  assert.throws(() => run(context, 'photography-extension.js'), /摄影专题内容标识重复/);
  assert.deepEqual(plain(context.window.PHOTO_DATA), before);
});
