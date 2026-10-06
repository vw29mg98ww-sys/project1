// 오답노트 테스트: 오답 모으기, 해결 상태, 원인, 필터, 원인 기록, 필터한 오답 다시 풀기

function nEnv() {
  var storage = TM.createStorage(TM.createMemoryBackend());
  var t = 0;
  // 풀이 시각이 순서대로 쌓이도록 1분씩 증가하는 시계
  var progress = TM.createProgressService(storage, { now: function () { t++; return new Date(Date.UTC(2026, 9, 6, 0, t)); } });
  return { storage: storage, progress: progress, content: TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary), navigated: [] };
}
function wrongOf(q) { return q.correct_answer === 'A' ? 'B' : 'A'; }
function ids(entries) { return entries.map(function (e) { return e.question.question_id; }); }

test('오답 모으기: 틀린 문제만, 최근에 틀린 순서, 다시 맞히면 해결됨', function () {
  var env = nEnv();
  var c = env.content;
  var a = c.getQuestion('d1-p5-01'), b = c.getQuestion('d1-p5-02'), d = c.getQuestion('d1-p7-01');
  env.progress.recordAttempt(a, wrongOf(a), 1000);
  env.progress.recordAttempt(b, b.correct_answer, 1000);   // 맞힌 문제는 오답노트에 없음
  env.progress.recordAttempt(d, wrongOf(d), 1000);
  env.progress.recordAttempt(a, a.correct_answer, 1000);   // 다시 맞힘 → 해결됨
  var entries = TM.wrongNoteService.buildEntries(c, env.progress.getAttempts());
  assert.deepEqual(ids(entries), ['d1-p7-01', 'd1-p5-01']);
  assert.equal(entries[1].resolved, true);
  assert.equal(entries[1].wrongCount, 1);
  var s = TM.wrongNoteService.summarize(entries);
  assert.deepEqual([s.open, s.resolved, s.noReason], [1, 1, 1]);
  assert.deepEqual(ids(TM.wrongNoteService.filterEntries(entries, {})), ['d1-p7-01'], '기본은 미해결만');
  assert.equal(TM.wrongNoteService.filterEntries(entries, { status: 'all' }).length, 2);
});

test('오답 원인: 최근 오답의 원인, 없으면 이전 오답에서 고른 원인', function () {
  var env = nEnv();
  var q = env.content.getQuestion('d1-p5-05');
  var first = env.progress.recordAttempt(q, wrongOf(q), 1000);
  env.progress.setWrongReason(first.id, 'grammar');
  env.progress.recordAttempt(q, wrongOf(q), 1000); // 두 번째 오답은 원인 미선택
  var e = TM.wrongNoteService.buildEntries(env.content, env.progress.getAttempts())[0];
  assert.equal(e.reason, 'grammar');
  assert.equal(e.wrongCount, 2);
});

test('필터: DAY · Part · 유형 · 어휘 오답 · 긴 문장 오답 · 원인 미선택', function () {
  var env = nEnv();
  var c = env.content;
  var list = [['d1-p5-06', 'vocabulary'], ['d2-p5-09', 'long_sentence'], ['d3-p7-02', 'long_sentence'], ['d1-p6-03', null]];
  list.forEach(function (x) {
    var q = c.getQuestion(x[0]);
    var rec = env.progress.recordAttempt(q, wrongOf(q), 1000);
    if (x[1]) env.progress.setWrongReason(rec.id, x[1]);
  });
  var all = TM.wrongNoteService.buildEntries(c, env.progress.getAttempts());
  var f = function (filter) { return ids(TM.wrongNoteService.filterEntries(all, filter)).sort(); };
  assert.deepEqual(f({ reason: 'vocabulary' }), ['d1-p5-06']);
  assert.deepEqual(f({ reason: 'long_sentence' }), ['d2-p5-09', 'd3-p7-02']);
  assert.deepEqual(f({ reason: 'none' }), ['d1-p6-03']);
  assert.deepEqual(f({ day: '1' }), ['d1-p5-06', 'd1-p6-03']);
  assert.deepEqual(f({ part: '5' }), ['d1-p5-06', 'd2-p5-09']);
  assert.deepEqual(f({ type: '관계사' }), ['d1-p5-06', 'd2-p5-09']);
  assert.deepEqual(f({ part: '5', reason: 'long_sentence' }), ['d2-p5-09']);
  assert.deepEqual(TM.wrongNoteService.typesIn(all), ['관계사', '문장 삽입', '정보 연결']);
});

