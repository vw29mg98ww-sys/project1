// 진행 막대. value가 null이면(기록 없음) 빈 막대를 그린다.
(function (TM) {
  'use strict';

  TM.components = TM.components || {};

  // opts: { value: 0~100 | null, label: 화면 낭독기용 설명 }
  TM.components.renderMeter = function (opts) {
    var v = opts.value == null ? 0 : Math.max(0, Math.min(100, opts.value));
    return '<div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(v) + '"' +
      (opts.label ? ' aria-label="' + TM.dom.escapeHtml(opts.label) + '"' : '') + '>' +
      '<span style="width:' + v + '%"></span></div>';
  };
})(window.TM = window.TM || {});
