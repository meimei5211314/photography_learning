'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { freshState, scheduleReview, isDue, validateState, DAY } = require('../learning.js');
const now = Date.parse('2026-11-13T08:00:00Z');
const validate = state => validateState(state, ['camera', 'exposure'], ['portrait'], ['card-a', 'card-b']);

test('fresh state instances do not share mutable arrays or objects', () => {
  const first = freshState();
  first.completed.push('camera');
  first.tasks.portrait = {};
  first.diagnostics['depth-choice'] = false;
  assert.deepEqual(freshState(), { version: 2, completed: [], tasks: {}, reviews: {}, quiz: {}, diagnostics: {} });
});

test('mastered cards follow 1, 3, 7, 14, 30 days and stay at 30 days', () => {
  let previous;
  let clock = now;
  for (const [index, days] of [1, 3, 7, 14, 30, 30, 30].entries()) {
    const next = scheduleReview(previous, 'good', clock);
    assert.equal(next.due - clock, days * DAY);
    assert.equal(next.step, Math.min(index + 1, 5));
    assert.equal(next.lastReviewed, clock);
    previous = next;
    clock = next.due;
  }
});

test('again resets stage, hard retains stage, and neither mutates prior record', () => {
  const previous = { due: now, step: 3, lastReviewed: now - DAY };
  assert.deepEqual(scheduleReview(previous, 'again', now), { due: now + 600000, step: 0, lastReviewed: now });
  assert.deepEqual(scheduleReview(previous, 'hard', now), { due: now + DAY, step: 3, lastReviewed: now });
  assert.equal(previous.step, 3);
  assert.equal(scheduleReview(undefined, 'hard', now).step, 0);
});

test('new cards are due, exact deadline is inclusive, and future cards are not due', () => {
  assert.equal(isDue(undefined, now), true);
  const review = { due: now, step: 0, lastReviewed: now - 600000 };
  assert.equal(isDue(review, now - 1), false);
  assert.equal(isDue(review, now), true);
  assert.equal(isDue(review, now + 1), true);
});

test('intervals cross month, leap-year, and year boundaries using elapsed time', () => {
  for (const date of ['2028-02-28T16:00:00Z', '2026-12-31T23:59:59Z', '2026-03-08T01:59:59Z']) {
    const clock = Date.parse(date);
    assert.equal(scheduleReview(null, 'good', clock).due, clock + DAY);
  }
});

test('invalid ratings, timestamps, review stages, and impossible dates fail explicitly', () => {
  assert.throws(() => scheduleReview(null, 'easy', now));
  for (const bad of [NaN, Infinity, -1, 1.2, 'today']) assert.throws(() => scheduleReview(null, 'good', bad));
  assert.throws(() => scheduleReview(null, 'good', 8640000000000000));
  assert.throws(() => scheduleReview({ due: now, step: 6, lastReviewed: now }, 'good', now));
  assert.throws(() => isDue({ due: now, step: 0, lastReviewed: now + 1 }, now));
});

test('valid backup is copied and normalized without modifying source', () => {
  const state = freshState();
  state.completed = ['camera', 'camera'];
  state.tasks.portrait = { checks: [2, 0, 2], note: '先预测，再拍摄。', completed: false };
  state.reviews['card-a'] = scheduleReview(null, 'good', now);
  state.quiz.exposure = false;
  const normalized = validate(state);
  assert.deepEqual(normalized.completed, ['camera']);
  assert.deepEqual(normalized.tasks.portrait.checks, [0, 2]);
  normalized.tasks.portrait.note = 'changed';
  normalized.reviews['card-a'].step = 5;
  assert.equal(state.tasks.portrait.note, '先预测，再拍摄。');
  assert.equal(state.reviews['card-a'].step, 1);
  assert.deepEqual(state.tasks.portrait.checks, [2, 0, 2]);
});

test('unknown ids, missing or extra fields, invalid versions and wrong types are rejected', () => {
  const candidates = [null, [], { ...freshState(), version: 3 }, { ...freshState(), extra: true },
    { ...freshState(), completed: ['unrelated'] }, { ...freshState(), tasks: [] },
    { ...freshState(), reviews: { missing: { due: now, step: 0, lastReviewed: now } } },
    { ...freshState(), quiz: { camera: 'true' } }, { ...freshState(), completed: {} }];
  for (const value of candidates) assert.throws(() => validate(value));
  const missing = freshState();
  delete missing.quiz;
  assert.throws(() => validate(missing));
});

