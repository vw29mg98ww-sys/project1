// 데이터 형식 변환(마이그레이션).
// 앱을 업데이트하면서 저장 형식이 바뀌어도 기존 학습 기록을 잃지 않도록,
// 저장된 형식 버전을 확인하고 필요한 변환을 순서대로 실행한다.
//
// 형식을 바꿀 때:
//   1) storage.js의 SCHEMA_VERSION을 1 올린다
//   2) 아래 MIGRATIONS에 { version: 새 버전, description, migrate: function (storage) { ... } }를 추가한다
(function (TM) {
  'use strict';

  var MIGRATIONS = [
    // 예시) { version: 2, description: '풀이 기록에 source 항목 추가',
    //        migrate: function (storage) { storage.update('attempts', function (list) { ... }, []); } }
  ];

  // storage: 저장소, options: { migrations, targetVersion } (테스트에서 바꿔 넣을 수 있다)
  function run(storage, options) {
    options = options || {};
    var list = (options.migrations || MIGRATIONS).slice().sort(function (a, b) { return a.version - b.version; });
    var target = options.targetVersion || storage.SCHEMA_VERSION;
    var metaKey = TM.KEYS.META;
    var meta = storage.get(metaKey, null);

    // 처음 실행: 기록이 하나도 없으면 최신 형식, 기록이 있는데 meta가 없으면 버전 1로 본다
    var hasData = storage.keys().some(function (k) { return k !== metaKey; });
    var from = meta && meta.schemaVersion ? meta.schemaVersion : (hasData ? 1 : target);
    var current = from;
    var applied = [];

    list.forEach(function (m) {
      if (m.version > current && m.version <= target) {
        m.migrate(storage);
        current = m.version;
        applied.push(m.version);
        storage.set(metaKey, { schemaVersion: current, migratedAt: new Date().toISOString() });
      }
    });
    if (from > target) return { from: from, to: from, applied: [], newerThanApp: true };
    if (!meta || meta.schemaVersion !== Math.max(current, target)) {
      current = Math.max(current, target);
      storage.set(metaKey, { schemaVersion: current });
    }
    // from > target: 더 새로운 버전의 앱에서 저장한 기록 (이 앱으로 덮어쓰지 않도록 알린다)
    return { from: from, to: current, applied: applied, newerThanApp: from > target };
  }

  TM.migrations = { run: run, MIGRATIONS: MIGRATIONS };
})(window.TM = window.TM || {});
