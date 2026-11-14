'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../progress-store.js');
const L = require('../learning.js');
const KEY = 'field-notes-photography-v1';
const validate = value => L.validateState(value, ['camera', 'exposure'], ['portrait'], ['camera-path']);
function record(lesson = 'camera') {
  const value = L.freshState();
  value.completed = [lesson];
  value.tasks.portrait = { checks: [0], note: '保留这段复盘', completed: false };
  return value;
}
function memory(initial = null) {
  let raw = initial;
  return {
    failRead: false, failWrite: false, writes: 0, afterWrite: null,
    getItem(key) { assert.equal(key, KEY); if (this.failRead) throw Error('read denied'); return raw; },
    setItem(key, value) { assert.equal(key, KEY); if (this.failWrite) throw Error('quota exceeded'); this.writes++; raw = value; if (this.afterWrite) raw = this.afterWrite; },
    external(value) { raw = value; },
    raw() { return raw; }
  };
}
const storeFor = storage => createStore({ getStorage: () => storage, key: KEY, validate, freshState: L.freshState });

test('empty browser storage is read without writing, and a valid save keeps the original format', () => {
  const storage = memory(), store = storeFor(storage);
  assert.deepEqual(store.load().state, L.freshState());
  assert.equal(storage.writes, 0);
  const draft = record(), result = store.save(draft);
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(storage.raw()), draft);
  assert.equal(store.status().kind, 'ready');
  result.state.tasks.portrait.note = 'different';
  assert.equal(draft.tasks.portrait.note, '保留这段复盘');
});
test('loading v1 progress migrates in memory without rewriting the original record', () => {
  const old = { version: 1, completed: ['camera'], tasks: {}, reviews: {}, quiz: { camera: true } };
  const raw = JSON.stringify(old), storage = memory(raw), store = storeFor(storage);
  const result = store.load();
  assert.equal(result.ok, true);
  assert.equal(result.state.version, 2);
  assert.deepEqual(result.state.completed, old.completed);
  assert.deepEqual(result.state.quiz, old.quiz);
  assert.equal(storage.raw(), raw);
  assert.equal(storage.writes, 0);
});
test('malformed existing records are preserved until explicit replacement succeeds', () => {
  const storage = memory('{broken'), store = storeFor(storage);
  assert.equal(store.load().kind, 'invalid');
  assert.equal(store.status().invalidRaw, '{broken');
  assert.equal(store.save(record()).kind, 'invalid');
  assert.equal(storage.raw(), '{broken');
  storage.failWrite = true;
  assert.equal(store.save(record(), { replaceInvalid: true }).ok, false);
  assert.equal(store.status().invalidRaw, '{broken');
  storage.failWrite = false;
  assert.equal(store.save(record(), { replaceInvalid: true }).ok, true);
  assert.equal(store.status().invalidRaw, null);
});
test('failed reads cannot authorize replacing an unread existing record', () => {
  const raw = JSON.stringify(record()), storage = memory(raw), store = storeFor(storage);
  storage.failRead = true;
  assert.equal(store.load().kind, 'unavailable');
  storage.failRead = false;
  assert.equal(store.save(L.freshState()).ok, false);
  assert.equal(storage.raw(), raw);
  assert.equal(store.load().ok, true);
  assert.equal(store.save(L.freshState()).ok, true);
});
test('a denied localStorage getter is handled without crashing the application', () => {
  const store = createStore({ getStorage() { throw Error('SecurityError'); }, key: KEY, validate, freshState: L.freshState });
  assert.equal(store.load().kind, 'unavailable');
  assert.equal(store.save(record()).ok, false);
  assert.equal(store.check().ok, false);
});
test('write failure leaves stored progress and draft intact and permits an explicit retry', () => {
  const raw = JSON.stringify(record()), storage = memory(raw), store = storeFor(storage);
  store.load();
  const draft = record('exposure');
  storage.failWrite = true;
  assert.equal(store.save(draft).kind, 'unavailable');
  assert.equal(storage.raw(), raw);
  assert.deepEqual(draft.completed, ['exposure']);
  assert.equal(store.check().kind, 'unavailable');
  storage.failWrite = false;
  assert.equal(store.save(draft).ok, true);
  assert.deepEqual(JSON.parse(storage.raw()).completed, ['exposure']);
});
test('a stale page cannot overwrite another page, even before a storage event is delivered', () => {
  const storage = memory(), first = storeFor(storage), second = storeFor(storage);
  first.load(); second.load();
  const firstDraft = record(), secondDraft = record('exposure');
  secondDraft.tasks.portrait.note = '第二页新增笔记';
  assert.equal(first.save(firstDraft).ok, true);
  const raw = storage.raw();
  assert.equal(second.save(secondDraft).kind, 'conflict');
  assert.equal(storage.raw(), raw);
  assert.equal(secondDraft.tasks.portrait.note, '第二页新增笔记');
  assert.deepEqual(second.load().state, firstDraft);
  assert.equal(second.save(secondDraft).ok, true);
});
test('external clearing or replacement blocks normal saves and backup imports alike', () => {
  for (const external of [null, JSON.stringify(record('exposure')), '{damaged']) {
    const storage = memory(JSON.stringify(record())), store = storeFor(storage);
    store.load(); storage.external(external);
    assert.equal(store.check().kind, 'conflict');
    assert.equal(store.save(record(), { replaceInvalid: true }).kind, 'conflict');
    assert.equal(storage.raw(), external);
    assert.equal(storage.writes, 0);
  }
});
test('once observed, an external change requires explicit reload even if raw text later matches', () => {
  const raw = JSON.stringify(record()), storage = memory(raw), store = storeFor(storage);
  store.load(); storage.external(null);
  assert.equal(store.check().kind, 'conflict');
  storage.external(raw);
  assert.equal(store.save(record()).kind, 'conflict');
  assert.equal(store.load().ok, true);
  assert.equal(store.save(record()).ok, true);
});
test('invalid candidates and an observable write/readback race do not report success', () => {
  const storage = memory(), store = storeFor(storage);
  store.load();
  assert.equal(store.save({ ...record(), extra: true }).kind, 'validation');
  assert.equal(storage.writes, 0);
  const competing = JSON.stringify(record('exposure'));
  storage.afterWrite = competing;
  assert.equal(store.save(record()).kind, 'conflict');
  assert.equal(storage.raw(), competing);
});

test('a known conflict survives read errors and failed reloads even when the old raw value returns', () => {
  const raw = JSON.stringify(record()), storage = memory(raw), store = storeFor(storage);
  store.load();
  storage.external(JSON.stringify(record('exposure')));
  assert.equal(store.check().kind, 'conflict');
  storage.failRead = true;
  assert.equal(store.check().kind, 'conflict');
  assert.equal(store.load().kind, 'conflict');
  storage.failRead = false;
  storage.external(raw);
  assert.equal(store.save(record('exposure')).kind, 'conflict');
  assert.equal(storage.writes, 0);
  assert.equal(store.load().ok, true);
  assert.equal(store.save(record('exposure')).ok, true);
});
