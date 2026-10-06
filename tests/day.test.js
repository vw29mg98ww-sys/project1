// DAY 학습 시스템 테스트: 진행률, 오답 복습, 다음 학습, 이어서 학습 위치, DAY 이동

// 테스트용 작은 데이터: DAY 1 = 단어 2 · Part 5 문제 2 · Part 7 문제 1, DAY 2 = Part 5 문제 1
function dayContent() {
  function q(id, day, part, extra) {
    return Object.assign({ question_id: id, day: day, part: part, difficulty: 1, passage_id: null, question: 'Q',
      choices: ['a', 'b', 'c', 'd'], correct_answer: 'A', explanation: { summary: 's' }, vocabulary: [], question_type: '' }, extra || {});
  }
  return TM.dataService.buildContent({
    passages: [{ passage_id: 'p1', type: 'single', documents: [{ html: '<p>x</p>' }] }],
    questions: [q('d1-a', 1, 5), q('d1-b', 1, 5), q('d1-c', 1, 7, { passage_id: 'p1' }), q('d2-a', 2, 5)]
  }, { words: [{ word: 'submit', meaning: '제출하다', day: 1 }, { word: 'Refund', meaning: '환불', day: 1 }] });
}

function setup() {
  var storage = TM.createStorage(TM.createMemoryBackend());
  var clock = { now: new Date('2026-10-06T09:00:00') };
  return { storage: storage, progress: TM.createProgressService(storage, { now: function () { return clock.now; } }), content: dayContent() };
}

function progressOf(t, day) {
  return TM.dayService.computeDayProgress({ content: t.content, day: day, attempts: t.progress.getAttempts(), vocabState: t.progress.getVocabState() });
}

function section(p, id) { return p.sections.filter(function (s) { return s.id === id; })[0]; }

test('DAY 진행률: 시작 전에는 0%, 하루 구성은 단어·Part 5·6·7·오답 복습', function () {
  var t = setup();
  var p = progressOf(t, 1);
  assert.deepEqual(p.sections.map(function (s) { return s.id; }), ['vocabulary', 'part5', 'part6', 'part7', 'review']);
  assert.equal(p.status, 'not_started');
  assert.equal(p.percent, 0);
  assert.equal(p.mainTotal, 5, '단어 2 + 문제 3');
  assert.equal(section(p, 'part6').total, 0);
  assert.equal(TM.dayService.nextSection(p).id, 'vocabulary');
});

test('DAY 진행률: 단어 상태 표시와 문제 풀이가 반영된다', function () {
  var t = setup();
  t.progress.setVocabStatus('submit', 'known');
  t.progress.setVocabStatus('refund', 'unknown'); // 대소문자 달라도 같은 단어
  t.progress.recordAttempt(t.content.getQuestion('d1-a'), 'A', 1000);
  t.progress.recordAttempt(t.content.getQuestion('d1-a'), 'A', 1000); // 같은 문제 두 번 → 1문제로 계산
  var p = progressOf(t, 1);
  assert.equal(section(p, 'vocabulary').done, 2);
  assert.ok(section(p, 'vocabulary').complete);
  assert.equal(section(p, 'part5').done, 1);
  assert.equal(p.mainDone, 3);
  assert.equal(p.percent, 60);
  assert.equal(p.status, 'in_progress');
  assert.equal(TM.dayService.nextSection(p).id, 'part5', '단어를 끝냈으니 다음은 Part 5');
  assert.equal(progressOf(t, 2).percent, 0, '다른 DAY에는 영향 없음');
});

test('오답 복습: 처음 틀린 문제가 대상이고, 다시 풀면 완료된다', function () {
  var t = setup();
  t.progress.setVocabStatus('submit', 'known');
  t.progress.setVocabStatus('refund', 'known');
  t.progress.recordAttempt(t.content.getQuestion('d1-a'), 'A', 1000); // 정답
  t.progress.recordAttempt(t.content.getQuestion('d1-b'), 'C', 1000); // 오답
  t.progress.recordAttempt(t.content.getQuestion('d1-c'), 'D', 1000); // 오답

  var p = progressOf(t, 1);
  assert.equal(p.percent, 100, '단어·문제는 모두 한 번씩 풀었음');
  assert.equal(section(p, 'review').total, 2);
  assert.equal(section(p, 'review').done, 0);
  assert.equal(p.complete, false, '오답 복습이 남아 있으면 DAY 완료가 아님');
  assert.equal(TM.dayService.nextSection(p).id, 'review');
  assert.deepEqual(TM.dayService.getSectionItems(t.content, 1, 'review', t.progress.getAttempts()).map(function (q) { return q.question_id; }), ['d1-b', 'd1-c']);

  t.progress.recordAttempt(t.content.getQuestion('d1-b'), 'A', 1000);
  t.progress.recordAttempt(t.content.getQuestion('d1-c'), 'B', 1000); // 다시 틀려도 복습은 한 것
  p = progressOf(t, 1);
  assert.equal(section(p, 'review').done, 2);
  assert.ok(p.complete);
  assert.equal(p.status, 'complete');
  assert.equal(TM.dayService.nextSection(p), null);
});

