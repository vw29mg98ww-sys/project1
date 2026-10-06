// 학습분석 테스트: 기간 요약, Part·유형·원인·단어·연속 학습, 분석 문장, AI 연결 구조, 그래프, 화면

var TODAY = '2026-10-06'; // 화요일

function aEnv() {
  var storage = TM.createStorage(TM.createMemoryBackend());
  var clock = { now: new Date(TODAY + 'T09:00:00') };
  var progress = TM.createProgressService(storage, { now: function () { return clock.now; } });
  return { storage: storage, progress: progress, clock: clock, content: TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary), navigated: [] };
}
function at(env, dateKey, hour) { env.clock.now = new Date(dateKey + 'T' + String(hour || 9).padStart(2, '0') + ':00:00'); }
function solve(env, id, ok, seconds, reason) {
  var q = env.content.getQuestion(id);
  var r = env.progress.recordAttempt(q, ok ? q.correct_answer : (q.correct_answer === 'A' ? 'B' : 'A'), (seconds || 20) * 1000);
  if (reason) env.progress.setWrongReason(r.id, reason);
  return r;
}
function summary(env, days) {
  return TM.analyticsService.buildSummary({ content: env.content, attempts: env.progress.getAttempts(), vocabState: env.progress.getVocabState(), profile: env.progress.getProfile(), today: TODAY, rangeDays: days || 7 });
}

test('기간 요약: 일별 학습량·정답률, 기간 밖 기록 제외', function () {
  var env = aEnv();
  at(env, '2026-09-20'); solve(env, 'd1-p5-01', true);           // 7일 범위 밖
  at(env, '2026-10-01'); solve(env, 'd1-p5-02', true); solve(env, 'd1-p5-03', false);
  at(env, TODAY); solve(env, 'd1-p5-04', true);
  var s = summary(env, 7);
  assert.equal(s.daily.length, 7);
  assert.equal(s.range.from, '2026-09-30');
  assert.equal(s.totals.attempts, 3);
  assert.equal(s.totals.accuracy, 67);
  var oct1 = s.daily.filter(function (d) { return d.date === '2026-10-01'; })[0];
  assert.deepEqual([oct1.attempts, oct1.correct, oct1.accuracy], [2, 1, 50]);
  assert.equal(s.daily.filter(function (d) { return d.date === '2026-10-02'; })[0].accuracy, null, '안 푼 날은 정답률 없음');
  assert.equal(s.totals.studyDays, 2);
  assert.equal(summary(env, 30).totals.attempts, 4, '30일이면 포함');
});

test('Part별 정답률·평균 풀이 시간, 유형별(낮은 순), 오답 원인 비율', function () {
  var env = aEnv();
  solve(env, 'd1-p5-06', false, 30, 'grammar'); solve(env, 'd2-p5-09', false, 30, 'vocabulary'); solve(env, 'd1-p5-06', true, 10);
  solve(env, 'd1-p7-01', true, 60); solve(env, 'd1-p7-02', false, 80, 'vocabulary');
  var s = summary(env);
  assert.deepEqual([s.parts[5].attempts, s.parts[5].accuracy, s.parts[5].avgSeconds], [3, 33, 23]);
  assert.deepEqual([s.parts[7].accuracy, s.parts[7].avgSeconds], [50, 70]);
  assert.equal(s.parts[6].accuracy, null);
  assert.deepEqual([s.types[0].type, s.types[0].accuracy], ['NOT 문제', 0], '정답률 낮은 유형부터');
  assert.deepEqual([s.types[1].type, s.types[1].accuracy], ['관계사', 33]);
  assert.deepEqual([s.reasons.wrong, s.reasons.tagged], [3, 3]);
  assert.deepEqual(s.reasons.list.map(function (r) { return [r.id, r.share]; }), [['vocabulary', 67], ['grammar', 33]]);
});

