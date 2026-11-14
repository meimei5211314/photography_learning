/* Search the local curriculum. No requests, tracking, or persistent search history. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhotoSearch = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim();
  function words(value) {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(words).join(' ');
    if (value && typeof value === 'object') return Object.values(value).map(words).join(' ');
    return '';
  }
  function buildIndex(data, cases = [], diagnoses = []) {
    const groups = [
      ['课程', 'lesson', data.lessons || [], item => item.subtitle],
      ['实拍任务', 'practice', data.tasks || [], item => item.description],
      ['场景案例', 'cases', cases, item => item.summary],
      ['现场排障', 'diagnose', diagnoses, item => item.summary]
    ];
    return groups.flatMap(([type, route, items, describe]) => items.map(item => ({
      id: item.id, type, title: item.title, description: describe(item) || '',
      href: `#${route}/${item.id}`, titleKey: normalize(item.title), text: normalize(words(item))
    })));
  }
  function search(index, query, limit = 30) {
    if (!Number.isInteger(limit) || limit < 1) return [];
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) {
      const groups = [...new Set(index.map(item => item.type))].map(type => index.filter(item => item.type === type));
      const suggestions = [];
      for (let n = 0; groups.some(group => n < group.length) && suggestions.length < limit; n++) {
        for (const group of groups) if (group[n] && suggestions.length < limit) suggestions.push(group[n]);
      }
      return suggestions;
    }
    return index.filter(item => terms.every(term => item.text.includes(term)))
      .map((item, position) => ({ item, position, score: terms.reduce((sum, term) => sum + (item.titleKey.includes(term) ? 5 : 1), 0) }))
      .sort((a, b) => b.score - a.score || a.position - b.position)
      .slice(0, limit).map(result => result.item);
  }
  return Object.freeze({ buildIndex, search });
});
