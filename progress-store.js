(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhotoProgressStore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // Keep the original v1/v2 JSON format. The raw snapshot is deliberately local
  // to this page: another page's replacement is never silently merged with notes.
  function createStore({ getStorage, key, validate, freshState }) {
    let snapshot, loaded = false, invalidRaw = null, kind = 'unavailable';
    const status = () => ({ kind, invalidRaw, loaded });
    function failure(reason, error) {
      kind = reason;
      return { ok: false, kind, error };
    }
    function load() {
      let raw;
      try { raw = getStorage().getItem(key); }
      catch (error) { return failure('unavailable', error); }
      snapshot = raw;
      loaded = true;
      invalidRaw = null;
      try {
        const state = raw === null ? freshState() : validate(JSON.parse(raw));
        kind = 'ready';
        return { ok: true, kind, state };
      } catch (error) {
        invalidRaw = raw;
        return failure('invalid', error);
      }
    }
    function check() {
      if (!loaded) return failure('unavailable');
      let current;
      try { current = getStorage().getItem(key); }
      catch (error) { return failure('unavailable', error); }
      if (current !== snapshot || kind === 'conflict') return failure('conflict');
      return { ok: kind === 'ready', kind };
    }
    function save(candidate, { replaceInvalid = false } = {}) {
      let normalized, serialized;
      try {
        normalized = validate(candidate);
        serialized = JSON.stringify(normalized);
      } catch (error) { return { ok: false, kind: 'validation', error }; }
      if (!loaded) return failure('unavailable');
      if (kind === 'conflict') return failure('conflict');
      try {
        const storage = getStorage();
        if (storage.getItem(key) !== snapshot) return failure('conflict');
        if (invalidRaw !== null && !replaceInvalid) return failure('invalid');
        storage.setItem(key, serialized);
        // Also detect an observable replacement between the write and readback.
        if (storage.getItem(key) !== serialized) return failure('conflict');
        snapshot = serialized;
        invalidRaw = null;
        kind = 'ready';
        return { ok: true, kind, state: normalized };
      } catch (error) { return failure('unavailable', error); }
    }
    return Object.freeze({ load, save, check, status });
  }
  return Object.freeze({ createStore });
});
