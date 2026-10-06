// Part 5 / 6 / 7은 같은 틀을 쓰므로 하나의 함수로 화면을 만든다
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.createPartPage = function (part) {
    var info = TM.constants.PARTS[part];
    return {
      title: info.name,
      render: function (ctx) {
        var esc = TM.dom.escapeHtml;
        return TM.components.renderPlaceholder({
          title: info.name + ' · ' + info.title,
          description: '등록된 문제 ' + ctx.content.getQuestions({ part: part }).length + '개',
          step: 6,
          features: [
            '유형별 문제 풀이와 즉시 채점',
            '정답/오답 해설, 오답 원인 선택',
            '자주 틀리는 유형을 추천 학습 영역으로 표시'
          ],
          extra: '<div class="chips">' + info.types.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>'
        });
      }
    };
  };
})(window.TM = window.TM || {});
