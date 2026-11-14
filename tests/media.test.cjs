'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const context={window:{}};
for(const file of ['data.js','advanced-data.js','field-data.js','media.js','media-v3.js']) vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const M=context.window.PHOTO_MEDIA;
const D=context.window.PHOTO_DATA;

test('all redistributed photos have a local valid image and complete attribution',()=>{
  assert.ok(Object.keys(M.assets).length>=6);
  for(const [id,a] of Object.entries(M.assets)){
    assert.match(a.src,/^assets\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i,id);
    const bytes=fs.readFileSync(path.join(root,a.src));
    assert.ok(bytes.length>1000,id+' image is not empty');
    const isJpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
    const isPng=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const isWebp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
    assert.ok(isJpeg||isPng||isWebp,id+' has actual image bytes, not an error response');
    for(const field of ['alt','title','author','license','note'])assert.ok(typeof a[field]==='string'&&a[field].trim(),id+'.'+field);
    assert.equal(new URL(a.source).protocol,'https:');
    assert.equal(new URL(a.licenseUrl).protocol,'https:');
  }
});

test('hero and every lesson resolve to available photography assets',()=>{
  assert.ok(M.assets[M.hero]);
  for(const l of D.lessons)assert.ok(M.assets[M.lessonImages[l.id]],l.id);
});

test('page loads media and practice modules before the application and all script files exist',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
  for(const name of ['data.js','advanced-data.js','field-data.js','media.js','media-v3.js','learning.js','progress-store.js','labs.js','visual-practice.js','guides.js','editing-lab.js','field-guide.js','search.js']){
    assert.ok(scripts.indexOf(name)>=0&&scripts.indexOf(name)<scripts.indexOf('app.js'),name);
  }
  for(const file of scripts)assert.ok(fs.existsSync(path.join(root,file)),file);
});

test('extension modules load after their base data',()=>{ const html=fs.readFileSync(path.join(root,'index.html'),'utf8'); for(const [base,extension] of [['data.js','advanced-data.js'],['media.js','media-v3.js']]) assert.ok(html.indexOf('src=\"'+base+'\"') < html.indexOf('src=\"'+extension+'\"')); });
