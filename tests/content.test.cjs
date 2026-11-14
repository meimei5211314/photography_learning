'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8'), context, { timeout: 1000 });
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../advanced-data.js'), 'utf8'), context, { timeout: 1000 });
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../field-data.js'), 'utf8'), context, { timeout: 1000 });
for (const file of ['knowledge-data.js','photography-extension.js','shooting-depth-data.js','finishing-depth-data.js','curriculum-support.js','camera-parameters-data.js','camera-config-data.js','lens-practice-data.js','equipment-data.js','dual-camera-lessons.js','dual-camera-data.js','glossary.js']) vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, {timeout: 1000});
const data = context.window.PHOTO_DATA;

function text(value, label) {
  assert.equal(typeof value, 'string', label + ' must be text');
  assert.ok(value.trim().length > 0, label + ' must not be empty');
}
function texts(values, minimum, label) {
  assert.ok(Array.isArray(values), label + ' must be an array');
  assert.ok(values.length >= minimum, label + ' has too few entries');
  values.forEach((value, index) => text(value, label + '[' + index + ']'));
}
function uniqueIds(values, label) {
  const ids = values.map(value => value.id);
  assert.equal(new Set(ids).size, ids.length, label + ' ids must be unique');
  ids.forEach(id => assert.match(id, /^[a-z][a-z0-9-]*$/, label + ' id must be safe for routes'));
}

test('complete curriculum contains 43 lessons, 39 practical tasks and 86 memory cards', () => {
  assert.ok(data && typeof data === 'object');
  assert.equal(data.lessons.length, 43);
  assert.equal(data.tasks.length, 39);
  assert.equal(data.cards.length, 86);
  uniqueIds(data.lessons, 'lesson');
  uniqueIds(data.tasks, 'task');
  uniqueIds(data.cards, 'card');
});

test('every lesson includes explanation, practice, misconceptions and an answerable quiz', () => {
  const labs = new Set(['', 'exposure', 'composition', 'focal', 'whitebalance']);
  for (const lesson of data.lessons) {
    for (const field of ['title', 'subtitle', 'tag', 'art', 'intro', 'mnemonic']) text(lesson[field], lesson.id + '.' + field);
    assert.ok([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(lesson.stage), lesson.id + ' stage');
    assert.ok(Number.isFinite(lesson.minutes) && lesson.minutes > 0, lesson.id + ' duration');
    assert.ok(labs.has(lesson.lab), lesson.id + ' lab route');
    assert.ok(Array.isArray(lesson.sections) && lesson.sections.length >= 3, lesson.id + ' explanations');
    lesson.sections.forEach(section => {
      text(section.title, lesson.id + '.section.title');
      text(section.body, lesson.id + '.section.body');
    });
    texts(lesson.steps, 2, lesson.id + '.steps');
    texts(lesson.mistakes, 1, lesson.id + '.mistakes');
    text(lesson.quiz.question, lesson.id + '.quiz.question');
    text(lesson.quiz.explanation, lesson.id + '.quiz.explanation');
    texts(lesson.quiz.options, 2, lesson.id + '.quiz.options');
    assert.ok(Number.isInteger(lesson.quiz.answer) && lesson.quiz.answer >= 0 && lesson.quiz.answer < lesson.quiz.options.length, lesson.id + ' correct answer index');
  }
  for (const stage of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) assert.ok(data.lessons.some(lesson => lesson.stage === stage), 'stage ' + stage + ' must have lessons');
});

test('practical tasks contain instructions, starting settings, observable criteria and reflection', () => {
  for (const task of data.tasks) {
    for (const field of ['title', 'scene', 'difficulty', 'time', 'description', 'settings', 'reflection']) text(task[field], task.id + '.' + field);
    texts(task.steps, 3, task.id + '.steps');
    texts(task.criteria, 2, task.id + '.criteria');
  }
});

test('all cards link to existing lessons, every lesson is covered, and sources use HTTPS', () => {
  const lessonIds = new Set(data.lessons.map(lesson => lesson.id));
  const covered = new Set();
  for (const card of data.cards) {
    text(card.front, card.id + '.front');
    text(card.back, card.id + '.back');
    assert.ok(lessonIds.has(card.lessonId), card.id + ' related lesson');
    covered.add(card.lessonId);
  }
  assert.equal(covered.size, lessonIds.size, 'all lessons need memory cards');
  assert.ok(Array.isArray(data.sources) && data.sources.length >= 2, 'sources must be provided');
  assert.equal(new Set(data.sources.map(source => source.url)).size, data.sources.length, 'source URLs should not repeat');
  for (const source of data.sources) {
    text(source.title, 'source.title');
    text(source.note, 'source.note');
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(url.hostname.includes('.'));
  }
});
