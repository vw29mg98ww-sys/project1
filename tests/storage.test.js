function memoryStorage() { return TM.createStorage(TM.createMemoryBackend()); }

test('저장한 값을 다시 읽을 수 있다 (객체·배열·숫자)', function () {
  var s = memoryStorage();
  s.set('profile', { day: 3, streak: 2 });
  s.set('list', [1, 2, 3]);
  s.set('zero', 0);
  assert.deepEqual(s.get('profile'), { day: 3, streak: 2 });
  assert.deepEqual(s.get('list'), [1, 2, 3]);
  assert.equal(s.get('zero'), 0);
  assert.equal(s.get('missing', 'fallback'), 'fallback');
});

test('저장소를 다시 만들어도 기록이 유지된다 (= 브라우저 재접속)', function () {
  var backend = TM.createMemoryBackend();
  TM.createStorage(backend).set('attempts', { q1: { correct: true } });
  assert.deepEqual(TM.createStorage(backend).get('attempts'), { q1: { correct: true } });
});

test('update는 기존 값을 바탕으로 갱신한다', function () {
  var s = memoryStorage();
  s.update('count', function (n) { return n + 1; }, 0);
  s.update('count', function (n) { return n + 1; }, 0);
  assert.equal(s.get('count'), 2);
});

test('손상된 값은 fallback으로 처리하고, 다른 앱의 키는 건드리지 않는다', function () {
  var backend = TM.createMemoryBackend();
  backend.setItem(TM.STORAGE_NAMESPACE + 'broken', '{not json');
  backend.setItem('other-app', 'keep');
  var s = TM.createStorage(backend);
  assert.equal(s.get('broken', 'fb'), 'fb');
  s.set('a', 1);
  s.clearAll();
  assert.deepEqual(s.keys(), []);
  assert.equal(backend.getItem('other-app'), 'keep');
});

test('백업 내보내기 → 가져오기로 기록을 복원한다', function () {
  var source = memoryStorage();
  source.set('profile', { day: 5 });
  source.set('vocabState', { implement: 'known' });
  var backup = JSON.parse(JSON.stringify(source.exportAll()));

  var target = memoryStorage();
  target.set('old', 'remove me');
  target.importAll(backup);
  assert.deepEqual(target.get('profile'), { day: 5 });
  assert.deepEqual(target.get('vocabState'), { implement: 'known' });
  assert.equal(target.get('old'), null);
  assert.throws(function () { target.importAll({ foo: 1 }); }, /백업 파일이 아닙니다/);
});

test('저장 실패(용량 초과 등) 시 false를 돌려준다', function () {
  var backend = TM.createMemoryBackend();
  backend.setItem = function () { throw new Error('QuotaExceededError'); };
  assert.equal(TM.createStorage(backend).set('a', 1), false);
});

test('실제 브라우저 저장소(localStorage)를 사용 중이다', function () {
  assert.ok(TM.storage.isPersistent, 'localStorage를 쓸 수 없어 임시 저장 중입니다');
});
