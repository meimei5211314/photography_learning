'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const base=['data.js','advanced-data.js','field-data.js','knowledge-data.js','photography-extension.js','shooting-depth-data.js','finishing-depth-data.js','curriculum-support.js','camera-parameters-data.js','camera-config-data.js','lens-practice-data.js','equipment-data.js','dual-camera-lessons.js','dual-camera-data.js'];
const run=(c,f)=>vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const plain=x=>JSON.parse(JSON.stringify(x));
function load(){const c={window:{}};for(const f of [...base,'r7-foundation-config.js','r7-advanced-config.js'])run(c,f);return c;}
function snapshot(c){const d=c.window.PHOTO_DATA;return plain({lessons:d.lessons,tasks:d.tasks,cards:d.cards,r6:c.window.PHOTO_CAMERA_CONFIG});}

test('comparison pairs twelve topics without changing original curriculum or R6 configuration',()=>{
  const c=load(),before=snapshot(c);run(c,'camera-comparison-data.js');
  const compare=c.window.PHOTO_CAMERA_COMPARISON,d=c.window.PHOTO_DATA;
  assert.deepEqual(snapshot(c),before);
  assert.deepEqual([d.lessons.length,d.tasks.length,d.cards.length],[43,39,86]);
  assert.equal(compare.basics.id,'basics');assert.equal(compare.topics.length,12);
  assert.deepEqual(plain(compare.topics.map(x=>x.id)),plain(c.window.PHOTO_CAMERA_CONFIG.topics.map(x=>x.id)));
  for(const t of compare.topics){
    assert.equal(t.r6,c.window.PHOTO_CAMERA_CONFIG.topics.find(x=>x.id===t.id));
    assert.equal(t.r7.id,t.id);assert.ok(t.differences.length>=2);
    for(const model of [t.r6,t.r7]){assert.ok(model.steps.length>=5);assert.ok(d.tasks.some(x=>x.id===model.taskId));for(const id of model.lessonIds)assert.ok(d.lessons.some(x=>x.id===id));}
  }
});

test('basic parameters explain mode boundaries and lead to a reversible ten-step setup',()=>{
  const c=load();run(c,'camera-comparison-data.js');const x=c.window.PHOTO_CAMERA_COMPARISON;
  assert.equal(x.basics.specs.length,14);assert.equal(x.basics.setup.length,10);
  for(const row of x.basics.specs)for(const key of ['name','r6','r7','meaning'])assert.ok(row[key].trim(),key);
  for(const row of x.basics.setup)for(const key of ['title','r6','r7','check'])assert.ok(row[key].trim(),key);
  const spec=name=>x.basics.specs.find(s=>s.name.includes(name));
  assert.match(spec('记录像素').r6,/3:2.*6960×4640.*1.6.*4320×2880/);
  assert.match(spec('记录像素').r7,/3:2.*6960×4640/);
  assert.match(spec('电池').r6,/不能使用LP-E6/);assert.match(spec('电池').r7,/LP-E6P.*LP-E6NH.*LP-E6N.*LP-E6/);
  assert.match(spec('H+').meaning,/电池.*快门.*镜头.*缓存/);
  assert.match(spec('快门时间').meaning,/0.004.*Tv\/M/);
  assert.match(spec('同一焦距').r7,/无需再乘一次/);
  assert.match(spec('照片与短片').meaning,/另行核验/);
  assert.ok(x.switchChecklist.length>=8);
  assert.match(JSON.stringify(x.basics.setup),/原配置|不清除/);
});

test('comparison merges official evidence once and keeps partial and repeated loads atomic',()=>{
  const c=load();run(c,'camera-comparison-data.js');const d=c.window.PHOTO_DATA;
  assert.equal(new Set(d.sources.map(s=>s.url)).size,d.sources.length);
  const x=c.window.PHOTO_CAMERA_COMPARISON;
  for(const s of x.sources){assert.equal(new URL(s.url).protocol,'https:');assert.equal(new URL(s.url).hostname,'cam.start.canon');assert.ok(s.title&&s.note);}
  assert.ok(x.sources.some(s=>s.url.includes('/C005/'))&&x.sources.some(s=>s.url.includes('/C022/')));
  const before=JSON.stringify(d);assert.throws(()=>run(c,'camera-comparison-data.js'),/已加载/);assert.equal(JSON.stringify(d),before);
  for(const mutate of [
    w=>{delete w.PHOTO_R7_FOUNDATION;},
    w=>w.PHOTO_R7_ADVANCED.topics.pop(),
    w=>{w.PHOTO_R7_ADVANCED.topics[1].id=w.PHOTO_R7_ADVANCED.topics[0].id;},
    w=>{w.PHOTO_R7_FOUNDATION.topics[0].taskId='missing-task';},
    w=>{w.PHOTO_R7_FOUNDATION.topics[0].differences=[];}
  ]){const trial=load();mutate(trial.window);const original=JSON.stringify(trial.window.PHOTO_DATA);assert.throws(()=>run(trial,'camera-comparison-data.js'));assert.equal(trial.window.PHOTO_CAMERA_COMPARISON,undefined);assert.equal(JSON.stringify(trial.window.PHOTO_DATA),original);}
});
