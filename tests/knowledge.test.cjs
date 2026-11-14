'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
function run(context, file) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { timeout: 1000 });
}
function baseline() {
  const context = { window: {} };
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js']) run(context, file);
  return context;
}

test('camera extension appends four lessons, four tasks and eight cards without changing existing content', () => {
  const context = baseline();
  const data = context.window.PHOTO_DATA;
  const original = plain({ lessons: data.lessons, tasks: data.tasks, cards: data.cards });
  run(context, 'knowledge-data.js');
  const camera = context.window.PHOTO_KNOWLEDGE;
  assert.deepEqual(plain(camera.lessonIds), ['sensor-raw', 'af-tracking', 'shutter-stabilization', 'lens-system']);
  assert.equal(camera.tasks.length, 4);
  assert.equal(camera.cards.length, 8);
  for (const key of ['lessons', 'tasks', 'cards']) {
    assert.deepEqual(plain(data[key].slice(0, original[key].length)), original[key], key + ' prior records are untouched');
    assert.equal(new Set(data[key].map(item => item.id)).size, data[key].length, key + ' unique identities');
  }
  assert.ok(camera.lessons.every(lesson => lesson.stage === 6));
});

test('camera lessons include substantive teaching, actionable tasks, retrieval and traceable official sources', () => {
  const context = baseline();
  run(context, 'knowledge-data.js');
  const data = context.window.PHOTO_DATA;
  const camera = context.window.PHOTO_KNOWLEDGE;
  const officialHosts = new Set(['global.canon', 'cam.start.canon', 'www.canon-europe.com', 'files.canon-europe.com', 'onlinemanual.nikonimglib.com']);
  const artwork = new Set(['camera', 'exposure', 'aperture', 'shutter', 'iso', 'focus', 'lens', 'composition', 'whitebalance', 'light', 'modes']);
  for (const lesson of camera.lessons) {
    assert.ok(lesson.sections.length >= 5, lesson.id + ' teaching sections');
    assert.ok(lesson.sections.every(section => section.title && section.body.length >= 80), lesson.id + ' sections have substantive explanations');
    assert.ok(lesson.steps.length >= 4 && lesson.mistakes.length >= 3, lesson.id + ' practice and misconceptions');
    assert.ok(lesson.quiz.options.length >= 3 && lesson.quiz.answer < lesson.quiz.options.length);
    assert.ok(lesson.quiz.explanation.length > 25);
    assert.ok(lesson.related.length >= 2 && lesson.mediaId && lesson.observation);
    assert.ok(artwork.has(lesson.art), lesson.id + ' supported principle illustration');
    const taskLinks = lesson.related.filter(link => link.href.startsWith('#practice/'));
    assert.equal(taskLinks.length, 1, lesson.id + ' one primary recordable task');
    const task = camera.tasks.find(item => '#practice/' + item.id === taskLinks[0].href);
    assert.ok(task && task.steps.length >= 4 && task.criteria.length >= 3 && task.reflection, lesson.id + ' task workflow');
    assert.equal(camera.cards.filter(card => card.lessonId === lesson.id).length, 2, lesson.id + ' retrieval coverage');
    assert.ok(lesson.sources.length >= 2, lesson.id + ' primary attribution');
    for (const source of lesson.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(officialHosts.has(url.hostname), source.url + ' verified official host');
      assert.ok(source.title && source.note);
      assert.ok(data.sources.some(item => item.url === source.url), lesson.id + ' source appears in reference index');
    }
  }
});

test('camera duplicate loading fails before adding partial records', () => {
  const context = baseline();
  run(context, 'knowledge-data.js');
  const before = plain(context.window.PHOTO_DATA);
  assert.throws(() => run(context, 'knowledge-data.js'), /相机知识内容标识重复/);
  assert.deepEqual(plain(context.window.PHOTO_DATA), before);
});

test('combined knowledge stages keep all thirty lessons and their new cross-topic paths reachable', () => {
  const context = baseline();
  for (const file of ['knowledge-data.js', 'photography-extension.js', 'media.js', 'media-v3.js', 'field-guide.js']) run(context, file);
  const data = context.window.PHOTO_DATA;
  assert.equal(data.lessons.length, 30);
  assert.equal(data.tasks.length, 26);
  assert.equal(data.cards.length, 60);
  const lessons = new Set(data.lessons.map(item => item.id));
  const tasks = new Set(data.tasks.map(item => item.id));
  const diagnoses = new Set(context.window.PhotoFieldGuide.items.map(item => item.id));
  for (const stage of [6, 7]) assert.equal(data.lessons.filter(lesson => lesson.stage === stage).length, 4);
  for (const lesson of data.lessons.filter(item => item.stage >= 6)) {
    assert.ok(context.window.PHOTO_MEDIA.assets[lesson.mediaId], lesson.id + ' existing credited photo');
    assert.equal(data.cards.filter(card => card.lessonId === lesson.id).length, 2);
    for (const related of lesson.related) {
      const [kind, id] = related.href.slice(1).split('/');
      if (kind === 'lesson') assert.ok(lessons.has(id), related.href);
      if (kind === 'practice') assert.ok(tasks.has(id), related.href);
      if (kind === 'diagnose' && id) assert.ok(diagnoses.has(id), related.href);
    }
  }
  assert.equal(new Set(data.sources.map(source => source.url)).size, data.sources.length, 'shared primary sources are deduplicated');
});
