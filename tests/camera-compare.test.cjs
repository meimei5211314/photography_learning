'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const ids = ['controls', 'quality', 'exposure-modes', 'auto-iso', 'metering-compensation', 'autofocus', 'white-balance', 'drive-shutter', 'stabilization', 'playback', 'custom-controls', 'custom-modes'];
const source = { title: '对应机型原文', url: 'https://example.com/manual', note: '查阅实际条件' };

function model(id, name) {
  return { id, title: name + '配置', group: '逐项核对', summary: name + '自己的操作条件', settings: ['模式', '选项', '结果'].map((value, index) => ({ name: value, value: name + '独立入口' + index, reason: name + '选项理由' + index })), steps: Array.from({length:6}, (_, index) => name + '步骤' + index), checks: [name + '结果1', name + '结果2', name + '结果3'], pitfalls: [{symptom:name + '故障1',fix:name + '处理1'},{symptom:name + '故障2',fix:name + '处理2'}], restore: [name + '恢复1', name + '恢复2'], lessonIds: ['camera'], taskId: name === 'R7' ? 'dual-body-switch-check' : 'r6-first', sources: [source] };
}
function fixture() {
  return { id:'r6iii-r7-settings', title:'两机配置对照', checkedAt:'2026-11-14', summary:'按机型理解设置',
    basics:{id:'basics',title:'基础参数与设置起点',group:'基础对照',summary:'先认识记录范围与工作状态',specs:[{name:'记录区域',r6:'全画幅或对应裁切',r7:'APS-C',meaning:'取景范围与输出分别核对'},{name:'操作入口',r6:'R6控制',r7:'R7控制',meaning:'按当前机型操作'}],setup:[{title:'准备状态',r6:'R6步骤',r7:'R7步骤',check:'各拍一张验证'},{title:'选择格式',r6:'R6格式入口',r7:'R7格式入口',check:'核对原片'}],pitfalls:[{symptom:'读数不同',fix:'先查模式'}],sources:[source]},
    topics:ids.map(id=>({id,title:'对照 '+id,group:'逐项核对',summary:'针对 '+id+' 的独立操作',differences:['R6与R7的入口各自核对','相同目的不等于相同设置'],r6:model(id,'R6'),r7:model(id,'R7')})), switchChecklist:['认机型','读当前值','试拍并检查'],sources:[source] };
}
function load(config = fixture()) {
  const window = { PHOTO_CAMERA_COMPARISON:config, PHOTO_DATA:{lessons:[{id:'camera',title:'认识相机'}],tasks:[{id:'r6-first',title:'R6初次拍摄'},{id:'dual-body-switch-check',title:'双机往返核对'}]} };
  Object.defineProperty(window,'localStorage',{get(){throw new Error('Comparison must not access saved progress');}});
  vm.runInNewContext(fs.readFileSync(path.join(root,'camera-compare.js'),'utf8'),{window},{filename:'camera-compare.js'});
  return window;
}
const section = (html, name) => html.split(`data-compare-section="${name}"`)[1]?.split('data-compare-section=')[0] || '';

test('default basics shows all thirteen native topic links, labeled specifications and setup checks', () => {
  const window = load(), host = {innerHTML:''};
  window.PhotoCameraCompare.mount(host);
  const html=host.innerHTML;
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.match(html,/data-compare-topic="basics"/);
  assert.match(html,/class="cc-directory" open/);
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
  for(const id of ['basics',...ids])assert.ok(html.includes(`href="#camera-compare/${id}"`),id);
  assert.equal((html.match(/data-compare-spec>/g)||[]).length,2);
  assert.equal((html.match(/data-compare-setup>/g)||[]).length,2);
  for(const name of ['EOS R6 Mark III','EOS R7','换机时怎样理解'])assert.ok(html.includes(`data-label="${name}"`));
  assert.match(html,/确认结果：/);
  assert.match(html,/class="cc-switch-checklist"/);
  assert.match(html,/href="#kit\/r6-r7"/);
  assert.match(html,/href="#camera-compare\/controls"/);
  assert.doesNotMatch(html,/<input|type="checkbox"|data-finish-task/);
});

