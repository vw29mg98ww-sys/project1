// Vocabulary 테스트: 단어 상태, 검색·필터, 복습 순서, 단어 카드 학습, 복습 세트, 문제 연결, 문제 상세, DAY 완료

function vEnv() {
  var storage = TM.createStorage(TM.createMemoryBackend());
  return { storage: storage, content: TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary), progress: TM.createProgressService(storage), navigated: [] };
}

// 화면을 테스트용 영역에 띄운다 (router는 이동 기록만 남기는 가짜)
function mountPage(page, env, params) {
  var root = document.createElement('div');
  root.style.display = 'none';
  document.body.appendChild(root);
  var ctx = { content: env.content, storage: env.storage, progress: env.progress,
    router: { navigate: function (p) { env.navigated.push(p); }, refresh: function () {} } };
  root.innerHTML = page.render(ctx, params);
  var cleanup = page.mount ? page.mount(root, ctx, params) : null;
  return {
    root: root,
    text: function () { return root.textContent; },
    click: function (sel) { var el = root.querySelector(sel); assert.ok(el, sel + ' 없음'); el.click(); },
    close: function () { if (cleanup) cleanup(); root.remove(); }
  };
}

test('단어 상태: 미학습 / 복습 필요(문제 오답) / 모름 / 헷갈림 / 알고 있음', function () {
  var env = vEnv();
  var st = function () { return env.progress.getVocabState(); };
  assert.equal(TM.vocabService.statusOf(st(), 'submit'), 'new');
  env.progress.flagWordsForReview(['submit'], 'd1-p5-03');
  assert.equal(TM.vocabService.statusOf(st(), 'submit'), 'review');
  env.progress.setVocabStatus('submit', 'confused');
  assert.equal(TM.vocabService.statusOf(st(), 'Submit'), 'confused');
  var view = TM.vocabService.wordView(env.content, st(), env.content.getWord('submit'));
  assert.equal(view.mastery_level, 2);
  assert.ok(view.related.indexOf('d1-p5-03') >= 0, '관련 문제 연결');
  assert.ok(view.wrongQuestions.indexOf('d1-p5-03') >= 0, '틀린 문제 표시');
});

test('문제 번호 라벨: DAY · Part · Question 번호', function () {
  var env = vEnv();
  assert.equal(env.content.questionLabel('d1-p5-03'), 'DAY 1 · Part 5 · Question 3');
  assert.equal(env.content.questionLabel('d3-p7-06'), 'DAY 3 · Part 7 · Question 6');
});

test('현황 요약과 검색·필터(단어/뜻, DAY, 상태, 난이도)', function () {
  var env = vEnv();
  env.progress.setVocabStatus('submit', 'known');
  env.progress.setVocabStatus('postpone', 'unknown');
  env.progress.flagWordsForReview(['receipt'], 'd1-p5-08');
  var st = env.progress.getVocabState();
  var words = env.content.words;
  var c = TM.vocabService.summarize(words, st);
  assert.deepEqual([c.known, c.unknown, c.review, c.reviewTotal, c.new], [1, 1, 1, 2, words.length - 3]);
  var f = function (filter) { return TM.vocabService.filterWords(words, st, filter).map(function (w) { return w.word; }); };
  assert.deepEqual(f({ query: 'post' }), ['postpone']);
  assert.ok(f({ query: '영수증' }).indexOf('receipt') >= 0, '뜻으로도 검색');
  assert.deepEqual(f({ status: 'review' }).sort(), ['postpone', 'receipt']);
  assert.ok(f({ day: '3' }).every(function (w) { return env.content.getWord(w).day === 3; }));
  assert.ok(f({ difficulty: '4' }).every(function (w) { return env.content.getWord(w).difficulty === 4; }));
});

test('복습 순서: 모름 → 문제 오답 → 헷갈림', function () {
  var env = vEnv();
  env.progress.setVocabStatus('budget', 'confused');
  env.progress.flagWordsForReview(['receipt'], 'd1-p5-08');
  env.progress.setVocabStatus('postpone', 'unknown');
  env.progress.setVocabStatus('submit', 'known');
  var q = TM.vocabService.reviewQueue(env.content.words, env.progress.getVocabState()).map(function (w) { return w.word; });
  assert.deepEqual(q, ['postpone', 'receipt', 'budget']);
});

test('DAY 단어 카드: 뜻 보기 → 상태 선택 → 저장 → 다음 단어, DAY 진행률 반영', function () {
  keepHash();
  var env = vEnv();
  var words = env.content.getWords({ day: 1 });
  var view = mountPage(TM.pages.study, env, { day: '1', section: 'vocabulary' });
  assert.ok(view.text().indexOf('Word 1 / ' + words.length) >= 0);
  assert.ok(view.text().indexOf(words[0].word) >= 0);
  assert.ok(view.text().indexOf(words[0].meaning) < 0, '처음에는 뜻을 가린다');
  view.click('[data-action="flip"]');
  assert.ok(view.text().indexOf(words[0].meaning) >= 0);
  view.click('[data-status="known"]');
  assert.equal(env.progress.getVocabState()[words[0].word.toLowerCase()].status, 'known');
  assert.ok(view.text().indexOf('Word 2 / ') >= 0);
  view.click('[data-status="unknown"]'); // 뜻을 안 보고 바로 골라도 된다
  var dp = TM.dayService.computeDayProgress({ content: env.content, day: 1, attempts: [], vocabState: env.progress.getVocabState() });
  assert.equal(dp.sections[0].done, 2);
  assert.deepEqual([env.progress.getLastPosition().section, env.progress.getLastPosition().index], ['vocabulary', 2]);
  view.close();
  var again = mountPage(TM.pages.study, env, { day: '1', section: 'vocabulary' });
  assert.ok(again.text().indexOf('Word 3 / ') >= 0, '다시 열면 아직 안 한 단어부터');
  again.close(); restoreHash();
});

