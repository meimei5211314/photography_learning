'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const L=require('../learning.js');
const original=require('./fixtures/v2-content-contract.json');
const context={window:{}};
for(const file of ['data.js','advanced-data.js','field-data.js','knowledge-data.js','photography-extension.js','glossary.js','media.js','media-v3.js','field-guide.js','histogram.js']) vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const D=context.window.PHOTO_DATA,A=context.window.PHOTO_ADVANCED,M=context.window.PHOTO_MEDIA;
const plain=x=>JSON.parse(JSON.stringify(x));

test('legacy lesson/card identities and task criterion positions survive expansion',()=>{
  for(const id of original.lessons) assert.ok(D.lessons.some(l=>l.id===id),id);
  for(const id of original.cards) assert.ok(D.cards.some(c=>c.id===id),id);
  for(const t of original.tasks) assert.deepEqual(plain(D.tasks.find(x=>x.id===t.id).criteria),t.criteria,t.id);
});

test('populated v1 and v2 backups retain actual completed tasks and review deadlines',()=>{
  for(const version of [1,2]){
    const before={version,completed:['camera','workflow'],tasks:{},reviews:{'camera-path':{step:2,lastReviewed:1794531600000,due:1794790800000}},quiz:{camera:true,workflow:false}};
    for(const t of original.tasks) before.tasks[t.id]={completed:true,checks:t.criteria.map((_,i)=>i),note:'这是兼容性测试记录'};
    if(version===2) before.diagnostics={'depth-evidence':true};
    const after=L.validateState(before,D.lessons.map(l=>l.id),D.tasks.map(t=>t.id),D.cards.map(c=>c.id));
    assert.deepEqual(after.completed,before.completed);
    assert.deepEqual(after.tasks,before.tasks);
    assert.deepEqual(after.reviews,before.reviews);
    assert.deepEqual(after.quiz,before.quiz);
    assert.deepEqual(after.diagnostics,version===2?before.diagnostics:{});
    assert.ok(!after.completed.includes('r6-start'));
    for(const task of D.tasks){const saved=after.tasks[task.id];if(saved)assert.ok(saved.checks.every(i=>i<task.criteria.length)&&saved.checks.length===task.criteria.length);}
  }
});

test('six scenarios connect real media, complete decisions, lessons and saved tasks',()=>{
  assert.equal(A.cases.length,6);
  assert.equal(new Set(A.cases.map(c=>c.id)).size,6);
  for(const c of A.cases){
    assert.ok(['人像','街拍','叙事'].includes(c.category));
    for(const field of ['title','summary','intent']) assert.ok(c[field]?.trim(),c.id+'.'+field);
    assert.ok(M.assets[c.assetId],c.id+' media');
    assert.ok(c.settings.length>=3&&c.settings.every(s=>s.label&&s.value&&s.reason),c.id+' reasoned settings');
    for(const field of ['steps','editing','criteria'])assert.ok(c[field].length>=3,c.id+'.'+field);
    assert.ok(c.troubleshooting.length>=2&&c.troubleshooting.every(t=>t.symptom&&t.action));
    assert.ok(c.recall.question&&c.recall.answer);
    assert.ok(c.lessonIds.length>=2&&c.lessonIds.every(id=>D.lessons.some(l=>l.id===id)));
    assert.ok(D.tasks.some(t=>t.id===c.taskId),c.id+' task');
  }
});

test('specialty course entry links resolve to implemented routes and real content',()=>{
  const validRoute=href=>{
    const [page,id]=href.replace(/^#/,'').split('/');
    if(page==='lesson')return D.lessons.some(l=>l.id===id);
    if(page==='cases')return !id||A.cases.some(c=>c.id===id);
    if(page==='practice')return !id||D.tasks.some(t=>t.id===id);
    if(page==='diagnose')return !id||context.window.PhotoFieldGuide.items.some(t=>t.id===id);
    if(page==='histogram')return !id||context.window.PhotoHistogram.scenarios.some(t=>t.id===id);
    if(page==='lab')return ['exposure','compare','composition','focal','whitebalance'].includes(id);
    return ['camera','edit','review','observe','home','reference'].includes(page)&&!id;
  };
  for(const l of D.lessons.filter(l=>l.stage>=4)){
    assert.ok(l.sections.length>=5,l.id+' depth');
    assert.ok(l.observation,l.id+' observation');
    assert.ok(l.related?.length>=2,l.id+' next actions');
    for(const r of l.related)assert.ok(r.label&&validRoute(r.href),l.id+' '+r.href);
    assert.equal(D.cards.filter(c=>c.lessonId===l.id).length,2);
  }
});
