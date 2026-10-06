// 해시(#/경로) 기반 라우터. 서버 없이 파일로 열어도 동작하고, 새로고침해도 같은 화면이 유지된다.
(function (TM) {
  'use strict';

  // '#/part5?day=3' → { path: '/part5', params: { day: '3' } }
  function parseHash(hash) {
    var raw = String(hash || '').replace(/^#/, '');
    var idx = raw.indexOf('?');
    var pathPart = idx >= 0 ? raw.slice(0, idx) : raw;
    var query = idx >= 0 ? raw.slice(idx + 1) : '';
    var path = '/' + pathPart.split('/').filter(Boolean).join('/');
    var params = {};
    new URLSearchParams(query).forEach(function (value, key) { params[key] = value; });
    return { path: path, params: params };
  }

  function createRouter(options) {
    function handle() {
      var route = parseHash(window.location.hash);
      if (route.path === '/') {
        window.location.replace('#' + options.defaultPath);
        return;
      }
      options.onRoute({ path: route.path, params: route.params, page: options.routes[route.path] || null });
    }
    window.addEventListener('hashchange', handle);
    handle();
    return {
      navigate: function (path) { window.location.hash = path; },
      refresh: handle
    };
  }

  TM.router = { parseHash: parseHash, createRouter: createRouter };
})(window.TM = window.TM || {});