test('단어 카드에 관련 문제가 연결되고, 마지막 단어 뒤에는 결과 요약', function () {
  keepHash();
  var env = vEnv();
  var words = env.content.getWords({ day: 1 });
  var idx = words.map(function (w) { return w.word; }).indexOf('submit');
  var view = mountPage(TM.pages.study, env, { day: '1', section: 'vocabulary', q: String(idx) });
  view.click('[data-action="flip"]');
  assert.ok(view.text().indexOf('DAY 1 · Part 5 · Question 3') >= 0);
  assert.ok(view.root.querySelector('a[href="#/question?id=d1-p5-03"]'));
  view.close();
  var all = mountPage(TM.pages.study, env, { day: '1', section: 'vocabulary', q: String(words.length - 1) });
  all.click('[data-status="confused"]');
  assert.ok(all.text().indexOf('학습 결과') >= 0 && all.text().indexOf('헷갈림 1') >= 0);
  assert.equal(env.progress.getLastPosition(), null);
  all.close(); restoreHash();
});

test('Vocabulary 화면: 복습 단어 학습 세트를 만들고 이어서 학습한다', function () {
  keepHash();
  var env = vEnv();
  env.progress.setVocabStatus('postpone', 'unknown');
  env.progress.flagWordsForReview(['receipt'], 'd1-p5-08');
  var page = mountPage(TM.pages.vocabulary, env, {});
  assert.ok(page.text().indexOf('복습 단어 학습 (2)') >= 0);
  page.click('[data-action="review"]');
  var set = env.progress.getVocabSession();
  assert.deepEqual(set.words, ['postpone', 'receipt']);
  assert.equal(env.navigated[0], '/vocab-study?sid=' + set.id);
  page.close();
  var study = mountPage(TM.pages.vocabStudy, env, { sid: set.id });
  assert.ok(study.text().indexOf('복습 단어') >= 0 && study.text().indexOf('postpone') >= 0);
  study.click('[data-status="known"]');
  study.close();
  assert.equal(env.progress.getVocabSession().index, 1);
  var again = mountPage(TM.pages.vocabStudy, env, { sid: set.id });
  assert.ok(again.text().indexOf('receipt') >= 0, '세트 안에서 이어서');
  again.close();
  var c = TM.vocabService.summarize(env.content.words, env.progress.getVocabState());
  assert.equal(c.reviewTotal, 1, '알고 있음으로 고른 단어는 복습에서 빠짐');
  restoreHash();
});

test('Vocabulary 화면: 필터가 주소에서 적용되고 단어 상세에 관련 문제가 보인다', function () {
  var env = vEnv();
  var html = TM.pages.vocabulary.render({ content: env.content, storage: env.storage, progress: env.progress }, { q: 'submit' });
  assert.ok(html.indexOf('1개 단어') >= 0);
  assert.ok(html.indexOf('DAY 1 · Part 5 · Question 3') >= 0);
  var none = TM.pages.vocabulary.render({ content: env.content, storage: env.storage, progress: env.progress }, { q: 'zzzz' });
  assert.ok(none.indexOf('조건에 맞는 단어가 없습니다') >= 0);
});

test('문제 상세: 정답·모든 오답 보기 설명·풀이 기록·다시 풀기', function () {
  var env = vEnv();
  var q = env.content.getQuestion('d1-p5-03');
  var rec = env.progress.recordAttempt(q, 'B', 15000);
  env.progress.setWrongReason(rec.id, 'grammar');
  var page = mountPage(TM.pages.question, env, { id: 'd1-p5-03' });
  var text = page.text();
  assert.ok(text.indexOf('DAY 1 · Part 5 · Question 3') >= 0);
  ['B', 'C', 'D'].forEach(function (l) { assert.ok(text.indexOf(q.explanation.wrong_choices[l]) >= 0, l + ' 설명'); });
  assert.ok(text.indexOf('내 답 (B)') >= 0 && text.indexOf('원인: 문법') >= 0);
  page.click('[data-action="retry"]');
  var practice = env.progress.getPracticeSession();
  assert.deepEqual(practice.ids, ['d1-p5-03']);
  assert.equal(env.navigated[0], '/study?mode=practice&sid=' + practice.id);
  page.close();
  assert.ok(TM.pages.question.render({ content: env.content, progress: env.progress }, { id: 'nope' }).indexOf('찾을 수 없습니다') >= 0);
});

test('단어와 문제를 모두 마치면 DAY가 완료된다', function () {
  var env = vEnv();
  env.content.getWords({ day: 1 }).forEach(function (w) { env.progress.setVocabStatus(w.word, 'known'); });
  env.content.getQuestions({ day: 1 }).forEach(function (q) { env.progress.recordAttempt(q, q.correct_answer, 1000); });
  var dp = TM.dayService.computeDayProgress({ content: env.content, day: 1, attempts: env.progress.getAttempts(), vocabState: env.progress.getVocabState() });
  assert.equal(dp.percent, 100);
  assert.ok(dp.complete);
});

test('단어 목록은 30개씩 보여주고 더 보기로 늘린다', function () {
  var env = vEnv();
  var page = mountPage(TM.pages.vocabulary, env, {});
  assert.equal(page.root.querySelectorAll('.word-row').length, 30);
  var rest = env.content.words.length - 30;
  assert.ok(page.text().indexOf('더 보기 (' + rest + '개 남음)') >= 0);
  page.click('[data-action="more"]');
  assert.equal(page.root.querySelectorAll('.word-row').length, Math.min(60, env.content.words.length));
  page.close();
});
