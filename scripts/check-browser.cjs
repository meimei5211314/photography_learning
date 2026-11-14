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
async function beforeUnloadBlocked(page) {
  // Browsers decide whether to display a native prompt; this checks our handler.
  return page.evaluate(() => {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  });
}
async function assertFocus(page, selector, message) {
  assert.equal(await page.locator(selector).evaluate(el => el === document.activeElement), true, message);
}
async function activateWithKeyboard(page, selector) {
  await page.locator(selector).focus();
  await page.keyboard.press('Enter');
}
async function waitForRequests(requests, label) {
  const deadline = Date.now() + 10000;
  while (!requests.length && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
  assert.ok(requests.length, label + ': photo request was intercepted');
}
async function checkKeyboard(base, errors) {
  const isolated = await browser.newContext();
  const page = await isolated.newPage();
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(base + '/#practice');
    await activateWithKeyboard(page, '.skip-link');
    await assertFocus(page, '#main', 'skip navigation focuses main');
    assert.equal(new URL(page.url()).hash, '#practice', 'skip navigation preserves the current route');
    await activateWithKeyboard(page, '[data-task-filter="todo"]');
    await assertFocus(page, '[data-task-filter="todo"]', 'task filter preserves keyboard focus');
    assert.equal(await page.locator('[data-task-filter="todo"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-task-filter][aria-pressed="true"]').count(), 1);
    await page.locator('#task-three-apertures summary').first().click();
    const checks = page.locator('[data-check][data-task="three-apertures"]');
    for (let index = 0; index < await checks.count(); index++) await checks.nth(index).check();
    await activateWithKeyboard(page, '[data-finish-task="three-apertures"]');
    assert.equal(await page.locator('#task-three-apertures').count(), 0, 'completed task leaves todo filter');
    await assertFocus(page, '[data-task-filter="todo"]', 'removed task returns focus to current filter');
    await activateWithKeyboard(page, '[data-task-filter="done"]');
    await page.locator('#task-three-apertures summary').first().click();
    await activateWithKeyboard(page, '[data-finish-task="three-apertures"]');
    await assertFocus(page, '[data-task-filter="done"]', 'restarted task returns focus to current filter');
    await route(page, 'camera');
    await activateWithKeyboard(page, '#camera-next');
    await assertFocus(page, '#camera-step-title', 'next camera step focuses its new heading');
    assert.equal(await page.locator('[data-camera-step="1"]').getAttribute('aria-pressed'), 'true');
    await route(page, 'cases');
    await activateWithKeyboard(page, '[data-case-filter="人像"]');
    await assertFocus(page, '[data-case-filter="人像"]', 'case filter preserves keyboard focus');
    await activateWithKeyboard(page, '#search-button');
    const dialogName = await page.locator('#search-dialog').evaluate(el => el.getAttribute('aria-label') ||
      (el.getAttribute('aria-labelledby') || '').split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ').trim());
    assert.ok(dialogName, 'search dialog has an accessible name');
    await page.locator('#search-input').fill('直方图');
    assert.equal(await page.locator('.search-count').getAttribute('role'), 'status', 'search count is announced');
    // Chromium's search field consumes Escape to clear a nonempty query first.
    await page.locator('#search-input').fill('');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('search-dialog').open);
    await assertFocus(page, '#search-button', 'closing search returns focus to its trigger');
    await page.evaluate(key => {
      localStorage.setItem(key, JSON.stringify({ version: 2, completed: ['camera'], tasks: {}, reviews: {}, quiz: {}, diagnostics: {} }));
    }, key);
    await page.goto(base + '/#review');
    await page.reload();
    const cardCount = await page.evaluate(() => PHOTO_DATA.cards.filter(card => card.lessonId === 'camera').length);
    for (let index = 0; index < cardCount; index++) {
      await activateWithKeyboard(page, '#reveal-card');
      await assertFocus(page, '[data-rate="again"]', 'revealed card focuses the first rating');
      await activateWithKeyboard(page, '[data-rate="again"]');
      if (index + 1 < cardCount) await assertFocus(page, '#reveal-card', 'rating focuses the next card');
    }
    assert.equal(await page.locator('#reveal-card').count(), 0, 'rated cards leave this review session');
    assert.notEqual(await page.evaluate(() => document.activeElement.tagName), 'BODY', 'empty review queue retains useful focus');
    const dueBefore = await page.evaluate(key => Object.values(JSON.parse(localStorage.getItem(key)).reviews).map(item => item.due), key);
    await activateWithKeyboard(page, '[data-review-mode="all"]');
    await assertFocus(page, '[data-review-mode="all"]', 'review mode preserves keyboard focus');
    assert.equal(await page.locator('[data-review-mode="all"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-review-mode][aria-pressed="true"]').count(), 1);
    await activateWithKeyboard(page, '#reveal-card');
    await activateWithKeyboard(page, '[data-rate="good"]');
    const dueAfter = await page.evaluate(key => Object.values(JSON.parse(localStorage.getItem(key)).reviews).map(item => item.due), key);
    assert.deepEqual(dueAfter, dueBefore, 'early free practice does not postpone due dates');
    await activateWithKeyboard(page, '[data-review-mode="due"]');
    await page.evaluate(() => { const now = Date.now(); Date.now = () => now + 11 * 60 * 1000; });
    await activateWithKeyboard(page, '#refresh-reviews');
    assert.equal(await page.locator('#reveal-card').count(), 1, 'refresh brings newly due cards back into the queue');
  } finally { await isolated.close(); }
}
async function checkDeferredImport(base, errors) {
  const isolated = await browser.newContext();
  const page = await isolated.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const prompts = [];
  page.on('dialog', dialog => { prompts.push(dialog.message()); return dialog.accept(); });
  const backup = completed => ({ version: 2, completed, tasks: {}, reviews: {}, quiz: {}, diagnostics: {} });
  const file = name => ({ name, mimeType: 'application/json', buffer: Buffer.from('{}') });
  try {
    await page.goto(base + '/#settings');
    await page.evaluate(() => {
      window.testPendingReads = [];
      File.prototype.text = function () { return new Promise(resolve => window.testPendingReads.push({ name: this.name, resolve })); };
    });
    await page.locator('#import-data').setInputFiles(file('left-page.json'));
    await route(page, 'home');
    await page.evaluate(record => window.testPendingReads[0].resolve(JSON.stringify(record)), backup(['camera']));
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 0)));
    assert.equal(prompts.length, 0, 'leaving settings cancels a pending import before confirmation');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null);
    await route(page, 'settings');
    await page.locator('#import-data').setInputFiles(file('older.json'));
    await page.locator('#import-data').setInputFiles(file('newer.json'));
    await page.evaluate(record => window.testPendingReads[2].resolve(JSON.stringify(record)), backup(['shutter']));
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key) || '{}').completed?.includes('shutter'), key);
    await page.evaluate(record => window.testPendingReads[1].resolve(JSON.stringify(record)), backup(['camera']));
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 0)));
    assert.equal(prompts.length, 1, 'superseded file read cannot ask to replace the newer import');
    assert.deepEqual(await exportRecord(page), backup(['shutter']), 'newest import remains authoritative');
    assert.equal(await beforeUnloadBlocked(page), false, 'successful import clears unsaved warning');
  } finally { await isolated.close(); }
}
async function checkLearningPaths(base, errors) {
  const isolated = await browser.newContext();
  const page = await isolated.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  const counters = async () => (await page.locator('.lp-progress dd').allTextContents()).map(text => text.replace(/\s/g, ''));
  try {
    await page.goto(base + '/#paths');
    assert.equal(await page.locator('.lp-card').count(), 6);
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null, 'opening a route does not write progress');
    await activateWithKeyboard(page, '.lp-card[href="#paths/first-session"]');
    await page.waitForFunction(() => location.hash === '#paths/first-session');
    const first = await page.evaluate(() => PhotoPaths.items.find(item => item.id === 'first-session'));
    assert.deepEqual(await counters(), ['0/' + first.lessonIds.length, '0/' + first.lessonIds.length, '0/' + first.taskIds.length]);
    await page.locator('.lp-lessons a[href="#lesson/camera?path=first-session"]').click();
    await page.locator('.path-return[href="#paths/first-session"]').waitFor();
    await page.reload();
    assert.equal(await page.locator('.path-return[href="#paths/first-session"]').count(), 1, 'refresh retains the path query');
    const correct = await page.evaluate(() => PHOTO_DATA.lessons.find(item => item.id === 'camera').quiz.answer);
    await page.locator(`[data-answer="${correct}"]`).click();
    await page.locator('#complete-lesson').click();
    await page.waitForFunction(() => location.hash === '#paths/first-session');
    assert.deepEqual(await counters(), ['1/' + first.lessonIds.length, '1/' + first.lessonIds.length, '0/' + first.taskIds.length], 'course completion returns to the selected goal and refreshes separate counters');
    const taskId = first.taskIds[0];
    await page.locator(`.lp-task[href="#practice/${taskId}?path=first-session"]`).click();
    await page.locator(`#task-${taskId} details[open]`).waitFor();
    const checks = page.locator(`[data-task="${taskId}"][data-check]`);
    for (let index = 0; index < await checks.count(); index++) await checks.nth(index).check();
    await page.locator(`[data-note="${taskId}"]`).fill('路径验证：保留原片、条件与下一次行动');
    await page.locator(`[data-finish-task="${taskId}"]`).click();
    await page.locator(`#task-${taskId} .task-path-return[href="#paths/first-session"]`).click();
    await page.waitForFunction(() => location.hash === '#paths/first-session');
    assert.deepEqual(await counters(), ['1/' + first.lessonIds.length, '1/' + first.lessonIds.length, '1/' + first.taskIds.length]);
    await route(page, 'settings');
    const partial = await exportRecord(page);
    assert.equal(partial.tasks[taskId].note, '路径验证：保留原片、条件与下一次行动');
    const full = await page.evaluate(() => ({ version: 2, completed: PHOTO_DATA.lessons.map(item => item.id), quiz: Object.fromEntries(PHOTO_DATA.lessons.map(item => [item.id, true])), tasks: Object.fromEntries(PHOTO_DATA.tasks.map(item => [item.id, { completed: true, checks: item.criteria.map((_, index) => index), note: '自报完成：保留证据' }])), reviews: {}, diagnostics: {} }));
    await page.locator('#import-data').setInputFiles({ name: 'path-complete.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(full)) });
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key) || '{}').completed?.length === PHOTO_DATA.lessons.length, key);
    for (const item of await page.evaluate(() => PhotoPaths.items)) {
      await route(page, 'paths/' + item.id);
      assert.deepEqual(await counters(), [item.lessonIds.length + '/' + item.lessonIds.length, item.lessonIds.length + '/' + item.lessonIds.length, item.taskIds.length + '/' + item.taskIds.length]);
      assert.match(await page.locator('.lp-note').innerText(), /不自动评价照片或认定掌握/);
    }
    await page.reload();
    assert.equal(await page.locator('.lp-detail').count(), 1, 'path deep link survives reload after import');
    await route(page, 'settings');
    await page.locator('#import-data').setInputFiles({ name: 'path-partial.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(partial)) });
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key) || '{}').completed?.length === 1, key);
    await route(page, 'paths/first-session');
    assert.deepEqual(await counters(), ['1/' + first.lessonIds.length, '1/' + first.lessonIds.length, '1/' + first.taskIds.length], 'restored backup changes the displayed route state');
    await route(page, 'paths/people-action');
    await page.locator('.lp-prerequisites a[href="#lesson/exposure?path=people-action"]').click();
    await page.locator('.path-return[href="#paths/people-action"]').waitFor();
    await page.locator('#complete-lesson').click();
    await page.waitForFunction(() => location.hash === '#paths/people-action');
    const people = await page.evaluate(() => PhotoPaths.items.find(item => item.id === 'people-action'));
    assert.deepEqual(await counters(), ['0/' + people.lessonIds.length, '0/' + people.lessonIds.length, '0/' + people.taskIds.length], 'prerequisite returns to the goal without counting as a core lesson');
    await route(page, 'paths/not-a-goal');
    assert.equal(await page.locator('.lp-card').count(), 6);
    assert.match(await page.locator('.lp-notice').textContent(), /没有找到/);
    await route(page, 'lesson/camera?path=not-a-goal');
    assert.equal(await page.locator('.path-return').count(), 0, 'unknown path does not capture ordinary navigation');
    await page.locator('#complete-lesson').click();
    await page.waitForFunction(() => location.hash === '#lesson/exposure');
    await route(page, 'lesson/camera?path=editing-delivery');
    assert.equal(await page.locator('.path-return').count(), 0, 'an unrelated valid path cannot capture a lesson');
  } finally { await isolated.close(); }
}
async function checkPhotoFailures(base, errors) {
  const isolated = await browser.newContext();
  const page = await isolated.newPage();
  page.on('pageerror', error => errors.push(error.message));
  let mode = 'abort';
  const held = [];
  await page.route('**/*', async request => {
    if (request.request().resourceType() !== 'image') return request.continue();
    if (mode === 'abort') return request.abort();
    if (mode === 'corrupt') return request.fulfill({ contentType: 'image/jpeg', body: 'not a decodable photo' });
    if (mode === 'hold') { held.push(request); return; }
    return request.continue();
  });
  const assertBlocked = async label => {
    assert.equal(await page.locator('[data-vp-answer]:not(:disabled)').count(), 0, label + ': choices stay disabled');
    assert.equal(await page.locator('[data-vp-action="check"]').isDisabled(), true, label + ': scoring stays disabled');
    await page.locator('[data-vp-action="check"]').evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    assert.equal(await page.locator('.vp-feedback').count(), 0, label + ': no answer is revealed without photo evidence');
    assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').diagnostics || {}, key), {});
  };
  try {
    await page.goto(base + '/#observe', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-vp-action="reload-photo"]').waitFor();
    await assertBlocked('aborted photo');
    mode = 'corrupt';
    await page.locator('[data-vp-action="reload-photo"]').click();
    await page.locator('[data-vp-action="reload-photo"]').waitFor();
    await assertBlocked('undecodable photo');
    mode = 'hold';
    await page.locator('[data-vp-action="reload-photo"]').click();
    await waitForRequests(held, 'slow photo');
    assert.match(await page.locator('.vp-image-status').innerText(), /载入|加载/);
    await assertBlocked('slow photo');
    mode = 'pass';
    await Promise.all(held.splice(0).map(request => request.continue()));
    await page.locator('[data-vp-answer]:not(:disabled)').first().waitFor();
    const firstQuestion = await page.evaluate(() => {
      window.testCurrentPhoto = document.querySelector('.vp-full-image img');
      return PhotoPractice.questions[0];
    });
    await page.locator(`[data-vp-answer="${firstQuestion.answer}"]`).click();
    assert.equal(await page.evaluate(() => window.testCurrentPhoto === document.querySelector('.vp-full-image img')), true, 'answer selection preserves the decoded photo');
    await page.locator('[data-vp-action="check"]').click();
    await page.locator('.vp-feedback').waitFor();
    assert.equal(await page.evaluate(({ key, id }) => JSON.parse(localStorage.getItem(key)).diagnostics[id], { key, id: firstQuestion.id }), true, 'restored photo permits grading');
    mode = 'hold';
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForRequests(held, 'old question');
    await page.evaluate(() => { window.testOldPhoto = document.querySelector('.vp-full-image img'); });
    mode = 'pass';
    await page.locator('[data-vp-jump]').filter({ hasText: '看懂时间的痕迹' }).click();
    await page.locator('[data-vp-answer]:not(:disabled)').first().waitFor();
    const newQuestion = await page.locator('#vp-question-title').innerText();
    await Promise.allSettled(held.splice(0).map(request => request.continue()));
    await page.evaluate(() => {
      window.testOldPhoto.dispatchEvent(new Event('error'));
      window.testOldPhoto.dispatchEvent(new Event('load'));
    });
    assert.equal(await page.locator('#vp-question-title').innerText(), newQuestion, 'late photo callbacks cannot change the new question');
    assert.equal(await page.locator('[data-vp-answer]:disabled').count(), 0, 'late failure cannot disable a ready new photo');
    await route(page, 'home');
    await page.evaluate(() => window.testOldPhoto.dispatchEvent(new Event('error')));
    await checkPage(page, 'leaving photo practice during callbacks');
  } finally {
    await Promise.allSettled(held.splice(0).map(request => request.abort()));
    await isolated.close();
  }
}
async function checkPhotoPairs(base, errors) {
  const isolated = await browser.newContext();
  const page = await isolated.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const late = [];
  await page.route('**/__browser-check__/**', request => {
    if (request.request().url().endsWith('broken.jpg')) return request.abort();
    late.push(request);
  });
  try {
    for (const module of [{ hash: 'lab', prefix: 'lab' }, { hash: 'edit', prefix: 'edit' }]) {
      const { hash, prefix } = module;
      await page.goto(base + '/#' + hash);
      const stage = '.' + prefix + '-photo-stage';
      await page.locator(stage + '.' + prefix + '-loaded').waitFor();
      assert.equal(await page.locator(stage + ' img').count(), 2, hash + ': comparison uses both images');
      const source = await page.locator(stage + ' img').first().getAttribute('src');
      const photo = fs.readFileSync(path.join(root, source));
      if (hash === 'lab') await page.locator('[data-prediction="a"]').click();
      else {
        await page.locator('#edit-exposure').evaluate(el => { el.value = '0.7'; el.dispatchEvent(new Event('input', { bubbles: true })); });
        await page.locator('[data-order="backup"]').click();
      }
      // Give the two DOM images separate requests, even when they share a source.
      await page.locator(stage).evaluate((el, hash) => {
        const images = el.querySelectorAll('img');
        images[0].src = '/__browser-check__/' + hash + '/broken.jpg';
        images[1].src = '/__browser-check__/' + hash + '/late.jpg';
      }, hash);
      await page.locator('[data-action="reload-photo"]').waitFor();
      assert.match(await page.locator('.' + prefix + '-image-status').innerText(), /未能|失败/);
      await waitForRequests(late, hash);
      await page.waitForFunction(selector => document.querySelector(selector).querySelectorAll('img')[1].complete === false, stage);
      assert.equal(late.length, 1, hash + ': other image is still loading');
      await late.shift().fulfill({ contentType: 'image/jpeg', body: photo });
      await page.waitForFunction(selector => document.querySelector(selector).querySelectorAll('img')[1].naturalWidth > 0, stage);
      assert.equal(await page.locator(stage).evaluate((el, prefix) => el.classList.contains(prefix + '-loaded'), prefix), false, hash + ': late success cannot hide the other image failure');
      assert.equal(await page.locator('.' + prefix + '-image-status').isVisible(), true);
      await page.locator('[data-action="reload-photo"]').click();
      await page.locator(stage + '.' + prefix + '-loaded').waitFor();
      assert.equal(await page.locator('[data-action="reload-photo"]').isVisible(), false);
      if (hash === 'lab') assert.equal(await page.locator('[data-prediction="a"]').getAttribute('aria-pressed'), 'true', 'photo retry preserves prediction');
      else {
        assert.equal(await page.locator('#edit-exposure').inputValue(), '0.7', 'photo retry preserves editing controls');
        assert.equal(await page.locator('.edit-order-slot.is-filled').count(), 1, 'photo retry preserves workflow exercise');
      }
    }
  } finally {
    await Promise.allSettled(late.splice(0).map(request => request.abort()));
    await isolated.close();
  }
}
async function checkHistograms(page) {
  await route(page, 'histogram');
  assert.equal(await page.locator('.hg-card').count(), 4);
  const scenarios = await page.evaluate(() => PhotoHistogram.scenarios.map(({ id, answer, options, taskId }) => ({ id, answer, options: options.length, taskId })));
  assert.equal(scenarios.length, 4);
  const savedBefore = await page.evaluate(key => localStorage.getItem(key), key);
  for (const scenario of scenarios) {
    await route(page, 'histogram/' + scenario.id);
    await checkPage(page, 'histogram ' + scenario.id);
    assert.equal(await page.locator('#hg-feedback').isVisible(), false, 'explanation starts hidden');
    assert.match(await page.locator('.hg-chart-note').innerText(), /原创合成示意/);
    assert.ok((await page.locator('#hg-chart-description').textContent()).length > 30, 'chart has a textual equivalent');
    assert.ok(await page.locator('.hg-reference a[href^="https://cam.start.canon/"]').count());
    await activateWithKeyboard(page, '#hg-check');
    await assertFocus(page, '[data-hg-choice="0"]', 'empty answer directs focus to a choice');
    assert.equal(await page.locator('#hg-feedback').isVisible(), false, 'submit without a choice does not reveal the answer');
    await page.locator(`[data-hg-choice="${(scenario.answer + 1) % scenario.options}"]`).check();
    await activateWithKeyboard(page, '#hg-check');
    assert.match(await page.locator('.hg-result').innerText(), /再核对/);
    await assertFocus(page, '#hg-feedback', 'submitted answer focuses the explanation');
    await activateWithKeyboard(page, '[data-hg-reset]');
    assert.equal(await page.locator('[data-hg-choice]:checked').count(), 0, 'retry clears the previous selection');
    await page.locator(`[data-hg-choice="${scenario.answer}"]`).focus();
    await page.keyboard.press('Space');
    await activateWithKeyboard(page, '#hg-check');
    assert.match(await page.locator('.hg-result').innerText(), /判断有依据/);
    await page.locator(`#hg-feedback a[href="#practice/${scenario.taskId}"]`).click();
    await page.locator(`#task-${scenario.taskId} details[open]`).waitFor();
  }
  assert.equal(await page.evaluate(key => localStorage.getItem(key), key), savedBefore, 'histogram judgments do not claim course completion or change progress');
  await route(page, 'histogram/not-a-scenario');
  assert.equal(await page.locator('.hg-card').count(), 4, 'unknown scenario offers the available choices');
  return scenarios.map(item => item.id);
}
async function checkStorageFailures(base, errors) {
  const isolated = await browser.newContext();
  const page = await isolated.newPage();
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(base + '/#lesson/camera');
    await page.locator('#complete-lesson').click();
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).completed.includes('camera'), key);
    assert.equal(await beforeUnloadBlocked(page), false, 'durable progress does not trigger a leave warning');
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
    assert.equal(await beforeUnloadBlocked(page), true, 'unsaved learning requests a leave warning');
    assert.match(await page.locator('.local-badge').innerText(), /未保存|尚未保存/, 'sidebar exposes unsaved progress');
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
    await page.locator('#retry-progress-save').click();
    await page.locator('#progress-storage-status').waitFor({ state: 'hidden' });
    assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key), draft, 'direct retry saves the intact in-memory draft');
    assert.equal(await beforeUnloadBlocked(page), false, 'successful save retry clears the leave warning');
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles({ name: 'test-progress.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming)) });
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).completed.join(',') === 'shutter', key);
    assert.deepEqual(await exportRecord(page), incoming, 'successful retry imports only after persistence succeeds');
    assert.equal(await page.locator('#progress-storage-status').isVisible(), false);
    assert.equal(await beforeUnloadBlocked(page), false);
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
    assert.equal(await beforeUnloadBlocked(second), true, 'conflicting draft requests a leave warning');
    await second.evaluate(key => {
      window.testOriginalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = function (name) {
        if (name === key) throw new DOMException('Test storage denied', 'SecurityError');
        return window.testOriginalGetItem.call(this, name);
      };
    }, key);
    second.once('dialog', dialog => dialog.accept());
    await second.locator('#reload-progress').click();
    assert.match(await second.locator('#progress-storage-message').innerText(), /其他页面/, 'failed reload retains the conflict lock');
    await second.evaluate(() => { Storage.prototype.getItem = window.testOriginalGetItem; delete window.testOriginalGetItem; });
    // Restoring the page's original null snapshot must not silently unlock it.
    await first.evaluate(key => localStorage.removeItem(key), key);
    await route(second, 'practice/three-apertures');
    await second.locator('[data-note="three-apertures"]').fill('冲突后原值恢复，也必须先显式加载。');
    assert.equal(await first.evaluate(key => localStorage.getItem(key), key), null, 'conflict is sticky even after the old raw value returns');
    await first.evaluate(({ key, durable }) => localStorage.setItem(key, JSON.stringify(durable)), { key, durable });
    second.once('dialog', dialog => dialog.accept());
    await second.locator('#reload-progress').click();
    await second.locator('#progress-storage-status').waitFor({ state: 'hidden' });
    assert.equal(await beforeUnloadBlocked(second), false, 'explicit reload clears the discarded draft warning');
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
  assert.equal(counts.lessons, 36); assert.equal(counts.tasks, 32); assert.equal(counts.cards, 72); assert.ok(counts.questions >= 12);
  await page.locator('[data-stage="5"]').click();
  assert.equal(await page.locator('.course-card').count(), 4);
  await prepareScreenshot(page);
  await page.screenshot({ path: path.join(output, 'new-courses-desktop.png'), fullPage: true });
  for (const stage of ['6', '7', '8', '9']) {
    await page.locator(`[data-stage="${stage}"]`).click();
    assert.equal(await page.locator('.course-card').count(), Number(stage) >= 8 ? 3 : 4, 'stage ' + stage + ' exposes its courses');
    assert.equal(await page.locator(`[data-stage="${stage}"]`).getAttribute('aria-pressed'), 'true');
  }
  await route(page, 'lesson/local-editing');
  await prepareScreenshot(page);
  await page.screenshot({ path: path.join(output, 'systematic-lesson-desktop.png'), fullPage: true });
  const routes = await page.evaluate(() => [
    ...PHOTO_DATA.lessons.map(x => 'lesson/' + x.id),
    ...PHOTO_ADVANCED.cases.map(x => 'cases/' + x.id),
    ...PhotoFieldGuide.items.map(x => 'diagnose/' + x.id),
    ...PhotoHistogram.scenarios.map(x => 'histogram/' + x.id),
    ...PhotoPaths.items.map(x => 'paths/' + x.id),
    'diagnose', 'camera', 'cases', 'lab', 'histogram', 'paths', 'practice', 'review', 'observe', 'edit', 'reference', 'settings'
  ]);
  for (const hash of routes) { await route(page, hash); await checkPage(page, hash); }
  await route(page, 'paths/first-session');
  await page.screenshot({ path: path.join(output, 'learning-path-desktop.png'), fullPage: true });
  await checkDiagnosis(page);
  await checkSpecialtyQuestion(page);
  const histogramIds = await checkHistograms(page);
  await page.locator('#search-button').click();
  await page.locator('#search-input').fill('逆光');
  const kinds = await page.locator('.search-result-type').allTextContents();
  assert.ok(kinds.includes('课程') && kinds.includes('实拍任务') && kinds.includes('场景案例'), 'search spans content types');
  await page.locator('#search-input').fill('直方图');
  assert.ok((await page.locator('.search-result-type').allTextContents()).includes('现场排障'));
  assert.ok(await page.locator('.search-result[href^="#histogram/"]').count(), 'search links directly to histogram scenarios');
  await page.locator('.search-result').first().click();
  assert.equal(await page.locator('#search-dialog').evaluate(el => el.open), false);
  for (const [term, id] of [['RAW', 'raw'], ['1:1', 'magnification']]) {
    await page.locator('#search-button').click();
    await page.locator('#search-input').fill(term);
    await page.locator(`.search-result[href="#reference/${id}"]`).click();
    await page.waitForFunction(id => document.activeElement?.id === 'term-' + id, id);
    assert.equal(await page.locator(`#term-${id} a[href^="#lesson/"]`).count(), 1, 'glossary search connects definition to its lesson');
  }
  await page.locator('#search-button').click();
  await page.locator('#search-input').fill('旅行');
  assert.ok(await page.locator('.search-result[href="#paths/landscape-night"]').count(), 'goal paths are searchable');
  await page.locator('.search-result[href="#paths/landscape-night"]').click();
  await page.locator('.lp-detail').waitFor();
  await route(page, 'practice/metering-bracket');
  await page.locator('[data-note="metering-bracket"]').fill('已有实拍笔记');
  await page.locator('[data-note-template="metering-bracket"]').click();
  const note = await page.locator('[data-note="metering-bracket"]').inputValue();
  assert.ok(note.includes('已有实拍笔记') && note.includes('拍摄意图'), 'template preserves existing notes');
  await page.reload();
  assert.equal(await page.locator('[data-note="metering-bracket"]').inputValue(), note);
  await page.setViewportSize({ width: 390, height: 844 });
  const newLessonIds = ['sensor-raw', 'af-tracking', 'shutter-stabilization', 'lens-system', 'flash-basics', 'closeup', 'night-scene', 'photo-series', 'camera-readiness', 'filters-exposure', 'action-panning', 'still-life-lighting', 'local-editing', 'color-output'];
  for (const hash of ['home', 'diagnose', 'lesson/metering-histogram', 'observe', 'practice/export-verify', 'settings', 'reference', ...newLessonIds.map(id => 'lesson/' + id), 'histogram', ...histogramIds.map(id => 'histogram/' + id), 'paths', ...(await page.evaluate(() => PhotoPaths.items.map(item => 'paths/' + item.id)))]) {
    await route(page, hash); await checkPage(page, 'mobile ' + hash);
  }
  await checkDiagnosis(page);
  await route(page, 'diagnose');
  await prepareScreenshot(page);
  await page.screenshot({ path: path.join(output, 'diagnosis-mobile.png'), fullPage: true });
  await route(page, 'histogram/highlight-clipping');
  await page.screenshot({ path: path.join(output, 'histogram-mobile.png'), fullPage: true });
  await route(page, 'paths/editing-delivery');
  await page.screenshot({ path: path.join(output, 'learning-path-mobile.png'), fullPage: true });
  const offline = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  offline.on('pageerror', error => errors.push(error.message));
  await offline.context().setOffline(true);
  await offline.goto(pathToFileURL(path.join(root, 'index.html')).href + '#lesson/export-backup');
  await checkPage(offline, 'file protocol');
  assert.match(await offline.locator('main h1').textContent(), /导出|交付|备份/);
  await checkHistograms(offline);
  for (const hash of ['paths', ...(await offline.evaluate(() => PhotoPaths.items.map(item => 'paths/' + item.id)))]) { await route(offline, hash); await checkPage(offline, 'file ' + hash); }
  await checkLearningPaths(base, errors);
  await checkKeyboard(base, errors);
  await checkPhotoFailures(base, errors);
  await checkPhotoPairs(base, errors);
  await checkStorageFailures(base, errors);
  await checkMultipleTabs(base, errors);
  await checkDeferredImport(base, errors);
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  console.log(JSON.stringify({ result: 'passed', counts, routesChecked: routes.length, viewports: ['1440×1000', '390×844'], offline: true, histogramScenarios: histogramIds.length, keyboard: true, learningPaths: 6, pathContextAndRestore: true, photoFailures: ['aborted', 'undecodable', 'delayed', 'retry', 'stale callbacks', 'both comparison images'], storageFailures: true, multipleTabs: true, deferredImport: true, screenshots: output }, null, 2));
}
main().catch(async error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
});
