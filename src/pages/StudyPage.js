// 학습 화면 (#/study?day=1&section=part5&q=0). 문제 풀이는 STEP 4, 단어 학습은 STEP 7에서 구현한다.
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.study = {
    title: '학습',
    menuPath: '/day', // 사이드바에서는 'DAY 학습'을 선택된 메뉴로 표시
    render: function (ctx, params) {
      var day = Number(params && params.day);
      var section = TM.dayService.getSection(params && params.section);
      if (!day || !section) {
        return '<section class="page"><div class="card placeholder"><h1>학습할 DAY와 영역을 선택하세요</h1>' +
          '<p><a class="btn btn-primary" href="#/day">DAY 학습으로</a></p></div></section>';
      }
      var items = TM.dayService.getSectionItems(ctx.content, day, section.id, ctx.progress.getAttempts());
      return TM.components.renderPlaceholder({
        before: '<a class="back-link" href="#/day?day=' + day + '">← DAY ' + day + '</a>',
        title: 'DAY ' + day + ' · ' + section.label,
        description: '학습 대상 ' + items.length + '개',
        step: section.kind === 'vocab' ? 7 : 4,
        features: section.kind === 'vocab'
          ? ['단어 카드로 뜻 확인', '모름 / 헷갈림 / 알고 있음 선택', '단어가 나온 문제 함께 보기']
          : ['DAY ' + day + ' · ' + section.label + ' · Question 1 / ' + items.length + ' 진행 표시', '답 선택 → 채점 → 해설', '풀이 시간·선택한 답·오답 원인 저장', '중간에 닫아도 마지막 문제부터 이어서']
      });
    }
  };
})(window.TM = window.TM || {});
