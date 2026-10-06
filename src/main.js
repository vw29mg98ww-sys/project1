// 앱 시작점: 레이아웃 생성 → 데이터 로드 → 라우터 연결
(function (TM) {
  'use strict';

  var esc = TM.dom.escapeHtml;

  function renderLoadError(outlet, error) {
    var details = error.details || [];
    outlet.innerHTML = '<section class="page"><div class="card error-card">' +
      '<h1>데이터를 불러오지 못했습니다</h1>' +
      '<p>' + esc(error.message) + '</p>' +
      (details.length ? '<ul>' + details.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="muted">문제 파일(src/data/questions.js, vocabulary.js)을 수정했다면 위 목록의 위치를 고친 뒤 새로고침하세요.</p>' +
    '</div></section>';
  }

  function bootstrap() {
    var layout = TM.components.createLayout(document.getElementById('app'));
    var outlet = layout.outlet;

    var content;
    try {
      content = TM.dataService.loadContent();
    } catch (error) {
      console.error(error);
      renderLoadError(outlet, error);
      return;
    }
    if (content.warnings.length) console.warn('데이터 경고:\n' + content.warnings.join('\n'));

    var ctx = { content: content, storage: TM.storage };
    var cleanup = null;

    ctx.router = TM.router.createRouter({
      routes: TM.routes,
      defaultPath: '/dashboard',
      onRoute: function (route) {
        if (typeof cleanup === 'function') cleanup();
        var page = route.page || TM.pages.notFound;
        outlet.innerHTML = page.render(ctx, route.params);
        cleanup = page.mount ? page.mount(outlet, ctx, route.params) : null;
        layout.setActive(route.path);
        document.title = page.title + ' · ' + TM.constants.APP_NAME;
        window.scrollTo(0, 0);
      }
    });
  }

  bootstrap();
})(window.TM = window.TM || {});