test('이어서 학습: 마지막 위치를 저장하고 다시 접속해도 불러온다', function () {
  var t = setup();
  assert.equal(t.progress.getLastPosition(), null);
  t.progress.saveLastPosition(1, 'part5', 1);
  var reopened = TM.createProgressService(t.storage); // 브라우저를 닫았다 연 상황
  var pos = reopened.getLastPosition();
  assert.equal(pos.day, 1);
  assert.equal(pos.section, 'part5');
  assert.equal(pos.index, 1);
  assert.ok(TM.dayService.isResumable(pos, progressOf(t, 1)));
  assert.equal(TM.dayService.isResumable(pos, progressOf(t, 2)), false, '다른 DAY에서는 이어서 하기 대상 아님');
  assert.equal(TM.dayService.studyLink(1, 'part5', 1), '#/study?day=1&section=part5&q=1');
});

test('이어서 학습: 해당 영역을 끝냈으면 더 이상 이어서 하기로 보여주지 않는다', function () {
  var t = setup();
  t.progress.saveLastPosition(1, 'part5', 1);
  t.progress.recordAttempt(t.content.getQuestion('d1-a'), 'A', 1000);
  t.progress.recordAttempt(t.content.getQuestion('d1-b'), 'A', 1000);
  assert.equal(TM.dayService.isResumable(t.progress.getLastPosition(), progressOf(t, 1)), false);
  t.progress.clearLastPosition();
  assert.equal(t.progress.getLastPosition(), null);
});

test('현재 DAY 변경이 저장되고 다른 기록은 유지된다', function () {
  var t = setup();
  t.progress.recordAttempt(t.content.getQuestion('d1-a'), 'A', 1000);
  t.progress.setCurrentDay(2);
  var profile = TM.createProgressService(t.storage).getProfile();
  assert.equal(profile.currentDay, 2);
  assert.equal(profile.studyDates.length, 1);
});

function renderDay(t, params) {
  return TM.pages.day.render({ content: t.content, storage: t.storage, progress: t.progress }, params);
}

test('DAY 목록 화면: 모든 DAY와 진행률·현재 DAY 표시', function () {
  var t = setup();
  t.progress.recordAttempt(t.content.getQuestion('d1-a'), 'A', 1000);
  var html = renderDay(t, {});
  assert.ok(html.indexOf('DAY 1') >= 0 && html.indexOf('DAY 2') >= 0);
  assert.ok(html.indexOf('진행 중') >= 0);
  assert.ok(html.indexOf('현재') >= 0);
});

test('DAY 상세 화면: 영역별 진행률과 이어서 학습 버튼', function () {
  var t = setup();
  t.progress.recordAttempt(t.content.getQuestion('d1-a'), 'A', 1000);
  t.progress.saveLastPosition(1, 'part5', 1);
  var html = renderDay(t, { day: '1' });
  ['Vocabulary', 'Part 5', 'Part 6', 'Part 7', '오답 복습', '전체 진행률', '1 / 2', '이어서 학습', 'section=part5&amp;q=1'].forEach(function (text) {
    assert.ok(html.indexOf(text) >= 0 || html.indexOf(text.replace('&amp;', '&')) >= 0, text + ' 없음');
  });
});

test('DAY 상세 화면: 완료한 현재 DAY에서 다음 DAY 시작 버튼', function () {
  var t = setup();
  ['submit', 'refund'].forEach(function (w) { t.progress.setVocabStatus(w, 'known'); });
  ['d1-a', 'd1-b', 'd1-c'].forEach(function (id) { t.progress.recordAttempt(t.content.getQuestion(id), 'A', 1000); });
  var html = renderDay(t, { day: '1' });
  assert.ok(html.indexOf('DAY 1 학습을 모두 마쳤습니다') >= 0);
  assert.ok(html.indexOf('data-action="advance" data-day="2"') >= 0);
  assert.ok(renderDay(t, { day: '9' }).indexOf('아직 학습 데이터가 없습니다') >= 0);
});
