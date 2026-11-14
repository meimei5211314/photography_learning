'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = { window: {}, AbortController };
for (const file of ['data.js', 'advanced-data.js', 'field-data.js', 'media.js', 'media-v3.js', 'visual-practice.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
}
const practice = context.window.PhotoPractice;
const data = context.window.PHOTO_DATA;
const media = context.window.PHOTO_MEDIA;

function host(initialImage = 'ready') {
  const listeners = new Map();
  let html = '', image = null, choices = [], check = null;
  const node = () => ({ focus() {}, scrollIntoView() {}, setAttribute() {}, classList: { toggle() {} } });
  const notice = node(), status = node();
  return {
    get innerHTML() { return html; },
    set innerHTML(value) {
      html = value;
      image = value.includes('class="vp-full-image"') ? { complete: initialImage !== 'loading', naturalWidth: initialImage === 'ready' ? 1200 : 0 } : null;
      choices = [...value.matchAll(/data-vp-answer="(\d+)"/g)].map(match => ({ ...node(), dataset: { vpAnswer: match[1] } }));
      check = value.includes('data-vp-action="check"') ? node() : null;
    },
    get image() { return image; },
    addEventListener(name, callback, options) {
      listeners.set(name, callback);
      options.signal.addEventListener('abort', () => { listeners.delete(name); }, { once: true });
    },
    querySelector(selector) {
      if (selector === '.vp-full-image img') return image;
      if (selector === '.vp-image-status') return image ? notice : null;
      if (selector === '[data-vp-action="check"]') return check;
      if (selector === '.vp-status') return status;
      return node();
    },
    querySelectorAll(selector) { return selector === '[data-vp-answer]' ? choices : []; },
    imageEvent(type, target = image) {
      target.complete = true;
      target.naturalWidth = type === 'load' ? 1200 : 0;
      listeners.get(type)?.({ type, target });
    },
    act(kind, value) {
      const property = { jump: 'vpJump', answer: 'vpAnswer', action: 'vpAction' }[kind];
      const expected = { jump: '[data-vp-jump]', answer: '[data-vp-answer]', action: '[data-vp-action]' }[kind];
      listeners.get('click')?.({ target: { closest: selector => selector === expected ? { dataset: { [property]: String(value) } } : null } });
    }
  };
}

test('visual practice preserves all legacy ids and covers every specialty photo with valid learning links', () => {
  const original = ['depth-evidence', 'group-focus', 'water-motion', 'light-edge', 'frame-purpose', 'white-balance-evidence'];
  assert.ok(practice.questions.length >= 12);
  assert.equal(new Set(practice.questions.map(q => q.id)).size, practice.questions.length);
  for (const id of original) assert.ok(practice.questions.some(q => q.id === id), id);
  for (const assetId of ['portrait', 'portraitBacklight', 'portraitGroup', 'street', 'streetNight']) {
    assert.ok(practice.questions.some(q => q.assetId === assetId), assetId);
  }
  for (const q of practice.questions) {
    assert.ok(media.assets[q.assetId], q.id + ' media');
    assert.ok(data.lessons.some(lesson => lesson.id === q.lessonId), q.id + ' lesson');
    assert.ok(data.tasks.some(task => task.id === q.taskId), q.id + ' task');
    for (const key of ['label', 'look', 'question', 'evidence', 'transfer']) assert.ok(q[key].trim(), q.id + '.' + key);
    assert.ok(q.options.length >= 3);
    assert.ok(q.options.every(option => option.trim()));
    assert.equal(new Set(q.options).size, q.options.length);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
  }
});

test('photograph bytes must load before choosing or recording a result; selection preserves the image', () => {
  const container = host('loading'), records = [], q = practice.questions[0];
  practice.mount(container, { onResult: result => records.push(result) });
  const image = container.image;
  assert.ok(container.querySelectorAll('[data-vp-answer]').every(button => button.disabled));
  container.act('answer', q.answer);
  container.act('action', 'check');
  assert.equal(records.length, 0);
  container.imageEvent('load');
  assert.ok(container.querySelectorAll('[data-vp-answer]').every(button => !button.disabled));
  assert.equal(container.querySelector('[data-vp-action="check"]').disabled, true, 'loading-time input was discarded');
  container.act('answer', q.answer);
  assert.equal(container.image, image, 'choosing must not reload the photograph');
  container.act('action', 'check');
  assert.equal(records.length, 1);
  practice.destroy();
});

test('broken image requests remain unscored and can be retried after recovery', () => {
  const container = host('loading'), records = [], q = practice.questions[0];
  practice.mount(container, { onResult: result => records.push(result) });
  const failed = container.image;
  container.imageEvent('error');
  assert.match(container.querySelector('.vp-image-status').innerHTML, /重新加载照片/);
  container.act('answer', q.answer);
  container.act('action', 'check');
  assert.equal(records.length, 0);
  container.act('action', 'reload-photo');
  assert.notEqual(container.image, failed);
  container.imageEvent('load', failed);
  assert.ok(container.querySelectorAll('[data-vp-answer]').every(button => button.disabled), 'old attempt cannot unlock retry');
  container.imageEvent('load');
  container.act('answer', q.answer);
  container.act('action', 'check');
  assert.equal(records.length, 1);
  practice.destroy();
});

test('late image events cannot change a different question or an unmounted view', () => {
  const container = host('loading'), records = [];
  practice.mount(container, { onResult: result => records.push(result) });
  const previous = container.image;
  container.act('jump', 1);
  container.imageEvent('load', previous);
  assert.ok(container.querySelectorAll('[data-vp-answer]').every(button => button.disabled));
  container.imageEvent('load');
  container.imageEvent('error', previous);
  assert.ok(container.querySelectorAll('[data-vp-answer]').every(button => !button.disabled));
  practice.destroy();
  container.imageEvent('error');
  container.act('answer', 0);
  container.act('action', 'check');
  assert.equal(records.length, 0);
});

test('a cached image decode failure also blocks grading without needing a new error event', () => {
  const container = host('error'), records = [];
  practice.mount(container, { onResult: result => records.push(result) });
  assert.match(container.querySelector('.vp-image-status').innerHTML, /照片未能加载/);
  container.act('answer', 1);
  container.act('action', 'check');
  assert.equal(records.length, 0);
  practice.destroy();
});

test('recent errors are first, answers must be checked, and double-checking does not resave', () => {
  const container = host();
  const records = [];
  const q = practice.questions.find(item => item.id === 'night-subject-motion');
  practice.mount(container, { results: { [q.id]: false, 'depth-evidence': true }, onResult: result => records.push(result) });
  assert.ok(container.innerHTML.includes(q.question));
  container.act('action', 'check');
  assert.equal(records.length, 0, 'must select an answer before checking');
  container.act('answer', q.answer);
  assert.equal(records.length, 0, 'selection is not a result');
  container.act('action', 'check');
  assert.equal(records.length, 1);
  assert.equal(records[0].id, q.id);
  assert.equal(records[0].correct, true);
  assert.ok(container.innerHTML.includes(q.evidence));
  assert.ok(container.innerHTML.includes('#practice/' + q.taskId));
  container.act('action', 'check');
  assert.equal(records.length, 1);
  practice.destroy();
});

test('retry updates the latest result and destroying a view stops future input', () => {
  const container = host();
  const records = [];
  const q = practice.questions[0];
  practice.mount(container, { onResult: result => records.push(result) });
  container.act('answer', (q.answer + 1) % q.options.length);
  container.act('action', 'check');
  assert.equal(records[0].correct, false);
  container.act('action', 'retry');
  container.act('answer', q.answer);
  container.act('action', 'check');
  assert.equal(records[1].correct, true);
  assert.equal(records.length, 2);
  practice.destroy();
  container.act('action', 'retry');
  container.act('answer', q.answer);
  container.act('action', 'check');
  assert.equal(records.length, 2);
});

test('missing photographs cannot record an answer as a visual judgment', () => {
  const container = host();
  const q = practice.questions[0];
  const assets = context.window.PHOTO_MEDIA.assets;
  const asset = assets[q.assetId];
  delete assets[q.assetId];
  let saved = false;
  try {
    practice.mount(container, { onResult: () => { saved = true; } });
    assert.match(container.innerHTML, /照片尚未加载/);
    container.act('answer', q.answer);
    container.act('action', 'check');
    assert.equal(saved, false);
  } finally {
    assets[q.assetId] = asset;
    practice.destroy();
  }
});
