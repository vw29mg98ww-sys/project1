(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.settings = {
    title: '설정',
    render: function () {
      return TM.components.renderPlaceholder({
        title: '설정',
        description: '학습 환경과 기록을 관리합니다.',
        step: 10,
        features: ['학습 기록 백업 / 복원', '하루 학습량 조정', '학습 기록 초기화']
      });
    }
  };
})(window.TM = window.TM || {});
