// 학습 기록 → Dashboard 숫자. 화면과 분리된 순수 계산 함수라 테스트하기 쉽다.
(function (TM) {
  'use strict';

  function accuracy(correct, total) {
    return total ? Math.round((correct / total) * 100) : null; // 풀이가 없으면 null(화면에는 '—')
  }

  // 최근 오답 원인 분포: 최근 N문제 중 원인이 기록된 오답만 센다
  function analyzeWrongReasons(attempts) {
    var cfg = TM.constants.WEAKNESS;
    var tagged = attempts.slice(-cfg.RECENT_WINDOW).filter(function (a) { return !a.is_correct && a.wrong_reason; });
    var counts = {};
    tagged.forEach(function (a) { counts[a.wrong_reason] = (counts[a.wrong_reason] || 0) + 1; });
    var distribution = TM.constants.WRONG_REASONS
      .filter(function (r) { return counts[r.id]; })
      .map(function (r) { return { id: r.id, label: r.label, short: r.short, count: counts[r.id], share: Math.round((counts[r.id] / tagged.length) * 100) }; })
      .sort(function (a, b) { return b.count - a.count; });
    return { tagged: tagged.length, enough: tagged.length >= cfg.MIN_TAGGED, distribution: distribution };
  }

  // data: { attempts, profile, vocabState, today: 'YYYY-MM-DD' }
  function computeDashboard(data) {
    var attempts = data.attempts || [];
    var profile = data.profile;
    var vocabState = data.vocabState || {};

    var correct = attempts.filter(function (a) { return a.is_correct; }).length;
    var parts = {};
    [5, 6, 7].forEach(function (p) {
      var list = attempts.filter(function (a) { return a.part === p; });
      var c = list.filter(function (a) { return a.is_correct; }).length;
      parts[p] = { total: list.length, correct: c, accuracy: accuracy(c, list.length) };
    });

    // 오답노트 = 마지막 풀이가 오답인 문제
    var latest = {};
    attempts.forEach(function (a) { latest[a.question_id] = a; });
    var wrongNote = Object.keys(latest).filter(function (id) { return !latest[id].is_correct; }).length;

    var vocab = { known: 0, review: 0 };
    Object.keys(vocabState).forEach(function (w) {
      var s = vocabState[w].status;
      if (s === 'known') vocab.known++;
      else if (s === 'unknown' || s === 'confused') vocab.review++;
    });

    return {
      isEmpty: attempts.length === 0 && Object.keys(vocabState).length === 0,
      currentDay: profile.currentDay,
      streak: TM.date.calcStreak(profile.studyDates, data.today),
      studiedToday: profile.studyDates.indexOf(data.today) >= 0,
      totalAttempts: attempts.length,
      correct: correct,
      wrong: attempts.length - correct,
      accuracy: accuracy(correct, attempts.length),
      parts: parts,
      wrongNote: wrongNote,
      vocab: vocab,
      estimate: TM.scoreService.estimateScore(attempts),
      weakness: analyzeWrongReasons(attempts)
    };
  }

  TM.statsService = { computeDashboard: computeDashboard, analyzeWrongReasons: analyzeWrongReasons };
})(window.TM = window.TM || {});
