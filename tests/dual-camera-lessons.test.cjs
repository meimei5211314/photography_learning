'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const plain = value => JSON.parse(JSON.stringify(value));
const run = (context,file) => vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const ids = ['dual-body-assignment','dual-body-controls','dual-body-field-workflow'];
const taskIds = ['dual-body-pairing-test','dual-body-switch-check','dual-body-story'];
function baseline() {
  const context = {window:{}};
  for (const file of ['data.js','advanced-data.js','field-data.js','knowledge-data.js','photography-extension.js','shooting-depth-data.js','finishing-depth-data.js','curriculum-support.js','camera-parameters-data.js','lens-practice-data.js']) run(context,file);
  return context;
}

test('optional dual-camera lessons append 3/3/6 while retaining every original learning record',()=>{
  const context = baseline(), data = context.window.PHOTO_DATA, before = plain(data);
  assert.deepEqual([data.lessons.length,data.tasks.length,data.cards.length],[40,36,80]);
  run(context,'dual-camera-lessons.js');
  const extension = context.window.PHOTO_DUAL_LESSONS;
  assert.deepEqual(plain(extension.lessonIds),ids);
  assert.deepEqual(plain(extension.taskIds),taskIds);
  for (const [key,total,added] of [['lessons',43,3],['tasks',39,3],['cards',86,6]]) {
    assert.equal(data[key].length,total);
    assert.equal(extension[key].length,added);
    assert.deepEqual(plain(data[key].slice(0,before[key].length)),before[key]);
    assert.equal(new Set(data[key].map(item=>item.id)).size,total);
  }
  assert.equal(new Set(data.sources.map(item=>item.url)).size,data.sources.length);
  assert.deepEqual(plain(data.sources.slice(0,before.sources.length)),before.sources);
});

test('each new lesson supplies a complete, sourced and connected optional learning loop',()=>{
  const context = baseline();
  for (const file of ['dual-camera-lessons.js','media.js','media-v3.js']) run(context,file);
  const data = context.window.PHOTO_DATA, extension = context.window.PHOTO_DUAL_LESSONS;
  const official = new Set(['cam.start.canon','gdlp01.c-wss.com']);
  for (const lesson of extension.lessons) {
    assert.equal(lesson.stage,11);
    assert.ok(lesson.sections.length>=6&&lesson.sections.every(section=>section.title&&section.body.length>80));
    assert.ok(lesson.steps.length>=5&&lesson.mistakes.length>=3);
    assert.ok(lesson.outcomes.length>=2&&lesson.prerequisites.length>=2);
    assert.ok(lesson.prerequisites.every(id=>data.lessons.some(item=>item.id===id)));
    assert.ok(context.window.PHOTO_MEDIA.assets[lesson.mediaId]);
    assert.match(lesson.observation,/不是/);
    assert.match(lesson.intro,/若增购|若实际拥有/);
    assert.ok(lesson.quiz.answer>=0&&lesson.quiz.answer<lesson.quiz.options.length&&lesson.quiz.explanation.length>30);
    assert.equal(extension.cards.filter(card=>card.lessonId===lesson.id).length,2);
    const taskLinks = lesson.related.filter(link=>link.href.startsWith('#practice/'));
    assert.equal(taskLinks.length,1);
    const task = extension.tasks.find(item=>taskLinks[0].href==='#practice/'+item.id);
    assert.ok(task&&task.steps.length>=5&&task.criteria.length>=4&&task.reflection);
    assert.match(task.description,/未有 R7|没有 R7|仅有单机/);
    assert.ok(task.criteria.some(line=>line.includes('两台真实机身')));
    assert.ok(task.lessonIds.every(id=>data.lessons.some(item=>item.id===id)));
    for (const link of lesson.related) {
      const [type,id] = link.href.slice(1).split('/');
      if (type==='lesson') assert.ok(data.lessons.some(item=>item.id===id),link.href);
      else if (type==='practice') assert.ok(data.tasks.some(item=>item.id===id),link.href);
      else assert.equal(link.href,'#kit/r6-r7');
    }
    for (const source of lesson.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol,'https:');
      assert.ok(official.has(url.hostname));
      assert.ok(source.title&&source.note&&data.sources.some(item=>item.url===source.url));
    }
  }
});

