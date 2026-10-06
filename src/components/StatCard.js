// 숫자 하나를 보여주는 통계 카드
(function (TM) {
  'use strict';

  TM.components = TM.components || {};

  TM.components.renderStatCard = function (opts) {
    var esc = TM.dom.escapeHtml;
    return '<div class="card stat-card">' +
      '<div class="stat-label">' + esc(opts.label) + '</div>' +
      '<div class="stat-value">' + esc(opts.value) + '</div>' +
      (opts.sub ? '<div class="stat-sub">' + esc(opts.sub) + '</div>' : '') +
    '</div>';
  };
})(window.TM = window.TM || {});