test('malformed tasks, excessive notes, and dangerous keys cannot be imported', () => {
  for (const task of [
    { checks: [-1], note: '', completed: false },
    { checks: [128], note: '', completed: false },
    { checks: ['1'], note: '', completed: false },
    { checks: [], note: 'x'.repeat(10001), completed: false },
    { checks: [], note: '', completed: 'yes' },
    { checks: [], note: '', completed: false, custom: true }
  ]) assert.throws(() => validate({ ...freshState(), tasks: { portrait: task } }));
  const polluted = JSON.parse('{"version":1,"completed":[],"tasks":{"__proto__":{"polluted":true}},"reviews":{},"quiz":{}}');
  assert.throws(() => validate(polluted));
  assert.equal({}.polluted, undefined);
  assert.throws(() => validate(Object.assign(Object.create({ surprise: true }), freshState())));
});

test('v1 backups migrate without losing course, task, quiz or review records', () => {
  const old = {
    version: 1, completed: ['camera'],
    tasks: { portrait: { checks: [0, 1], note: '窗边观察。', completed: true } },
    reviews: { 'card-a': { due: now + DAY, step: 2, lastReviewed: now } },
    quiz: { camera: true, exposure: false }
  };
  const migrated = validate(old);
  assert.equal(migrated.version, 2);
  assert.deepEqual(migrated.diagnostics, {});
  for (const key of ['completed', 'tasks', 'reviews', 'quiz']) assert.deepEqual(migrated[key], old[key]);
  migrated.tasks.portrait.note = 'new';
  assert.equal(old.tasks.portrait.note, '窗边观察。');
  assert.equal(old.version, 1);
});

test('early free practice preserves the scheduled date and stage for every rating', () => {
  const previous = { due: now + 7 * DAY, step: 3, lastReviewed: now - DAY };
  for (const rating of ['again', 'hard', 'good']) {
    const next = scheduleReview(previous, rating, now, { practiceOnly: true });
    assert.deepEqual(next, previous);
    assert.notEqual(next, previous);
  }
  let drill = previous;
  for (let i = 0; i < 50; i++) drill = scheduleReview(drill, 'good', now + i * 1000, { practiceOnly: true });
  assert.deepEqual(drill, previous);
});

test('first or due practice still starts or advances a real review appointment', () => {
  assert.deepEqual(scheduleReview(undefined, 'good', now, { practiceOnly: true }),
    { due: now + DAY, step: 1, lastReviewed: now });
  const due = { due: now, step: 1, lastReviewed: now - DAY };
  assert.deepEqual(scheduleReview(due, 'good', now, { practiceOnly: true }),
    { due: now + 3 * DAY, step: 2, lastReviewed: now });
  assert.equal(scheduleReview(due, 'again', now, { practiceOnly: true }).due, now + 600000);
  for (const options of [null, [], { practiceOnly: 'true' }, { unknown: true }]) {
    assert.throws(() => scheduleReview(due, 'good', now, options));
  }
});

test('v2 diagnostic results preserve latest booleans while rejecting invalid or excessive keys', () => {
  const state = freshState();
  state.diagnostics = { 'depth-choice': false, 'shutter_2': true };
  const validated = validate(state);
  assert.deepEqual(validated.diagnostics, state.diagnostics);
  validated.diagnostics['depth-choice'] = true;
  assert.equal(state.diagnostics['depth-choice'], false);
  for (const map of [[], { 'bad key': true }, { '../bad': true }, { 'x': 'false' }, JSON.parse('{"__proto__":true}')]) {
    assert.throws(() => validate({ ...freshState(), diagnostics: map }));
  }
  const many = Object.fromEntries(Array.from({ length: 101 }, (_, i) => ['question-' + i, true]));
  assert.throws(() => validate({ ...freshState(), diagnostics: many }));
  const missing = freshState(); delete missing.diagnostics;
  assert.throws(() => validate(missing));
});
