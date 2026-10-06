// 통합 테스트: 처음 실행부터 하루 학습 완료, 오답·분석, 다음 DAY, 백업·복원까지 실제 화면을 순서대로 거친다

test('처음 실행 → DAY 1 완료 → DAY 2 → 오답노트·분석 → 백업·복원', function () {
  keepHash();
  var storage = TM.createStorage(TM.createMemoryBackend());
  var env = { storage: storage, progress: TM.createProgressService(storage), content: TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary), navigated: [] };
  var c = env.content;
  TM.migrations.run(storage);

  // 1) 처음 실행: 환영 안내
  var dash = mountPage(TM.pages.dashboard, env, {});
  assert.ok(dash.text().indexOf('처음 오셨나요?') >= 0 && dash.text().indexOf('오늘의 학습 시작') >= 0);
  dash.close();

  // 2) DAY 1 단어: 3개 중 1개는 모름
  var words = c.getWords({ day: 1 });
  var v = mountPage(TM.pages.study, env, { day: '1', section: 'vocabulary' });
  words.forEach(function (w, i) { v.click('[data-status="' + (i % 3 === 0 ? 'unknown' : 'known') + '"]'); });
  assert.ok(v.text().indexOf('학습 결과') >= 0);
  v.close();

  // 3) DAY 1 Part 5·6·7: 4문제 중 1문제는 틀리고 원인 기록
  var wrongCount = 0;
  ['part5', 'part6', 'part7'].forEach(function (section) {
    var items = c.getQuestions({ day: 1, part: Number(section.slice(4)) });
    var s = mountPage(TM.pages.study, env, { day: '1', section: section });
    items.forEach(function (q, i) {
      var wrong = i % 4 === 1;
      s.click('[data-letter="' + (wrong ? (q.correct_answer === 'A' ? 'B' : 'A') : q.correct_answer) + '"]');
      if (wrong) { s.click('[data-reason="' + (i % 8 === 1 ? 'vocabulary' : 'long_sentence') + '"]'); wrongCount++; }
      s.click('[data-action="next"]');
    });
    assert.ok(s.text().indexOf('학습 결과') >= 0, section + ' 결과');
    s.close();
  });

  var dp = TM.dayService.computeDayProgress({ content: c, day: 1, attempts: env.progress.getAttempts(), vocabState: env.progress.getVocabState() });
  assert.equal(dp.percent, 100);
  assert.equal(dp.sections[4].total, wrongCount, '틀린 문제가 오답 복습 대상');
  assert.equal(dp.complete, false, '오답 복습 전에는 미완료');

  // 4) 오답 복습 → DAY 1 완료
  var r = mountPage(TM.pages.study, env, { day: '1', section: 'review' });
  for (var i = 0; i < wrongCount; i++) {
    var q = c.getQuestion(env.progress.getAttempts().filter(function (a) { return !a.is_correct; })[i].question_id);
    r.click('[data-letter="' + q.correct_answer + '"]');
    r.click('[data-action="next"]');
  }
  assert.ok(r.text().indexOf('DAY 1 완료') >= 0, '복습을 마치면 DAY 완료 안내');
  r.close();

  // 5) DAY 화면에서 DAY 2 시작
  var day = mountPage(TM.pages.day, env, { day: '1' });
  assert.ok(day.text().indexOf('DAY 1 학습을 모두 마쳤습니다') >= 0);
  day.click('[data-action="advance"]');
  day.close();
  assert.equal(env.progress.getProfile().currentDay, 2);
  assert.equal(env.navigated[env.navigated.length - 1], '/day?day=2');

  // 6) 오답노트: 다시 맞힌 문제는 해결됨
  var notes = TM.wrongNoteService.summarize(TM.wrongNoteService.buildEntries(c, env.progress.getAttempts()));
  assert.deepEqual([notes.open, notes.resolved], [0, wrongCount]);

  // 7) 학습분석·Dashboard: 20문제 이상 → 예상 점수, 모든 숫자가 서로 맞는다
  var attempts = env.progress.getAttempts();
  var stats = TM.statsService.computeDashboard({ attempts: attempts, profile: env.progress.getProfile(), vocabState: env.progress.getVocabState(), today: TM.date.toDateKey(new Date()) });
  assert.ok(stats.estimate.total >= 10 && stats.estimate.total <= 990, '예상 점수 계산');
  assert.equal(stats.totalAttempts, attempts.length);
  assert.equal(stats.streak, 1);
  var summary = TM.analyticsService.buildSummary({ content: c, attempts: attempts, vocabState: env.progress.getVocabState(), profile: env.progress.getProfile(), today: TM.date.toDateKey(new Date()), rangeDays: 7 });
  assert.equal(summary.totals.attempts, stats.totalAttempts, '분석과 Dashboard의 문제 수 일치');
  assert.equal(summary.vocab.reviewTotal, stats.vocab.review, '분석과 Dashboard의 복습 단어 수 일치');
  var page = mountPage(TM.pages.analytics, env, {});
  assert.ok(page.text().indexOf('분석 리포트') >= 0);
  page.close();

  // 8) 백업 → 다른 브라우저에서 복원 → 같은 상태
  var text = TM.backupService.toText(TM.backupService.createBackup(storage));
  var other = TM.createStorage(TM.createMemoryBackend());
  TM.backupService.restore(other, TM.backupService.parse(text));
  var p2 = TM.createProgressService(other);
  var stats2 = TM.statsService.computeDashboard({ attempts: p2.getAttempts(), profile: p2.getProfile(), vocabState: p2.getVocabState(), today: TM.date.toDateKey(new Date()) });
  assert.deepEqual([stats2.totalAttempts, stats2.accuracy, stats2.currentDay, stats2.vocab.known, stats2.estimate.total],
    [stats.totalAttempts, stats.accuracy, 2, stats.vocab.known, stats.estimate.total]);
  restoreHash();
});
