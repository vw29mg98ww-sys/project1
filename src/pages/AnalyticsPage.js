(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.analytics = {
    title: '학습분석',
    render: function () {
      return TM.components.renderPlaceholder({
        title: '학습분석',
        description: '학습 기록을 그래프로 분석합니다.',
        step: 9,
        features: ['일별 학습량 · 정답률', 'Part별 · 유형별 정답률', '오답 원인 분포', '취약 영역과 다음 학습 추천']
      });
    }
  };
})(window.TM = window.TM || {});
