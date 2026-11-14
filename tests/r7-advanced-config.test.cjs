'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const plain = value => JSON.parse(JSON.stringify(value));
const run = (context,file) => vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context,{timeout:1000});
const topicIds = ['autofocus','drive-shutter','stabilization','playback','custom-controls','custom-modes'];
function baseline() {
  const context = {window:{}};
  for (const file of ['data.js','advanced-data.js','field-data.js','knowledge-data.js','photography-extension.js','shooting-depth-data.js','finishing-depth-data.js','curriculum-support.js','camera-parameters-data.js','lens-practice-data.js','dual-camera-lessons.js','camera-config-data.js']) run(context,file);
  return context;
}

test('R7 advanced config exports six topics without modifying old 43/39/86 records, R6 config or sources',()=>{
  const context = baseline(), data = context.window.PHOTO_DATA;
  const before = plain(data), original = plain(context.window.PHOTO_CAMERA_CONFIG);
  assert.deepEqual([data.lessons.length,data.tasks.length,data.cards.length],[43,39,86]);
  run(context,'r7-advanced-config.js');
  const config = context.window.PHOTO_R7_ADVANCED;
  assert.equal(config.model,'Canon EOS R7');
  assert.equal(config.checkedAt,'2026-11-14');
  assert.deepEqual(plain(config.topics.map(topic=>topic.id)),topicIds);
  assert.deepEqual(plain(data),before);
  assert.deepEqual(plain(context.window.PHOTO_CAMERA_CONFIG),original);
});

test('R7 advanced topics provide differences, operations, checks, recovery and valid existing destinations',()=>{
  const context = baseline();run(context,'r7-advanced-config.js');
  const config = context.window.PHOTO_R7_ADVANCED, data = context.window.PHOTO_DATA;
  for (const topic of config.topics) {
    assert.ok(topic.title&&topic.group&&topic.summary.length>=30,topic.id);
    assert.ok(topic.differences.length>=2&&topic.differences.every(line=>typeof line==='string'&&line.length>=20),topic.id+' differences');
    assert.ok(topic.settings.length>=3&&topic.settings.every(item=>item.name&&item.value&&item.reason),topic.id+' settings');
    assert.ok(topic.steps.length>=6&&topic.steps.every(line=>line.length>=20),topic.id+' steps');
    assert.ok(topic.checks.length>=3&&topic.checks.every(line=>line.length>=10),topic.id+' checks');
    assert.ok(topic.pitfalls.length>=2&&topic.pitfalls.every(item=>item.symptom&&item.fix.length>=20),topic.id+' pitfalls');
    assert.ok(topic.restore.length>=2&&topic.restore.every(line=>line.length>=20),topic.id+' restore');
    assert.ok(topic.lessonIds.length>=2&&topic.lessonIds.every(id=>data.lessons.some(lesson=>lesson.id===id)),topic.id+' lessons');
    assert.ok(data.tasks.some(task=>task.id===topic.taskId),topic.id+' task');
    assert.notEqual(topic.taskId,'r6-first');
    assert.ok(context.window.PHOTO_CAMERA_CONFIG.topics.some(item=>item.id===topic.id),topic.id+' counterpart');
  }
});

