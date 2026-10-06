// 학습 화면 (#/study?day=1&section=part5&q=0)
// 문제 하나를 보여주고 → 답 선택 → 즉시 채점·저장 → 해설 → 다음 문제. 마지막 문제 뒤에는 결과 요약.
// 단어(Vocabulary) 영역은 STEP 7에서 구현한다.
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };

  function studyHash(state, index) {
    return '#/study?day=' + state.day + '&section=' + state.section.id + '&q=' + index;
  }

  function renderHeader(state) {
    var total = state.items.length;
    var current = state.finished ? total : state.index + 1;
    var answeredCount = state.finished ? total : state.index + (state.attempt ? 1 : 0);
    return '<div class="study-header">' +
      '<div class="study-header-row">' +
        '<div class="study-location">' +
          '<span class="loc-day">DAY ' + state.day + '</span>' +
          '<span class="loc-part">' + esc(state.section.label) + '</span>' +
          '<span class="loc-q">Question ' + current + ' / ' + total + '</span>' +
        '</div>' +
        (state.finished ? '' : '<span class="study-timer" id="study-timer" aria-label="풀이 시간">⏱ 0:00</span>') +
        '<a class="btn btn-sm" href="#/day?day=' + state.day + '">' + (state.finished ? 'DAY ' + state.day : '그만하기') + '</a>' +
      '</div>' +
      TM.components.renderMeter({ value: total ? (answeredCount / total) * 100 : 0, label: '진행률' }) +
    '</div>';
  }

  function renderQuestion(state, ctx) {
    var q = state.items[state.index];
    var passage = q.passage_id ? ctx.content.getPassage(q.passage_id) : null;
    var nextLabel = state.index + 1 < state.items.length ? '다음 문제 →' : '결과 보기';
    return renderHeader(state) +
      '<div class="study-body' + (passage ? ' has-passage' : '') + '">' +
        TM.components.renderPassage(passage, TM.studyService.blankNumber(q.question)) +
        '<div class="card question-card">' +
          '<div class="question-meta"><span class="chip">' + esc(TM.constants.PARTS[q.part].name) + (q.question_type ? ' · ' + esc(q.question_type) : '') + '</span>' +
            '<span class="muted small">' + esc(TM.constants.DIFFICULTY_LEVELS[q.difficulty].label) + '</span></div>' +
          '<p class="question-text">' + esc(q.question) + '</p>' +
          TM.components.renderChoices(q, state.attempt) +
          (state.attempt ? TM.components.renderFeedback(q, state.attempt, ctx.content, state.flagged) : '') +
          (state.attempt ? '<div class="study-next"><button type="button" class="btn btn-primary btn-lg" data-action="next">' + nextLabel + '</button></div>' : '') +
          '<p class="hint">키보드: 1–4 또는 A–D로 선택' + (state.attempt ? ' · Enter로 다음' : '') + '</p>' +
        '</div>' +
      '</div>';
  }

  function renderSummary(state, ctx) {
    var s = TM.studyService.summarize(state.results);
    var dayProgress = TM.dayService.computeDayProgress({ content: ctx.content, day: state.day, attempts: ctx.progress.getAttempts(), vocabState: ctx.progress.getVocabState() });
    var next = TM.dayService.nextSection(dayProgress);
    var wrong = state.results.filter(function (r) { return !r.is_correct; });
    var noReason = wrong.filter(function (r) { return !r.wrong_reason; }).length;

    var wrongList = wrong.length ? '<h2 class="section-title">틀린 문제</h2><ul class="card result-list">' + wrong.map(function (r) {
      var q = ctx.content.getQuestion(r.question_id);
      var reason = TM.constants.WRONG_REASONS.filter(function (x) { return x.id === r.wrong_reason; })[0];
      return '<li><div class="result-q">' + esc(q.question) + '</div>' +
        '<div class="muted small">내 답 (' + r.selected + ') · 정답 (' + q.correct_answer + ')' + (reason ? ' · 원인: ' + esc(reason.label) : '') + '</div></li>';
    }).join('') + '</ul>' : '';

    return renderHeader(state) +
      '<div class="card study-summary">' +
        '<div class="hero-label">' + esc(state.section.label) + ' 학습 결과</div>' +
        (s.answered
          ? '<div class="summary-score">' + s.correct + ' / ' + s.answered + '<span class="stat-unit">정답</span></div>' +
            '<div class="muted">정답률 ' + s.accuracy + '% · 평균 풀이 시간 ' + TM.date.formatDuration(s.avgTimeMs) + '</div>'
          : '<div class="summary-score">완료</div>') +
        (noReason ? '<p class="small">💡 오답 원인을 고르지 않은 문제가 ' + noReason + '개 있습니다. 원인을 기록하면 취약 영역 분석이 정확해집니다.</p>' : '') +
        '<div class="summary-actions">' +
          (next ? '<a class="btn btn-primary btn-lg" href="' + TM.dayService.studyLink(state.day, next.id) + '">다음 학습: ' + esc(next.label) + '</a>'
                : dayProgress.complete ? '<a class="btn btn-primary btn-lg" href="#/day?day=' + state.day + '">🎉 DAY ' + state.day + ' 완료! 확인하기</a>' : '') +
          '<a class="btn" href="#/day?day=' + state.day + '">DAY ' + state.day + ' 학습 현황</a>' +
          '<a class="btn" href="#/dashboard">Dashboard</a>' +
        '</div>' +
      '</div>' + wrongList;
  }

  function renderEmpty(day, section) {
    return '<section class="page"><a class="back-link" href="#/day?day=' + day + '">← DAY ' + day + '</a>' +
      '<div class="card placeholder"><h1>DAY ' + day + ' · ' + esc(section.label) + '</h1>' +
      '<p>' + (section.kind === 'review' ? '복습할 오답이 없습니다. 👍' : '이 영역에 등록된 문제가 없습니다.') + '</p>' +
      '<p><a class="btn btn-primary" href="#/day?day=' + day + '">DAY ' + day + '로 돌아가기</a></p></div></section>';
  }

  TM.pages.study = {
    title: '학습',
    menuPath: '/day', // 사이드바에서는 'DAY 학습'을 선택된 메뉴로 표시
    render: function (ctx, params) {
      var day = Number(params && params.day);
      var section = TM.dayService.getSection(params && params.section);
      if (!day || !section || ctx.content.days.indexOf(day) < 0) {
        return '<section class="page"><div class="card placeholder"><h1>학습할 DAY와 영역을 선택하세요</h1>' +
          '<p><a class="btn btn-primary" href="#/day">DAY 학습으로</a></p></div></section>';
      }
      if (section.kind === 'vocab') {
        return TM.components.renderPlaceholder({
          before: '<a class="back-link" href="#/day?day=' + day + '">← DAY ' + day + '</a>',
          title: 'DAY ' + day + ' · Vocabulary',
          description: '학습 대상 ' + ctx.content.getWords({ day: day }).length + '개',
          step: 7,
          features: ['단어 카드로 뜻 확인', '모름 / 헷갈림 / 알고 있음 선택', '단어가 나온 문제 함께 보기']
        });
      }
      var session = TM.studyService.buildSession(ctx.content, day, section.id, ctx.progress.getAttempts(), params.q);
      if (!session.items.length) return renderEmpty(day, section);
      return '<section class="page study" data-study></section>';
    },

    mount: function (root, ctx, params) {
      var host = root.querySelector('[data-study]');
      if (!host) return null;
      var session = TM.studyService.buildSession(ctx.content, Number(params.day), params.section, ctx.progress.getAttempts(), params.q);
      var state = {
        day: session.day, section: session.section, items: session.items,
        index: session.startIndex, attempt: null, flagged: null, results: [], finished: false,
        shownAt: 0, hiddenAt: null
      };

      function elapsed() { return Date.now() - state.shownAt; }

      function updateTimer() {
        var el = host.querySelector('#study-timer');
        if (!el) return;
        el.textContent = '⏱ ' + TM.date.formatDuration(state.attempt ? state.attempt.time_ms : elapsed());
      }

      function draw() {
        host.innerHTML = state.finished ? renderSummary(state, ctx) : renderQuestion(state, ctx);
        updateTimer();
      }

      function show(index) {
        state.index = index;
        state.attempt = null;
        state.flagged = null;
        state.shownAt = Date.now();
        ctx.progress.saveLastPosition(state.day, state.section.id, index);
        // 주소만 바꾸고 화면은 다시 만들지 않는다(새로고침하면 이 문제부터 시작)
        try { history.replaceState(null, '', studyHash(state, index)); } catch (e) { /* 무시 */ }
        draw();
        window.scrollTo(0, 0);
      }

      function choose(letter) {
        if (state.finished || state.attempt) return;
        var q = state.items[state.index];
        var record = ctx.progress.recordAttempt(q, letter, elapsed());
        state.flagged = record.is_correct ? null : ctx.progress.flagWordsForReview(q.vocabulary, q.question_id);
        state.attempt = record;
        state.results.push(record);
        // 지금 닫아도 다음 문제부터 이어서 할 수 있게 위치를 미리 저장한다
        if (state.index + 1 < state.items.length) ctx.progress.saveLastPosition(state.day, state.section.id, state.index + 1);
        else ctx.progress.clearLastPosition();
        draw();
      }

      function chooseReason(reasonId) {
        if (!state.attempt || state.attempt.is_correct) return;
        ctx.progress.setWrongReason(state.attempt.id, reasonId);
        state.attempt.wrong_reason = reasonId; // results 배열의 같은 기록도 함께 바뀐다
        draw();
      }

      function next() {
        if (!state.attempt) return;
        if (state.index + 1 < state.items.length) show(state.index + 1);
        else { state.finished = true; draw(); window.scrollTo(0, 0); }
      }

      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn || btn.disabled) return;
        if (btn.dataset.action === 'choose') choose(btn.dataset.letter);
        else if (btn.dataset.action === 'reason') chooseReason(btn.dataset.reason);
        else if (btn.dataset.action === 'next') next();
      }

      function onKey(e) {
        if (state.finished || e.metaKey || e.ctrlKey || e.altKey) return;
        // 버튼에 초점이 있을 때 Enter/Space는 클릭으로 처리되므로 중복 실행하지 않는다
        if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
        var key = e.key.toUpperCase();
        var idx = ['1', '2', '3', '4'].indexOf(key);
        var letter = idx >= 0 ? TM.constants.CHOICE_LETTERS[idx] : (TM.constants.CHOICE_LETTERS.indexOf(key) >= 0 ? key : null);
        if (letter && !state.attempt) { choose(letter); return; }
        if (e.key === 'Enter' && state.attempt) { e.preventDefault(); next(); }
      }

      // 다른 탭을 보는 동안은 풀이 시간에서 뺀다
      function onVisibility() {
        if (document.hidden) state.hiddenAt = Date.now();
        else if (state.hiddenAt) { if (!state.attempt) state.shownAt += Date.now() - state.hiddenAt; state.hiddenAt = null; }
      }

      host.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);
      document.addEventListener('visibilitychange', onVisibility);
      var timer = setInterval(function () { if (!state.attempt && !state.finished) updateTimer(); }, 1000);
      show(state.index);

      return function cleanup() {
        clearInterval(timer);
        host.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }
  };
})(window.TM = window.TM || {});
