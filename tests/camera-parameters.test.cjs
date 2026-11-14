'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const clone = value => JSON.parse(JSON.stringify(value));
const ids = ['camera','exposure','aperture','shutter','iso','focus','whitebalance','modes'];
const run = (context, file) => vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
function baseline() {
  const context = {window:{}};
  for(const file of ['data.js','advanced-data.js','field-data.js','knowledge-data.js','photography-extension.js','shooting-depth-data.js','finishing-depth-data.js','curriculum-support.js'])run(context,file);
  return context;
}

test('parameter detail preserves curriculum identities, original teaching, quizzes and all progress-bearing records', () => {
  const context=baseline(), data=context.window.PHOTO_DATA, before=clone(data);
  run(context,'camera-parameters-data.js');
  assert.deepEqual(clone(context.window.PHOTO_CAMERA_PARAMETERS.lessonIds),ids);
  assert.deepEqual(clone(data.lessons.map(x=>x.id)),before.lessons.map(x=>x.id));
  assert.equal(data.lessons.length,36);
  assert.deepEqual(clone(data.tasks),before.tasks);
  assert.deepEqual(clone(data.cards),before.cards);
  for(const old of before.lessons) {
    const current=data.lessons.find(x=>x.id===old.id);
    if(!ids.includes(old.id)){assert.deepEqual(clone(current),old);continue;}
    assert.deepEqual(clone(current.sections.slice(0,old.sections.length)),old.sections);
    assert.deepEqual(clone(current.steps.slice(0,old.steps.length)),old.steps);
    assert.deepEqual(clone(current.mistakes.slice(0,old.mistakes.length)),old.mistakes);
    for(const key of Object.keys(old).filter(key=>!['sections','steps','mistakes','minutes','sources'].includes(key)))assert.deepEqual(clone(current[key]),old[key],`${old.id}.${key}`);
    assert.ok(current.minutes>=old.minutes);
  }
});

test('every enhanced lesson has complete readable tables, practical extensions and official source coverage', () => {
  const context=baseline(), before=clone(context.window.PHOTO_DATA);
  run(context,'camera-parameters-data.js');
  const data=context.window.PHOTO_DATA;
  const officialHosts=new Set(['cam.start.canon','www.nikonusa.com','www.canon-europe.com']);
  for(const id of ids) {
    const current=data.lessons.find(x=>x.id===id), old=before.lessons.find(x=>x.id===id);
    const added=current.sections.slice(old.sections.length);
    assert.ok(added.length>=4&&added.length<=6,id);
    assert.ok(added.every(x=>x.title&&x.body.length>80),id);
    assert.ok(added.every(x=>!x.body.includes(String.fromCharCode(92))),`${id}: no visible string escape artifacts`);
    assert.ok(current.steps.length>=old.steps.length+2);
    const table=current.parameterTable;
    assert.ok(table.caption.length>20&&table.headers.length>=3&&table.rows.length>=6,id);
    assert.ok(table.headers.every(x=>typeof x==='string'&&x));
    for(const row of table.rows)assert.ok(row.length===table.headers.length&&row.every(x=>typeof x==='string'&&x.trim()),id);
    assert.ok(current.sources.length>=2,id);
    for(const item of current.sources) {
      assert.ok(item.title&&item.note);
      const url=new URL(item.url);
      assert.equal(url.protocol,'https:'); assert.ok(officialHosts.has(url.hostname),url.hostname);
      assert.ok(data.sources.some(source=>source.url===item.url));
    }
  }
  assert.equal(new Set(data.sources.map(x=>x.url)).size,data.sources.length);
});

test('published exposure examples distinguish equal displayed brightness from equal incident light', () => {
  const context=baseline(); run(context,'camera-parameters-data.js');
  const data=context.window.PHOTO_DATA;
  const lesson=data.lessons.find(x=>x.id==='exposure');
  const rows=lesson.parameterTable.rows.map(row=>{
    const values=row[1].match(/1\/(\d+) 秒 \/ f\/(\d+(?:\.\d+)?) \/ (\d+)/);
    assert.ok(values, row[1]);
    return {light:1/Number(values[1])/Number(values[2])**2,iso:Number(values[3])};
  });
  const near=(actual,expected)=>assert.ok(Math.abs(actual/expected-1)<0.03,`${actual} ≈ ${expected}`);
  const expectedLight=[1,1,0.5,1,0.25,1],expectedBrightness=[1,1,1,1,0.25,2];
  assert.equal(rows.length,expectedLight.length);
  rows.forEach((row,index)=>{
    near(row.light/rows[0].light,expectedLight[index]);
    near((row.light*row.iso)/(rows[0].light*rows[0].iso),expectedBrightness[index]);
  });
  const text=lesson.sections.map(x=>x.body).join(' ');
  assert.match(text,/1\/3 档/); assert.match(text,/无闪光/); assert.match(text,/重新启动测光/);
  assert.match(text,/实际进光却只有起点的一半/);
  const aperture=data.lessons.find(x=>x.id==='aperture').parameterTable.rows;
  const values=aperture.map(row=>Number(row[0].slice(2)));
  values.slice(1).forEach((f,index)=>assert.ok(Math.abs((f/values[index])**2/2-1)<0.07,'nominal f-number rounding'));
  const isoTable=data.lessons.find(x=>x.id==='iso').parameterTable;
  assert.match(isoTable.headers[2],/标称 ISO 数值比/);
  assert.match(isoTable.caption,/不是屏幕亮度/);
  const iso=isoTable.rows.map(row=>Number(row[0]));
  iso.slice(1).forEach((value,index)=>assert.equal(value,iso[index]*2));
});

test('reload or missing prerequisites fail before any partial mutation', () => {
  const context=baseline();run(context,'camera-parameters-data.js');
  const before=clone(context.window.PHOTO_DATA);
  assert.throws(()=>run(context,'camera-parameters-data.js'),/已加载/);
  assert.deepEqual(clone(context.window.PHOTO_DATA),before);
  const incomplete=baseline();incomplete.window.PHOTO_DATA.lessons=incomplete.window.PHOTO_DATA.lessons.filter(x=>x.id!=='modes');
  const missingBefore=clone(incomplete.window.PHOTO_DATA);
  assert.throws(()=>run(incomplete,'camera-parameters-data.js'),/先加载完整课程/);
  assert.deepEqual(clone(incomplete.window.PHOTO_DATA),missingBefore);
});
