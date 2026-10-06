// 학습 기록에서 안내 문장을 만든다.
// 지금은 규칙 기반이고, 나중에 AI 분석을 붙일 때는 같은 형식({ id, tone, message, href? })의 목록을
// 돌려주는 함수로 교체하거나 결과를 이어 붙이면 화면 코드는 그대로 쓸 수 있다.
(function (TM) {
  'use strict';

  // 취약 영역 이름 고르기: 1위는 항상, 2위는 비중이 25% 이상이거나 1위와 10%p 이내일 때 함께
  function weaknessMessage(weakness) {
    if (!weakness.enough || !weakness.distribution.length) return null;
    var d = weakness.distribution;
    var names = [d[0].short];
    if (d[1] && (d[1].share >= 25 || d[0].share - d[1].share <= 10)) names.push(d[1].short);
    var subject = names.length === 2 ? TM.korean.particle(names[0], '와', '과') + ' ' + names[1] : names[0];
    return '현재 가장 취약한 영역은 ' + subject + '입니다.';
  }

  // stats: statsService.computeDashboard 결과
  function buildDashboardInsights(stats) {
    var insights = [];
    var C = TM.constants;

    var weak = weaknessMessage(stats.weakness);
    if (weak) insights.push({ id: 'weakness', tone: 'focus', message: weak });

    // Part별 정답률: 5문제 이상 푼 Part가 2개 이상일 때 가장 낮은 Part 안내
    var measured = [5, 6, 7].filter(function (p) { return stats.parts[p].total >= 5; });
    if (measured.length >= 2) {
      var lowest = measured.reduce(function (a, b) { return stats.parts[b].accuracy < stats.parts[a].accuracy ? b : a; });
      insights.push({ id: 'lowest-part', tone: 'focus', message: C.PARTS[lowest].name + ' 정답률이 ' + stats.parts[lowest].accuracy + '%로 가장 낮습니다.' });
    }

    if (stats.vocab.review > 0) {
      insights.push({ id: 'vocab-review', tone: 'info', message: '복습할 단어가 ' + stats.vocab.review + '개 있습니다.' });
    }
    if (stats.wrongNote > 0) {
      insights.push({ id: 'wrong-note', tone: 'info', message: '오답노트에 다시 풀어야 할 문제가 ' + stats.wrongNote + '개 있습니다.' });
    }
    // 기록이 어느 정도 쌓였는데 백업한 지 오래됐으면 알린다
    var remind = TM.backupService ? TM.backupService.REMIND_AFTER_DAYS : 7;
    if (stats.totalAttempts >= 20 && (stats.daysSinceBackup === null || stats.daysSinceBackup >= remind)) {
      insights.push({
        id: 'backup', tone: 'info', href: '#/settings',
        message: stats.daysSinceBackup === null ? '학습 기록을 아직 백업하지 않았습니다. 설정에서 백업 파일을 내려받아 두세요.'
          : '마지막 백업 후 ' + stats.daysSinceBackup + '일이 지났습니다. 설정에서 백업하세요.'
      });
    }
    if (!stats.studiedToday && stats.streak > 0) {
      insights.push({ id: 'streak', tone: 'info', message: '오늘 학습하면 연속 학습 ' + (stats.streak + 1) + '일이 됩니다.' });
    }
    return insights;
  }

  TM.insightService = { buildDashboardInsights: buildDashboardInsights, weaknessMessage: weaknessMessage };
})(window.TM = window.TM || {});