test('every configuration compares each learning phase with explicit model labels and original practice routes', () => {
  const window=load(),host={innerHTML:''};
  const before=JSON.stringify({config:window.PHOTO_CAMERA_COMPARISON,data:window.PHOTO_DATA});
  for(const id of ids){
    window.PhotoCameraCompare.mount(host,id);
    const html=host.innerHTML;
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    assert.match(html,new RegExp('data-compare-topic="'+id+'"'));
    assert.ok(html.includes(`href="#camera-compare/${id}" aria-current="page"`));
    assert.ok(html.includes(`href="#camera/${id}"`));
    for(const key of ['settings','steps','checks','pitfalls','restore','practice','sources']){
      const part=section(html,key);
      for(const model of ['r6','r7'])assert.ok(part.includes(`data-camera-model="${model}"`),id+' '+key+' '+model);
      assert.ok(part.includes('EOS R6 Mark III')&&part.includes('EOS R7'),id+' '+key+' model labels');
    }
    assert.equal((section(html,'steps').match(/<li>/g)||[]).length,12);
    assert.equal((section(html,'settings').match(/<dt>/g)||[]).length,6);
    assert.ok(html.includes('href="#practice/r6-first"'));
    assert.ok(html.includes('href="#practice/dual-body-switch-check"'));
    assert.ok(html.includes('href="#lesson/camera"'));
    assert.match(html,/不会自动记为任务完成/);
    assert.match(html,/target="_blank" rel="noopener noreferrer"/);
    assert.doesNotMatch(html,/<input|type="checkbox"|data-finish-task/);
    window.PhotoCameraCompare.destroy();
  }
  assert.equal(JSON.stringify({config:window.PHOTO_CAMERA_COMPARISON,data:window.PHOTO_DATA}),before);
});

test('unknown routes and unavailable model data provide recovery without echoing untrusted route text', () => {
  const window=load(),host={innerHTML:''};
  window.PhotoCameraCompare.mount(host,'<img src=x onerror=alert(1)>');
  assert.match(host.innerHTML,/没有找到这个配置主题/);
  assert.match(host.innerHTML,/class="cc-directory" open/);
  assert.doesNotMatch(host.innerHTML,/onerror|aria-current=/);
  assert.ok(host.innerHTML.includes('href="#camera-compare/basics"'));
  const missing=load(null);
  missing.PhotoCameraCompare.mount(host);
  assert.match(host.innerHTML,/两机配置对照暂不可用/);
  assert.ok(host.innerHTML.includes('href="#camera"'));
  assert.doesNotThrow(()=>missing.PhotoCameraCompare.mount(null));
  const incomplete=fixture();delete incomplete.topics[0].r7;
  const partial=load(incomplete);
  partial.PhotoCameraCompare.mount(host,'controls');
  assert.match(host.innerHTML,/此主题的机型资料尚不完整/);
  assert.equal((host.innerHTML.match(/<h1>/g)||[]).length,1);
  assert.ok(host.innerHTML.includes('href="#camera-compare/basics"'));
});

test('comparison escapes data text and attributes and rejects unsafe official-source protocols', () => {
  const config=fixture();
  config.basics.title='<b>基础</b>';config.basics.specs[0].r7='<script>alert(1)</script>';
  config.basics.setup[0].title='<起点>';config.basics.setup[0].check='A & B';
  config.basics.sources=[{title:'安全 & 来源',url:'https://example.com/?a=1&b=2'},{title:'不安全来源',url:'javascript:alert(1)'}];
  config.topics[0].title='<b>操作</b>';config.topics[0].differences=['<差异>'];
  config.topics[0].r7.settings[0].value='<入口>';config.topics[0].r7.steps=['<步骤>'];
  config.topics[0].r7.restore='<恢复>';config.topics[0].r7.sources=config.basics.sources;
  const window=load(config),host={innerHTML:''};
  window.PHOTO_DATA.tasks[1].title='<实拍>';
  window.PhotoCameraCompare.mount(host);
  assert.match(host.innerHTML,/&lt;b&gt;基础&lt;\/b&gt;/);
  assert.match(host.innerHTML,/&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(host.innerHTML,/&lt;起点&gt;/);
  assert.match(host.innerHTML,/A &amp; B/);
  assert.match(host.innerHTML,/https:\/\/example.com\/\?a=1&amp;b=2/);
  assert.doesNotMatch(host.innerHTML,/<script>|javascript:|不安全来源/);
  window.PhotoCameraCompare.mount(host,'controls');
  for(const text of ['操作','入口','步骤','恢复','实拍','差异'])assert.ok(host.innerHTML.includes('&lt;'+(text==='操作'?'b&gt;操作&lt;/b':text)+'&gt;'),text);
  assert.doesNotMatch(host.innerHTML,/<script>|javascript:|不安全来源/);
});

test('adjacent routes follow comparison order and the final topic returns to dual-camera practice', () => {
  const window=load(),host={innerHTML:''};
  window.PhotoCameraCompare.mount(host,'controls');
  const first=host.innerHTML.split('class="cc-neighbors"')[1];
  assert.ok(first.includes('href="#camera-compare/basics"'));
  assert.ok(first.includes('href="#camera-compare/quality"'));
  window.PhotoCameraCompare.mount(host,'custom-modes');
  const last=host.innerHTML.split('class="cc-neighbors"')[1];
  assert.ok(last.includes('href="#camera-compare/custom-controls"'));
  assert.ok(last.includes('href="#kit/r6-r7"'));
});
