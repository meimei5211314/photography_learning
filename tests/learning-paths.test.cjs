'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const paths = require('../learning-paths.js');
const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
function curriculum() {
  const context = { window: {} };
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js', 'knowledge-data.js', 'photography-extension.js', 'shooting-depth-data.js', 'finishing-depth-data.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  }
  return context.window.PHOTO_DATA;
}

test('six bounded goal paths connect prerequisites, courses, real tasks and observable evidence', () => {
  const data = curriculum();
  const lessonIds = new Set(data.lessons.map(item => item.id));
  const taskIds = new Set(data.tasks.map(item => item.id));
  assert.deepEqual(paths.items.map(item => item.id), ['first-session','people-action','landscape-night','tabletop','editing-delivery','visual-story']);
  for (const item of paths.items) {
    assert.ok(item.title && item.summary && item.audience && item.prerequisiteNote && item.limitation);
    assert.ok(item.lessonIds.length >= 4 && item.lessonIds.length <= 6, item.id + ' focused course scope');
    assert.ok(item.taskIds.length >= 2 && item.taskIds.length <= 3, item.id + ' practice scope');
    assert.equal(new Set(item.lessonIds).size, item.lessonIds.length);
    assert.equal(new Set(item.taskIds).size, item.taskIds.length);
    for (const id of [...item.prerequisites, ...item.lessonIds]) assert.ok(lessonIds.has(id), item.id + ' lesson ' + id);
    for (const id of item.taskIds) assert.ok(taskIds.has(id), item.id + ' task ' + id);
    assert.equal(item.evidence.length, 3);
    assert.equal(item.questions.length, 3);
    assert.ok(item.evidence.every(text => text.length > 20));
    assert.ok(Object.isFrozen(item) && Object.isFrozen(item.lessonIds));
  }
});

test('progress separates reading, latest correct responses and reported tasks without changing input', () => {
  const item = paths.items[0];
  const fresh = { completed: [], quiz: {}, tasks: {} };
  assert.deepEqual(paths.getProgress(item, fresh), { read: 0, quizCorrect: 0, tasksReported: 0, lessonTotal: item.lessonIds.length, taskTotal: item.taskIds.length });
  const state = { completed: [item.lessonIds[0], item.lessonIds[0], 'not-in-path'], quiz: { [item.lessonIds[1]]: true, [item.lessonIds[2]]: false }, tasks: { [item.taskIds[0]]: { completed: true }, [item.taskIds[1]]: { completed: false } } };
  const original = plain(state);
  assert.deepEqual(paths.getProgress(item.id, state), { read: 1, quizCorrect: 1, tasksReported: 1, lessonTotal: item.lessonIds.length, taskTotal: item.taskIds.length });
  assert.deepEqual(state, original);
  assert.equal(paths.getProgress('unknown', state), null);
  for (const id of item.lessonIds) { state.completed.push(id); state.quiz[id] = true; }
  for (const id of item.taskIds) state.tasks[id] = { completed: true };
  const full = paths.getProgress(item, state);
  assert.equal(full.read, full.lessonTotal);
  assert.equal(full.quizCorrect, full.lessonTotal);
  assert.equal(full.tasksReported, full.taskTotal);
  assert.equal(Object.hasOwn(full, 'mastered'), false, 'no inferred mastery or certification');
});

test('list, detail and unknown routes render read-only state and keep path context on action links', () => {
  const data = curriculum();
  const host = { innerHTML: '' };
  const state = { completed: ['camera'], quiz: { camera: false }, tasks: {} };
  const before = plain({ data, state });
  paths.mount(host, undefined, { data, state });
  assert.equal((host.innerHTML.match(/<h1>/g) || []).length, 1);
  assert.equal((host.innerHTML.match(/class="lp-card"/g) || []).length, 6);
  assert.match(host.innerHTML, /不能单独证明掌握/);
  paths.mount(host, 'first-session', { data, state });
  assert.equal((host.innerHTML.match(/<h1>/g) || []).length, 1);
  assert.match(host.innerHTML, /#lesson\/camera\?path=first-session/);
  assert.match(host.innerHTML, /#practice\/readiness-rehearsal\?path=first-session/);
  assert.match(host.innerHTML, /自测待巩固/);
  assert.match(host.innerHTML, /任务自报完成/);
  assert.deepEqual(plain({ data, state }), before);
  paths.mount(host, '<img src=x onerror=alert(1)>', { data, state });
  assert.match(host.innerHTML, /没有找到这条路径/);
  assert.doesNotMatch(host.innerHTML, /onerror/);
  const current = host.innerHTML;
  paths.destroy();
  assert.equal(host.innerHTML, current, 'destroy creates no extra state or events');
});

test('course and task labels are escaped and mounting does not require storage access', () => {
  const item = paths.items[0];
  const data = { lessons: item.lessonIds.map(id => ({ id, title: '<b>course</b>' })), tasks: item.taskIds.map(id => ({ id, title: '<b>task</b>', description: 'A & B' })) };
  const host = { innerHTML: '' };
  paths.mount(host, item.id, { data });
  assert.match(host.innerHTML, /&lt;b&gt;course&lt;\/b&gt;/);
  assert.match(host.innerHTML, /A &amp; B/);
  assert.doesNotMatch(host.innerHTML, /<b>course<\/b>/);
});
