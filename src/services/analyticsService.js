// 학습분석 데이터 요약. 기록(풀이·단어·학습 날짜) → 그래프와 분석에 쓰는 하나의 요약 객체.
// 요약은 함수 없는 순수 데이터(JSON으로 바꿀 수 있음)라서, 규칙 기반 분석과 나중에 붙일 AI 분석이 같은 입력을 쓴다.
(function (TM) {
  'use strict';

  function pct(c, t) { return t ? Math.round((c / t) * 100) : null; }

  function localDateKey(iso) { return TM.date.toDateKey(new Date(iso)); }

  // 가장 긴 연속 학습일
  function bestStreak(dateKeys) {
    var sorted = Array.from(new Set(dateKeys)).sort();
    var best = 0, run = 0, prev = null;
    sorted.forEach(function (d) {
      run = prev && TM.date.addDays(prev, 1) === d ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    });
    return best;
  }

  // data: { content, attempts, vocabState, profile, today: 'YYYY-MM-DD', rangeDays }
  function buildSummary(data) {
    var C = TM.constants;
    var today = data.today;
    var days = data.rangeDays || 7;
    var from = TM.date.addDays(today, -(days - 1));
    var allAttempts = data.attempts || [];
    var attempts = allAttempts.filter(function (a) { var d = localDateKey(a.answered_at); return d >= from && d <= today; });
    var studyDates = (data.profile && data.profile.studyDates) || [];

    // 일별
    var byDate = {};
    attempts.forEach(function (a) {
      var d = localDateKey(a.answered_at);
      var e = byDate[d] || (byDate[d] = { attempts: 0, correct: 0 });
      e.attempts++;
      if (a.is_correct) e.correct++;
    });
    var daily = [];
    for (var i = 0; i < days; i++) {
      var key = TM.date.addDays(from, i);
      var e = byDate[key] || { attempts: 0, correct: 0 };
      daily.push({ date: key, attempts: e.attempts, correct: e.correct, accuracy: pct(e.correct, e.attempts), studied: studyDates.indexOf(key) >= 0 || e.attempts > 0 });
    }

    // Part별 (정답률, 평균 풀이 시간)
    var parts = {};
    [5, 6, 7].forEach(function (p) {
      var list = attempts.filter(function (a) { return a.part === p; });
      var c = list.filter(function (a) { return a.is_correct; }).length;
      var time = list.reduce(function (n, a) { return n + (a.time_ms || 0); }, 0);
      parts[p] = { attempts: list.length, correct: c, accuracy: pct(c, list.length), avgSeconds: list.length ? Math.round(time / list.length / 1000) : null };
    });

    // 유형별
    var typeMap = {};
    attempts.forEach(function (a) {
      if (!a.question_type) return;
      var k = a.part + '|' + a.question_type;
      var t = typeMap[k] || (typeMap[k] = { part: a.part, type: a.question_type, attempts: 0, correct: 0 });
      t.attempts++;
      if (a.is_correct) t.correct++;
    });
    var types = Object.keys(typeMap).map(function (k) { var t = typeMap[k]; t.accuracy = pct(t.correct, t.attempts); return t; })
      .sort(function (a, b) { return a.accuracy - b.accuracy || b.attempts - a.attempts; });

    // 오답 원인
    var wrongs = attempts.filter(function (a) { return !a.is_correct; });
    var tagged = wrongs.filter(function (a) { return a.wrong_reason; });
    var reasonCounts = {};
    tagged.forEach(function (a) { reasonCounts[a.wrong_reason] = (reasonCounts[a.wrong_reason] || 0) + 1; });
    var reasons = C.WRONG_REASONS.filter(function (r) { return reasonCounts[r.id]; })
      .map(function (r) { return { id: r.id, label: r.label, count: reasonCounts[r.id], share: pct(reasonCounts[r.id], tagged.length) }; })
      .sort(function (a, b) { return b.count - a.count; });

    // 단어: 현재 암기 상태 + 이 기간에 상태를 표시한 단어 수
    var vocabState = data.vocabState || {};
    var vocabCounts = TM.vocabService.summarize(data.content.words, vocabState);
    var markedInRange = Object.keys(vocabState).filter(function (w) {
      var u = vocabState[w].updatedAt;
      if (!u || !vocabState[w].status) return false;
      var d = localDateKey(u);
      return d >= from && d <= today;
    }).length;

    // 학습 달력: 최근 N주 (일요일 시작으로 맞춤)
    var weeks = C.ANALYTICS.HEATMAP_WEEKS;
    var end = TM.date.parseDateKey(today);
    var calStart = TM.date.addDays(today, -((weeks - 1) * 7 + end.getDay()));
    var allByDate = {};
    allAttempts.forEach(function (a) { var d = localDateKey(a.answered_at); allByDate[d] = (allByDate[d] || 0) + 1; });
    var heatmap = [];
    for (var h = 0; ; h++) {
      var dk = TM.date.addDays(calStart, h);
      if (dk > today) break;
      heatmap.push({ date: dk, attempts: allByDate[dk] || 0, studied: studyDates.indexOf(dk) >= 0 || !!allByDate[dk] });
    }

    var totalTime = attempts.reduce(function (n, a) { return n + (a.time_ms || 0); }, 0);
    var correct = attempts.filter(function (a) { return a.is_correct; }).length;
    var half = Math.floor(days / 2);
    var firstHalf = attempts.filter(function (a) { return localDateKey(a.answered_at) < TM.date.addDays(from, half); });
    var secondHalf = attempts.filter(function (a) { return localDateKey(a.answered_at) >= TM.date.addDays(from, half); });

    return {
      range: { days: days, from: from, to: today, label: '최근 ' + days + '일' },
      totals: {
        attempts: attempts.length, correct: correct, accuracy: pct(correct, attempts.length),
        studyDays: daily.filter(function (d) { return d.studied; }).length,
        avgSeconds: attempts.length ? Math.round(totalTime / attempts.length / 1000) : null
      },
      trend: {
        firstHalf: { attempts: firstHalf.length, accuracy: pct(firstHalf.filter(function (a) { return a.is_correct; }).length, firstHalf.length) },
        secondHalf: { attempts: secondHalf.length, accuracy: pct(secondHalf.filter(function (a) { return a.is_correct; }).length, secondHalf.length) }
      },
      daily: daily,
      parts: parts,
      types: types,
      reasons: { wrong: wrongs.length, tagged: tagged.length, untagged: wrongs.length - tagged.length, list: reasons },
      vocab: { total: vocabCounts.total, known: vocabCounts.known, confused: vocabCounts.confused, unknown: vocabCounts.unknown, review: vocabCounts.review, new: vocabCounts.new, reviewTotal: vocabCounts.reviewTotal, markedInRange: markedInRange },
      streak: { current: TM.date.calcStreak(studyDates, today), best: bestStreak(studyDates), totalStudyDays: new Set(studyDates).size },
      heatmap: heatmap
    };
  }

  TM.analyticsService = { buildSummary: buildSummary, bestStreak: bestStreak };
})(window.TM = window.TM || {});
