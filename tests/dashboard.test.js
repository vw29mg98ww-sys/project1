// Dashboard 계산 테스트: 날짜, 연속 학습일, 학습 기록 저장, 통계, 예상 점수, 취약 영역 문장

function newProgress(dateStr) {
  var clock = { now: new Date(dateStr) };
  var storage = TM.createStorage(TM.createMemoryBackend());
  var progress = TM.createProgressService(storage, { now: function () { return clock.now; } });
  return { progress: progress, storage: storage, clock: clock };
}

function q(id, part, answer) {
  return { question_id: id, day: 1, part: part, difficulty: 2, question_type: '품사', correct_answer: answer || 'A' };
}

test('날짜 계산: 월말·연말을 넘어가도 정확하다', function () {
  assert.equal(TM.date.addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(TM.date.addDays('2026-01-01', -1), '2025-12-31');
  assert.equal(TM.date.addDays('2028-03-01', -1), '2028-02-29');
});

test('연속 학습일: 오늘 또는 어제부터 끊기지 않은 날 수', function () {
  var days = ['2026-10-01', '2026-10-03', '2026-10-04', '2026-10-05'];
  assert.equal(TM.date.calcStreak(days, '2026-10-05'), 3, '오늘 공부함');
  assert.equal(TM.date.calcStreak(days, '2026-10-06'), 3, '오늘 아직 공부 전이면 어제까지 유지');
  assert.equal(TM.date.calcStreak(days, '2026-10-07'), 0, '어제 쉬었으면 끊김');
  assert.equal(TM.date.calcStreak([], '2026-10-07'), 0);
});

test('한국어 조사: 받침에 따라 와/과를 고른다', function () {
  assert.equal(TM.korean.particle('어휘', '와', '과'), '어휘와');
  assert.equal(TM.korean.particle('문법', '와', '과'), '문법과');
  assert.equal(TM.korean.particle('긴 문장 해석', '와', '과'), '긴 문장 해석과');
});

test('문제 풀이 기록이 저장되고 학습 날짜가 기록된다', function () {
  var t = newProgress('2026-10-06T09:00:00');
  var rec = t.progress.recordAttempt(q('q1', 5, 'B'), 'C', 41234);
  assert.equal(rec.is_correct, false);
  assert.equal(rec.time_ms, 41234);
  assert.equal(rec.selected, 'C');
  t.progress.setWrongReason(rec.id, 'vocabulary');

  // 다음 날 다시 접속(같은 저장소로 새 서비스 생성)
  t.clock.now = new Date('2026-10-07T20:00:00');
  var again = TM.createProgressService(t.storage, { now: function () { return t.clock.now; } });
  assert.equal(again.getAttempts().length, 1);
  assert.equal(again.getAttempts()[0].wrong_reason, 'vocabulary');
  again.recordAttempt(q('q1', 5, 'B'), 'B', 1000);
  assert.deepEqual(again.getProfile().studyDates, ['2026-10-06', '2026-10-07']);
  assert.equal(again.getProfile().startedAt, '2026-10-06');
});

test('학습 기록이 없을 때 Dashboard 숫자', function () {
  var t = newProgress('2026-10-06T09:00:00');
  var s = TM.statsService.computeDashboard({ attempts: [], profile: t.progress.getProfile(), vocabState: {}, today: '2026-10-06' });
  assert.ok(s.isEmpty);
  assert.equal(s.currentDay, 1);
  assert.equal(s.accuracy, null);
  assert.equal(s.parts[5].accuracy, null);
  assert.equal(s.estimate.total, null);
  assert.equal(s.estimate.needed, 20);
});

test('Dashboard 통계: 정답률, Part별, 오답노트, 단어', function () {
  var t = newProgress('2026-10-06T09:00:00');
  var p = t.progress;
  p.recordAttempt(q('a', 5), 'A', 1000);   // 정답
  p.recordAttempt(q('b', 5), 'B', 1000);   // 오답
  p.recordAttempt(q('c', 7), 'C', 1000);   // 오답
  p.recordAttempt(q('c', 7), 'A', 1000);   // 다시 풀어 정답 → 오답노트에서 빠짐
  p.setVocabStatus('implement', 'known');
  p.setVocabStatus('eligible', 'confused');
  p.setVocabStatus('Submit', 'unknown');
  var s = TM.statsService.computeDashboard({ attempts: p.getAttempts(), profile: p.getProfile(), vocabState: p.getVocabState(), today: '2026-10-06' });
  assert.equal(s.totalAttempts, 4);
  assert.equal(s.accuracy, 50);
  assert.equal(s.wrong, 2);
  assert.equal(s.parts[5].accuracy, 50);
  assert.equal(s.parts[7].accuracy, 50);
  assert.equal(s.parts[6].total, 0);
  assert.equal(s.wrongNote, 1, '마지막 풀이가 오답인 문제만');
  assert.deepEqual(s.vocab, { known: 1, review: 2 });
  assert.equal(s.streak, 1);
  assert.ok(s.studiedToday);
});

function makeAttempts(part, total, correct, reasons) {
  var list = [];
  for (var i = 0; i < total; i++) {
    var ok = i < correct;
    list.push({ question_id: part + '-' + i, part: part, is_correct: ok, wrong_reason: ok ? null : (reasons ? reasons[(i - correct) % reasons.length] : null) });
  }
  return list;
}

test('예상 점수: 20문제 미만이면 계산하지 않는다', function () {
  var r = TM.scoreService.estimateScore(makeAttempts(5, 19, 19));
  assert.equal(r.total, null);
  assert.equal(r.needed, 1);
});

test('예상 점수: 정답률이 높을수록 높고, 범위를 벗어나지 않는다', function () {
  var all = TM.scoreService.estimateScore(makeAttempts(5, 40, 40));
  var none = TM.scoreService.estimateScore(makeAttempts(5, 40, 0));
  var ninety = TM.scoreService.estimateScore(makeAttempts(5, 40, 36));
  var seventy = TM.scoreService.estimateScore(makeAttempts(5, 40, 28));
  assert.equal(all.total, 990);
  assert.equal(none.total, 10);
  assert.equal(ninety.total, 900, '정답률 90% → 900점');
  assert.ok(seventy.total < ninety.total);
  assert.equal(ninety.total % 5, 0);
});

test('예상 점수: 실제 RC 구성 비중으로 Part별 정답률을 반영한다', function () {
  // Part 5 100%, Part 7 50% → 비중 30:54로 평균 ≈ 67.9%
  var r = TM.scoreService.estimateScore(makeAttempts(5, 20, 20).concat(makeAttempts(7, 20, 10)));
  assert.equal(r.accuracy, 68);
});

test('취약 영역 문장: 상위 두 원인이 비슷하면 함께 말한다', function () {
  var reasons = ['vocabulary', 'vocabulary', 'vocabulary', 'vocabulary', 'long_sentence', 'long_sentence', 'long_sentence', 'grammar'];
  var w = TM.statsService.analyzeWrongReasons(makeAttempts(5, 18, 10, reasons));
  assert.equal(w.tagged, 8);
  assert.equal(w.distribution[0].id, 'vocabulary');
  assert.equal(TM.insightService.weaknessMessage(w), '현재 가장 취약한 영역은 어휘와 긴 문장 해석입니다.');
});

test('취약 영역 문장: 한 원인이 압도적이면 하나만, 기록이 적으면 표시하지 않는다', function () {
  var one = TM.statsService.analyzeWrongReasons(makeAttempts(5, 20, 10, ['grammar', 'grammar', 'grammar', 'grammar', 'grammar', 'grammar', 'grammar', 'grammar', 'careless', 'inference']));
  assert.equal(TM.insightService.weaknessMessage(one), '현재 가장 취약한 영역은 문법입니다.');
  var few = TM.statsService.analyzeWrongReasons(makeAttempts(5, 10, 6, ['grammar']));
  assert.equal(few.enough, false);
  assert.equal(TM.insightService.weaknessMessage(few), null);
});

test('학습 진단: 가장 낮은 Part와 복습 안내를 만든다', function () {
  var attempts = makeAttempts(5, 10, 9).concat(makeAttempts(7, 10, 6));
  var stats = TM.statsService.computeDashboard({
    attempts: attempts,
    profile: { currentDay: 2, studyDates: ['2026-10-05'] },
    vocabState: { implement: { status: 'unknown' } },
    today: '2026-10-06'
  });
  var messages = TM.insightService.buildDashboardInsights(stats).map(function (i) { return i.message; });
  assert.ok(messages.indexOf('Part 7 정답률이 60%로 가장 낮습니다.') >= 0, messages.join(' / '));
  assert.ok(messages.indexOf('복습할 단어가 1개 있습니다.') >= 0);
  assert.ok(messages.indexOf('오늘 학습하면 연속 학습 2일이 됩니다.') >= 0);
});

test('Dashboard 화면에 주요 항목이 모두 표시된다', function () {
  var t = newProgress('2026-10-06T09:00:00');
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  var html = TM.pages.dashboard.render({ content: content, storage: t.storage, progress: t.progress });
  ['목표 900', '현재 예상 점수', '오늘의 학습 시작', '현재 DAY', '연속 학습일', '누적 문제 수', '전체 정답률',
   'Part 5 정답률', 'Part 6 정답률', 'Part 7 정답률', '암기한 단어', '복습할 단어', '누적 오답 수'].forEach(function (label) {
    assert.ok(html.indexOf(label) >= 0, label + ' 항목이 없습니다');
  });
});
