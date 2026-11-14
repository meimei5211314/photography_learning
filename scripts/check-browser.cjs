'use strict';

// Optional development check; Playwright is not a website/runtime dependency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
let chromium;
try { ({ chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')); }
catch { console.error('请提供测试用 Playwright：设置 PLAYWRIGHT_MODULE 为其模块路径；站点运行本身无需此依赖。'); process.exit(1); }
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.validation', 'browser');
const key = 'field-notes-photography-v1';
let server, browser;
function availablePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => { const port = probe.address().port; probe.close(() => resolve(port)); });
  });
}
function waitForServer(url) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    function check() {
      const req = http.get(url, res => { res.resume(); resolve(); });
      req.on('error', error => Date.now() - started > 10000 ? reject(error) : setTimeout(check, 100));
      req.setTimeout(2000, () => req.destroy());
    }
    check();
  });
}
async function route(page, hash) {
  // The app's synchronous hashchange handler was registered at startup. Resolve
  // after that event instead of treating an old h1 as the new page being ready.
  await page.evaluate(hash => new Promise(resolve => {
    if (location.hash === '#' + hash) { resolve(); return; }
    window.addEventListener('hashchange', () => resolve(), { once: true });
    location.hash = hash;
  }), hash);
  await page.waitForFunction(hash => location.hash === '#' + hash && document.querySelector('main h1'), hash);
}
async function checkDiagnosis(page) {
  await route(page, 'diagnose/subject-motion');
  const checks = page.locator('[data-fg-check]');
  assert.equal(await checks.count(), 3);
  for (let index = 0; index < 3; index++) await checks.nth(index).check();
  assert.match(await page.locator('#fg-check-status').innerText(), /3 \/ 3/);
  await checks.nth(1).uncheck();
  assert.match(await page.locator('#fg-check-status').innerText(), /2 \/ 3/);
  await page.locator('[data-fg-reset]').click();
  assert.equal(await page.locator('[data-fg-check]:checked').count(), 0);
  assert.match(await page.locator('#fg-check-status').innerText(), /0 \/ 3/);
  await page.locator('.fg-detail a[href="#practice/sharpness-check"]').click();
  await page.locator('#task-sharpness-check details[open]').waitFor();
}
async function checkSpecialtyQuestion(page) {
  await route(page, 'observe');
  const question = await page.evaluate(() => PhotoPractice.questions.find(q => q.id === 'night-subject-motion'));
  await page.locator('[data-vp-jump]').filter({ hasText: question.label }).click();
  assert.equal(await page.locator('#vp-question-title').innerText(), question.question);
  await page.locator(`[data-vp-answer="${question.answer}"]`).click();
  await page.locator('[data-vp-action="check"]').click();
  assert.ok((await page.locator('.vp-feedback').innerText()).includes(question.evidence));
  assert.equal(await page.evaluate(({ key, id }) => JSON.parse(localStorage.getItem(key)).diagnostics[id], { key, id: question.id }), true);
  await page.locator(`.vp-feedback a[href="#practice/${question.taskId}"]`).click();
  await page.locator(`#task-${question.taskId} details[open]`).waitFor();
}
async function exportRecord(page) {
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#export-data').click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  assert.ok(stream, 'export supplies a downloadable backup');
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
async function checkStorageFailures(base, errors) {
  const isolated = await browser.newContext();
  const page = await isolated.newPage();
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(base + '/#lesson/camera');
    await page.locator('#complete-lesson').click();
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).completed.includes('camera'), key);
    const savedBefore = await page.evaluate(key => localStorage.getItem(key), key);
    await route(page, 'lesson/exposure');
    await page.evaluate(key => {
      window.testOriginalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (name, value) {
        if (name === key) throw new DOMException('Test storage full', 'QuotaExceededError');
        return window.testOriginalSetItem.call(this, name, value);
      };
    }, key);
    await page.locator('#complete-lesson').click();
    await page.locator('#progress-storage-status').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), savedBefore, 'failed save leaves durable record unchanged');
    assert.doesNotMatch(await page.locator('#toast').innerText(), /已记录阅读进度/, 'failure is not overwritten with a success toast');
    await route(page, 'settings');
    const draft = await exportRecord(page);
    assert.ok(draft.completed.includes('exposure'), 'unsaved learning remains exportable');
    const incoming = { version: 2, completed: ['shutter'], tasks: {}, reviews: {}, quiz: {}, diagnostics: {} };
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles({ name: 'test-progress.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming)) });
    await page.waitForFunction(() => document.getElementById('import-status').textContent.includes('未导入'));
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), savedBefore, 'failed import preserves durable record');
    assert.deepEqual(await exportRecord(page), draft, 'failed import also preserves the existing in-memory draft');
    await page.evaluate(() => { Storage.prototype.setItem = window.testOriginalSetItem; delete window.testOriginalSetItem; });
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles({ name: 'test-progress.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming)) });
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).completed.join(',') === 'shutter', key);
    assert.deepEqual(await exportRecord(page), incoming, 'successful retry imports only after persistence succeeds');
    assert.equal(await page.locator('#progress-storage-status').isVisible(), false);
  } finally { await isolated.close(); }
}
async function checkMultipleTabs(base, errors) {
  const isolated = await browser.newContext();
  const first = await isolated.newPage(), second = await isolated.newPage();
  for (const page of [first, second]) page.on('pageerror', error => errors.push(error.message));
  try {
    await first.goto(base + '/#practice/three-apertures');
    await second.goto(base + '/#practice/three-apertures');
    await first.locator('[data-note="three-apertures"]').fill('第一个页面：缩小光圈后背景文字更清楚。');
    await second.locator('#progress-storage-status').waitFor({ state: 'visible' });
    assert.match(await second.locator('#progress-storage-message').innerText(), /其他页面/);
    await second.locator('[data-note="three-apertures"]').fill('第二个页面：这个草稿必须保留。');
    const durable = await first.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    assert.equal(durable.tasks['three-apertures'].note, '第一个页面：缩小光圈后背景文字更清楚。', 'stale page cannot overwrite another page');
    await route(second, 'settings');
    const draft = await exportRecord(second);
    assert.equal(draft.tasks['three-apertures'].note, '第二个页面：这个草稿必须保留。', 'conflicting draft can be exported');
    second.once('dialog', dialog => dialog.accept());
    await second.locator('#reload-progress').click();
    await second.locator('#progress-storage-status').waitFor({ state: 'hidden' });
    await route(second, 'practice/three-apertures');
    assert.equal(await second.locator('[data-note="three-apertures"]').inputValue(), durable.tasks['three-apertures'].note);
    await second.locator('[data-note="three-apertures"]').fill('加载最新记录后继续写。');
    assert.equal(await second.evaluate(key => JSON.parse(localStorage.getItem(key)).tasks['three-apertures'].note, key), '加载最新记录后继续写。', 'explicit reload allows subsequent saves');
  } finally { await isolated.close(); }
}
async function checkPage(page, label) {
  const state = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    return {
      headings: document.querySelectorAll('main h1').length,
      duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  });
  assert.equal(state.headings, 1, label + ': one page heading');
  assert.deepEqual(state.duplicateIds, [], label + ': unique element IDs');
  assert.equal(state.overflow, false, label + ': no horizontal overflow');
}
async function prepareScreenshot(page) {
  const images = page.locator('main img');
  for (let index = 0; index < await images.count(); index++) {
    const image = images.nth(index);
    // Exercise real lazy loading by bringing each photo into the viewport.
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async element => {
      if (!element.complete) {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Photo loading timed out: ' + element.getAttribute('src'))), 10000);
          element.addEventListener('load', () => { clearTimeout(timer); resolve(); }, { once: true });
          element.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Photo failed: ' + element.getAttribute('src'))); }, { once: true });
        });
      }
      if (element.naturalWidth <= 0) throw new Error('Photo has no decoded pixels: ' + element.getAttribute('src'));
      await element.decode();
    });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => window.scrollY === 0);
}
async function main() {
  fs.mkdirSync(output, { recursive: true });
  const port = await availablePort();
  server = spawn(process.execPath, ['server.cjs'], { cwd: root, env: { ...process.env, PORT: String(port) }, windowsHide: true, stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}`;
  await waitForServer(base);
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  const page = await context.newPage();
  context.on('page', p => p.on('pageerror', error => errors.push(error.message)));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await checkPage(page, 'desktop home');
  const counts = await page.evaluate(() => ({ lessons: PHOTO_DATA.lessons.length, tasks: PHOTO_DATA.tasks.length, cards: PHOTO_DATA.cards.length, questions: PhotoPractice.questions.length }));
  assert.equal(counts.lessons, 22); assert.equal(counts.tasks, 18); assert.equal(counts.cards, 44); assert.ok(counts.questions >= 12);
  await page.locator('[data-stage="5"]').click();
  assert.equal(await page.locator('.course-card').count(), 4);
  await prepareScreenshot(page);
  await page.screenshot({ path: path.join(output, 'new-courses-desktop.png'), fullPage: true });
  const routes = await page.evaluate(() => [
    ...PHOTO_DATA.lessons.map(x => 'lesson/' + x.id),
    ...PHOTO_ADVANCED.cases.map(x => 'cases/' + x.id),
    ...PhotoFieldGuide.items.map(x => 'diagnose/' + x.id),
    'diagnose', 'camera', 'practice', 'review', 'observe', 'edit', 'reference', 'settings'
  ]);
  for (const hash of routes) { await route(page, hash); await checkPage(page, hash); }
  await checkDiagnosis(page);
  await checkSpecialtyQuestion(page);
  await page.locator('#search-button').click();
  await page.locator('#search-input').fill('逆光');
  const kinds = await page.locator('.search-result-type').allTextContents();
  assert.ok(kinds.includes('课程') && kinds.includes('实拍任务') && kinds.includes('场景案例'), 'search spans content types');
  await page.locator('#search-input').fill('直方图');
  assert.ok((await page.locator('.search-result-type').allTextContents()).includes('现场排障'));
  await page.locator('.search-result').first().click();
  assert.equal(await page.locator('#search-dialog').evaluate(el => el.open), false);
  await route(page, 'practice/metering-bracket');
  await page.locator('[data-note="metering-bracket"]').fill('已有实拍笔记');
  await page.locator('[data-note-template="metering-bracket"]').click();
  const note = await page.locator('[data-note="metering-bracket"]').inputValue();
  assert.ok(note.includes('已有实拍笔记') && note.includes('拍摄意图'), 'template preserves existing notes');
  await page.reload();
  assert.equal(await page.locator('[data-note="metering-bracket"]').inputValue(), note);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const hash of ['home', 'diagnose', 'lesson/metering-histogram', 'observe', 'practice/export-verify', 'settings']) {
    await route(page, hash); await checkPage(page, 'mobile ' + hash);
  }
  await checkDiagnosis(page);
  await route(page, 'diagnose');
  await prepareScreenshot(page);
  await page.screenshot({ path: path.join(output, 'diagnosis-mobile.png'), fullPage: true });
  const offline = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  offline.on('pageerror', error => errors.push(error.message));
  await offline.context().setOffline(true);
  await offline.goto(pathToFileURL(path.join(root, 'index.html')).href + '#lesson/export-backup');
  await checkPage(offline, 'file protocol');
  assert.match(await offline.locator('main h1').textContent(), /导出|交付|备份/);
  await checkStorageFailures(base, errors);
  await checkMultipleTabs(base, errors);
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  console.log(JSON.stringify({ result: 'passed', counts, routesChecked: routes.length, viewports: ['1440×1000', '390×844'], offline: true, storageFailures: true, multipleTabs: true, screenshots: output }, null, 2));
}
main().catch(async error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
});
