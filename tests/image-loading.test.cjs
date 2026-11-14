'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function load(file, api) {
  const context = { window: {}, document: {}, AbortController };
  for (const name of ['media.js', 'media-v3.js', file]) {
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', name), 'utf8'), context);
  }
  return context.window[api];
}

// A small event host models image completion and detached DOM nodes. Browser
// regression additionally covers real requests and the visible overlay.
function imageHost(prefix, initial = []) {
  const listeners = new Map();
  let html = '', nodes, members, stage, images;
  function node() {
    const classes = new Set();
    return {
      dataset: {}, style: {}, hidden: false, textContent: '', innerHTML: '',
      focus() {}, setAttribute() {},
      classList: {
        toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
        contains(name) { return classes.has(name); }
      }
    };
  }
  return {
    get innerHTML() { return html; },
    set innerHTML(value) {
      html = value;
      nodes = new Map(); members = new Set(); stage = node();
      images = [...value.matchAll(/<img\b[^>]*>/g)].map((match, index) => {
        const img = { ...node(), tagName: 'IMG', complete: initial[index] === 'ready' || initial[index] === 'error', naturalWidth: initial[index] === 'ready' ? 1200 : 0, closest: selector => selector === `.${prefix}-photo-stage` ? stage : null };
        const id = match[0].match(/\bid="([^"]+)"/)?.[1];
        if (id) nodes.set('#' + id, img);
        members.add(img);
        return img;
      });
      members.add(stage);
      nodes.set(`.${prefix}-photo-stage`, stage);
      stage.querySelectorAll = selector => selector === 'img' ? images : [];
      stage.querySelector = selector => this.querySelector(selector);
    },
    get images() { return images; },
    contains(target) { return members.has(target); },
    querySelector(selector) {
      if (!nodes.has(selector)) nodes.set(selector, node());
      return nodes.get(selector);
    },
    querySelectorAll() { return []; },
    addEventListener(name, callback, options) {
      listeners.set(name, callback);
      options.signal.addEventListener('abort', () => listeners.delete(name), { once: true });
    },
    imageEvent(type, image) {
      image.complete = true; image.naturalWidth = type === 'load' ? 1200 : 0;
      listeners.get(type)?.({ type, target: image });
    },
    click(dataset) {
      listeners.get('click')?.({ target: { closest: selector => selector === 'button' ? { dataset } : null } });
    },
    input(name, value) {
      listeners.get('input')?.({ target: { dataset: { edit: name, setting: name }, value } });
    }
  };
}

for (const [file, api, prefix] of [['editing-lab.js', 'PhotoEditing', 'edit'], ['labs.js', 'PhotoLabs', 'lab']]) {
  test(`${api}: all comparison images must load, and a later success cannot mask one failure`, () => {
    const view = load(file, api), host = imageHost(prefix);
    view.mount(host);
    const stage = host.querySelector(`.${prefix}-photo-stage`), [first, second] = host.images;
    assert.equal(host.images.length, 2);
    host.imageEvent('error', first);
    host.imageEvent('load', second);
    assert.equal(stage.classList.contains(`${prefix}-loaded`), false);
    assert.match(host.querySelector(`.${prefix}-image-status`).textContent, /未能完整加载/);
    assert.equal(host.querySelector('[data-action="reload-photo"]').hidden, false);
    host.click({ action: 'reload-photo' });
    const nextStage = host.querySelector(`.${prefix}-photo-stage`);
    host.imageEvent('load', first);
    assert.equal(nextStage.classList.contains(`${prefix}-loaded`), false, 'detached event cannot unlock a retry');
    host.imageEvent('load', host.images[0]);
    assert.equal(nextStage.classList.contains(`${prefix}-loaded`), false, 'one image is insufficient');
    host.imageEvent('load', host.images[1]);
    assert.equal(nextStage.classList.contains(`${prefix}-loaded`), true);
    assert.equal(host.querySelector('[data-action="reload-photo"]').hidden, true);
    view.destroy();
    host.imageEvent('error', host.images[0]);
    assert.equal(nextStage.classList.contains(`${prefix}-loaded`), true, 'unmounted view no longer handles events');
  });

  test(`${api}: cached completion checks cover every layer, including already broken images`, () => {
    const view = load(file, api), host = imageHost(prefix, ['ready', 'error']);
    view.mount(host);
    assert.equal(host.querySelector(`.${prefix}-photo-stage`).classList.contains(`${prefix}-loaded`), false);
    assert.equal(host.querySelector('[data-action="reload-photo"]').hidden, false);
    view.destroy();
    const ready = imageHost(prefix, ['ready', 'ready']);
    view.mount(ready);
    assert.equal(ready.querySelector(`.${prefix}-photo-stage`).classList.contains(`${prefix}-loaded`), true);
    assert.equal(ready.querySelector('[data-action="reload-photo"]').hidden, true);
    view.destroy();
  });
}

test('retrying editing photographs retains adjustments and completed workflow steps', () => {
  const view = load('editing-lab.js', 'PhotoEditing'), host = imageHost('edit');
  view.mount(host);
  host.input('exposure', '0.4');
  host.click({ order: 'backup' });
  const workflow = host.querySelector('#edit-workflow-progress').innerHTML;
  host.imageEvent('error', host.images[0]);
  host.click({ action: 'reload-photo' });
  assert.equal(host.querySelector('#edit-value-exposure').textContent, '+0.4 EV');
  assert.equal(host.querySelector('#edit-workflow-progress').innerHTML, workflow);
  view.destroy();
});

test('retrying a single-image experiment retains its chosen parameters', () => {
  const view = load('labs.js', 'PhotoLabs'), host = imageHost('lab');
  view.mount(host, 'exposure');
  assert.equal(host.images.length, 1);
  host.input('iso', '2');
  host.imageEvent('error', host.images[0]);
  host.click({ action: 'reload-photo' });
  assert.equal(host.querySelector('#lab-value-iso').textContent, 400);
  host.imageEvent('load', host.images[0]);
  assert.equal(host.querySelector('.lab-photo-stage').classList.contains('lab-loaded'), true);
  view.destroy();
});
