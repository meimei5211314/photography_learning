'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const plain = value => JSON.parse(JSON.stringify(value));
const run = (context,file) => vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const ids = ['prime-working-distance','zoom-range-map','two-lens-comparison','two-lens-outing'];
const taskIds = ['prime-distance-focus','zoom-aperture-map','matched-lens-pairs','two-lens-field-story'];
function baseline() {
  const context={window:{}};
  for(const file of ['data.js','advanced-data.js','field-data.js','knowledge-data.js','photography-extension.js','shooting-depth-data.js','finishing-depth-data.js','curriculum-support.js','camera-parameters-data.js'])run(context,file);
  return context;
}

test('owned lens practice appends four lessons, four tasks and eight cards without changing old learning records',()=>{
  const context=baseline(),data=context.window.PHOTO_DATA,before=plain(data);
  run(context,'lens-practice-data.js');
  const module=context.window.PHOTO_LENS_PRACTICE;
  assert.deepEqual(plain(module.lessonIds),ids);
  assert.deepEqual(plain(module.taskIds),taskIds);
  const totals={lessons:40,tasks:36,cards:80};
  for(const key of Object.keys(totals)){
    assert.equal(data[key].length,totals[key]);
    assert.deepEqual(plain(data[key].slice(0,before[key].length)),before[key]);
    assert.equal(new Set(data[key].map(item=>item.id)).size,data[key].length);
  }
  assert.equal(new Set(data.sources.map(item=>item.url)).size,data.sources.length);
});

test('each equipment lesson supplies a complete task, valid recall, prerequisite, media and source chain',()=>{
  const context=baseline();
  for(const file of ['lens-practice-data.js','media.js','media-v3.js'])run(context,file);
  const data=context.window.PHOTO_DATA,module=context.window.PHOTO_LENS_PRACTICE;
  const official=new Set(['cam.start.canon','www.canon.com.cn','www.canon-europe.com','gdlp01.c-wss.com']);
  for(const lesson of module.lessons){
    assert.equal(lesson.stage,10);
    assert.ok(lesson.sections.length>=6&&lesson.sections.every(section=>section.title&&section.body.length>80));
    assert.ok(lesson.steps.length>=5&&lesson.mistakes.length>=3);
    assert.ok(lesson.outcomes.length>=2&&lesson.prerequisites.every(id=>data.lessons.some(item=>item.id===id)));
    assert.ok(context.window.PHOTO_MEDIA.assets[lesson.mediaId]);
    assert.match(lesson.observation,/不是|不代表/);
    assert.ok(lesson.quiz.answer>=0&&lesson.quiz.answer<lesson.quiz.options.length&&lesson.quiz.explanation.length>30);
    assert.equal(module.cards.filter(card=>card.lessonId===lesson.id).length,2);
    const taskLinks=lesson.related.filter(link=>link.href.startsWith('#practice/'));
    assert.equal(taskLinks.length,1);
    const task=module.tasks.find(item=>taskLinks[0].href==='#practice/'+item.id);
    assert.ok(task&&task.steps.length>=5&&task.criteria.length>=4&&task.reflection);
    assert.ok(task.lessonIds.every(id=>data.lessons.some(item=>item.id===id)));
    for(const link of lesson.related){
      const [type,id]=link.href.slice(1).split('/');
      if(type==='lesson')assert.ok(data.lessons.some(item=>item.id===id),link.href);
      else if(type==='practice')assert.ok(data.tasks.some(item=>item.id===id),link.href);
      else assert.equal(link.href,'#kit');
    }
    for(const ref of lesson.sources){
      const url=new URL(ref.url);
      assert.equal(url.protocol,'https:');assert.ok(official.has(url.hostname));
      assert.ok(ref.title&&ref.note&&data.sources.some(item=>item.url===ref.url));
    }
  }
});

test('same-50mm comparison requires matched crop, actual focal length and output evidence before conclusions',()=>{
  const context=baseline();run(context,'lens-practice-data.js');
  const module=context.window.PHOTO_LENS_PRACTICE;
  const lesson=module.lessons.find(item=>item.id==='two-lens-comparison');
  const task=module.tasks.find(item=>item.id==='matched-lens-pairs');
  const text=lesson.sections.map(item=>item.body).join(' ');
  assert.match(text,/RF50.*全画幅/);assert.match(text,/RF-S.*1\.6/);
  assert.match(text,/RF50 主动设为 1\.6 倍裁切/);
  assert.match(text,/原片真实焦距/);assert.match(text,/读取变焦当前位置的最大光圈/);
  assert.match(text,/像素/);assert.match(text,/共同可用/);
  assert.match(text,/不能.*纯粹镜头锐度差异/);
  assert.match(text,/换回 RF50.*手动 1\.6 倍裁切/);
  assert.ok(task.criteria.some(line=>line.includes('匹配记录区域')&&line.includes('真实像素')));
  assert.ok(task.steps.some(line=>line.includes('真实焦距')));
  assert.ok(task.steps.some(line=>line.includes('恢复 RF50')&&line.includes('全画幅')));
  const zoom=module.lessons.find(item=>item.id==='zoom-range-map').sections.map(item=>item.body).join(' ');
  for(const [actual,equivalent] of [[18,28.8],[35,56],[50,80],[85,136],[150,240]])assert.equal(Number((actual*1.6).toFixed(1)),equivalent);
  assert.match(zoom,/约 29、56、80、136、240mm/);
  assert.match(zoom,/35、50、85mm 的值留给实测/);
  assert.match(zoom,/MF.*35mm.*0\.59/);
  assert.match(zoom,/不等于全焦段都能 AF/);
  const prime=module.lessons.find(item=>item.id==='prime-working-distance').sections.map(item=>item.body).join(' ');
  assert.match(prime,/FOCUS\/CONTROL.*不是 AF\/MF/);
});

test('a duplicate lesson, task or card cannot cause a partial append',()=>{
  for(const [key,id] of [['lessons',ids[0]],['tasks',taskIds[2]],['cards','outing-change-check']]){
    const context=baseline();context.window.PHOTO_DATA[key].push({id});
    const before=plain(context.window.PHOTO_DATA);
    assert.throws(()=>run(context,'lens-practice-data.js'),/两镜实拍内容标识重复/);
    assert.deepEqual(plain(context.window.PHOTO_DATA),before);
    assert.equal(context.window.PHOTO_LENS_PRACTICE,undefined);
  }
});
