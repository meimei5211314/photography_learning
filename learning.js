(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhotoLearning = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const DAY = 24 * 60 * 60 * 1000;
  const INTERVALS = Object.freeze([1, 3, 7, 14, 30]);
  const MAX_TIME = 8640000000000000;
  const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

  function freshState() {
    return { version: 1, completed: [], tasks: {}, reviews: {}, quiz: {} };
  }

  function timestamp(value, name) {
    if (!Number.isSafeInteger(value) || value < 0 || value > MAX_TIME) {
      throw new TypeError(name + ' 必须是有效的毫秒时间戳');
    }
    return value;
  }

  function object(value, name) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new TypeError(name + ' 必须是对象');
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError(name + ' 包含不支持的对象类型');
    }
    if (Object.keys(value).some(key => FORBIDDEN_KEYS.has(key))) {
      throw new TypeError(name + ' 包含不安全的字段');
    }
    return value;
  }

  function fields(value, allowed, name) {
    object(value, name);
    if (Object.keys(value).some(key => !allowed.includes(key)) ||
        allowed.some(key => !Object.hasOwn(value, key))) {
      throw new TypeError(name + ' 的字段与本版本不匹配');
    }
  }

  function reviewRecord(value) {
    fields(value, ['due', 'step', 'lastReviewed'], '复习记录');
    timestamp(value.due, '复习时间');
    timestamp(value.lastReviewed, '上次复习时间');
    if (!Number.isInteger(value.step) || value.step < 0 || value.step > INTERVALS.length) {
      throw new TypeError('复习阶段应为 0–5 的整数');
    }
    if (value.due < value.lastReviewed) throw new TypeError('复习时间早于上次复习时间');
    return { due: value.due, step: value.step, lastReviewed: value.lastReviewed };
  }

  // Intervals are elapsed 24-hour days, rather than midnight/calendar boundaries.
  // A good answer advances one stage; again resets it, hard retains it.
  function scheduleReview(previous, rating, now = Date.now()) {
    timestamp(now, '当前时间');
    if (!['again', 'hard', 'good'].includes(rating)) throw new TypeError('未知的复习评分');
    const old = previous == null ? { step: 0 } : reviewRecord(previous);
    let step = old.step;
    let delay;
    if (rating === 'again') {
      step = 0;
      delay = 10 * 60 * 1000;
    } else if (rating === 'hard') {
      delay = DAY;
    } else {
      delay = INTERVALS[Math.min(step, INTERVALS.length - 1)] * DAY;
      step = Math.min(step + 1, INTERVALS.length);
    }
    timestamp(now + delay, '下次复习时间');
    return { due: now + delay, step, lastReviewed: now };
  }

  function isDue(review, now = Date.now()) {
    timestamp(now, '当前时间');
    if (review == null) return true;
    return reviewRecord(review).due <= now;
  }

  function ids(values, name) {
    if (!Array.isArray(values) || values.length > 1000 || values.some(value =>
      typeof value !== 'string' || !value.length || value.length > 100 || FORBIDDEN_KEYS.has(value))) {
      throw new TypeError(name + ' 标识列表无效');
    }
    return new Set(values);
  }

  function knownMap(value, allowed, name) {
    object(value, name);
    const keys = Object.keys(value);
    if (keys.length > allowed.size || keys.some(key => !allowed.has(key))) {
      throw new TypeError(name + ' 包含不属于本课程的标识');
    }
    return keys;
  }

  // Strict whitelist-based import: this never merges untrusted objects into state.
  function validateState(input, lessonIds, taskIds, cardIds) {
    fields(input, ['version', 'completed', 'tasks', 'reviews', 'quiz'], '学习备份');
    if (input.version !== 1) throw new TypeError('暂不支持这个备份版本');
    const lessons = ids(lessonIds, '课程');
    const tasks = ids(taskIds, '任务');
    const cards = ids(cardIds, '记忆卡');
    if (!Array.isArray(input.completed) || input.completed.length > lessons.size ||
        input.completed.some(id => typeof id !== 'string' || !lessons.has(id))) {
      throw new TypeError('已学课程记录无效');
    }
    const result = freshState();
    result.completed = [...new Set(input.completed)];
    for (const id of knownMap(input.tasks, tasks, '任务记录')) {
      const task = input.tasks[id];
      fields(task, ['checks', 'note', 'completed'], '任务记录');
      if (!Array.isArray(task.checks) || task.checks.length > 128 || task.checks.some(index =>
        !Number.isInteger(index) || index < 0 || index > 127)) {
        throw new TypeError('任务勾选项无效');
      }
      if (typeof task.note !== 'string' || task.note.length > 10000 || typeof task.completed !== 'boolean') {
        throw new TypeError('任务笔记或完成状态无效');
      }
      result.tasks[id] = { checks: [...new Set(task.checks)].sort((a, b) => a - b), note: task.note, completed: task.completed };
    }
    for (const id of knownMap(input.reviews, cards, '记忆卡记录')) {
      result.reviews[id] = reviewRecord(input.reviews[id]);
    }
    for (const id of knownMap(input.quiz, lessons, '测验记录')) {
      if (typeof input.quiz[id] !== 'boolean') throw new TypeError('测验结果必须是布尔值');
      result.quiz[id] = input.quiz[id];
    }
    return result;
  }

  return Object.freeze({ freshState, scheduleReview, isDue, validateState, DAY, INTERVALS });
});