test('R7 sources are unique official C005 material, including documented English playback fallback',()=>{
  const context = {window:{}};run(context,'r7-advanced-config.js');
  const config = context.window.PHOTO_R7_ADVANCED;
  assert.equal(new Set(config.sources.map(source=>source.url)).size,config.sources.length);
  for (const source of config.sources) {
    const url = new URL(source.url);
    assert.equal(url.protocol,'https:');assert.equal(url.hostname,'cam.start.canon');
    assert.match(url.pathname,/^\/(zh|en)\/C005\/manual\/html\//);
    assert.ok(source.title&&source.note.length>=15);
  }
  for (const topic of config.topics) {
    assert.ok(topic.sources.length>=1);
    assert.ok(topic.sources.every(source=>config.sources.some(item=>item.url===source.url)));
  }
  const fallback = config.sources.find(source=>source.url.includes('/en/'));
  assert.ok(fallback&&fallback.url.endsWith('UG-06_Playback_0300.html'));
  assert.match(fallback.note,/中文.*未能获取.*同编号官方英文/);
  assert.match(config.sources.find(source=>source.url.endsWith('index.html')).note,/1\.8\.0.*不.*最新/);
});

test('R7 operation differences are taught explicitly instead of copying R6 paths or dial names',()=>{
  const context = {window:{}};run(context,'r7-advanced-config.js');
  const topics = new Map(context.window.PHOTO_R7_ADVANCED.topics.map(topic=>[topic.id,topic]));
  const body = id => JSON.stringify(topics.get(id));
  const af = body('autofocus');
  assert.match(af,/前方 AF\/MF.*启用.*关闭/);
  assert.match(af,/被摄体追踪 → 开.*眼睛检测 → 启用/);
  assert.match(af,/点击屏幕执行单次对焦/);
  assert.match(af,/主拨盘改宽.*速控转盘改高/);
  const playback = body('playback');
  assert.match(playback,/主拨盘调倍率.*速控转盘切图/);
  assert.match(playback,/MF照片从中央/);
  assert.match(playback,/勾选屏幕并确定/);
  const controls = body('custom-controls');
  assert.match(controls,/自定义功能 → 自定义按钮/);
  assert.match(controls,/设置 → 多功能锁/);
  assert.match(controls,/LOCK按钮锁\/解锁/);
  assert.match(controls,/清除全部自定义功能\(C\.Fn\).*保留自定义按钮和转盘/);
  assert.match(controls,/默认半按与AF-ON均启动测光和AF/);
  const custom = body('custom-modes');
  assert.match(custom,/R7设置目录未列出对应入口/);
  assert.match(custom,/基本设置.*其他设置/);
  assert.match(custom,/静止图像与短片.*分别注册/);
  assert.match(custom,/未借到R7.*不宣称已完成/);
});

test('R7 shooting limits and restoration distinguish shutters, lens communication and subject motion',()=>{
  const context = {window:{}};run(context,'r7-advanced-config.js');
  const topics = new Map(context.window.PHOTO_R7_ADVANCED.topics.map(topic=>[topic.id,topic]));
  const drive = JSON.stringify(topics.get('drive-shutter'));
  assert.match(drive,/15\/15\/30/);assert.match(drive,/6\.5\/8\/15/);
  assert.match(drive,/1\/1000秒.*防闪烁/);
  assert.match(drive,/30张\/秒.*1\/30秒/);
  assert.match(drive,/1\/16000秒.*Tv\/M.*HDR模式.*对焦包围/);
  assert.match(drive,/机械1\/250秒.*电子前帘1\/320秒.*电子不支持闪光/);
  assert.match(drive,/先关闭静音.*还原快门模式和驱动/);
  const is = JSON.stringify(topics.get('stabilization'));
  assert.match(is,/RF50无镜头IS.*RF-S18–150有IS但无实体IS开关/);
  assert.match(is,/不通信镜头/);assert.match(is,/不要.*等效焦距/);
  assert.match(is,/清楚张数\/总张数/);
  assert.match(is,/背景清楚.*主体拖影/);
  assert.ok(topics.get('stabilization').restore.some(line=>line.includes('快门')&&line.includes('ISO')));
});

test('standalone CommonJS and browser exports work without PHOTO_DATA and repeat load cannot overwrite them',()=>{
  for (const context of [{window:{}},{module:{exports:{}}}]) {
    run(context,'r7-advanced-config.js');
    const holder = context.window||context;
    const config = holder.PHOTO_R7_ADVANCED, before = plain(config);
    assert.ok(config&&config.topics.length===6);
    assert.equal(holder.PHOTO_DATA,undefined);
    if (context.module) assert.equal(context.module.exports,config);
    assert.throws(()=>run(context,'r7-advanced-config.js'),/R7 进阶配置已加载/);
    assert.equal(holder.PHOTO_R7_ADVANCED,config);
    assert.deepEqual(plain(config),before);
  }
});
