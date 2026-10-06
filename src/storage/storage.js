// 학습 기록 저장소 (브라우저 localStorage 사용).
// 앱의 다른 코드는 localStorage를 직접 쓰지 않고 반드시 이 모듈을 통해 저장한다.
// 그래서 나중에 IndexedDB나 서버 저장으로 바꿀 때 이 파일만 고치면 된다.
//
// 저장 방식: 키마다 { v: 데이터 형식 버전, savedAt, data } 형태의 JSON 문자열.
// localStorage는 브라우저마다 약 500만 글자까지 저장할 수 있다(실측: Chromium 약 520만 글자).
// 풀이 기록 1건은 약 230글자라서 약 2만 건(하루 30문제씩 약 2년)을 저장할 수 있다.
(function (TM) {
  'use strict';

  var NAMESPACE = 'toeic900:';
  var APP_ID = 'toeic-900-master';
  // 데이터 형식 버전. 저장 형식을 바꿀 때 올리고 storage/migrations.js에 변환 방법을 추가한다.
  var SCHEMA_VERSION = 1;
  var QUOTA_CHARS = 5000000; // 브라우저 한도보다 조금 낮게 잡은 안전 기준

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
    var errorHandler = null;

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
      SCHEMA_VERSION: SCHEMA_VERSION,

      // 저장에 실패했을 때(용량 초과 등) 화면에 알리기 위한 함수를 등록한다
      setErrorHandler: function (fn) { errorHandler = fn; },

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
          if (errorHandler) errorHandler(e, key);
          return false;
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

      // 사용 중인 저장 공간. 브라우저 한도는 글자 수 기준이므로 글자 수로 센다.
      usage: function () {
        var chars = 0;
        var byKey = {};
        ownKeys().forEach(function (k) {
          var raw = store.getItem(fullKey(k)) || '';
          var size = fullKey(k).length + raw.length;
          byKey[k] = size;
          chars += size;
        });
        return { chars: chars, quotaChars: QUOTA_CHARS, ratio: chars / QUOTA_CHARS, byKey: byKey };
      },

      // 백업: 모든 학습 기록을 하나의 객체로 내보낸다
      exportAll: function () {
        var data = {};
        ownKeys().forEach(function (k) { data[k] = api.get(k); });
        return { app: APP_ID, schema_version: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data: data };
      },

      // 복원: 기존 기록을 모두 지우고 백업 내용으로 바꾼다
      importAll: function (backup) {
        if (!backup || backup.app !== APP_ID || !backup.data || typeof backup.data !== 'object') {
          throw new Error('TOEIC 900 MASTER 백업 파일이 아닙니다');
        }
        if (backup.schema_version > SCHEMA_VERSION) {
          throw new Error('더 새로운 버전의 앱에서 만든 백업입니다. 앱을 최신 버전으로 업데이트한 뒤 불러오세요');
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
  TM.APP_ID = APP_ID;
  // 앱 전체에서 공유하는 기본 저장소
  TM.storage = createStorage();
})(window.TM = window.TM || {});
