// 저장소 키 목록. 모든 학습 데이터는 이 키들로만 저장한다.
// 새 데이터를 저장할 때는 여기에 키를 추가하고 TM.storage의 get/set을 쓴다.
(function (TM) {
  'use strict';

  TM.KEYS = {
    META: 'meta',                     // 저장된 데이터 형식 버전 { schemaVersion }
    PROFILE: 'profile',               // 학습 시작일, 현재 DAY, 연속 학습일
    DAY_PROGRESS: 'dayProgress',      // DAY별 진행률 (현재는 기록에서 계산하므로 예약만 해 둠)
    ATTEMPTS: 'attempts',             // 문제별 풀이 기록(선택한 답, 정답 여부, 풀이 시간, 오답 원인)
    VOCAB_STATE: 'vocabState',        // 단어별 학습 상태
    LAST_POSITION: 'lastPosition',    // 마지막으로 풀던 위치
    BACKUP_INFO: 'backupInfo',        // 마지막 백업·복원 시각 { lastBackupAt, lastRestoredAt }
    SETTINGS: 'settings'
  };
})(window.TM = window.TM || {});
