(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  TM.pages.notFound = {
    title: '페이지 없음',
    render: function () {
      return '<section class="page"><div class="card placeholder">' +
        '<h1>페이지를 찾을 수 없습니다</h1>' +
        '<p><a class="btn btn-primary" href="#/dashboard">Dashboard로 이동</a></p>' +
      '</div></section>';
    }
  };
})(window.TM = window.TM || {});
