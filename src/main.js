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

  function renderNewerDataError(outlet) {
    outlet.innerHTML = '<section class="page"><div class="card error-card">' +
      '<h1>더 새로운 버전의 앱에서 저장한 기록입니다</h1>' +
      '<p>기록이 손상되지 않도록 이 버전에서는 열지 않습니다. 최신 버전의 앱 파일로 실행하세요.</p>' +
    '</div></section>';
  }

  // 저장 관련 준비: 형식 변환, 저장 실패 알림, 영구 보관 요청
  function prepareStorage() {
    var storage = TM.storage;
    storage.setErrorHandler(function () {
      TM.components.toast('학습 기록을 저장하지 못했습니다. 저장 공간이 부족할 수 있습니다. 설정에서 백업한 뒤 공간을 확인하세요.', 'error');
    });
    if (!storage.isPersistent) {
      TM.components.toast('이 브라우저에서는 학습 기록이 저장되지 않습니다(개인정보 보호 모드 등). 일반 창에서 열어 주세요.', 'error');
    }
    var result = TM.migrations.run(storage);
    // Firefox는 영구 보관 요청 시 허용 창을 띄우므로 설정 화면에서 직접 요청하게 하고, 그 외 브라우저는 처음 한 번 자동 요청한다
    var settings = storage.get(TM.KEYS.SETTINGS, {}) || {};
    if (!settings.persistRequested && !/firefox/i.test(navigator.userAgent)) {
      TM.persistence.request();
      storage.set(TM.KEYS.SETTINGS, Object.assign({}, settings, { persistRequested: true }));
    }
    return result;
  }

  function bootstrap() {
    var layout = TM.components.createLayout(document.getElementById('app'));
    var outlet = layout.outlet;

    var migration = prepareStorage();
    if (migration.newerThanApp) {
      renderNewerDataError(outlet);
      return;
    }

    var content;
    try {
      content = TM.dataService.loadContent();
    } catch (error) {
      console.error(error);
      renderLoadError(outlet, error);
      return;
    }
    if (content.warnings.length) console.warn('데이터 경고:\n' + content.warnings.join('\n'));

    var ctx = { content: content, storage: TM.storage, progress: TM.progress };
    var cleanup = null;

    var currentPath = null;
    ctx.router = TM.router.createRouter({
      routes: TM.routes,
      defaultPath: '/dashboard',
      onRoute: function (route) {
        if (typeof cleanup === 'function') cleanup();
        var page = route.page || TM.pages.notFound;
        outlet.innerHTML = page.render(ctx, route.params);
        cleanup = page.mount ? page.mount(outlet, ctx, route.params) : null;
        currentPath = route.path;
        layout.setActive(page.menuPathFor ? page.menuPathFor(ctx, route.params) : (page.menuPath || route.path));
        document.title = page.title + ' · ' + TM.constants.APP_NAME;
        window.scrollTo(0, 0);
      }
    });

    // 다른 탭에서 기록이 바뀌면 화면을 새로 그린다 (문제를 푸는 중에는 방해하지 않도록 제외)
    window.addEventListener('storage', function (e) {
      if (e.key && e.key.indexOf(TM.STORAGE_NAMESPACE) === 0 && currentPath !== '/study') ctx.router.refresh();
    });
  }

  bootstrap();
})(window.TM = window.TM || {});
