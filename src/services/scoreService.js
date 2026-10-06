// 예상 점수 계산.
// 최근 풀이의 Part별 정답률을 실제 RC 구성 비중(Part 5:6:7 = 30:16:54)으로 가중 평균해서
// RC 환산 점수를 추정하고, LC도 같은 수준이라고 가정해 총점을 계산한다.
// 공식 환산표가 아니라 학습 동기 부여용 추정치이며, 계산 방식은 이 파일만 고치면 바뀐다.
(function (TM) {
  'use strict';

  // RC 정답률(%) → RC 환산 점수 기준점. 사이 값은 직선으로 보간한다.
  var RC_TABLE = [[0, 5], [25, 90], [50, 235], [60, 290], [70, 345], [80, 400], [90, 450], [100, 495]];

  function rcFromAccuracy(pct) {
    for (var i = 1; i < RC_TABLE.length; i++) {
      var a = RC_TABLE[i - 1], b = RC_TABLE[i];
      if (pct <= b[0]) return a[1] + ((pct - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
    }
    return 495;
  }

  function roundTo5(n) { return Math.round(n / 5) * 5; }

  // attempts: 시간순 풀이 기록 → { total, rc, accuracy, basedOn } 또는 풀이 수 부족 시 { total: null, needed }
  function estimateScore(attempts) {
    var cfg = TM.constants.SCORE;
    var recent = attempts.slice(-cfg.RECENT_WINDOW);
    if (recent.length < cfg.MIN_ATTEMPTS) {
      return { total: null, rc: null, basedOn: recent.length, needed: cfg.MIN_ATTEMPTS - recent.length };
    }

    var parts = {};
    recent.forEach(function (a) {
      parts[a.part] = parts[a.part] || { total: 0, correct: 0 };
      parts[a.part].total++;
      if (a.is_correct) parts[a.part].correct++;
    });

    // 푼 Part만으로 비중을 다시 나눈다 (Part 5만 풀었다면 Part 5 정답률 = RC 정답률)
    var weightSum = 0, weighted = 0;
    Object.keys(parts).forEach(function (p) {
      var w = cfg.PART_WEIGHTS[p] || 0;
      weightSum += w;
      weighted += w * (parts[p].correct / parts[p].total);
    });
    var accuracy = weightSum ? (weighted / weightSum) * 100 : 0;
    var rc = Math.min(495, Math.max(5, roundTo5(rcFromAccuracy(accuracy))));
    return { total: Math.min(990, Math.max(10, rc * 2)), rc: rc, accuracy: Math.round(accuracy), basedOn: recent.length, needed: 0 };
  }

  TM.scoreService = { estimateScore: estimateScore, rcFromAccuracy: rcFromAccuracy };
})(window.TM = window.TM || {});