test('단어 현황과 연속 학습일(현재·최고), 학습 달력', function () {
  var env = aEnv();
  ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-10-05', TODAY].forEach(function (d) { at(env, d); solve(env, 'd1-p5-01', true); });
  at(env, TODAY);
  env.progress.setVocabStatus('submit', 'known');
  env.progress.setVocabStatus('postpone', 'unknown');
  env.progress.flagWordsForReview(['receipt'], 'd1-p5-08');
  var s = summary(env);
  assert.deepEqual([s.streak.current, s.streak.best, s.streak.totalStudyDays], [2, 4, 6]);
  assert.deepEqual([s.vocab.known, s.vocab.unknown, s.vocab.review, s.vocab.reviewTotal, s.vocab.markedInRange], [1, 1, 1, 2, 2]);
  assert.equal(s.heatmap[s.heatmap.length - 1].date, TODAY);
  assert.equal(TM.date.parseDateKey(s.heatmap[0].date).getDay(), 0, '달력은 일요일부터');
  assert.equal(s.heatmap.length, 11 * 7 + 3, '12주(이번 주는 화요일까지)');
  assert.equal(TM.analyticsService.bestStreak(['2026-01-31', '2026-02-01', '2026-02-03']), 2, '월말을 넘어 이어지는 연속');
});

function richEnv() {
  // Part 5는 잘 풀고 Part 7 추론은 약한 학생, 원인은 어휘 위주
  var env = aEnv();
  var p5 = env.content.getQuestions({ part: 5 }).slice(0, 10);
  p5.forEach(function (q, i) { solve(env, q.question_id, i < 9, 20, i < 9 ? null : 'careless'); });
  var p7 = env.content.getQuestions({ part: 7 });
  var inference = p7.filter(function (q) { return q.question_type === '추론'; });
  var others = p7.filter(function (q) { return q.question_type !== '추론'; }).slice(0, 5);
  inference.forEach(function (q) { solve(env, q.question_id, false, 100, 'vocabulary'); });
  others.forEach(function (q, i) { solve(env, q.question_id, i < 3, 100, i < 3 ? null : (i === 3 ? 'vocabulary' : 'long_sentence')); });
  for (var i = 0; i < 25; i++) env.progress.setVocabStatus(env.content.words[i].word, i % 2 ? 'unknown' : 'confused');
  return env;
}

test('분석 문장: 가장 낮은 Part, 오답 원인 비율, 약한 유형, 풀이 시간, 다음 학습 추천', function () {
  var env = richEnv();
  var s = summary(env);
  var msgs = TM.analysisService.analyzeSync(s).map(function (i) { return i.message; });
  assert.ok(msgs.indexOf('최근 7일 동안 Part 7 정답률이 ' + s.parts[7].accuracy + '%로 가장 낮습니다.') >= 0, msgs.join('\n'));
  var top = s.reasons.list[0];
  assert.equal(top.id, 'vocabulary');
  assert.ok(msgs.indexOf('어휘 부족으로 인한 오답이 전체 오답의 ' + top.share + '%입니다.') >= 0, msgs.join('\n'));
  assert.ok(msgs.indexOf('\'추론\' 유형(Part 7) 정답률이 0%로 낮습니다.') >= 0, msgs.join('\n'));
  assert.ok(msgs.indexOf('Part 7 평균 풀이 시간이 100초로 목표(70초)보다 깁니다. 실전에서는 시간이 부족할 수 있습니다.') >= 0);
  assert.ok(msgs.indexOf('다음 학습에서는 Part 7 추론 문제 5개와 어휘 복습 20개를 추천합니다.') >= 0, msgs.join('\n'));
});

test('분석 문장: 기록이 없으면 학습 시작 안내', function () {
  var list = TM.analysisService.analyzeSync(summary(aEnv()));
  assert.equal(list.length, 1);
  assert.equal(list[0].id, 'no-data');
});

