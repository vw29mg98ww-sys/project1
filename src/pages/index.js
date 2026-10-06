// 경로 → 화면 연결표. 새 화면을 만들면 파일을 추가하고 여기에 한 줄 추가한다.
// 화면 형식: { title, render(ctx, params) → HTML 문자열, mount?(root, ctx, params) → 정리 함수 }
(function (TM) {
  'use strict';

  var P = TM.pages;
  TM.routes = {
    '/dashboard': P.dashboard,
    '/day': P.day,
    '/study': P.study,            // 메뉴에는 없고 DAY 화면에서 들어가는 학습 화면
    '/part5': P.createPartPage(5),
    '/part6': P.createPartPage(6),
    '/part7': P.createPartPage(7),
    '/vocabulary': P.vocabulary,
    '/wrong-notes': P.wrongNotes,
    '/analytics': P.analytics,
    '/settings': P.settings
  };
})(window.TM = window.TM || {});
