// 아직 구현하지 않은 화면에 쓰는 안내 카드
(function (TM) {
  'use strict';

  TM.components = TM.components || {};

  TM.components.renderPlaceholder = function (opts) {
    var esc = TM.dom.escapeHtml;
    var features = opts.features || [];
    // opts.before: 제목 위에 넣을 HTML (예: 뒤로 가기 링크)
    return '<section class="page">' + (opts.before || '') +
      '<header class="page-header"><h1>' + esc(opts.title) + '</h1><p class="muted">' + esc(opts.description) + '</p></header>' +
      '<div class="card placeholder">' +
        '<span class="badge">STEP ' + opts.step + '에서 구현 예정</span>' +
        (features.length ? '<ul class="feature-list">' + features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' : '') +
        (opts.extra || '') +
      '</div>' +
    '</section>';
  };
})(window.TM = window.TM || {});