test('AI 분석을 붙일 수 있는 구조: 분석기 추가(비동기)와 요약 글', function () {
  var env = richEnv();
  var s = summary(env);
  TM.analysisService.registerProvider({ id: 'fake-ai', analyze: function (sum) {
    return Promise.resolve([{ id: 'ai-1', tone: 'info', message: 'AI: ' + sum.totals.attempts + '문제 분석' }]);
  } });
  var prompt = TM.analysisService.buildPrompt(s);
  var json = JSON.parse(prompt.slice(prompt.indexOf('{')));
  assert.equal(json.totals.attempts, s.totals.attempts);
  assert.ok(prompt.indexOf('TOEIC 900점') >= 0);
  return TM.analysisService.analyze(s).then(function (all) {
    TM.analysisService.unregisterProvider('fake-ai');
    assert.ok(all.some(function (i) { return i.id === 'ai-1'; }));
    assert.ok(all.some(function (i) { return i.id === 'recommend'; }), '규칙 기반 결과도 함께');
  });
});

test('그래프: 축 눈금, 막대 개수, 끊어진 꺾은선, 툴팁 값 이스케이프', function () {
  var ch = TM.components.charts;
  assert.deepEqual([ch.niceMax(3), ch.niceMax(13), ch.niceMax(47), ch.niceMax(120)], [4, 20, 50, 150]);
  [1, 3, 7, 13, 47, 99, 120, 333, 999].forEach(function (m) { assert.equal(ch.niceMax(m) % 2, 0, m + ' → 가운데 눈금이 정수'); });
  var col = ch.columnChart({ ariaLabel: 'x', data: [{ label: '1', value: 3, title: 'a', rows: [] }, { label: '2', value: 0, title: 'b', rows: [] }] });
  assert.equal((col.match(/class="chart-col"/g) || []).length, 2);
  assert.equal((col.match(/class="chart-bar"/g) || []).length, 1, '0인 날은 막대 없음');
  var line = ch.lineChart({ ariaLabel: 'y', data: [10, 20, null, 30, 40].map(function (v, i) { return { label: String(i), value: v, title: '<b>', rows: [['정답률', v + '%']] }; }) });
  assert.equal((line.match(/class="chart-line"/g) || []).length, 2, '빈 날에서 선이 끊긴다');
  assert.ok(line.indexOf('data-tip-title="&lt;b&gt;"') >= 0);
  var table = ch.tableView(['이름', '값'], [['<x>', 1]]);
  assert.ok(table.indexOf('&lt;x&gt;') >= 0 && table.indexOf('표로 보기') >= 0);
});

test('학습분석 화면: 기간·핵심 숫자·리포트·모든 그래프, 추천 학습 시작', function () {
  var env = richEnv();
  var page = mountPage(TM.pages.analytics, env, { range: '30' });
  var text = page.text();
  ['학습분석', '최근 30일', '푼 문제', '정답률', '평균 풀이 시간', '연속 학습일', '분석 리포트', '일별 학습량', '일별 정답률',
   'Part별 정답률', '오답 원인', '문제 유형별 정답률', '단어 암기 현황', '학습 달력', '표로 보기', '학습 요약 복사'].forEach(function (t) {
    assert.ok(text.indexOf(t) >= 0, t + ' 없음');
  });
  assert.ok(page.root.querySelector('.seg.is-active').textContent === '최근 30일');
  var rec = page.root.querySelector('[data-action="insight"][data-which="action"]');
  rec.click();
  var set = env.progress.getPracticeSession();
  assert.ok(set.ids.length > 0 && set.ids.length <= 5);
  assert.ok(set.ids.every(function (id) { return env.content.getQuestion(id).question_type === '추론'; }));
  assert.equal(set.returnTo, '/analytics?range=30');
  page.click('[data-which="secondary"]');
  assert.equal(env.progress.getVocabSession().words.length, 20, '어휘 복습 20개');
  page.close();
  var empty = mountPage(TM.pages.analytics, aEnv(), {});
  assert.ok(empty.text().indexOf('이 기간에 푼 문제가 없습니다') >= 0);
  assert.ok(empty.root.querySelector('.seg.is-active').textContent === '최근 7일', '기본 7일');
  empty.close();
});
