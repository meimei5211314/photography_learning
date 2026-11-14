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
  function buildIndex(data, cases = [], diagnoses = [], exercises = [], paths = [], cameraTopics = [], equipment = null, dualCamera = null, comparison = null) {
    const groups = [
      ['课程', 'lesson', data.lessons || [], item => item.subtitle],
      ['实拍任务', 'practice', data.tasks || [], item => item.description],
      ['场景案例', 'cases', cases, item => item.summary],
      ['现场排障', 'diagnose', diagnoses, item => item.summary],
      ['读图练习', 'histogram', exercises, item => item.summary],
      ['摄影术语', 'reference', data.glossary || [], item => item.summary],
      ['学习路径', 'paths', paths, item => item.summary],
      ['相机配置', 'camera', cameraTopics, item => item.summary]
    ];
    const index = groups.flatMap(([type, route, items, describe]) => items.map(item => ({
      id: item.id, type, title: item.title, description: describe(item) || '',
      href: `#${route}/${item.id}`, titleKey: normalize(item.title), text: normalize(words(item))
    })));
    if (equipment) index.push({id:equipment.id, type:'手头器材', title:equipment.title,
      description:equipment.camera.name+' · '+equipment.lenses.map(lens=>lens.name).join(' / '),
      href:'#kit', titleKey:normalize(equipment.title), text:normalize(words(equipment)+' 小痰盂 18-150 18–150 RF50mmf1.8stm 两支镜头')});
    if (dualCamera) index.push({id:dualCamera.id, type:'可选双机', title:dualCamera.title,
      description:'如果增加 EOS R7 · '+dualCamera.intro,
      href:'#kit/r6-r7', titleKey:normalize(dualCamera.title),
      text:normalize(words(dualCamera)+' R7 R6 三代 双机 小痰盂 18-150 18–150 RF50mmf1.8stm')});
    if (comparison) for (const topic of [comparison.basics, ...comparison.topics]) {
      const title = 'R7 / R6 三代 · '+topic.title;
      index.push({id:topic.id,type:'换机配置',title,description:topic.summary,
        href:'#camera-compare/'+topic.id,titleKey:normalize(title),
        text:normalize('R7 R6 三代 R6 Mark III 换机 配置 对照 '+words(topic))});
    }
    return index;
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
