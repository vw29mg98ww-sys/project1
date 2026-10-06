// 학습 기록 보관 테스트: 저장 공간, 저장 실패 알림, 데이터 형식 변환, 백업·복원, 백업 알림

function freshStorage() { return TM.createStorage(TM.createMemoryBackend()); }

test('저장 공간 사용량을 계산한다', function () {
  var s = freshStorage();
  assert.equal(s.usage().bytes, 0);
  s.set('attempts', [{ a: 1 }]);
  var u1 = s.usage();
  assert.ok(u1.bytes > 0);
  assert.ok(u1.byKey.attempts > 0);
  s.set('attempts', [{ a: 1 }, { a: 2 }, { a: 3 }]);
  assert.ok(s.usage().bytes > u1.bytes);
  assert.equal(u1.quotaBytes, 5 * 1024 * 1024);
});

test('저장에 실패하면 등록한 알림 함수가 호출된다', function () {
  var backend = TM.createMemoryBackend();
  backend.setItem = function () { throw new Error('QuotaExceededError'); };
  var s = TM.createStorage(backend);
  var called = null;
  s.setErrorHandler(function (err, key) { called = key; });
  assert.equal(s.set('attempts', []), false);
  assert.equal(called, 'attempts');
});

test('형식 변환: 새로 시작하면 최신 형식으로 표시한다', function () {
  var s = freshStorage();
  var r = TM.migrations.run(s, { migrations: [], targetVersion: 3 });
  assert.equal(r.from, 3);
  assert.deepEqual(r.applied, []);
  assert.equal(s.get('meta').schemaVersion, 3);
});

test('형식 변환: 기존 기록은 버전 순서대로 한 번씩만 변환한다', function () {
  var s = freshStorage();
  s.set('attempts', [{ question_id: 'q1' }]); // 형식 표시(meta)가 없는 예전 기록 = 버전 1
  var log = [];
  var migrations = [
    { version: 3, migrate: function (st) { log.push(3); st.update('attempts', function (l) { return l.map(function (a) { return Object.assign({ v3: true }, a); }); }, []); } },
    { version: 2, migrate: function (st) { log.push(2); st.update('attempts', function (l) { return l.map(function (a) { return Object.assign({ v2: true }, a); }); }, []); } }
  ];
  var r = TM.migrations.run(s, { migrations: migrations, targetVersion: 3 });
  assert.deepEqual(log, [2, 3]);
  assert.deepEqual(r.applied, [2, 3]);
  assert.deepEqual(s.get('attempts')[0], { v3: true, v2: true, question_id: 'q1' });
  TM.migrations.run(s, { migrations: migrations, targetVersion: 3 }); // 다시 실행해도
  assert.deepEqual(log, [2, 3], '이미 변환한 것은 다시 하지 않는다');
});

test('형식 변환: 더 새로운 앱의 기록이면 손대지 않고 알린다', function () {
  var s = freshStorage();
  s.set('meta', { schemaVersion: 5 });
  s.set('attempts', [1]);
  var r = TM.migrations.run(s, { migrations: [], targetVersion: 1 });
  assert.ok(r.newerThanApp);
  assert.equal(s.get('meta').schemaVersion, 5);
});

test('백업 파일: 이름, 마지막 백업 시각 기록, 내용 요약', function () {
  var s = freshStorage();
  var p = TM.createProgressService(s, { now: function () { return new Date('2026-10-06T10:00:00'); } });
  var q = TM_DATA.questions.questions[0];
  p.recordAttempt(q, q.correct_answer, 12000);
  p.setVocabStatus('submit', 'known');
  p.setCurrentDay(2);
  assert.equal(TM.backupService.fileName(new Date('2026-10-06T10:00:00')), 'toeic900-backup-2026-10-06.json');
  assert.equal(TM.backupService.lastBackupAt(s), null);
  var backup = TM.backupService.createBackup(s, new Date('2026-10-06T11:00:00'));
  assert.equal(TM.backupService.lastBackupAt(s), new Date('2026-10-06T11:00:00').toISOString());
  var sum = TM.backupService.summarize(backup);
  assert.deepEqual([sum.attempts, sum.words, sum.studyDays, sum.currentDay], [1, 1, 1, 2]);
});

test('백업 파일 읽기: 잘못된 파일은 이해하기 쉬운 오류', function () {
  assert.throws(function () { TM.backupService.parse('{not json'); }, /파일을 읽을 수 없습니다/);
  assert.throws(function () { TM.backupService.parse('{"app":"other","data":{}}'); }, /백업 파일이 아닙니다/);
  var newer = JSON.stringify({ app: TM.APP_ID, schema_version: 99, data: {} });
  assert.throws(function () { TM.backupService.restore(freshStorage(), TM.backupService.parse(newer)); }, /더 새로운 버전/);
});

