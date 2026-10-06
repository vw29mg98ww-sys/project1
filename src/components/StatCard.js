// 숫자 하나를 보여주는 통계 카드
(function (TM) {
  'use strict';

  TM.components = TM.components || {};

  // opts: { label, value, unit?, sub?, extra?(HTML) }
  TM.components.renderStatCard = function (opts) {
    var esc = TM.dom.escapeHtml;
    return '<div class="card stat-card">' +
      '<div class="stat-label">' + esc(opts.label) + '</div>' +
      '<div class="stat-value">' + esc(opts.value) + (opts.unit ? '<span class="stat-unit">' + esc(opts.unit) + '</span>' : '') + '</div>' +
      (opts.sub ? '<div class="stat-sub">' + esc(opts.sub) + '</div>' : '') +
      (opts.extra || '') +
    '</div>';
  };
})(window.TM = window.TM || {});
