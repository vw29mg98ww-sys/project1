// Part 5/6/7 테스트: 유형별 정답률, 추천 학습 영역, 연습 순서, 맞춤 난이도, 연습 세트 풀이, 새 문제 데이터

function pContent() { return TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary); }
function att(q, ok) {
  return { question_id: q.question_id, part: q.part, question_type: q.question_type, difficulty: q.difficulty, is_correct: ok };
}

test('새 문제: Part 7 이중·삼중 지문과 LEVEL 3·4 문제가 있다', function () {
  var c = pContent();
  var types = c.passages.filter(function (p) { return p.part === 7; }).map(function (p) { return p.type; });
  assert.ok(types.indexOf('double') >= 0 && types.indexOf('triple') >= 0);
  [3, 4].forEach(function (l) {
    assert.ok(c.questions.some(function (q) { return q.difficulty === l; }), 'LEVEL ' + l + ' 문제 없음');
  });
  assert.ok(c.questions.some(function (q) { return q.question_type === '정보 연결'; }));
  assert.ok(c.questions.some(function (q) { return q.question_type === '동의어'; }));
});

test('문장 삽입 문제는 모두 앞뒤 문맥 분석이 있고, 형식이 틀리면 오류', function () {
  var c = pContent();
  c.questions.filter(function (q) { return q.question_type === '문장 삽입'; }).forEach(function (q) {
    var ctxInfo = q.explanation.context_analysis;
    assert.ok(ctxInfo && ctxInfo.before && ctxInfo.after && ctxInfo.clue, q.question_id + ' 문맥 분석 없음');
  });
  var data = JSON.parse(JSON.stringify(TM_DATA.questions));
  data.questions[0].explanation.context_analysis = { before: 'x' };
  assert.match(TM.validateData(data, TM_DATA.vocabulary).errors.join('\n'), /context_analysis/);
});

test('문장 삽입 해설에 앞뒤 문맥이 표시된다', function () {
  var c = pContent();
  var q = c.getQuestion('d3-p6-02');
  var html = TM.components.renderFeedback(q, { selected: 'B', is_correct: false, time_ms: 1000 }, c, []);
  ['앞뒤 문맥', '빈칸 앞', '빈칸 뒤', '연결 단서'].forEach(function (t) { assert.ok(html.indexOf(t) >= 0, t); });
});

test('유형별 정답률과 추천 학습 영역(3번 이상 풀고 70% 미만)', function () {
  var c = pContent();
  var rel = c.getQuestions({ part: 5 }).filter(function (q) { return q.question_type === '관계사'; });
  var prep = c.getQuestions({ part: 5 }).filter(function (q) { return q.question_type === '전치사'; });
  var attempts = [att(rel[0], false), att(rel[1], false), att(rel[0], true), att(prep[0], false), att(prep[1], true)];
  var stats = TM.practiceService.typeStats(c, attempts, 5);
  var relStat = stats.filter(function (s) { return s.type === '관계사'; })[0];
  assert.deepEqual([relStat.attempts, relStat.correct, relStat.accuracy, relStat.questions], [3, 1, 33, rel.length]);
  assert.equal(stats[0].type, '품사', 'Part 5 유형 순서대로');
  var weak = TM.practiceService.weakTypes(stats).map(function (s) { return s.type; });
  assert.deepEqual(weak, ['관계사'], '전치사는 2번만 풀어서 아직 판단하지 않음');
});

test('연습 순서: 틀린 문제 → 안 푼 문제 → 맞힌 문제, 지문 묶음은 유지', function () {
  var c = pContent();
  var p5 = c.getQuestions({ day: 1, part: 5 }).slice(0, 4);
  var ordered = TM.practiceService.orderForPractice(p5, [att(p5[0], true), att(p5[2], false)]);
  assert.deepEqual(ordered.map(function (q) { return q.question_id; }), [p5[2], p5[1], p5[3], p5[0]].map(function (q) { return q.question_id; }));
  var p7 = c.getQuestions({ part: 7 });
  var last = p7[p7.length - 1];
  var ordered7 = TM.practiceService.orderForPractice(p7, [att(last, false)]);
  var firstPassage = ordered7[0].passage_id;
  assert.equal(firstPassage, last.passage_id, '틀린 문제의 지문 세트가 먼저');
  var seen = [];
  ordered7.forEach(function (q) {
    if (seen[seen.length - 1] !== q.passage_id) { assert.ok(seen.indexOf(q.passage_id) < 0, '지문 ' + q.passage_id + ' 문제가 흩어짐'); seen.push(q.passage_id); }
  });
});

