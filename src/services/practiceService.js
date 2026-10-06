// Part별 연습: 유형별 정답률, 추천 학습 영역(자주 틀리는 유형), 연습 문제 세트 만들기
// (화면과 분리된 순수 함수)
(function (TM) {
  'use strict';

  function pct(c, t) { return t ? Math.round((c / t) * 100) : null; }

  // 문제 유형별 정답률. 문제 데이터에 있는 유형 + 풀이 기록에 있는 유형을 모두 보여준다.
  function typeStats(content, attempts, part) {
    var questions = content.getQuestions({ part: part });
    var order = TM.constants.PARTS[part].types;
    var map = {};
    function entry(type) {
      return map[type] || (map[type] = { type: type, questions: 0, attempts: 0, correct: 0, accuracy: null });
    }
    questions.forEach(function (q) { if (q.question_type) entry(q.question_type).questions++; });
    attempts.forEach(function (a) {
      if (a.part !== part || !a.question_type) return;
      var e = entry(a.question_type);
      e.attempts++;
      if (a.is_correct) e.correct++;
    });
    return Object.keys(map).map(function (k) {
      var e = map[k];
      e.accuracy = pct(e.correct, e.attempts);
      return e;
    }).sort(function (a, b) {
      var ia = order.indexOf(a.type), ib = order.indexOf(b.type);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
  }

  // 추천 학습 영역: 충분히 풀었는데 정답률이 낮은 유형 (정답률 낮은 순)
  function weakTypes(stats) {
    var cfg = TM.constants.WEAK_TYPE;
    return stats
      .filter(function (s) { return s.attempts >= cfg.MIN_ATTEMPTS && s.accuracy < cfg.THRESHOLD && s.questions > 0; })
      .sort(function (a, b) { return a.accuracy - b.accuracy || b.attempts - a.attempts; });
  }

  function latestByQuestion(attempts) {
    var latest = {};
    attempts.forEach(function (a) { latest[a.question_id] = a; });
    return latest;
  }

  // 연습 순서: ① 마지막에 틀린 문제 ② 아직 안 푼 문제 ③ 맞힌 문제 (같은 그룹 안에서는 데이터 순서 유지)
  // Part 6·7은 같은 지문의 문제가 흩어지지 않도록 지문 단위로 묶어서 정렬한다.
  function orderForPractice(questions, attempts) {
    var latest = latestByQuestion(attempts);
    function rank(q) {
      var a = latest[q.question_id];
      return !a ? 1 : a.is_correct ? 2 : 0;
    }
    var groups = [];
    var byKey = {};
    questions.forEach(function (q, i) {
      var key = q.passage_id || q.question_id;
      if (!byKey[key]) { byKey[key] = { key: key, items: [], first: i }; groups.push(byKey[key]); }
      byKey[key].items.push(q);
    });
    groups.forEach(function (g) { g.rank = Math.min.apply(null, g.items.map(rank)); });
    groups.sort(function (a, b) { return a.rank - b.rank || a.first - b.first; });
    return groups.reduce(function (list, g) { return list.concat(g.items); }, []);
  }

  // 연습 세트 만들기. options: { part, mode: 'type' | 'weak' | 'adaptive' | 'all', type }
  function buildPracticeSet(content, attempts, options) {
    var part = options.part;
    var info = TM.constants.PARTS[part];
    var all = content.getQuestions({ part: part });
    var partAttempts = attempts.filter(function (a) { return a.part === part; });

    if (options.mode === 'type') {
      var ofType = all.filter(function (q) { return q.question_type === options.type; });
      return { title: info.name + ' · ' + options.type, items: orderForPractice(ofType, attempts) };
    }
    if (options.mode === 'weak') {
      var weak = weakTypes(typeStats(content, attempts, part)).slice(0, 2).map(function (s) { return s.type; });
      var items = orderForPractice(all.filter(function (q) { return weak.indexOf(q.question_type) >= 0; }), attempts);
      return { title: info.name + ' · 추천 학습(' + weak.join(', ') + ')', items: items.slice(0, TM.constants.ADAPTIVE.SET_SIZE[part]) };
    }
    if (options.mode === 'adaptive') {
      var rec = TM.difficultyService.recommendLevel(partAttempts);
      return {
        title: info.name + ' · 맞춤 난이도 ' + TM.constants.DIFFICULTY_LEVELS[rec.level].label,
        items: TM.difficultyService.pickByLevel(all, attempts, rec.level, TM.constants.ADAPTIVE.SET_SIZE[part]),
        level: rec.level
      };
    }
    return { title: info.name + ' · 전체 문제', items: orderForPractice(all, attempts) };
  }

  TM.practiceService = {
    typeStats: typeStats,
    weakTypes: weakTypes,
    orderForPractice: orderForPractice,
    buildPracticeSet: buildPracticeSet
  };
})(window.TM = window.TM || {});
