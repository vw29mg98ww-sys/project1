// 날짜 도우미. 학습 날짜는 사용자 컴퓨터의 현지 날짜 기준 'YYYY-MM-DD' 문자열로 저장한다.
(function (TM) {
  'use strict';

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function toDateKey(date) {
    var d = date || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function parseDateKey(key) {
    var p = key.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function addDays(key, n) {
    var d = parseDateKey(key);
    d.setDate(d.getDate() + n);
    return toDateKey(d);
  }

  // 연속 학습일: 오늘(또는 아직 오늘 공부 전이면 어제)부터 거꾸로 하루도 빠짐없이 공부한 날 수
  function calcStreak(dateKeys, todayKey) {
    var set = new Set(dateKeys || []);
    var cursor = set.has(todayKey) ? todayKey : addDays(todayKey, -1);
    var streak = 0;
    while (set.has(cursor)) {
      streak++;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  TM.date = { toDateKey: toDateKey, parseDateKey: parseDateKey, addDays: addDays, calcStreak: calcStreak };
})(window.TM = window.TM || {});
