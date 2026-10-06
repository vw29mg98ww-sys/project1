// 문제 풀이 시스템 테스트: 세션 시작 위치, 채점·저장, 해설, 오답 원인, 복습 단어, 이어서 풀기, 결과 요약

function studyEnv() {
  var storage = TM.createStorage(TM.createMemoryBackend());
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  return { storage: storage, content: content, progress: TM.createProgressService(storage) };
}

// 실제 학습 화면을 테스트용 영역에 띄운다
function mountStudy(env, params) {
  var root = document.createElement('div');
  root.style.display = 'none';
  document.body.appendChild(root);
  var ctx = { content: env.content, storage: env.storage, progress: env.progress };
  root.innerHTML = TM.pages.study.render(ctx, params);
  var cleanup = TM.pages.study.mount(root, ctx, params);
  return {
    root: root,
    text: function () { return root.textContent; },
    click: function (selector) { var el = root.querySelector(selector); assert.ok(el, selector + ' 버튼이 없습니다'); el.click(); },
    close: function () { if (cleanup) cleanup(); root.remove(); }
  };
}

var originalHash;
function keepHash() { originalHash = location.hash; }
function restoreHash() { try { history.replaceState(null, '', originalHash || '#'); } catch (e) { /* 무시 */ } }

test('모든 문제에 자세한 해설(근거·구조·오답 이유·주의점)이 있다', function () {
  TM_DATA.questions.questions.forEach(function (q) {
    var ex = q.explanation;
    assert.ok(ex.evidence && ex.tip && ex.structure, q.question_id + ' 해설 항목 누락');
    TM.constants.CHOICE_LETTERS.filter(function (l) { return l !== q.correct_answer; }).forEach(function (l) {
      assert.ok(ex.wrong_choices && ex.wrong_choices[l], q.question_id + ' 보기 ' + l + '가 왜 틀렸는지 설명 없음');
    });
  });
});

test('wrong_choices에 정답이나 잘못된 키가 있으면 오류', function () {
  var data = JSON.parse(JSON.stringify(TM_DATA.questions));
  var q = data.questions[0];
  q.explanation.wrong_choices[q.correct_answer] = 'x';
  q.explanation.wrong_choices.E = 'x';
  var text = TM.validateData(data, TM_DATA.vocabulary).errors.join('\n');
  assert.match(text, /wrong_choices에 정답/);
  assert.match(text, /"A"~"D"여야/);
});

test('세션 시작 위치: 안 푼 첫 문제, 이어서 학습 위치, 잘못된 위치는 무시', function () {
  var env = studyEnv();
  var items = env.content.getQuestions({ day: 1, part: 5 });
  assert.equal(TM.studyService.buildSession(env.content, 1, 'part5', [], undefined).startIndex, 0);
  env.progress.recordAttempt(items[0], 'A', 1000);
  env.progress.recordAttempt(items[1], 'A', 1000);
  var attempts = env.progress.getAttempts();
  assert.equal(TM.studyService.buildSession(env.content, 1, 'part5', attempts, undefined).startIndex, 2);
  assert.equal(TM.studyService.buildSession(env.content, 1, 'part5', attempts, '5').startIndex, 5);
  assert.equal(TM.studyService.buildSession(env.content, 1, 'part5', attempts, '99').startIndex, 2);
  assert.equal(TM.studyService.buildSession(env.content, 1, 'vocabulary', attempts), null, '단어 영역은 STEP 7');
});

test('Part 6 빈칸 번호를 찾아 지문에서 강조한다', function () {
  assert.equal(TM.studyService.blankNumber('빈칸 (3)에 들어갈 가장 알맞은 문장은?'), 3);
  assert.equal(TM.studyService.blankNumber('What is being advertised?'), null);
  var env = studyEnv();
  var html = TM.components.renderPassage(env.content.getPassage('d1-p6-psg1'), 2);
  assert.ok(html.indexOf('<span class="blank is-active">(2)</span>') >= 0);
  assert.ok(html.indexOf('<span class="blank">(1)</span>') >= 0);
});

