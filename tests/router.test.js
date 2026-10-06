test('해시 주소를 경로와 파라미터로 나눈다', function () {
  assert.deepEqual(TM.router.parseHash('#/part5?day=3&q=2'), { path: '/part5', params: { day: '3', q: '2' } });
  assert.deepEqual(TM.router.parseHash('#/dashboard/'), { path: '/dashboard', params: {} });
  assert.deepEqual(TM.router.parseHash(''), { path: '/', params: {} });
  assert.deepEqual(TM.router.parseHash('#'), { path: '/', params: {} });
});

test('모든 메뉴 항목에 연결된 화면이 있다', function () {
  TM.constants.MENU.forEach(function (item) {
    var page = TM.routes[item.path];
    assert.ok(page, item.label + ' (' + item.path + ') 화면이 없습니다');
    assert.equal(typeof page.render, 'function');
  });
});

test('모든 화면이 오류 없이 그려진다', function () {
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  var storage = TM.createStorage(TM.createMemoryBackend());
  var ctx = { content: content, storage: storage, progress: TM.createProgressService(storage) };
  Object.keys(TM.routes).forEach(function (path) {
    var html = TM.routes[path].render(ctx, {});
    assert.ok(typeof html === 'string' && html.length > 0, path + ' 화면이 비어 있습니다');
  });
});
