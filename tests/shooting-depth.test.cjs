'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const plain = x => JSON.parse(JSON.stringify(x));
const run = (c, f) => vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), c);
function baseline() {
  const c = {window:{}};
  for (const f of ['data.js','advanced-data.js','field-data.js','knowledge-data.js','photography-extension.js']) run(c,f);
  return c;
}
test('shooting depth appends three independent lessons, tasks and six cards without modifying old records', () => {
  const c=baseline(), d=c.window.PHOTO_DATA;
  const before=plain({lessons:d.lessons,tasks:d.tasks,cards:d.cards});
  run(c,'shooting-depth-data.js');
  const ext=c.window.PHOTO_SHOOTING_DEPTH;
  assert.deepEqual(plain(ext.lessonIds),['camera-readiness','filters-exposure','action-panning']);
  assert.deepEqual(plain(ext.taskIds),['readiness-rehearsal','filter-comparison','panning-sequence']);
  assert.equal(ext.cards.length,6);
  for(const key of ['lessons','tasks','cards']) {
    assert.deepEqual(plain(d[key].slice(0,before[key].length)),before[key]);
    assert.equal(new Set(d[key].map(x=>x.id)).size,d[key].length);
  }
});
test('shooting courses connect complete decision workflows, official sources, credited media and real tasks', () => {
  const c=baseline();
  for(const f of ['shooting-depth-data.js','media.js','media-v3.js','histogram.js'])run(c,f);
  const d=c.window.PHOTO_DATA, ext=c.window.PHOTO_SHOOTING_DEPTH;
  const hosts=new Set(['cam.start.canon','www.fujifilm-x.com','www.academy.canon-me.com','www.nikonusa.com','www.canon.com.hk']);
  for(const lesson of ext.lessons) {
    assert.equal(lesson.stage,8);
    assert.ok(lesson.sections.length>=6&&lesson.sections.every(s=>s.title&&s.body.length>80));
    assert.ok(lesson.steps.length>=5&&lesson.mistakes.length>=3);
    assert.ok(lesson.quiz.answer>=0&&lesson.quiz.answer<lesson.quiz.options.length&&lesson.quiz.explanation);
    assert.ok(c.window.PHOTO_MEDIA.assets[lesson.mediaId]);
    assert.ok(lesson.observation.length>30&&lesson.mnemonic);
    const taskLinks=lesson.related.filter(x=>x.href.startsWith('#practice/'));
    assert.equal(taskLinks.length,1);
    const task=ext.tasks.find(x=>taskLinks[0].href==='#practice/'+x.id);
    assert.ok(task&&task.steps.length>=5&&task.criteria.length>=3&&task.reflection);
    assert.equal(ext.cards.filter(x=>x.lessonId===lesson.id).length,2);
    for(const link of lesson.related) {
      const [type,id]=link.href.slice(1).split('/');
      if(type==='lesson')assert.ok(d.lessons.some(x=>x.id===id),link.href);
      else if(type==='practice')assert.ok(d.tasks.some(x=>x.id===id),link.href);
      else assert.ok(type==='histogram'&&(!id||c.window.PhotoHistogram.scenarios.some(x=>x.id===id)),link.href);
    }
    assert.ok(lesson.sources.length>=2);
    for(const source of lesson.sources) {
      const url=new URL(source.url);
      assert.equal(url.protocol,'https:'); assert.ok(hosts.has(url.hostname));
      assert.ok(source.title&&source.note&&d.sources.some(x=>x.url===source.url));
    }
  }
  assert.equal(new Set(d.sources.map(s=>s.url)).size,d.sources.length);
});
test('duplicate shooting module load fails before adding partial records', () => {
  const c=baseline();run(c,'shooting-depth-data.js');
  const before=plain(c.window.PHOTO_DATA);
  assert.throws(()=>run(c,'shooting-depth-data.js'),/现场深化内容标识重复/);
  assert.deepEqual(plain(c.window.PHOTO_DATA),before);
});
