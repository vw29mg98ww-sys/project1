(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.wrongNotes = {
    title: '오답노트',
    render: function () {
      return TM.components.renderPlaceholder({
        title: '오답노트',
        description: '틀린 문제를 모아 다시 학습합니다.',
        step: 8,
        features: ['DAY별 · Part별 · 유형별 · 오답 원인별 필터', '내 답 / 정답 / 해설 / 관련 단어 함께 보기']
      });
    }
  };
})(window.TM = window.TM || {});
