// STEP 10 테스트: 설정(테마·하루 목표), 기록 초기화 확인, 처음 사용 안내, 오늘의 목표, 접근성, 지문 접기

function sEnv() {
  var storage = TM.createStorage(TM.createMemoryBackend());
  return { storage: storage, progress: TM.createProgressService(storage), content: TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary), navigated: [] };
}

test('설정 기본값과 저장, 테마 적용', function () {
  var env = sEnv();
  var s = TM.settingsService.get(env.storage);
  assert.deepEqual([s.theme, s.dailyGoal.questions, s.dailyGoal.words, s.onboardingDone], ['system', 20, 20, false]);
  TM.settingsService.update(env.storage, { dailyGoal: { questions: 40 } });
  assert.deepEqual(TM.settingsService.get(env.storage).dailyGoal, { questions: 40, words: 20 }, '일부만 바꿔도 나머지는 기본값');
  var before = document.documentElement.getAttribute('data-theme');
  TM.settingsService.applyTheme('dark');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'dark');
  TM.settingsService.applyTheme('system');
  assert.equal(document.documentElement.hasAttribute('data-theme'), false, '시스템 설정이면 표시를 지운다');
  if (before) document.documentElement.setAttribute('data-theme', before);
});

test('오늘의 학습량: 오늘 푼 문제와 오늘 상태를 고른 단어', function () {
  var env = sEnv();
  var clock = { now: new Date('2026-10-05T10:00:00') };
  var p = TM.createProgressService(env.storage, { now: function () { return clock.now; } });
  var q = env.content.questions[0];
  p.recordAttempt(q, 'A', 1000);
  clock.now = new Date('2026-10-06T10:00:00');
  p.recordAttempt(q, 'A', 1000); p.recordAttempt(q, 'B', 1000);
  p.setVocabStatus('submit', 'known');
  p.flagWordsForReview(['receipt'], 'x'); // 상태를 고른 것이 아니므로 제외
  assert.deepEqual(TM.settingsService.todayProgress(p.getAttempts(), p.getVocabState(), '2026-10-06'), { questions: 2, words: 1 });
});

test('설정 화면: 테마·하루 목표를 바꾸면 저장된다', function () {
  var env = sEnv();
  var before = document.documentElement.getAttribute('data-theme');
  var page = mountPage(TM.pages.settings, env, {});
  ['화면 테마', '하루 목표', '학습 기록 백업', '백업 불러오기', '저장 공간', '건 더 저장 가능', '학습 기록 초기화'].forEach(function (t) {
    assert.ok(page.text().indexOf(t) >= 0, t + ' 없음');
  });
  var dark = page.root.querySelector('input[data-setting="theme"][value="dark"]');
  dark.checked = true; dark.dispatchEvent(new Event('change', { bubbles: true }));
  assert.equal(TM.settingsService.get(env.storage).theme, 'dark');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'dark');
  var q30 = page.root.querySelector('input[data-setting="goalQuestions"][value="30"]');
  q30.checked = true; q30.dispatchEvent(new Event('change', { bubbles: true }));
  assert.equal(TM.settingsService.get(env.storage).dailyGoal.questions, 30);
  page.close();
  if (before) document.documentElement.setAttribute('data-theme', before); else document.documentElement.removeAttribute('data-theme');
});

test('기록 초기화: 화면 안에서 한 번 더 확인하고, 취소하면 그대로', function () {
  var env = sEnv();
  var q = env.content.questions[0];
  env.progress.recordAttempt(q, 'A', 1000);
  TM.settingsService.update(env.storage, { theme: 'light' });
  var page = mountPage(TM.pages.settings, env, {});
  page.click('[data-action="reset"]');
  assert.ok(page.text().indexOf('정말 모든 학습 기록을 지울까요?') >= 0);
  page.click('[data-action="reset-cancel"]');
  assert.equal(env.progress.getAttempts().length, 1, '취소하면 기록 유지');
  page.click('[data-action="reset"]');
  page.click('[data-action="reset-confirm"]');
  assert.equal(env.progress.getAttempts().length, 0);
  assert.equal(TM.settingsService.get(env.storage).theme, 'light', '화면 테마는 유지');
  page.close();
});

test('Dashboard: 처음 사용 안내(닫으면 다시 안 나옴)와 오늘의 목표', function () {
  var env = sEnv();
  var q = env.content.questions[0];
  env.progress.recordAttempt(q, 'A', 1000);
  env.progress.recordAttempt(q, 'B', 1000);
  var fresh = mountPage(TM.pages.dashboard, sEnv(), {});
  assert.ok(fresh.text().indexOf('환영합니다') < 0, '처음에는 안내만');
  fresh.close();
  var page = mountPage(TM.pages.dashboard, env, {});
  assert.ok(page.text().indexOf('처음 오셨나요?') >= 0);
  assert.ok(page.text().indexOf('오늘의 목표') >= 0 && page.text().indexOf('2 / 20문제') >= 0);
  page.click('button[data-action="onboarding-done"]');
  assert.equal(TM.settingsService.get(env.storage).onboardingDone, true);
  page.close();
  var again = mountPage(TM.pages.dashboard, env, {});
  assert.ok(again.text().indexOf('처음 오셨나요?') < 0);
  again.close();
});

test('접근성: 본문으로 건너뛰기, 지문 접기/펼치기', function () {
  var holder = document.createElement('div');
  holder.style.display = 'none';
  document.body.appendChild(holder);
  var layout = TM.components.createLayout(holder);
  assert.ok(holder.querySelector('.skip-link'));
  assert.equal(layout.outlet.getAttribute('tabindex'), '-1', '본문이 초점을 받을 수 있음');
  holder.remove();
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  var html = TM.components.renderPassage(content.getPassage('d3-p7-psg2'));
  assert.ok(html.indexOf('<details class="card passage" open>') === 0, '기본은 펼쳐진 상태');
  assert.ok(html.indexOf('지문 (문서 3개)') >= 0);
});

test('Dashboard 진단: 약한 유형은 가장 약한 하나만 보여준다', function () {
  var stats = TM.statsService.computeDashboard({ attempts: [], profile: { currentDay: 1, studyDates: [] }, vocabState: {}, today: '2026-10-06' });
  stats.weakTypes = [{ part: 5, type: '동사', accuracy: 67 }, { part: 7, type: '목적', accuracy: 33 }, { part: 6, type: '문법', accuracy: 50 }];
  var weak = TM.insightService.buildDashboardInsights(stats).filter(function (i) { return i.id.indexOf('weak-type') === 0; });
  assert.equal(weak.length, 1);
  assert.equal(weak[0].id, 'weak-type-7');
});