test('이중 지문은 문서마다 번호를 붙여 보여준다', function () {
  var html = TM.components.renderPassage({ passage_id: 'x', type: 'double', documents: [{ title: 'E-mail', html: '<p>a</p>' }, { title: '', html: '<p>b</p>' }] });
  assert.ok(html.indexOf('1/2') >= 0 && html.indexOf('2/2') >= 0);
  assert.ok(html.indexOf('E-mail') >= 0 && html.indexOf('문서 2') >= 0);
});

test('정답을 고르면 "정답입니다"와 해설, 기록이 저장된다', function () {
  keepHash();
  var env = studyEnv();
  var view = mountStudy(env, { day: '1', section: 'part5' });
  var q = env.content.getQuestions({ day: 1, part: 5 })[0];
  assert.ok(view.text().indexOf('DAY 1') >= 0 && view.text().indexOf('Question 1 / 10') >= 0, '진행 표시');
  view.click('[data-letter="' + q.correct_answer + '"]');
  assert.ok(view.text().indexOf('정답입니다') >= 0);
  assert.ok(view.text().indexOf(q.explanation.summary) >= 0);
  var saved = env.progress.getAttempts();
  assert.equal(saved.length, 1);
  assert.equal(saved[0].selected, q.correct_answer);
  assert.equal(saved[0].is_correct, true);
  assert.ok(saved[0].time_ms >= 0);
  assert.equal(env.progress.getLastPosition().index, 1, '닫아도 다음 문제부터 이어서');
  // 채점 후에는 다른 보기를 눌러도 바뀌지 않는다
  view.click('[data-letter="D"]');
  assert.equal(env.progress.getAttempts().length, 1);
  view.click('[data-action="next"]');
  assert.ok(view.text().indexOf('Question 2 / 10') >= 0);
  view.close(); restoreHash();
});

test('오답을 고르면 자세한 해설·오답 원인 선택·복습 단어 등록', function () {
  keepHash();
  var env = studyEnv();
  var view = mountStudy(env, { day: '1', section: 'part5' });
  var q = env.content.getQuestions({ day: 1, part: 5 })[0]; // introduce 문제, 관련 단어 있음
  var wrongLetter = TM.constants.CHOICE_LETTERS.filter(function (l) { return l !== q.correct_answer; })[0];
  view.click('[data-letter="' + wrongLetter + '"]');
  var text = view.text();
  ['오답입니다', '왜 틀렸는지', '정답 근거', '문장 구조', '핵심 어휘', '문제 유형', '다음에 주의할 점', '왜 틀렸나요?'].forEach(function (label) {
    assert.ok(text.indexOf(label) >= 0, label + ' 없음');
  });
  assert.ok(text.indexOf(q.explanation.wrong_choices[wrongLetter]) >= 0, '선택한 보기가 왜 틀렸는지');
  assert.equal(view.root.querySelectorAll('[data-action="reason"]').length, 8);

  view.click('[data-reason="vocabulary"]');
  assert.equal(env.progress.getAttempts()[0].wrong_reason, 'vocabulary');
  assert.ok(view.root.querySelector('[data-reason="vocabulary"]').classList.contains('is-selected'));
  view.click('[data-reason="careless"]'); // 다시 고르면 바뀐다
  assert.equal(env.progress.getAttempts()[0].wrong_reason, 'careless');

  var state = env.progress.getVocabState();
  q.vocabulary.forEach(function (w) {
    var entry = state[w.toLowerCase()];
    assert.ok(entry && entry.needsReview, w + ' 복습 등록');
    assert.ok(entry.wrongQuestions.indexOf(q.question_id) >= 0);
  });
  view.close(); restoreHash();
});

