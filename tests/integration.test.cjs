'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { buildIndex, search } = require('../search.js');
const original = require('./fixtures/v3-content-contract.json');
const fieldBaseline = require('./fixtures/field-content-contract.json');
const curriculumBaseline = require('./fixtures/curriculum-30-contract.json');
const cameraBaseline = require('./fixtures/curriculum-36-contract.json');
const learning = require('../learning.js');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
for (const file of ['data.js', 'advanced-data.js', 'field-data.js','knowledge-data.js','photography-extension.js','shooting-depth-data.js','finishing-depth-data.js','curriculum-support.js','camera-parameters-data.js','camera-config-data.js','lens-practice-data.js','equipment-data.js','glossary.js', 'media.js', 'media-v3.js', 'field-guide.js','histogram.js','learning-paths.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const D = context.window.PHOTO_DATA;
const cases = context.window.PHOTO_ADVANCED.cases;
const diagnoses = context.window.PhotoFieldGuide.items;
const histograms = context.window.PhotoHistogram.scenarios;
const paths = context.window.PhotoPaths.items;
const cameraTopics = context.window.PHOTO_CAMERA_CONFIG.topics;
const equipment = context.window.PHOTO_EQUIPMENT;
const plain = value => JSON.parse(JSON.stringify(value));
const supported = {
  camera: new Set(cameraTopics.map(item=>item.id)),
  paths: new Set(paths.map(item=>item.id)),
  lesson: new Set(D.lessons.map(x => x.id)), practice: new Set(D.tasks.map(x => x.id)),
  cases: new Set(cases.map(x => x.id)), diagnose: new Set(diagnoses.map(x => x.id)),
  histogram: new Set(histograms.map(x=>x.id)), reference: new Set(D.glossary.map(x=>x.id)),
  lab: new Set(['compare', 'exposure', 'composition', 'focal', 'whitebalance'])
};
function assertLink(href) {
  const [page, arg] = href.slice(1).split('/');
  assert.ok(href.startsWith('#'), href);
  if (arg) assert.ok(supported[page]?.has(arg), 'broken internal link: ' + href);
  else assert.ok(['home', 'camera', 'cases', 'lab', 'observe', 'practice', 'review', 'reference', 'settings', 'edit', 'diagnose', 'histogram', 'paths', 'kit'].includes(page), href);
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
  const index = buildIndex(D, cases, diagnoses, histograms, paths, cameraTopics, equipment);
  assert.equal(index.length, D.lessons.length + D.tasks.length + cases.length + diagnoses.length + histograms.length + D.glossary.length + paths.length + cameraTopics.length + 1);
  for (const item of index) assertLink(item.href);
  for (const keyword of ['直方图', '清晰', '导出', '长曝光', 'RAW', '闪光', '近摄', '夜景', '组照', '滚动快门', '滤镜', '追随', '蒙版', '软打样']) {
    assert.ok(search(index, keyword).length > 0, keyword + ' must be discoverable');
  }
});

test('glossary terms have unique reachable anchors and link to teaching content', () => {
  assert.equal(D.glossary.length, 16);
  assert.equal(supported.reference.size, D.glossary.length);
  for(const term of D.glossary){assert.ok(term.title && term.summary);assert.ok(supported.lesson.has(term.lessonId));}
});

test('the thirty-lesson backup contract survives expansion with completed tasks, notes and reviews intact', () => {
  const before = learning.freshState();
  before.completed = [...curriculumBaseline.lessons];
  for (const task of curriculumBaseline.tasks) {
    assert.deepEqual(plain(D.tasks.find(item=>item.id===task.id).criteria), task.criteria, task.id);
    before.tasks[task.id] = {completed:true, checks:task.criteria.map((_,i)=>i), note:'保留这次拍摄的观察与理由'};
  }
  for (const id of curriculumBaseline.cards) before.reviews[id] = {step:2,due:1794790800000,lastReviewed:1794531600000};
  for (const id of before.completed) before.quiz[id] = true;
  assert.deepEqual(learning.validateState(before,D.lessons.map(x=>x.id),D.tasks.map(x=>x.id),D.cards.map(x=>x.id)),before);
});

test('foundation goals and prerequisites lead to actual practice without circular prerequisites', () => {
  const foundations = D.lessons.filter(item=>item.stage<=3);
  assert.equal(foundations.length,12);
  const visit = (id, chain=[]) => {
    assert.ok(!chain.includes(id), 'prerequisite cycle: '+[...chain,id].join(' -> '));
    const lesson=D.lessons.find(item=>item.id===id);
    assert.ok(lesson, id);
    for(const prerequisite of lesson.prerequisites||[]) visit(prerequisite,[...chain,id]);
  };
  for(const lesson of foundations){
    assert.ok(lesson.outcomes.length>=2,lesson.id);
    assert.ok(supported.practice.has(lesson.taskId),lesson.id+' task');
    visit(lesson.id);
  }
  assert.equal(paths.length,6);
  for(const item of paths){
    assertLink('#paths/'+item.id);
    for(const id of item.lessonIds)assertLink('#lesson/'+id);
    for(const id of item.taskIds)assertLink('#practice/'+id);
  }
});

test('camera detail preserves all 36 lesson identities, quiz meanings and 32 saved task checklists', () => {
  assert.deepEqual(plain(D.lessons.slice(0,cameraBaseline.lessons.length).map(item=>item.id)), cameraBaseline.lessons);
  assert.deepEqual(plain(D.cards.slice(0,cameraBaseline.cards.length).map(item=>item.id)), cameraBaseline.cards);
  const before = learning.freshState();
  before.completed = [...cameraBaseline.lessons];
  for (const lesson of D.lessons.filter(item=>cameraBaseline.lessons.includes(item.id))) {
    assert.deepEqual(plain(lesson.quiz), cameraBaseline.quiz[lesson.id], lesson.id+' saved answer meaning');
    before.quiz[lesson.id] = true;
  }
  for (const task of cameraBaseline.tasks) {
    assert.deepEqual(plain(D.tasks.find(item=>item.id===task.id).criteria), task.criteria, task.id);
    before.tasks[task.id] = {completed:true, checks:task.criteria.map((_,i)=>i), note:'相机设置调整前的实拍记录'};
  }
  for (const id of cameraBaseline.cards) before.reviews[id] = {step:2,due:1794790800000,lastReviewed:1794531600000};
  assert.deepEqual(learning.validateState(before,D.lessons.map(x=>x.id),D.tasks.map(x=>x.id),D.cards.map(x=>x.id)),before);
});

test('all camera configurations link to real lessons and tasks and can be found through setting names', () => {
  const index = buildIndex(D, cases, diagnoses, histograms, paths, cameraTopics, equipment);
  assert.equal(cameraTopics.length,12);
  for (const topic of cameraTopics) {
    assertLink('#camera/'+topic.id);
    for (const id of topic.lessonIds) assertLink('#lesson/'+id);
    assertLink('#practice/'+topic.taskId);
    assert.ok(index.some(item=>item.type==='相机配置'&&item.href==='#camera/'+topic.id));
  }
  for (const term of ['ISO','白平衡','伺服','C1','快门','回放']) {
    assert.ok(search(index, term).some(item=>item.type==='相机配置'),term);
  }
});

test('confirmed kit and four lens courses are discoverable without marking new practice complete', () => {
  assertLink('#kit');
  assert.equal(equipment.camera.name,'EOS R6 Mark III');
  assert.equal(equipment.lenses.length,2);
  for (const lens of equipment.lenses) assertLink('#lesson/'+lens.lessonId);
  for (const scenario of equipment.scenarios) assertLink('#lesson/'+scenario.lessonId);
  const index = buildIndex(D, cases, diagnoses, histograms, paths, cameraTopics, equipment);
  for (const term of ['小痰盂','18-150','RF50','RF50mmf1.8stm']) {
    assert.ok(search(index, term).some(item=>item.href==='#kit'),term+' kit entry');
  }
  const state = learning.freshState();
  state.completed = [...cameraBaseline.lessons];
  for (const task of cameraBaseline.tasks) state.tasks[task.id] = {completed:true,checks:task.criteria.map((_,i)=>i),note:'以前的器材实拍记录'};
  const restored = learning.validateState(state,D.lessons.map(x=>x.id),D.tasks.map(x=>x.id),D.cards.map(x=>x.id));
  for (const lesson of D.lessons.filter(item=>item.stage===10)) assert.ok(!restored.completed.includes(lesson.id));
  for (const id of ['prime-distance-focus','zoom-aperture-map','matched-lens-pairs','two-lens-field-story']) assert.equal(restored.tasks[id],undefined);
});