function levelAttempts(n, correct, difficulty) {
  var list = [];
  for (var i = 0; i < n; i++) list.push({ question_id: 'x' + i, part: 5, difficulty: difficulty, is_correct: i < correct });
  return list;
}

test('맞춤 난이도: 기록이 적으면 LEVEL 1, 80% 이상이면 올리고 50% 미만이면 내린다', function () {
  var r = TM.difficultyService.recommendLevel(levelAttempts(3, 3, 1));
  assert.deepEqual([r.level, r.change], [1, 'start']);
  r = TM.difficultyService.recommendLevel(levelAttempts(10, 9, 2));
  assert.deepEqual([r.level, r.change, r.accuracy], [3, 'up', 90]);
  r = TM.difficultyService.recommendLevel(levelAttempts(10, 4, 3));
  assert.deepEqual([r.level, r.change], [2, 'down']);
  r = TM.difficultyService.recommendLevel(levelAttempts(10, 6, 2));
  assert.deepEqual([r.level, r.change], [2, 'keep']);
  assert.equal(TM.difficultyService.recommendLevel(levelAttempts(10, 10, 4)).level, 4, '최고 LEVEL 4');
  assert.equal(TM.difficultyService.recommendLevel(levelAttempts(10, 0, 1)).level, 1, '최저 LEVEL 1');
  r = TM.difficultyService.recommendLevel(levelAttempts(30, 30, 1).concat(levelAttempts(10, 2, 2)));
  assert.equal(r.accuracy, 20, '최근 10문제만 본다');
});

test('맞춤 난이도 문제 고르기: 목표 LEVEL에 가까운 문제, 지문 단위, 개수 제한', function () {
  var c = pContent();
  var picked = TM.difficultyService.pickByLevel(c.getQuestions({ part: 5 }), [], 4, 10);
  assert.equal(picked.length, 10);
  assert.ok(picked.slice(0, 3).every(function (q) { return q.difficulty === 4; }), 'LEVEL 4 문제부터');
  var p7 = TM.difficultyService.pickByLevel(c.getQuestions({ part: 7 }), [], 4, 10);
  assert.ok(p7.length <= 10 && p7.length > 0);
  assert.ok(p7.every(function (q) { return q.day === 3; }), '고난도 지문(DAY 3) 우선');
  var groups = {};
  p7.forEach(function (q) { groups[q.passage_id] = (groups[q.passage_id] || 0) + 1; });
  Object.keys(groups).forEach(function (pid) {
    assert.equal(groups[pid], c.getQuestions({ part: 7 }).filter(function (q) { return q.passage_id === pid; }).length, '지문 세트는 통째로');
  });
});

function practiceEnv() {
  var storage = TM.createStorage(TM.createMemoryBackend());
  return { storage: storage, content: pContent(), progress: TM.createProgressService(storage) };
}

test('연습 세트 만들기: 유형별·추천·맞춤·전체', function () {
  var env = practiceEnv();
  var byType = TM.practiceService.buildPracticeSet(env.content, [], { part: 5, mode: 'type', type: '관계사' });
  assert.ok(byType.items.length > 0 && byType.items.every(function (q) { return q.question_type === '관계사'; }));
  assert.equal(byType.title, 'Part 5 · 관계사');
  var all = TM.practiceService.buildPracticeSet(env.content, [], { part: 6, mode: 'all' });
  assert.equal(all.items.length, env.content.getQuestions({ part: 6 }).length);
  var adaptive = TM.practiceService.buildPracticeSet(env.content, [], { part: 5, mode: 'adaptive' });
  assert.equal(adaptive.level, 1);
  assert.ok(adaptive.items.length <= 10);
  var rel = env.content.getQuestions({ part: 5 }).filter(function (q) { return q.question_type === '관계사'; });
  var weak = TM.practiceService.buildPracticeSet(env.content, [att(rel[0], false), att(rel[1], false), att(rel[0], false)], { part: 5, mode: 'weak' });
  assert.ok(weak.items.every(function (q) { return q.question_type === '관계사'; }));
});

