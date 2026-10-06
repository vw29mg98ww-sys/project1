// 학습 화면
//   DAY 학습:   #/study?day=1&section=part5&q=0
//   Part 연습:  #/study?mode=practice&sid=세트ID&q=0  (Part 5/6/7 화면에서 만든 연습 세트)
// 문제 하나를 보여주고 → 답 선택 → 즉시 채점·저장 → 해설 → 다음 문제. 마지막 문제 뒤에는 결과 요약.
// 단어(Vocabulary) 영역은 STEP 7에서 구현한다.
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };

  function isPractice(state) { return state.kind === 'practice'; }

  function studyHash(state, index) {
    return isPractice(state)
      ? '#/study?mode=practice&sid=' + state.practice.id + '&q=' + index
      : '#/study?day=' + state.day + '&section=' + state.section.id + '&q=' + index;
  }

  function backLink(state) {
    return isPractice(state) ? { href: '#/part' + state.part, label: TM.constants.PARTS[state.part].name } : { href: '#/day?day=' + state.day, label: 'DAY ' + state.day };
  }

  function renderHeader(state) {
    var total = state.items.length;
    var current = state.finished ? total : state.index + 1;
    var answeredCount = state.finished ? total : state.index + (state.attempt ? 1 : 0);
    var location = isPractice(state)
      ? '<span class="loc-day">연습</span><span class="loc-part">' + esc(state.title) + '</span>'
      : '<span class="loc-day">DAY ' + state.day + '</span><span class="loc-part">' + esc(state.section.label) + '</span>';
    var back = backLink(state);
    return '<div class="study-header">' +
      '<div class="study-header-row">' +
        '<div class="study-location">' + location + '<span class="loc-q">Question ' + current + ' / ' + total + '</span></div>' +
        (state.finished ? '' : '<span class="study-timer" id="study-timer" aria-label="풀이 시간">⏱ 0:00</span>') +
        '<a class="btn btn-sm" href="' + back.href + '">' + (state.finished ? esc(back.label) : '그만하기') + '</a>' +
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

  function renderNextActions(state, ctx) {
    if (isPractice(state)) {
      return '<a class="btn btn-primary btn-lg" href="#/part' + state.part + '">' + esc(TM.constants.PARTS[state.part].name) + ' 화면으로</a>' +
        '<a class="btn" href="#/dashboard">Dashboard</a>';
    }
    var dayProgress = TM.dayService.computeDayProgress({ content: ctx.content, day: state.day, attempts: ctx.progress.getAttempts(), vocabState: ctx.progress.getVocabState() });
    var next = TM.dayService.nextSection(dayProgress);
    return (next ? '<a class="btn btn-primary btn-lg" href="' + TM.dayService.studyLink(state.day, next.id) + '">다음 학습: ' + esc(next.label) + '</a>'
          : dayProgress.complete ? '<a class="btn btn-primary btn-lg" href="#/day?day=' + state.day + '">🎉 DAY ' + state.day + ' 완료! 확인하기</a>' : '') +
      '<a class="btn" href="#/day?day=' + state.day + '">DAY ' + state.day + ' 학습 현황</a>' +
      '<a class="btn" href="#/dashboard">Dashboard</a>';
  }

  function renderSummary(state, ctx) {
    var s = TM.studyService.summarize(state.results);
    var wrong = state.results.filter(function (r) { return !r.is_correct; });
    var noReason = wrong.filter(function (r) { return !r.wrong_reason; }).length;
    var label = isPractice(state) ? state.title : state.section.label;

    var wrongList = wrong.length ? '<h2 class="section-title">틀린 문제</h2><ul class="card result-list">' + wrong.map(function (r) {
      var q = ctx.content.getQuestion(r.question_id);
      var reason = TM.constants.WRONG_REASONS.filter(function (x) { return x.id === r.wrong_reason; })[0];
      return '<li><div class="result-q">' + esc(q.question) + '</div>' +
        '<div class="muted small">내 답 (' + r.selected + ') · 정답 (' + q.correct_answer + ')' + (reason ? ' · 원인: ' + esc(reason.label) : '') + '</div></li>';
    }).join('') + '</ul>' : '';

    return renderHeader(state) +
      '<div class="card study-summary">' +
        '<div class="hero-label">' + esc(label) + ' 학습 결과</div>' +
        (s.answered
          ? '<div class="summary-score">' + s.correct + ' / ' + s.answered + '<span class="stat-unit">정답</span></div>' +
            '<div class="muted">정답률 ' + s.accuracy + '% · 평균 풀이 시간 ' + TM.date.formatDuration(s.avgTimeMs) + '</div>'
          : '<div class="summary-score">완료</div>') +
        (noReason ? '<p class="small">💡 오답 원인을 고르지 않은 문제가 ' + noReason + '개 있습니다. 원인을 기록하면 취약 영역 분석이 정확해집니다.</p>' : '') +
        '<div class="summary-actions">' + renderNextActions(state, ctx) + '</div>' +
      '</div>' + wrongList;
  }

  function messagePage(title, body, href, label) {
    return '<section class="page"><div class="card placeholder"><h1>' + esc(title) + '</h1>' +
      (body ? '<p>' + esc(body) + '</p>' : '') +
      '<p><a class="btn btn-primary" href="' + href + '">' + esc(label) + '</a></p></div></section>';
  }

  // 주소의 파라미터로 세션을 만든다. 만들 수 없으면 { page: 안내 HTML }
  function resolve(ctx, params) {
    params = params || {};
    if (params.mode === 'practice') {
      var practice = ctx.progress.getPracticeSession();
      if (!practice || practice.id !== params.sid) {
        return { page: messagePage('연습 세트를 찾을 수 없습니다', '새로운 연습을 시작하세요. (연습 세트는 가장 최근 것 하나만 저장됩니다)', '#/part5', 'Part 5 연습하러 가기') };
      }
      var ps = TM.studyService.buildPracticeSession(ctx.content, practice, params.q);
      if (!ps.items.length) return { page: messagePage('연습할 문제가 없습니다', '', '#/part' + practice.part, 'Part 화면으로') };
      return { session: ps };
    }
    var day = Number(params.day);
    var section = TM.dayService.getSection(params.section);
    if (!day || !section || ctx.content.days.indexOf(day) < 0) {
      return { page: messagePage('학습할 DAY와 영역을 선택하세요', '', '#/day', 'DAY 학습으로') };
    }
    if (section.kind === 'vocab') {
      return { page: TM.components.renderPlaceholder({
        before: '<a class="back-link" href="#/day?day=' + day + '">← DAY ' + day + '</a>',
        title: 'DAY ' + day + ' · Vocabulary',
        description: '학습 대상 ' + ctx.content.getWords({ day: day }).length + '개',
        step: 7,
        features: ['단어 카드로 뜻 확인', '모름 / 헷갈림 / 알고 있음 선택', '단어가 나온 문제 함께 보기']
      }) };
    }
    var session = TM.studyService.buildSession(ctx.content, day, section.id, ctx.progress.getAttempts(), params.q);
    if (!session.items.length) {
      return { page: '<section class="page"><a class="back-link" href="#/day?day=' + day + '">← DAY ' + day + '</a>' +
        '<div class="card placeholder"><h1>DAY ' + day + ' · ' + esc(section.label) + '</h1>' +
        '<p>' + (section.kind === 'review' ? '복습할 오답이 없습니다. 👍' : '이 영역에 등록된 문제가 없습니다.') + '</p>' +
        '<p><a class="btn btn-primary" href="#/day?day=' + day + '">DAY ' + day + '로 돌아가기</a></p></div></section>' };
    }
    return { session: session };
  }

  TM.pages.study = {
    title: '학습',
    // 사이드바에서 선택된 메뉴: DAY 학습이면 'DAY 학습', 연습이면 해당 Part
    menuPathFor: function (ctx, params) {
      if (params && params.mode === 'practice') {
        var p = ctx.progress.getPracticeSession();
        return p ? '/part' + p.part : '/day';
      }
      return '/day';
    },
    render: function (ctx, params) {
      var r = resolve(ctx, params);
      return r.page || '<section class="page study" data-study></section>';
    },

    mount: function (root, ctx, params) {
      var host = root.querySelector('[data-study]');
      if (!host) return null;
      var session = resolve(ctx, params).session;
      var state = {
        kind: session.kind, day: session.day, section: session.section,
        practice: session.practice, part: session.part, title: session.title,
        items: session.items, index: session.startIndex,
        attempt: null, flagged: null, results: [], finished: false, shownAt: 0, hiddenAt: null
      };

      // 이어서 학습 위치 저장: DAY 학습은 '이어서 학습' 위치, 연습은 연습 세트 안의 위치
      function savePosition(index) {
        if (isPractice(state)) ctx.progress.savePracticeIndex(index);
        else ctx.progress.saveLastPosition(state.day, state.section.id, index);
      }
      function clearPosition() {
        if (isPractice(state)) ctx.progress.savePracticeIndex(state.items.length);
        else ctx.progress.clearLastPosition();
      }

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
        savePosition(index);
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
        if (state.index + 1 < state.items.length) savePosition(state.index + 1);
        else clearPosition();
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