test('오답노트 화면: 문제·내 답·정답·해설·원인·관련 단어를 보여준다', function () {
  var env = nEnv();
  var q = env.content.getQuestion('d1-p5-03'); // 관련 단어 submit, expense report
  env.progress.recordAttempt(q, 'C', 1000);
  var page = mountPage(TM.pages.wrongNotes, env, {});
  var text = page.text();
  ['DAY 1 · Part 5 · Question 3', '미해결', q.question, '내 답', '(C) on', '정답', '(A) by', q.explanation.summary, '오답 원인', '관련 단어', 'submit', '틀림 1회'].forEach(function (t) {
    assert.ok(text.indexOf(t) >= 0, t + ' 없음');
  });
  // 그 자리에서 원인 기록
  page.click('[data-action="reason"][data-reason="vocabulary"]');
  assert.equal(env.progress.getAttempts()[0].wrong_reason, 'vocabulary');
  assert.ok(page.root.querySelector('.note-card [data-reason="vocabulary"]').classList.contains('is-selected'));
  page.close();
});

test('오답노트 화면: 빠른 필터와 주소의 필터, 빈 상태', function () {
  var env = nEnv();
  var empty = mountPage(TM.pages.wrongNotes, env, {});
  assert.ok(empty.text().indexOf('아직 틀린 문제가 없습니다') >= 0);
  empty.close();
  ['d1-p5-01', 'd1-p7-02'].forEach(function (id) { var q = env.content.getQuestion(id); env.progress.recordAttempt(q, wrongOf(q), 1000); });
  var page = mountPage(TM.pages.wrongNotes, env, { part: '7' });
  assert.equal(page.root.querySelectorAll('.note-card').length, 1);
  page.click('[data-action="quick"][data-reason="none"]');
  assert.equal(page.root.querySelectorAll('.note-card').length, 1, '원인 미선택 + Part 7');
  page.click('[data-action="quick"][data-reason="vocabulary"]');
  assert.ok(page.text().indexOf('조건에 맞는 오답이 없습니다') >= 0);
  page.close();
});

test('필터한 오답 다시 풀기: 연습 세트를 만들고, 끝나면 오답노트로 돌아온다', function () {
  keepHash();
  var env = nEnv();
  ['d1-p5-01', 'd1-p6-01', 'd1-p6-03', 'd2-p5-01'].forEach(function (id) { var q = env.content.getQuestion(id); env.progress.recordAttempt(q, wrongOf(q), 1000); });
  var page = mountPage(TM.pages.wrongNotes, env, { day: '1' });
  page.click('[data-action="retry-filtered"]');
  page.close();
  var set = env.progress.getPracticeSession();
  assert.equal(set.ids.length, 3, 'DAY 1 오답만');
  assert.equal(set.ids[1], 'd1-p6-01', '같은 지문 문제는 묶어서');
  assert.equal(set.ids[2], 'd1-p6-03');
  assert.equal(set.returnTo, '/wrong-notes?day=1', '돌아올 때 필터 유지');
  assert.equal(env.navigated[0], '/study?mode=practice&sid=' + set.id);

  var study = mountPage(TM.pages.study, env, { mode: 'practice', sid: set.id });
  set.ids.forEach(function (id) {
    study.click('[data-letter="' + env.content.getQuestion(id).correct_answer + '"]');
    study.click('[data-action="next"]');
  });
  assert.ok(study.text().indexOf('오답노트 화면으로') >= 0);
  assert.ok(study.root.querySelector('a[href="#/wrong-notes?day=1"]'));
  study.close();
  var entries = TM.wrongNoteService.buildEntries(env.content, env.progress.getAttempts());
  var s = TM.wrongNoteService.summarize(entries);
  assert.deepEqual([s.open, s.resolved], [1, 3], '다시 맞힌 3문제는 해결됨');
  restoreHash();
});

test('한 문제 다시 풀기와 Dashboard 오답 안내 링크', function () {
  var env = nEnv();
  var q = env.content.getQuestion('d2-p7-01');
  env.progress.recordAttempt(q, wrongOf(q), 1000);
  var page = mountPage(TM.pages.wrongNotes, env, {});
  page.click('[data-action="retry-one"]');
  page.close();
  assert.deepEqual(env.progress.getPracticeSession().ids, ['d2-p7-01']);
  var stats = TM.statsService.computeDashboard({ attempts: env.progress.getAttempts(), profile: env.progress.getProfile(), vocabState: {}, today: '2026-10-06' });
  var note = TM.insightService.buildDashboardInsights(stats).filter(function (i) { return i.id === 'wrong-note'; })[0];
  assert.equal(note.href, '#/wrong-notes');
  assert.equal(stats.wrongNote, TM.wrongNoteService.summarize(TM.wrongNoteService.buildEntries(env.content, env.progress.getAttempts())).open, 'Dashboard 오답 수 = 미해결 수');
});