test('연습 풀이: 기록은 남고, DAY 이어서 학습 위치는 건드리지 않으며, 새로고침해도 같은 세트', function () {
  var env = practiceEnv();
  env.progress.saveLastPosition(1, 'part5', 3);
  var set = TM.practiceService.buildPracticeSet(env.content, [], { part: 5, mode: 'type', type: '관계사' });
  var session = env.progress.startPracticeSession({ title: set.title, part: 5, mode: 'type', type: '관계사', ids: set.items.map(function (q) { return q.question_id; }) });
  keepHash();
  var view = mountStudy(env, { mode: 'practice', sid: session.id });
  assert.ok(view.text().indexOf('Part 5 · 관계사') >= 0 && view.text().indexOf('Question 1 / ' + set.items.length) >= 0);
  view.click('[data-letter="' + set.items[0].correct_answer + '"]');
  view.close();
  assert.equal(env.progress.getAttempts().length, 1);
  assert.equal(env.progress.getPracticeSession().index, 1);
  assert.deepEqual(env.progress.getLastPosition().index, 3, 'DAY 이어서 학습 위치 유지');
  var again = mountStudy(env, { mode: 'practice', sid: session.id });
  assert.ok(again.text().indexOf('Question 2 / ' + set.items.length) >= 0, '연습 세트 안에서 이어서');
  again.close();
  var stale = TM.pages.study.render({ content: env.content, storage: env.storage, progress: env.progress }, { mode: 'practice', sid: 'old' });
  assert.ok(stale.indexOf('연습 세트를 찾을 수 없습니다') >= 0);
  restoreHash();
});

test('Part 화면: 정답률·추천 난이도·추천 학습 영역·유형별 표', function () {
  var env = practiceEnv();
  var ctx = { content: env.content, storage: env.storage, progress: env.progress };
  var html = TM.pages.createPartPage(5).render(ctx);
  ['Part 5 정답률', '다음 추천 난이도', 'LEVEL 1', '맞춤 난이도 연습', '전체 문제 풀기', '유형별 정답률', '관계사'].forEach(function (t) {
    assert.ok(html.indexOf(t) >= 0, t + ' 없음');
  });
  var rel = env.content.getQuestions({ part: 5 }).filter(function (q) { return q.question_type === '관계사'; });
  [0, 1, 0].forEach(function (i) { env.progress.recordAttempt(rel[i], rel[i].correct_answer === 'A' ? 'B' : 'A', 1000); });
  html = TM.pages.createPartPage(5).render(ctx);
  assert.ok(html.indexOf('추천 문제 풀기') >= 0);
  assert.ok(html.indexOf('tag-warn') >= 0);
  assert.ok(TM.pages.createPartPage(7).render(ctx).indexOf('지문 구성: 단일 3 · 이중 1 · 삼중 1') >= 0);
});

test('Dashboard: 자주 틀리는 유형을 추천 학습으로 안내', function () {
  var stats = TM.statsService.computeDashboard({ attempts: [], profile: { currentDay: 1, studyDates: [] }, vocabState: {}, today: '2026-10-06' });
  stats.weakTypes = [{ part: 5, type: '관계사', accuracy: 33 }];
  var w = TM.insightService.buildDashboardInsights(stats).filter(function (i) { return i.id === 'weak-type-5'; })[0];
  assert.equal(w.message, 'Part 5 \'관계사\' 유형 정답률이 33%입니다. 추천 학습으로 집중 연습하세요.');
  assert.equal(w.href, '#/part5');
});
