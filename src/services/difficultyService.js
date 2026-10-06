// 맞춤 난이도: 최근 정답률로 다음에 풀 난이도(LEVEL 1~4)를 정하고, 그 난이도의 문제를 고른다.
// 규칙은 constants.js의 ADAPTIVE 값으로 조정할 수 있다.
(function (TM) {
  'use strict';

  var MIN_LEVEL = 1, MAX_LEVEL = 4;

  // recentAttempts: 한 Part의 풀이 기록(시간순)
  // → { level, current, accuracy, basedOn, change: 'up' | 'down' | 'keep' | 'start', reason }
  function recommendLevel(partAttempts) {
    var cfg = TM.constants.ADAPTIVE;
    var recent = partAttempts.slice(-cfg.WINDOW);
    if (recent.length < cfg.MIN_ATTEMPTS) {
      return { level: 1, current: null, accuracy: null, basedOn: recent.length, change: 'start',
        reason: '기록이 ' + cfg.MIN_ATTEMPTS + '문제 미만이라 LEVEL 1부터 시작합니다.' };
    }
    var correct = recent.filter(function (a) { return a.is_correct; }).length;
    var accuracy = Math.round((correct / recent.length) * 100);
    // 현재 난이도: 최근에 푼 문제들의 평균 난이도
    var avg = recent.reduce(function (n, a) { return n + (a.difficulty || 1); }, 0) / recent.length;
    var current = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(avg)));
    var level = current, change = 'keep';
    if (accuracy >= cfg.UP && current < MAX_LEVEL) { level = current + 1; change = 'up'; }
    else if (accuracy < cfg.DOWN && current > MIN_LEVEL) { level = current - 1; change = 'down'; }
    var reason = '최근 ' + recent.length + '문제 정답률 ' + accuracy + '% (평균 LEVEL ' + current + ') → ' +
      (change === 'up' ? '한 단계 올립니다.' : change === 'down' ? '한 단계 낮춰 기본기를 다집니다.' : '같은 난이도를 유지합니다.');
    return { level: level, current: current, accuracy: accuracy, basedOn: recent.length, change: change, reason: reason };
  }

  // 목표 난이도에 가까운 문제부터 고른다: 난이도 차이 → (마지막 오답 > 안 푼 문제 > 맞힌 문제) 순.
  // Part 6·7은 지문 단위로 고르고, 지문의 난이도는 그 지문 문제들의 평균으로 본다.
  function pickByLevel(questions, attempts, level, limit) {
    var latest = {};
    attempts.forEach(function (a) { latest[a.question_id] = a; });
    var groups = [], byKey = {};
    questions.forEach(function (q, i) {
      var key = q.passage_id || q.question_id;
      if (!byKey[key]) { byKey[key] = { items: [], first: i }; groups.push(byKey[key]); }
      byKey[key].items.push(q);
    });
    groups.forEach(function (g) {
      var avg = g.items.reduce(function (n, q) { return n + q.difficulty; }, 0) / g.items.length;
      g.distance = Math.abs(avg - level);
      g.status = Math.min.apply(null, g.items.map(function (q) {
        var a = latest[q.question_id];
        return !a ? 1 : a.is_correct ? 2 : 0;
      }));
    });
    groups.sort(function (a, b) {
      return a.distance - b.distance || a.status - b.status || a.first - b.first;
    });
    var picked = [];
    for (var i = 0; i < groups.length; i++) {
      if (picked.length && picked.length + groups[i].items.length > limit) {
        if (groups[i].items.length > 1) continue; // 지문 세트가 넘치면 건너뛰고 더 작은 것을 찾는다
        break;
      }
      picked = picked.concat(groups[i].items);
      if (picked.length >= limit) break;
    }
    return picked;
  }

  TM.difficultyService = { recommendLevel: recommendLevel, pickByLevel: pickByLevel };
})(window.TM = window.TM || {});