test('복습 단어 등록: 이미 아는 단어는 그대로, DAY 단어 진행률에는 포함하지 않음', function () {
  var env = studyEnv();
  env.progress.setVocabStatus('introduce', 'known');
  var flagged = env.progress.flagWordsForReview(['introduce', 'trade show'], 'd1-p5-01');
  assert.deepEqual(flagged, ['trade show']);
  var state = env.progress.getVocabState();
  assert.equal(state['introduce'].needsReview, false);
  assert.equal(state['trade show'].needsReview, true);
  var stats = TM.statsService.computeDashboard({ attempts: [], profile: env.progress.getProfile(), vocabState: state, today: '2026-10-06' });
  assert.deepEqual(stats.vocab, { known: 1, review: 1 }, 'Dashboard 복습할 단어에 포함');
  var dp = TM.dayService.computeDayProgress({ content: env.content, day: 1, attempts: [], vocabState: state });
  assert.equal(dp.sections[0].done, 1, '직접 표시한 introduce만 학습한 단어로 계산');
  env.progress.setVocabStatus('trade show', 'known');
  assert.equal(env.progress.getVocabState()['trade show'].needsReview, false, '알고 있음으로 바꾸면 복습 해제');
});

test('중간에 닫았다가 다시 열면 다음 문제부터 이어서 푼다', function () {
  keepHash();
  var env = studyEnv();
  var view = mountStudy(env, { day: '1', section: 'part5' });
  view.click('[data-letter="A"]');
  view.close(); // 다음 문제로 넘어가기 전에 닫음
  var pos = env.progress.getLastPosition();
  assert.deepEqual([pos.day, pos.section, pos.index], [1, 'part5', 1]);
  var again = mountStudy(env, { day: '1', section: 'part5', q: String(pos.index) });
  assert.ok(again.text().indexOf('Question 2 / 10') >= 0);
  again.close();
  var fresh = mountStudy(env, { day: '1', section: 'part5' }); // 위치 없이 들어와도 안 푼 첫 문제
  assert.ok(fresh.text().indexOf('Question 2 / 10') >= 0);
  fresh.close(); restoreHash();
});

test('마지막 문제를 마치면 결과 요약과 다음 학습 안내, 이어서 학습 위치는 지운다', function () {
  keepHash();
  var env = studyEnv();
  var items = env.content.getQuestions({ day: 1, part: 6 });
  var view = mountStudy(env, { day: '1', section: 'part6' });
  items.forEach(function (q, i) {
    view.click('[data-letter="' + (i === 0 ? (q.correct_answer === 'A' ? 'B' : 'A') : q.correct_answer) + '"]');
    view.click('[data-action="next"]');
  });
  var text = view.text();
  assert.ok(text.indexOf('학습 결과') >= 0);
  assert.ok(text.indexOf('3 / 4') >= 0, '4문제 중 3문제 정답');
  assert.ok(text.indexOf('틀린 문제') >= 0);
  assert.ok(text.indexOf('다음 학습: Vocabulary') >= 0, '아직 안 한 첫 영역 안내');
  assert.ok(text.indexOf('오답 원인을 고르지 않은 문제가 1개') >= 0);
  assert.equal(env.progress.getLastPosition(), null);
  var dp = TM.dayService.computeDayProgress({ content: env.content, day: 1, attempts: env.progress.getAttempts(), vocabState: {} });
  assert.equal(dp.sections[2].done, 4, 'DAY 진행률에 Part 6 반영');
  assert.equal(dp.sections[4].total, 1, '틀린 문제는 오답 복습 대상');
  view.close(); restoreHash();
});

test('오답 복습: 처음 틀린 문제만 다시 푼다', function () {
  keepHash();
  var env = studyEnv();
  var items = env.content.getQuestions({ day: 1, part: 5 });
  env.progress.recordAttempt(items[2], items[2].correct_answer === 'A' ? 'B' : 'A', 1000);
  env.progress.recordAttempt(items[5], items[5].correct_answer === 'A' ? 'B' : 'A', 1000);
  var view = mountStudy(env, { day: '1', section: 'review' });
  assert.ok(view.text().indexOf('오답 복습') >= 0 && view.text().indexOf('Question 1 / 2') >= 0);
  assert.ok(view.text().indexOf(items[2].question) >= 0);
  view.close(); restoreHash();
  var empty = mountStudy(studyEnv(), { day: '1', section: 'review' });
  assert.ok(empty.text().indexOf('복습할 오답이 없습니다') >= 0);
  empty.close(); restoreHash();
});
