'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const guide = require('../field-guide.js');

function host() {
  const callbacks = new Map();
  const status = { textContent: '' };
  const inputs = [0, 1, 2].map(index => ({ dataset: { fgCheck: String(index) }, checked: false }));
  return {
    innerHTML: '', status, inputs,
    addEventListener(name, callback, options) {
      callbacks.set(name, callback);
      options.signal.addEventListener('abort', () => callbacks.delete(name), { once: true });
    },
    querySelector() { return status; },
    querySelectorAll() { return inputs; },
    change(index, checked) {
      const input = inputs[index];
      input.checked = checked;
      callbacks.get('change')?.({ target: { closest: selector => selector === '[data-fg-check]' ? input : null } });
    },
    reset() { callbacks.get('click')?.({ target: { closest: selector => selector === '[data-fg-reset]' ? {} : null } }); }
  };
}

test('diagnosis entries lead to actual lessons and recordable tasks with a controlled verification', () => {
  const context = { window: {} };
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
  }
  const data = context.window.PHOTO_DATA;
  assert.ok(guide.items.length >= 8);
  assert.equal(new Set(guide.items.map(item => item.id)).size, guide.items.length);
  for (const item of guide.items) {
    assert.match(item.id, /^[a-z][a-z0-9-]+$/);
    for (const key of ['title', 'summary', 'category']) assert.ok(item[key].trim(), item.id + '.' + key);
    for (const key of ['evidence', 'checks', 'actions', 'mistakes']) {
      assert.ok(item[key].length >= 2, item.id + '.' + key);
      assert.ok(item[key].every(value => typeof value === 'string' && value.trim()));
    }
    assert.ok(item.lessonIds.length >= 1);
    for (const id of item.lessonIds) assert.ok(data.lessons.some(lesson => lesson.id === id), item.id + ' lesson ' + id);
    assert.ok(data.tasks.some(task => task.id === item.taskId), item.id + ' task');
    if (item.source) assert.equal(new URL(item.source.url).protocol, 'https:');
  }
});

test('deep links show the selected evidence and unknown links safely return to the list', () => {
  const container = host();
  guide.mount(container, 'subject-motion');
  assert.match(container.innerHTML, /背景清楚，人物却有拖影/);
  assert.match(container.innerHTML, /#practice\/sharpness-check/);
  assert.match(container.innerHTML, /data-fg-check="2"/);
  guide.mount(container, '<script>alert(1)</script>');
  assert.match(container.innerHTML, /没有找到这项排障/);
  assert.doesNotMatch(container.innerHTML, /<script>/);
  assert.equal((container.innerHTML.match(/class="fg-card"/g) || []).length, guide.items.length);
  guide.destroy();
});

test('checklist supports undo, reset and cleanup without implying a confirmed diagnosis', () => {
  const container = host();
  guide.mount(container, 'subject-motion');
  container.change(0, true);
  container.change(1, true);
  container.change(2, true);
  assert.match(container.status.textContent, /3 \/ 3/);
  assert.match(container.status.textContent, /继续检查其他可能原因/);
  container.change(1, false);
  assert.match(container.status.textContent, /2 \/ 3/);
  container.reset();
  assert.match(container.status.textContent, /0 \/ 3/);
  assert.ok(container.inputs.every(input => !input.checked));
  guide.destroy();
  container.change(0, true);
  assert.match(container.status.textContent, /0 \/ 3/, 'destroyed view no longer handles input');
});

test('remounting a different symptom starts a new checklist and detaches the old one', () => {
  const first = host(), second = host();
  guide.mount(first, 'subject-motion');
  first.change(0, true);
  guide.mount(second, 'export-soft');
  first.change(1, true);
  assert.match(first.status.textContent, /1 \/ 3/);
  second.change(2, true);
  assert.match(second.status.textContent, /1 \/ 3/);
  assert.match(second.innerHTML, /#practice\/export-verify/);
  guide.destroy();
});