test('백업 → 다른 브라우저에서 복원하면 모든 학습 기록이 그대로 돌아온다', function () {
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  var source = freshStorage();
  var p1 = TM.createProgressService(source, { now: function () { return new Date('2026-10-06T10:00:00'); } });
  var qs = content.getQuestions({ day: 1, part: 5 });
  var rec = p1.recordAttempt(qs[0], qs[0].correct_answer === 'A' ? 'B' : 'A', 30000);
  p1.setWrongReason(rec.id, 'grammar');
  p1.recordAttempt(qs[1], qs[1].correct_answer, 20000);
  p1.flagWordsForReview(['trade show'], qs[0].question_id);
  p1.setVocabStatus('submit', 'confused');
  p1.saveLastPosition(1, 'part5', 2);
  p1.setCurrentDay(1);
  var text = TM.backupService.toText(TM.backupService.createBackup(source));

  var target = freshStorage();
  target.set('attempts', [{ question_id: 'old' }]); // 복원하면 덮어써진다
  TM.backupService.restore(target, TM.backupService.parse(text));
  var p2 = TM.createProgressService(target);
  assert.deepEqual(p2.getAttempts(), p1.getAttempts());
  assert.equal(p2.getAttempts()[0].wrong_reason, 'grammar');
  assert.deepEqual(p2.getVocabState(), p1.getVocabState());
  assert.deepEqual(p2.getProfile(), p1.getProfile());
  assert.deepEqual(p2.getLastPosition(), p1.getLastPosition());
  assert.ok(target.get('backupInfo').lastRestoredAt);
  assert.equal(target.get('meta').schemaVersion, target.SCHEMA_VERSION);

  var today = '2026-10-06';
  var a = TM.statsService.computeDashboard({ attempts: p1.getAttempts(), profile: p1.getProfile(), vocabState: p1.getVocabState(), today: today });
  var b = TM.statsService.computeDashboard({ attempts: p2.getAttempts(), profile: p2.getProfile(), vocabState: p2.getVocabState(), today: today });
  assert.deepEqual([b.totalAttempts, b.accuracy, b.wrongNote, b.vocab.review, b.streak], [a.totalAttempts, a.accuracy, a.wrongNote, a.vocab.review, a.streak]);
});

test('백업 알림: 20문제 이상 풀었는데 백업이 없거나 7일이 지났으면 안내', function () {
  function insightsFor(lastBackupAt, count) {
    var attempts = [];
    for (var i = 0; i < count; i++) attempts.push({ question_id: 'q' + i, part: 5, is_correct: true });
    var stats = TM.statsService.computeDashboard({ attempts: attempts, profile: { currentDay: 1, studyDates: ['2026-10-10'] }, vocabState: {}, today: '2026-10-10', lastBackupAt: lastBackupAt });
    return TM.insightService.buildDashboardInsights(stats).filter(function (i) { return i.id === 'backup'; });
  }
  assert.equal(insightsFor(null, 5).length, 0, '기록이 적으면 알리지 않음');
  assert.match(insightsFor(null, 20)[0].message, /아직 백업하지 않았습니다/);
  assert.match(insightsFor('2026-10-01T09:00:00', 20)[0].message, /9일이 지났습니다/);
  assert.equal(insightsFor('2026-10-08T09:00:00', 20).length, 0, '최근에 백업했으면 알리지 않음');
  assert.equal(insightsFor(null, 20)[0].href, '#/settings');
});

test('설정 화면에 백업·복원·저장 공간·초기화가 표시된다', function () {
  var s = freshStorage();
  var html = TM.pages.settings.render({ storage: s, progress: TM.createProgressService(s) });
  ['학습 기록 백업', '백업 파일 내려받기', '백업 불러오기', '저장 공간', '영구 보관', '모든 학습 기록 지우기', '아직 백업한 적이 없습니다'].forEach(function (t) {
    assert.ok(html.indexOf(t) >= 0, t + ' 없음');
  });
});

test('같은 알림은 한 번만 표시한다', function () {
  var a = TM.components.toast('테스트 알림 중복 확인', 'error');
  var b = TM.components.toast('테스트 알림 중복 확인', 'error');
  assert.equal(a, b);
  assert.equal(document.querySelectorAll('.toast[data-message="테스트 알림 중복 확인"]').length, 1);
  a.remove();
});
