// 학습 기록 백업·복원.
// 백업 파일은 JSON 형식이며, 다른 컴퓨터·브라우저로 기록을 옮기거나 브라우저 데이터가 지워졌을 때 복원하는 데 쓴다.
(function (TM) {
  'use strict';

  // 백업 파일 이름: toeic900-backup-2026-10-06.json
  function fileName(date) {
    return 'toeic900-backup-' + TM.date.toDateKey(date || new Date()) + '.json';
  }

  // 백업 내용 만들기 + 마지막 백업 시각 기록
  function createBackup(storage, now) {
    var time = (now || new Date()).toISOString();
    storage.update(TM.KEYS.BACKUP_INFO, function (info) { return Object.assign({}, info, { lastBackupAt: time }); }, {});
    var backup = storage.exportAll();
    backup.exportedAt = time;
    return backup;
  }

  function toText(backup) { return JSON.stringify(backup, null, 2); }

  // 파일 내용 → 백업 객체. 문제가 있으면 이해하기 쉬운 메시지로 오류를 던진다.
  function parse(text) {
    var backup;
    try {
      backup = JSON.parse(text);
    } catch (e) {
      throw new Error('파일을 읽을 수 없습니다. TOEIC 900 MASTER에서 내려받은 백업 파일(.json)인지 확인하세요');
    }
    if (!backup || backup.app !== TM.APP_ID || !backup.data || typeof backup.data !== 'object') {
      throw new Error('TOEIC 900 MASTER 백업 파일이 아닙니다');
    }
    return backup;
  }

  // 복원 전에 보여줄 요약
  function summarize(backup) {
    var d = backup.data || {};
    var attempts = d[TM.KEYS.ATTEMPTS] || [];
    var vocab = d[TM.KEYS.VOCAB_STATE] || {};
    var profile = d[TM.KEYS.PROFILE] || {};
    return {
      exportedAt: backup.exportedAt || null,
      attempts: attempts.length,
      words: Object.keys(vocab).length,
      studyDays: (profile.studyDates || []).length,
      currentDay: profile.currentDay || 1
    };
  }

  // 복원: 기존 기록을 백업으로 바꾸고, 형식 변환이 필요하면 실행한다
  function restore(storage, backup, now) {
    storage.importAll(backup);
    TM.migrations.run(storage);
    storage.update(TM.KEYS.BACKUP_INFO, function (info) {
      return Object.assign({}, info, { lastRestoredAt: (now || new Date()).toISOString() });
    }, {});
  }

  function lastBackupAt(storage) {
    return (storage.get(TM.KEYS.BACKUP_INFO, {}) || {}).lastBackupAt || null;
  }

  // 마지막 백업 후 지난 날 수 (한 번도 안 했으면 null)
  function daysSinceBackup(storage, now) {
    var last = lastBackupAt(storage);
    if (!last) return null;
    return Math.floor(((now || new Date()) - new Date(last)) / 86400000);
  }

  TM.backupService = {
    fileName: fileName,
    createBackup: createBackup,
    toText: toText,
    parse: parse,
    summarize: summarize,
    restore: restore,
    lastBackupAt: lastBackupAt,
    daysSinceBackup: daysSinceBackup,
    REMIND_AFTER_DAYS: 7
  };
})(window.TM = window.TM || {});
