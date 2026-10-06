// 학습 기록 저장소 (브라우저 localStorage 사용).
// 앱의 다른 코드는 localStorage를 직접 쓰지 않고 반드시 이 모듈을 통해 저장한다.
// 그래서 나중에 IndexedDB나 서버 저장으로 바꿀 때 이 파일만 고치면 된다.
(function (TM) {
  'use strict';

  var NAMESPACE = 'toeic900:';
  var SCHEMA_VERSION = 1;

  // 메모리 저장소: localStorage를 쓸 수 없는 환경(일부 개인정보 보호 모드)이나 테스트에서 사용
  function createMemoryBackend() {
    var map = new Map();
    return {
      getItem: function (k) { return map.has(k) ? map.get(k) : null; },
      setItem: function (k, v) { map.set(k, String(v)); },
      removeItem: function (k) { map.delete(k); },
      key: function (i) { return Array.from(map.keys())[i] || null; },
      get length() { return map.size; }
    };
  }

  function detectBackend() {
    try {
      var ls = window.localStorage;
      var probe = NAMESPACE + '__probe__';
      ls.setItem(probe, '1');
      ls.removeItem(probe);
      return { backend: ls, persistent: true };
    } catch (e) {
      return { backend: createMemoryBackend(), persistent: false };
    }
  }

  function createStorage(backend) {
    var detected = backend ? { backend: backend, persistent: true } : detectBackend();
    var store = detected.backend;

    function fullKey(key) { return NAMESPACE + key; }

    function ownKeys() {
      var keys = [];
      for (var i = 0; i < store.length; i++) {
        var k = store.key(i);
        if (k && k.indexOf(NAMESPACE) === 0) keys.push(k.slice(NAMESPACE.length));
      }
      return keys;
    }

    var api = {
      // 브라우저를 닫아도 기록이 남는 저장소인지 여부
      isPersistent: detected.persistent,

      get: function (key, fallback) {
        if (fallback === undefined) fallback = null;
        try {
          var raw = store.getItem(fullKey(key));
          if (raw === null) return fallback;
          var parsed = JSON.parse(raw);
          return parsed && 'data' in parsed ? parsed.data : fallback;
        } catch (e) {
          return fallback;
        }
      },

      set: function (key, value) {
        try {
          store.setItem(fullKey(key), JSON.stringify({ v: SCHEMA_VERSION, savedAt: new Date().toISOString(), data: value }));
          return true;
        } catch (e) {
          return false; // 용량 초과 등. 호출한 쪽에서 사용자에게 알릴 수 있도록 false
        }
      },

      // 기존 값을 읽어 함수로 바꾼 뒤 저장: storage.update('profile', function (p) { ... }, {})
      update: function (key, updater, fallback) {
        var next = updater(api.get(key, fallback));
        api.set(key, next);
        return next;
      },

      remove: function (key) {
        try { store.removeItem(fullKey(key)); } catch (e) { /* 무시 */ }
      },

      keys: ownKeys,

      clearAll: function () {
        ownKeys().forEach(function (k) { store.removeItem(fullKey(k)); });
      },

      // 백업: 모든 학습 기록을 하나의 객체로 내보낸다 (설정 화면의 백업 기능에서 사용 예정)
      exportAll: function () {
        var data = {};
        ownKeys().forEach(function (k) { data[k] = api.get(k); });
        return { app: 'toeic-900-master', schema_version: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data: data };
      },

      importAll: function (backup) {
        if (!backup || backup.app !== 'toeic-900-master' || typeof backup.data !== 'object') {
          throw new Error('TOEIC 900 MASTER 백업 파일이 아닙니다');
        }
        api.clearAll();
        Object.keys(backup.data).forEach(function (k) { api.set(k, backup.data[k]); });
      }
    };
    return api;
  }

  TM.createStorage = createStorage;
  TM.createMemoryBackend = createMemoryBackend;
  TM.STORAGE_NAMESPACE = NAMESPACE;
  // 앱 전체에서 공유하는 기본 저장소
  TM.storage = createStorage();
})(window.TM = window.TM || {});
