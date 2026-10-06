// 단어 카드 학습
//   DAY 단어:   #/study?day=1&section=vocabulary&q=0   (StudyPage가 이 화면으로 넘긴다)
//   단어 복습:  #/vocab-study?sid=세트ID&q=0           (Vocabulary 화면에서 만든 복습 세트)
// 단어 → (뜻 보기) → 모름 / 헷갈림 / 알고 있음 선택 → 다음 단어. 마지막 뒤에는 결과 요약.
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };
  var CHOICES = [
    { status: 'unknown', label: '모름', key: '1' },
    { status: 'confused', label: '헷갈림', key: '2' },
    { status: 'known', label: '알고 있음', key: '3' }
  ];

  function isDay(state) { return state.kind === 'day'; }

  function hashFor(state, index) {
    return isDay(state)
      ? '#/study?day=' + state.day + '&section=vocabulary&q=' + index
      : '#/vocab-study?sid=' + state.set.id + '&q=' + index;
  }

  function backLink(state) {
    return isDay(state) ? { href: '#/day?day=' + state.day, label: 'DAY ' + state.day } : { href: '#/vocabulary', label: 'Vocabulary' };
  }

  function messagePage(title, body, href, label) {
    return '<section class="page"><div class="card placeholder"><h1>' + esc(title) + '</h1>' +
      (body ? '<p>' + esc(body) + '</p>' : '') +
      '<p><a class="btn btn-primary" href="' + href + '">' + esc(label) + '</a></p></div></section>';
  }

  // 주소 → 세션. 만들 수 없으면 { page: 안내 HTML }
  function resolve(ctx, params) {
    params = params || {};
    var vocabState = ctx.progress.getVocabState();
    var words, start, base;
    if (params.section === 'vocabulary') {
      var day = Number(params.day);
      if (!day || ctx.content.days.indexOf(day) < 0) return { page: messagePage('학습할 DAY를 선택하세요', '', '#/day', 'DAY 학습으로') };
      words = ctx.content.getWords({ day: day });
      if (!words.length) return { page: messagePage('DAY ' + day + ' · Vocabulary', '이 DAY에 등록된 단어가 없습니다.', '#/day?day=' + day, 'DAY ' + day + '로 돌아가기') };
      start = TM.vocabService.firstUnstudiedIndex(words, vocabState);
      base = { kind: 'day', day: day, title: 'Vocabulary' };
    } else {
      var set = ctx.progress.getVocabSession();
      if (!set || set.id !== params.sid) return { page: messagePage('단어 세트를 찾을 수 없습니다', 'Vocabulary 화면에서 새로 시작하세요. (가장 최근 세트 하나만 저장됩니다)', '#/vocabulary', 'Vocabulary로 가기') };
      words = set.words.map(function (w) { return ctx.content.getWord(w); }).filter(Boolean);
      if (!words.length) return { page: messagePage('학습할 단어가 없습니다', '', '#/vocabulary', 'Vocabulary로 가기') };
      start = Math.min(set.index || 0, words.length - 1);
      base = { kind: 'set', set: set, title: set.title };
    }
    var q = Number(params.q);
    if (params.q !== undefined && params.q !== '' && Number.isInteger(q) && q >= 0 && q < words.length) start = q;
    base.words = words;
    base.startIndex = start;
    return { session: base };
  }

  function renderHeader(state) {
    var total = state.words.length;
    var current = state.finished ? total : state.index + 1;
    var back = backLink(state);
    var location = isDay(state)
      ? '<span class="loc-day">DAY ' + state.day + '</span><span class="loc-part">Vocabulary</span>'
      : '<span class="loc-day">단어</span><span class="loc-part">' + esc(state.title) + '</span>';
    return '<div class="study-header"><div class="study-header-row">' +
        '<div class="study-location">' + location + '<span class="loc-q">Word ' + current + ' / ' + total + '</span></div>' +
        '<a class="btn btn-sm" href="' + back.href + '">' + (state.finished ? esc(back.label) : '그만하기') + '</a>' +
      '</div>' + TM.components.renderMeter({ value: total ? ((state.finished ? total : state.index) / total) * 100 : 0, label: '진행률' }) +
    '</div>';
  }

  function renderRelated(ctx, view) {
    if (!view.related.length) return '';
    return '<div class="word-related"><div class="word-section-label">관련 문제</div><ul>' + view.related.map(function (id) {
      var wrong = view.wrongQuestions.indexOf(id) >= 0;
      return '<li><a href="#/question?id=' + encodeURIComponent(id) + '">' + esc(ctx.content.questionLabel(id)) + '</a>' +
        (wrong ? ' <span class="tag tag-warn">틀린 문제</span>' : '') + '</li>';
    }).join('') + '</ul></div>';
  }

  function renderCard(state, ctx) {
    var word = state.words[state.index];
    var view = TM.vocabService.wordView(ctx.content, ctx.progress.getVocabState(), word);
    var level = TM.constants.DIFFICULTY_LEVELS[word.difficulty];
    return renderHeader(state) +
      '<div class="card word-card' + (state.flipped ? ' is-flipped' : '') + '">' +
        '<div class="word-top">' +
          (word.part_of_speech ? '<span class="chip">' + esc(word.part_of_speech) + '</span>' : '') +
          (level ? '<span class="muted small">' + esc(level.label) + '</span>' : '') +
          '<span class="word-status status-' + view.status + '">' + esc(view.statusLabel) + '</span>' +
        '</div>' +
        '<div class="word-text">' + esc(word.word) + '</div>' +
        (state.flipped
          ? '<div class="word-meaning">' + esc(word.meaning) + '</div>' +
            (word.example_sentence ? '<p class="word-example">' + esc(word.example_sentence) + '</p>' : '') +
            renderRelated(ctx, view) +
            (word.source ? '<div class="muted small">출처: ' + esc(word.source) + '</div>' : '')
          : '<button type="button" class="btn btn-lg word-flip" data-action="flip">뜻 보기</button>') +
        '<div class="mastery-buttons">' + CHOICES.map(function (c) {
          return '<button type="button" class="btn mastery-btn mastery-' + c.status + (view.status === c.status ? ' is-current' : '') + '" data-action="mark" data-status="' + c.status + '">' +
            esc(c.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="word-nav">' +
          (state.index > 0 ? '<button type="button" class="btn btn-sm" data-action="prev">← 이전 단어</button>' : '<span></span>') +
          '<button type="button" class="btn btn-sm" data-action="skip">건너뛰기 →</button>' +
        '</div>' +
        '<p class="hint">키보드: Space 뜻 보기 · 1 모름 · 2 헷갈림 · 3 알고 있음 · ← → 이동</p>' +
      '</div>';
  }

  function renderSummary(state, ctx) {
    var counts = { unknown: 0, confused: 0, known: 0 };
    Object.keys(state.marked).forEach(function (w) { counts[state.marked[w]]++; });
    var total = counts.unknown + counts.confused + counts.known;
    var actions;
    if (isDay(state)) {
      var dp = TM.dayService.computeDayProgress({ content: ctx.content, day: state.day, attempts: ctx.progress.getAttempts(), vocabState: ctx.progress.getVocabState() });
      var next = TM.dayService.nextSection(dp);
      actions = (next ? '<a class="btn btn-primary btn-lg" href="' + TM.dayService.studyLink(state.day, next.id) + '">다음 학습: ' + esc(next.label) + '</a>'
          : dp.complete ? '<a class="btn btn-primary btn-lg" href="#/day?day=' + state.day + '">🎉 DAY ' + state.day + ' 완료! 확인하기</a>' : '') +
        '<a class="btn" href="#/day?day=' + state.day + '">DAY ' + state.day + ' 학습 현황</a>';
    } else {
      actions = '<a class="btn btn-primary btn-lg" href="#/vocabulary">Vocabulary로</a>';
    }
    return renderHeader(state) +
      '<div class="card study-summary">' +
        '<div class="hero-label">' + esc(isDay(state) ? 'DAY ' + state.day + ' 단어' : state.title) + ' 학습 결과</div>' +
        '<div class="summary-score">' + total + '<span class="stat-unit">단어</span></div>' +
        '<div class="summary-counts"><span class="status-known">알고 있음 ' + counts.known + '</span> · <span class="status-confused">헷갈림 ' + counts.confused + '</span> · <span class="status-unknown">모름 ' + counts.unknown + '</span></div>' +
        (counts.unknown + counts.confused ? '<p class="small">모름·헷갈림 단어는 Vocabulary의 <b>복습 단어</b>에 모아 두었습니다.</p>' : '') +
        '<div class="summary-actions">' + actions + '<a class="btn" href="#/dashboard">Dashboard</a></div>' +
      '</div>';
  }

  TM.pages.vocabStudy = {
    title: '단어 학습',
    menuPathFor: function (ctx, params) { return params && params.section === 'vocabulary' ? '/day' : '/vocabulary'; },
    resolve: resolve,
    render: function (ctx, params) {
      var r = resolve(ctx, params);
      return r.page || '<section class="page study" data-vocab-study></section>';
    },
    mount: function (root, ctx, params) {
      var host = root.querySelector('[data-vocab-study]');
      if (!host) return null;
      var s = resolve(ctx, params).session;
      var state = { kind: s.kind, day: s.day, set: s.set, title: s.title, words: s.words, index: s.startIndex, flipped: false, finished: false, marked: {} };

      function savePosition(index) {
        if (isDay(state)) {
          if (index < state.words.length) ctx.progress.saveLastPosition(state.day, 'vocabulary', index);
          else ctx.progress.clearLastPosition();
        } else {
          ctx.progress.saveVocabIndex(index);
        }
      }

      function draw() { host.innerHTML = state.finished ? renderSummary(state, ctx) : renderCard(state, ctx); }

      function show(index) {
        if (index >= state.words.length) {
          state.finished = true;
          savePosition(state.words.length);
          draw();
          window.scrollTo(0, 0);
          return;
        }
        state.index = Math.max(0, index);
        state.flipped = false;
        state.finished = false;
        savePosition(state.index);
        try { history.replaceState(null, '', hashFor(state, state.index)); } catch (e) { /* 무시 */ }
        draw();
      }

      function mark(status) {
        var word = state.words[state.index];
        ctx.progress.setVocabStatus(word.word, status);
        state.marked[word.word] = status;
        show(state.index + 1);
      }

      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var a = btn.dataset.action;
        if (a === 'flip') { state.flipped = true; draw(); }
        else if (a === 'mark') mark(btn.dataset.status);
        else if (a === 'prev') show(state.index - 1);
        else if (a === 'skip') show(state.index + 1);
      }

      function onKey(e) {
        if (state.finished || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
        if (e.target.tagName === 'INPUT') return;
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); state.flipped = !state.flipped; draw(); return; }
        var choice = CHOICES.filter(function (c) { return c.key === e.key; })[0];
        if (choice) { mark(choice.status); return; }
        if (e.key === 'ArrowRight') show(state.index + 1);
        else if (e.key === 'ArrowLeft' && state.index > 0) show(state.index - 1);
      }

      host.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);
      show(state.index);
      return function () {
        host.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
      };
    }
  };
})(window.TM = window.TM || {});
