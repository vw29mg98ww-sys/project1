// Vocabulary: 단어 현황, 복습 단어 학습, 검색·필터, 단어별 상세(예문·관련 문제)
// 필터는 주소에 저장된다(#/vocabulary?status=review&day=1&q=imp) — 새로고침해도 유지
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };
  var STATUS_FILTERS = [
    { id: 'all', label: '전체' }, { id: 'review', label: '복습 단어' }, { id: 'new', label: '미학습' },
    { id: 'unknown', label: '모름' }, { id: 'confused', label: '헷갈림' }, { id: 'known', label: '알고 있음' }
  ];

  function currentFilter(params) {
    params = params || {};
    return { query: params.q || '', day: params.day || '', status: params.status || 'all', difficulty: params.level || '' };
  }

  function filterHash(f) {
    var parts = [];
    if (f.status && f.status !== 'all') parts.push('status=' + encodeURIComponent(f.status));
    if (f.day) parts.push('day=' + encodeURIComponent(f.day));
    if (f.difficulty) parts.push('level=' + encodeURIComponent(f.difficulty));
    if (f.query) parts.push('q=' + encodeURIComponent(f.query));
    return '#/vocabulary' + (parts.length ? '?' + parts.join('&') : '');
  }

  function renderRow(ctx, view) {
    var w = view.word;
    var level = TM.constants.DIFFICULTY_LEVELS[w.difficulty];
    var related = view.related.map(function (id) {
      var wrong = view.wrongQuestions.indexOf(id) >= 0;
      return '<li><a href="#/question?id=' + encodeURIComponent(id) + '&from=vocabulary">' + esc(ctx.content.questionLabel(id)) + '</a>' +
        (wrong ? ' <span class="tag tag-warn">틀린 문제</span>' : '') + '</li>';
    }).join('');
    return '<details class="word-row">' +
      '<summary>' +
        '<span class="wr-word">' + esc(w.word) + '</span>' +
        '<span class="wr-pos muted">' + esc(w.part_of_speech || '') + '</span>' +
        '<span class="wr-meaning">' + esc(w.meaning) + '</span>' +
        '<span class="word-status status-' + view.status + '">' + esc(view.statusLabel) + '</span>' +
      '</summary>' +
      '<div class="wr-detail">' +
        (w.example_sentence ? '<p class="word-example">' + esc(w.example_sentence) + '</p>' : '') +
        '<div class="wr-facts muted small">DAY ' + w.day + (level ? ' · ' + esc(level.label + ' ' + level.name) : '') +
          ' · 학습 ' + view.reviewCount + '회' + (w.source ? ' · 출처: ' + esc(w.source) : '') + '</div>' +
        (related ? '<div class="word-section-label">관련 문제</div><ul class="wr-related">' + related + '</ul>' : '<div class="muted small">연결된 문제가 없습니다.</div>') +
        '<div class="mastery-buttons small-buttons">' + ['unknown', 'confused', 'known'].map(function (st) {
          return '<button type="button" class="btn btn-sm mastery-btn mastery-' + st + (view.status === st ? ' is-current' : '') + '" data-action="mark" data-word="' + esc(w.word) + '" data-status="' + st + '">' +
            esc(TM.vocabService.STATUS[st].label) + '</button>';
        }).join('') + '</div>' +
      '</div>' +
    '</details>';
  }

  var PAGE_SIZE = 30;

  // limit: 처음에는 30개만 보여주고 '더 보기'로 늘린다 (단어가 많아져도 화면이 가볍도록)
  function renderList(ctx, filter, limit) {
    var vocabState = ctx.progress.getVocabState();
    var list = TM.vocabService.filterWords(ctx.content.words, vocabState, filter);
    if (!list.length) return '<p class="muted empty-list">조건에 맞는 단어가 없습니다.</p>';
    limit = limit || PAGE_SIZE;
    var rest = list.length - limit;
    return '<div class="list-count muted small">' + list.length + '개 단어</div>' +
      list.slice(0, limit).map(function (w) { return renderRow(ctx, TM.vocabService.wordView(ctx.content, vocabState, w)); }).join('') +
      (rest > 0 ? '<div class="more-row"><button type="button" class="btn" data-action="more">더 보기 (' + rest + '개 남음)</button></div>' : '');
  }

  TM.pages.vocabulary = {
    title: 'Vocabulary',
    render: function (ctx, params) {
      var C = TM.constants;
      var counts = TM.vocabService.summarize(ctx.content.words, ctx.progress.getVocabState());
      var filter = currentFilter(params);
      var currentDay = ctx.progress.getProfile().currentDay;
      var knownPct = counts.total ? (counts.known / counts.total) * 100 : 0;

      var stat = function (label, value, status) {
        return '<a class="card vocab-stat" href="' + filterHash({ status: status }) + '"><div class="stat-label">' + label + '</div><div class="stat-value">' + value + '</div></a>';
      };

      return '<section class="page vocab-page">' +
        '<header class="page-header"><h1>Vocabulary</h1><p class="muted">문제에 나온 핵심 어휘 ' + counts.total + '개 · 모르거나 헷갈리는 단어, 문제에서 틀린 단어는 자동으로 복습 단어가 됩니다.</p></header>' +

        '<div class="card vocab-hero">' +
          '<div class="vocab-hero-main">' +
            '<div class="hero-label">암기한 단어</div>' +
            '<div class="day-summary-pct">' + counts.known + '<span class="stat-unit">/ ' + counts.total + '</span></div>' +
            TM.components.renderMeter({ value: knownPct, label: '암기한 단어 비율' }) +
          '</div>' +
          '<div class="vocab-hero-actions">' +
            '<button type="button" class="btn btn-primary btn-lg" data-action="review"' + (counts.reviewTotal ? '' : ' disabled') + '>복습 단어 학습 (' + counts.reviewTotal + ')</button>' +
            '<a class="btn" href="' + TM.dayService.studyLink(currentDay, 'vocabulary') + '">DAY ' + currentDay + ' 단어 학습</a>' +
          '</div>' +
        '</div>' +

        '<div class="vocab-stats">' +
          stat('복습 단어', counts.reviewTotal, 'review') + stat('모름', counts.unknown, 'unknown') + stat('헷갈림', counts.confused, 'confused') +
          stat('문제 오답', counts.review, 'review') + stat('알고 있음', counts.known, 'known') + stat('미학습', counts.new, 'new') +
        '</div>' +

        '<div class="card vocab-filters">' +
          '<input type="search" class="input" placeholder="단어 또는 뜻 검색" value="' + esc(filter.query) + '" data-filter="query" aria-label="단어 검색">' +
          '<select class="input" data-filter="status" aria-label="학습 상태">' + STATUS_FILTERS.map(function (s) {
            return '<option value="' + s.id + '"' + (filter.status === s.id ? ' selected' : '') + '>' + s.label + '</option>';
          }).join('') + '</select>' +
          '<select class="input" data-filter="day" aria-label="DAY"><option value="">모든 DAY</option>' + ctx.content.days.map(function (d) {
            return '<option value="' + d + '"' + (String(filter.day) === String(d) ? ' selected' : '') + '>DAY ' + d + '</option>';
          }).join('') + '</select>' +
          '<select class="input" data-filter="difficulty" aria-label="난이도"><option value="">모든 난이도</option>' + [1, 2, 3, 4].map(function (l) {
            return '<option value="' + l + '"' + (String(filter.difficulty) === String(l) ? ' selected' : '') + '>' + C.DIFFICULTY_LEVELS[l].label + '</option>';
          }).join('') + '</select>' +
        '</div>' +

        '<div class="card word-list" data-word-list>' + renderList(ctx, filter) + '</div>' +
      '</section>';
    },

    mount: function (root, ctx, params) {
      var filter = currentFilter(params);
      var listEl = root.querySelector('[data-word-list]');
      var limit = PAGE_SIZE;

      function refreshList() {
        try { history.replaceState(null, '', filterHash(filter)); } catch (e) { /* 무시 */ }
        listEl.innerHTML = renderList(ctx, filter, limit);
      }

      function onInput(e) {
        var key = e.target.dataset && e.target.dataset.filter;
        if (!key) return;
        filter[key] = e.target.value;
        limit = PAGE_SIZE;
        refreshList();
      }

      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn || btn.disabled) return;
        if (btn.dataset.action === 'more') {
          limit += PAGE_SIZE;
          listEl.innerHTML = renderList(ctx, filter, limit);
        } else if (btn.dataset.action === 'review') {
          var queue = TM.vocabService.reviewQueue(ctx.content.words, ctx.progress.getVocabState());
          if (!queue.length) return;
          var set = ctx.progress.startVocabSession({ title: '복습 단어', words: queue.map(function (w) { return w.word; }) });
          ctx.router.navigate('/vocab-study?sid=' + set.id);
        } else if (btn.dataset.action === 'mark') {
          ctx.progress.setVocabStatus(btn.dataset.word, btn.dataset.status);
          // 현황 숫자도 바뀌므로 화면 전체를 다시 그리되, 스크롤 위치와 펼쳐 둔 단어는 유지한다
          var word = btn.dataset.word;
          var y = window.scrollY;
          ctx.router.refresh();
          var again = document.querySelector('[data-action="mark"][data-word="' + CSS.escape(word) + '"]');
          if (again) again.closest('details').open = true;
          window.scrollTo(0, y);
        }
      }

      root.addEventListener('input', onInput);
      root.addEventListener('click', onClick);
      return function () {
        root.removeEventListener('input', onInput);
        root.removeEventListener('click', onClick);
      };
    }
  };
})(window.TM = window.TM || {});
