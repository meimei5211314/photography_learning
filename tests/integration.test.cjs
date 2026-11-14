'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { buildIndex, search } = require('../search.js');
const original = require('./fixtures/v3-content-contract.json');
const fieldBaseline = require('./fixtures/field-content-contract.json');
const learning = require('../learning.js');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
for (const file of ['data.js', 'advanced-data.js', 'field-data.js','knowledge-data.js','photography-extension.js','glossary.js', 'media.js', 'media-v3.js', 'field-guide.js','histogram.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const D = context.window.PHOTO_DATA;
const cases = context.window.PHOTO_ADVANCED.cases;
const diagnoses = context.window.PhotoFieldGuide.items;
const histograms = context.window.PhotoHistogram.scenarios;
const plain = value => JSON.parse(JSON.stringify(value));
const supported = {
  lesson: new Set(D.lessons.map(x => x.id)), practice: new Set(D.tasks.map(x => x.id)),
  cases: new Set(cases.map(x => x.id)), diagnose: new Set(diagnoses.map(x => x.id)),
  histogram: new Set(histograms.map(x=>x.id)), reference: new Set(D.glossary.map(x=>x.id)),
  lab: new Set(['compare', 'exposure', 'composition', 'focal', 'whitebalance'])
};
function assertLink(href) {
  const [page, arg] = href.slice(1).split('/');
  assert.ok(href.startsWith('#'), href);
  if (arg) assert.ok(supported[page]?.has(arg), 'broken internal link: ' + href);
  else assert.ok(['home', 'camera', 'cases', 'lab', 'observe', 'practice', 'review', 'reference', 'settings', 'edit', 'diagnose', 'histogram'].includes(page), href);
}

test('all v3 learning identities and saved task criterion positions remain compatible', () => {
  for (const id of original.lessons) assert.ok(supported.lesson.has(id), id);
  for (const id of original.cards) assert.ok(D.cards.some(card => card.id === id), id);
  for (const task of original.tasks) assert.deepEqual(plain(D.tasks.find(item => item.id === task.id).criteria), task.criteria, task.id);
});
test('all 22 previous lessons and 18 task records survive the new curriculum without changing saved meanings', () => {
  for (const id of fieldBaseline.lessons) assert.ok(supported.lesson.has(id), id);
  for (const id of fieldBaseline.cards) assert.ok(D.cards.some(card => card.id === id), id);
  const before = learning.freshState();
  before.completed = [...fieldBaseline.lessons];
  for (const task of fieldBaseline.tasks) {
    assert.deepEqual(plain(D.tasks.find(item => item.id === task.id).criteria), task.criteria, task.id);
    before.tasks[task.id] = { completed: true, checks: task.criteria.map((_, index) => index), note: '保留上一轮拍摄证据与复盘' };
  }
  before.reviews[fieldBaseline.cards.at(-1)] = { step: 2, due: 1794790800000, lastReviewed: 1794531600000 };
  before.quiz['metering-histogram'] = true;
  const after = learning.validateState(before, D.lessons.map(x=>x.id), D.tasks.map(x=>x.id), D.cards.map(x=>x.id));
  assert.deepEqual(after, before);
});
test('new learning paths and all search results point to supported pages and actual records', () => {
  for (const lesson of D.lessons) for (const related of lesson.related || []) assertLink(related.href);
  const index = buildIndex(D, cases, diagnoses, histograms);
  assert.equal(index.length, D.lessons.length + D.tasks.length + cases.length + diagnoses.length + histograms.length + D.glossary.length);
  for (const item of index) assertLink(item.href);
  for (const keyword of ['直方图', '清晰', '导出', '长曝光', 'RAW', '闪光', '近摄', '夜景', '组照', '滚动快门']) {
    assert.ok(search(index, keyword).length > 0, keyword + ' must be discoverable');
  }
});

test('glossary terms have unique reachable anchors and link to teaching content', () => {
  assert.equal(D.glossary.length, 16);
  assert.equal(supported.reference.size, D.glossary.length);
  for(const term of D.glossary){assert.ok(term.title && term.summary);assert.ok(supported.lesson.has(term.lessonId));}
});
