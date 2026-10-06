(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.day = {
    title: 'DAY 학습',
    render: function (ctx) {
      var plan = TM.constants.DAILY_PLAN;
      var days = ctx.content.days;
      return TM.components.renderPlaceholder({
        title: 'DAY 학습',
        description: 'DAY 1 ~ DAY ' + (days[days.length - 1] || 1) + '의 학습 데이터가 준비되어 있습니다.',
        step: 3,
        features: [
          '하루 학습량: 단어 ' + plan.vocabulary + ' · Part 5 ' + plan.part5 + ' · Part 6 ' + plan.part6 + ' · Part 7 ' + plan.part7 + ' · 오답 복습',
          'DAY별 진행률과 전체 진행률 표시',
          '브라우저를 닫아도 마지막 문제부터 이어서 학습'
        ]
      });
    }
  };
})(window.TM = window.TM || {});
