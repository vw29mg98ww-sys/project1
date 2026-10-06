(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.vocabulary = {
    title: 'Vocabulary',
    render: function (ctx) {
      return TM.components.renderPlaceholder({
        title: 'Vocabulary',
        description: '등록된 단어 ' + ctx.content.words.length + '개',
        step: 7,
        features: ['모름 / 헷갈림 / 알고 있음 3단계 암기 상태', '복습 단어 자동 등록', '단어가 등장한 문제로 바로 이동']
      });
    }
  };
})(window.TM = window.TM || {});
