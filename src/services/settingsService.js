// 사용자 설정: 화면 테마, 하루 목표, 처음 사용 안내 표시 여부
// 저장 형식 settings: { theme: 'system'|'light'|'dark', dailyGoal: { questions, words }, onboardingDone, persistRequested }
(function (TM) {
  'use strict';

  var DEFAULTS = { theme: 'system', dailyGoal: { questions: 20, words: 20 }, onboardingDone: false };
  var GOAL_OPTIONS = { questions: [10, 20, 30, 40, 50], words: [10, 20, 30, 50] };
  var THEMES = [{ id: 'system', label: '시스템 설정' }, { id: 'light', label: '라이트' }, { id: 'dark', label: '다크' }];

  function get(storage) {
    var saved = storage.get(TM.KEYS.SETTINGS, {}) || {};
    return Object.assign({}, DEFAULTS, saved, { dailyGoal: Object.assign({}, DEFAULTS.dailyGoal, saved.dailyGoal || {}) });
  }

  function update(storage, patch) {
    return storage.update(TM.KEYS.SETTINGS, function (s) { return Object.assign({}, s || {}, patch); }, {});
  }

  // 테마 적용: 시스템이면 표시를 지워 컴퓨터 설정을 따르게 한다
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
  }

  // 오늘 한 학습량: 오늘 푼 문제 수, 오늘 상태를 고른 단어 수
  function todayProgress(attempts, vocabState, today) {
    var questions = attempts.filter(function (a) { return TM.date.toDateKey(new Date(a.answered_at)) === today; }).length;
    var words = Object.keys(vocabState || {}).filter(function (w) {
      var e = vocabState[w];
      return e.status && e.updatedAt && TM.date.toDateKey(new Date(e.updatedAt)) === today;
    }).length;
    return { questions: questions, words: words };
  }

  // 남은 저장 공간으로 풀이 기록을 대략 몇 건 더 저장할 수 있는지
  function capacity(usage, attemptCount) {
    var perAttempt = attemptCount >= 20 ? usage.byKey[TM.KEYS.ATTEMPTS] / attemptCount : 230;
    var free = Math.max(0, usage.quotaChars - usage.chars);
    return { perAttempt: Math.round(perAttempt), remainingAttempts: Math.floor(free / perAttempt) };
  }

  TM.settingsService = { DEFAULTS: DEFAULTS, GOAL_OPTIONS: GOAL_OPTIONS, THEMES: THEMES, get: get, update: update, applyTheme: applyTheme, todayProgress: todayProgress, capacity: capacity };
})(window.TM = window.TM || {});
