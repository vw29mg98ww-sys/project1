// Dashboard (STEP 1: 기본 화면 + 데이터/저장소 상태 확인. 학습 통계는 STEP 2에서 구현)
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.dashboard = {
    title: 'Dashboard',
    render: function (ctx) {
      var C = TM.constants;
      var stat = TM.components.renderStatCard;
      var content = ctx.content;
      var first = content.days[0];
      var last = content.days[content.days.length - 1];

      var partCards = [5, 6, 7].map(function (p) {
        return stat({ label: C.PARTS[p].name, value: content.getQuestions({ part: p }).length + '문항', sub: C.PARTS[p].title });
      }).join('');

      return '<section class="page">' +
        '<header class="page-header"><h1>Dashboard</h1>' +
          '<p class="muted">DAY 1부터 매일 조금씩, 목표 ' + C.TARGET_SCORE + '점까지.</p></header>' +

        '<div class="card hero">' +
          '<div><div class="hero-label">목표 점수</div><div class="hero-score">' + C.TARGET_SCORE + '</div></div>' +
          '<a class="btn btn-primary btn-lg" href="#/day">오늘의 학습 시작</a>' +
        '</div>' +

        '<h2 class="section-title">학습 데이터</h2>' +
        '<div class="stat-grid">' +
          partCards +
          stat({ label: 'Vocabulary', value: content.words.length + '단어' }) +
          stat({ label: '학습 DAY', value: content.days.length + '일치', sub: 'DAY ' + (first || '-') + ' ~ DAY ' + (last || '-') }) +
          stat({
            label: '기록 저장',
            value: ctx.storage.isPersistent ? '자동 저장' : '임시 저장',
            sub: ctx.storage.isPersistent ? '브라우저를 닫아도 유지됩니다' : '이 브라우저에서는 창을 닫으면 사라집니다'
          }) +
        '</div>' +

        '<p class="muted small">예상 점수, 연속 학습일, 정답률 등 학습 통계는 다음 단계(STEP 2)에서 표시됩니다.</p>' +
      '</section>';
    }
  };
})(window.TM = window.TM || {});
