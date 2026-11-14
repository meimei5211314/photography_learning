'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const histogram = require('../histogram.js');

function host() {
  const callbacks = new Map();
  const nodes = new Map();
  const node = () => ({ innerHTML: '', textContent: '', hidden: true, disabled: false, focused: false, focus() { this.focused = true; } });
  for (const selector of ['#hg-answer-status', '#hg-choices', '#hg-check', '[data-hg-reset]', '#hg-feedback']) nodes.set(selector, node());
  const inputs = [0, 1, 2].map(index => ({ ...node(), dataset: { hgChoice: String(index) }, checked: false }));
  nodes.set('[data-hg-choice]', inputs[0]);
  return {
    innerHTML: '', nodes, inputs,
    addEventListener(name, callback, options) {
      callbacks.set(name, callback);
      options.signal.addEventListener('abort', () => callbacks.delete(name), { once: true });
    },
    querySelector(selector) { return nodes.get(selector); },
    querySelectorAll() { return inputs; },
    choose(index) {
      const input = inputs[index] || { dataset: { hgChoice: String(index) } };
      input.checked = true;
      callbacks.get('change')?.({ target: { closest: selector => selector === '[data-hg-choice]' ? input : null } });
    },
    submit() {
      callbacks.get('submit')?.({ preventDefault() {}, target: { closest: selector => selector === '[data-hg-form]' ? {} : null } });
    },
    reset() {
      callbacks.get('click')?.({ target: { closest: selector => selector === '[data-hg-reset]' ? {} : null } });
    }
  };
}

test('four original synthetic scenarios have usable distributions and links to existing learning content', () => {
  const context = { window: {} };
  for (const file of ['data.js', 'advanced-data.js', 'field-data.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
  }
  const data = context.window.PHOTO_DATA;
  assert.equal(histogram.scenarios.length, 4);
  assert.equal(new Set(histogram.scenarios.map(item => item.id)).size, 4);
  for (const scenario of histogram.scenarios) {
    assert.match(scenario.id, /^[a-z][a-z0-9-]+$/);
    assert.equal(scenario.bins.length, 32);
    assert.ok(scenario.bins.every(count => Number.isFinite(count) && count >= 0));
    assert.ok(Math.max(...scenario.bins) > 0);
    assert.ok(scenario.observations.length >= 2);
    assert.ok(scenario.description.length > 20);
    assert.equal(scenario.options.length, 3);
    assert.ok(scenario.options.every(option => option.text && option.feedback));
    assert.ok(Number.isInteger(scenario.answer) && scenario.answer >= 0 && scenario.answer < scenario.options.length);
    assert.ok(scenario.steps.length >= 3);
    assert.ok(data.lessons.some(lesson => lesson.id === scenario.lessonId));
    assert.ok(data.tasks.some(task => task.id === scenario.taskId));
    assert.ok(Object.isFrozen(scenario) && Object.isFrozen(scenario.bins) && Object.isFrozen(scenario.options[0]));
  }
  const contrast = histogram.scenarios.find(item => item.id === 'high-contrast');
  assert.match(contrast.observations.join(''), /已经试拍/);
  assert.match(contrast.description, /仅凭.*不能确认/);
});

test('list and deep links label diagrams, axes and equivalents without exposing feedback before answering', () => {
  const container = host();
  histogram.mount(container);
  assert.equal((container.innerHTML.match(/class="hg-card"/g) || []).length, 4);
  assert.match(container.innerHTML, /原创合成示意/);
  for (const scenario of histogram.scenarios) {
    histogram.mount(container, scenario.id);
    assert.ok(container.innerHTML.includes(scenario.description));
    assert.match(container.innerHTML, /role="img" aria-labelledby="hg-chart-title hg-chart-description"/);
    assert.match(container.innerHTML, /纵轴：相对像素数量/);
    assert.match(container.innerHTML, /横轴：亮度/);
    assert.match(container.innerHTML, /<fieldset id="hg-choices"><legend>/);
    assert.match(container.innerHTML, /id="hg-feedback"[^>]* hidden>/);
    assert.ok(!container.innerHTML.includes(scenario.explanation));
    assert.ok(!container.innerHTML.includes(scenario.options[scenario.answer].feedback));
  }
  histogram.mount(container, '<script>alert(1)</script>');
  assert.match(container.innerHTML, /没有找到这个直方图情境/);
  assert.doesNotMatch(container.innerHTML, /<script>/);
  histogram.destroy();
});

test('an answer is required; selection alone gives no feedback, submission checks once and retry resets it', () => {
  const container = host();
  const scenario = histogram.scenarios[0];
  histogram.mount(container, scenario.id);
  container.submit();
  assert.match(container.nodes.get('#hg-answer-status').textContent, /请先选择/);
  assert.equal(container.nodes.get('#hg-feedback').hidden, true);
  assert.equal(container.inputs[0].focused, true);
  container.choose(-1);
  container.submit();
  assert.equal(container.nodes.get('#hg-feedback').hidden, true);
  container.choose(0);
  assert.equal(container.nodes.get('#hg-feedback').innerHTML, '');
  container.submit();
  const feedback = container.nodes.get('#hg-feedback');
  assert.equal(feedback.hidden, false);
  assert.equal(feedback.focused, true);
  assert.ok(feedback.innerHTML.includes(scenario.options[0].feedback));
  assert.match(feedback.innerHTML, /更有依据的下一步/);
  assert.match(feedback.innerHTML, /#practice\/metering-bracket/);
  assert.equal(container.nodes.get('#hg-choices').disabled, true);
  const first = feedback.innerHTML;
  container.choose(scenario.answer);
  container.submit();
  assert.equal(feedback.innerHTML, first, 'checked choice cannot drift without retry');
  container.reset();
  assert.equal(feedback.hidden, true);
  assert.equal(feedback.innerHTML, '');
  assert.ok(container.inputs.every(input => !input.checked));
  assert.equal(container.nodes.get('#hg-choices').disabled, false);
  container.choose(scenario.answer);
  container.submit();
  assert.match(feedback.innerHTML, /判断有依据/);
  assert.doesNotMatch(feedback.innerHTML, /更有依据的下一步/);
  histogram.destroy();
});

test('remount and destroy detach old input and do not carry answers to another scenario', () => {
  const first = host(), second = host();
  histogram.mount(first, 'low-key');
  first.choose(1);
  histogram.mount(second, 'high-key');
  first.submit();
  assert.equal(first.nodes.get('#hg-feedback').hidden, true);
  second.submit();
  assert.match(second.nodes.get('#hg-answer-status').textContent, /请先选择/);
  second.choose(2);
  second.submit();
  assert.match(second.nodes.get('#hg-feedback').innerHTML, /判断有依据/);
  histogram.destroy();
  second.reset();
  assert.equal(second.nodes.get('#hg-feedback').hidden, false, 'destroyed view cannot mutate');
});
