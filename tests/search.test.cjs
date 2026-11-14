'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildIndex, search } = require('../search.js');
const data = {
  lessons: [{ id: 'exposure', title: '曝光与测光', subtitle: '判断亮度', sections: [{ body: '逆光时检查重要高光。' }] }],
  tasks: [{ id: 'meter', title: '逆光测光练习', description: '保留高光细节', settings: 'M + AUTO ISO' }]
};
const index = buildIndex(data,
  [{ id: 'backlight', title: '逆光人像案例', summary: '观察脸部和背景' }],
  [{ id: 'clipping', title: '重要高光丢失', summary: '查看直方图并试拍', checks: ['比较逆光照片'] }]);

test('search discovers lessons, tasks, cases and field diagnoses through actual content', () => {
  const results = search(index, '逆光');
  assert.equal(results.length, 4);
  assert.deepEqual(new Set(results.map(item => item.type)), new Set(['课程', '实拍任务', '场景案例', '现场排障']));
  assert.ok(results[0].title.includes('逆光'), 'title matches should rank ahead of body-only matches');
  assert.equal(search(index, '直方图')[0].href, '#diagnose/clipping');
});
test('search combines terms, normalizes case and full-width input, and treats punctuation literally', () => {
  assert.equal(search(index, '逆光 高光').length, 3);
  assert.equal(search(index, 'ＡＵＴＯ iso')[0].href, '#practice/meter');
  assert.deepEqual(search(index, '[.*]'), []);
  assert.deepEqual(search(index, '<script>'), []);
});
test('empty queries show a mix of content types; limits and source data remain intact', () => {
  const original = JSON.stringify(index);
  assert.equal(new Set(search(index, '', 4).map(item => item.type)).size, 4);
  assert.equal(search(index, '逆光', 2).length, 2);
  assert.deepEqual(search(index, '', 0), []);
  assert.equal(JSON.stringify(index), original);
});
