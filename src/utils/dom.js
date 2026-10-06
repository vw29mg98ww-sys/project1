// 화면 렌더링에 쓰는 작은 도우미 함수들
(function (TM) {
  'use strict';

  var ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  TM.dom = {
    // 데이터 문자열을 HTML에 넣기 전에 반드시 이스케이프한다
    escapeHtml: function (value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ESCAPE[c]; });
    },
    percent: function (numerator, denominator) {
      return denominator ? Math.round((numerator / denominator) * 100) : 0;
    }
  };
})(window.TM = window.TM || {});