test('view and recorded-pixel comparison separates native APS-C, forced crop and single-body rehearsal',()=>{
  const context = baseline();run(context,'dual-camera-lessons.js');
  const lesson = context.window.PHOTO_DUAL_LESSONS.lessons[0];
  const table = plain(lesson.parameterTable), text = lesson.sections.map(section=>section.body).join(' ');
  assert.equal(table.headers.length,4);
  assert.ok(table.rows.every(row=>row.length===table.headers.length&&row.every(cell=>typeof cell==='string')));
  assert.deepEqual(table.rows.map(row=>[row[0],row[3]]),[
    ['R6 三代＋RF50','6960×4640'],['R6 三代＋RF-S18–150','4320×2880'],['R7＋RF50','6960×4640'],['R7＋RF-S18–150','6960×4640']
  ]);
  assert.match(table.caption,/3:2.*L.*RAW\/C-RAW/);
  assert.equal(6960*4640,32294400);assert.equal(4320*2880,12441600);
  assert.equal(50*1.6,80);assert.equal(150*1.6,240);assert.equal(Number((18*1.6).toFixed(1)),28.8);
  assert.match(text,/不能重复乘 1\.6/);
  assert.match(text,/实际焦距不因机身改变/);
  assert.match(text,/有效像素不是每一种输出文件/);
  assert.match(text,/不能据此保证画质排名/);
  assert.match(text,/不必逐像素重合/);
  assert.match(text,/不能代替 R7 实际的按钮、AF、噪声、记录像素或双机切换/);
  assert.match(text,/实拍验收保持未完成/);
  assert.match(text,/恢复 RF50 所需的全画幅/);
});

test('controls and file workflow retain body-specific settings and practical verification boundaries',()=>{
  const context = baseline();run(context,'dual-camera-lessons.js');
  const extension = context.window.PHOTO_DUAL_LESSONS;
  const controls = extension.lessons[1].sections.map(section=>section.body).join(' ');
  assert.match(controls,/R6 三代.*速控转盘 2 调 ISO.*R7.*ISO 按钮/);
  assert.match(controls,/机身前方有 AF\/MF 开关/);
  assert.match(controls,/启用时.*实体开关.*关闭.*AF→对焦模式/);
  assert.match(controls,/FOCUS\/CONTROL.*不是 AF\/MF/);
  assert.match(controls,/1\/3 档.*无闪光.*未 AE 锁.*重新测光/);
  assert.match(controls,/不能.*跨机载入配置文件/);
  assert.match(controls,/同叫 C1.*自动更新设置/);
  assert.match(controls,/R6→R7→R6/);
  const workflow = extension.lessons[2].sections.map(section=>section.body).join(' ');
  assert.match(workflow,/时区.*夏令时/);
  assert.match(workflow,/不是快门同步/);
  assert.match(workflow,/同一 K 值不保证/);
  assert.match(workflow,/不能|不要/);
  assert.match(workflow,/不.*出厂文件名必定相同/);
  assert.match(workflow,/原时间与偏移/);
  assert.match(workflow,/100%.*不同整体放大程度/);
  assert.match(workflow,/两台机身拍了不同照片.*没有互相保存/);
  assert.match(workflow,/从备份位置恢复一张.*打开/);
});

test('missing data or collisions fail before modifying lessons, tasks, cards or sources',()=>{
  assert.throws(()=>run({window:{}},'dual-camera-lessons.js'),/请先加载课程数据/);
  for (const [key,id] of [['lessons',ids[0]],['tasks',taskIds[2]],['cards','dual-file-backup']]) {
    const context = baseline();context.window.PHOTO_DATA[key].push({id});
    const before = plain(context.window.PHOTO_DATA);
    assert.throws(()=>run(context,'dual-camera-lessons.js'),/可选双机内容标识重复/);
    assert.deepEqual(plain(context.window.PHOTO_DATA),before);
    assert.equal(context.window.PHOTO_DUAL_LESSONS,undefined);
  }
  const context = baseline();run(context,'dual-camera-lessons.js');
  const before = plain(context.window.PHOTO_DATA), exported = context.window.PHOTO_DUAL_LESSONS;
  assert.throws(()=>run(context,'dual-camera-lessons.js'),/可选双机内容标识重复/);
  assert.deepEqual(plain(context.window.PHOTO_DATA),before);
  assert.equal(context.window.PHOTO_DUAL_LESSONS,exported);
});
