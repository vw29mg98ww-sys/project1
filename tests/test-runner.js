// 아주 작은 테스트 도구 (설치 필요 없음). tests/index.html을 브라우저로 열면 결과가 표시된다.
(function () {
  'use strict';

  var cases = [];
  window.test = function (name, fn) { cases.push({ name: name, fn: fn }); };

  function fail(message) { throw new Error(message); }
  window.assert = {
    ok: function (value, message) { if (!value) fail(message || '값이 참이어야 합니다: ' + value); },
    equal: function (actual, expected, message) {
      if (actual !== expected) fail((message ? message + ' — ' : '') + '기대값 ' + JSON.stringify(expected) + ', 실제값 ' + JSON.stringify(actual));
    },
    deepEqual: function (actual, expected, message) {
      var a = JSON.stringify(actual), e = JSON.stringify(expected);
      if (a !== e) fail((message ? message + ' — ' : '') + '\n기대값 ' + e + '\n실제값 ' + a);
    },
    match: function (text, regex) { if (!regex.test(text)) fail(regex + ' 이(가) 포함되어야 합니다:\n' + text); },
    throws: function (fn, regex) {
      try { fn(); } catch (e) {
        if (regex && !regex.test(e.message)) fail('오류 메시지가 ' + regex + '와 맞지 않습니다: ' + e.message);
        return;
      }
      fail('오류가 발생해야 합니다');
    }
  };

  // 테스트 함수가 Promise를 돌려주면(비동기 테스트) 끝날 때까지 기다린다
  window.runTests = function () {
    var results = [];
    var chain = Promise.resolve();
    cases.forEach(function (c) {
      chain = chain.then(function () {
        return Promise.resolve().then(c.fn)
          .then(function () { results.push({ name: c.name, ok: true }); },
                function (e) { results.push({ name: c.name, ok: false, error: e && e.message ? e.message : String(e) }); });
      });
    });
    return chain.then(function () { report(results); });
  };

  function report(results) {
    var failed = results.filter(function (r) { return !r.ok; }).length;
    var out = document.getElementById('results');
    out.innerHTML = '<h1 class="' + (failed ? 'fail' : 'pass') + '">' +
      (failed ? '실패 ' + failed + '개' : '모두 통과') + ' (' + results.length + '개 테스트)</h1>' +
      '<ul>' + results.map(function (r) {
        return '<li class="' + (r.ok ? 'pass' : 'fail') + '">' + (r.ok ? '✔ ' : '✖ ') + TM.dom.escapeHtml(r.name) +
          (r.error ? '<pre>' + TM.dom.escapeHtml(r.error) + '</pre>' : '') + '</li>';
      }).join('') + '</ul>';
    window.testResults = { total: results.length, failed: failed, results: results };
  }
})();
