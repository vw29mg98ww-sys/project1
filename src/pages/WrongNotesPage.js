// 오답노트: 틀린 문제 모아 보기, 필터(상태·DAY·Part·유형·오답 원인), 원인 기록, 필터한 오답 다시 풀기
// 필터는 주소에 저장된다(#/wrong-notes?reason=vocabulary&part=7) — 새로고침해도 유지
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };
  var PAGE_SIZE = 20;
  var FILTER_KEYS = ['status', 'day', 'part', 'type', 'reason'];

  function currentFilter(params) {
    params = params || {};
    var f = {};
    FILTER_KEYS.forEach(function (k) { f[k] = params[k] || ''; });
    if (!f.status) f.status = 'open';
    return f;
  }

  function filterHash(f) {
    var parts = [];
    FILTER_KEYS.forEach(function (k) {
      if (f[k] && !(k === 'status' && f[k] === 'open')) parts.push(k + '=' + encodeURIComponent(f[k]));
    });
    return '#/wrong-notes' + (parts.length ? '?' + parts.join('&') : '');
  }

  function reasonLabel(id) {
    var r = TM.constants.WRONG_REASONS.filter(function (x) { return x.id === id; })[0];
    return r ? r.label : '';
  }

  function choiceText(q, letter) {
    return '(' + letter + ') ' + q.choices[TM.constants.CHOICE_LETTERS.indexOf(letter)];
  }

  function renderEntry(ctx, e) {
    var q = e.question;
    var words = (q.vocabulary || []).map(function (w) { return ctx.content.getWord(w); }).filter(Boolean);
    var date = TM.date.toDateKey(new Date(e.lastWrong.answered_at));
    return '<article class="card note-card' + (e.resolved ? ' is-resolved' : '') + '">' +
      '<header class="note-head">' +
        '<a class="note-label" href="#/question?id=' + encodeURIComponent(q.question_id) + '&from=wrong-notes">' + esc(ctx.content.questionLabel(q.question_id)) + '</a>' +
        (q.question_type ? '<span class="chip">' + esc(q.question_type) + '</span>' : '') +
        '<span class="note-status ' + (e.resolved ? 'is-resolved' : 'is-open') + '">' + (e.resolved ? '✓ 해결됨' : '미해결') + '</span>' +
        '<span class="muted small note-meta">틀림 ' + e.wrongCount + '회 · ' + date + '</span>' +
      '</header>' +
      (q.passage_id ? '<div class="muted small">지문 문제 · 자세히 보기에서 지문을 확인하세요</div>' : '') +
      '<p class="note-question">' + esc(q.question) + '</p>' +
      '<div class="note-answers">' +
        '<div>내 답 <b class="bad-text">' + esc(choiceText(q, e.lastWrong.selected)) + '</b></div>' +
        '<div>정답 <b class="ok-text">' + esc(choiceText(q, q.correct_answer)) + '</b></div>' +
      '</div>' +
      '<p class="note-summary">' + esc(q.explanation.summary) + '</p>' +
      '<div class="note-row"><span class="note-row-label">오답 원인</span><div class="reason-chips">' +
        TM.constants.WRONG_REASONS.map(function (r) {
          var on = e.reason === r.id;
          return '<button type="button" class="reason-chip' + (on ? ' is-selected' : '') + '" data-action="reason" data-attempt="' + esc(e.lastWrong.id) + '" data-reason="' + r.id + '" aria-pressed="' + on + '">' + esc(r.label) + '</button>';
        }).join('') +
      '</div></div>' +
      (words.length ? '<div class="note-row"><span class="note-row-label">관련 단어</span><div class="note-words">' + words.map(function (w) {
        return '<a href="#/vocabulary?q=' + encodeURIComponent(w.word) + '"><b>' + esc(w.word) + '</b> ' + esc(w.meaning) + '</a>';
      }).join('') + '</div></div>' : '') +
      '<div class="note-actions">' +
        '<a class="btn btn-sm" href="#/question?id=' + encodeURIComponent(q.question_id) + '&from=wrong-notes">자세히 보기</a>' +
        '<button type="button" class="btn btn-sm btn-primary" data-action="retry-one" data-id="' + esc(q.question_id) + '">다시 풀기</button>' +
      '</div>' +
    '</article>';
  }

  function select(key, label, options, value) {
    return '<label class="filter-field"><span>' + label + '</span><select class="input" data-filter="' + key + '">' +
      options.map(function (o) { return '<option value="' + esc(o.value) + '"' + (String(value) === String(o.value) ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') +
      '</select></label>';
  }

  function renderBody(ctx, filter, limit) {
    var all = TM.wrongNoteService.buildEntries(ctx.content, ctx.progress.getAttempts());
    if (!all.length) {
      return '<div class="card placeholder"><h2 class="card-title">아직 틀린 문제가 없습니다</h2>' +
        '<p class="muted">문제를 풀다가 틀리면 여기에 자동으로 모입니다. 틀린 이유(오답 원인)도 함께 기록해 두세요.</p>' +
        '<p><a class="btn btn-primary" href="#/day">DAY 학습 하러 가기</a></p></div>';
    }
    var list = TM.wrongNoteService.filterEntries(all, filter);
    var summary = TM.wrongNoteService.summarize(all);
    var C = TM.constants;

    var reasonOptions = [{ value: '', label: '모든 원인' }, { value: 'none', label: '원인 미선택' }]
      .concat(C.WRONG_REASONS.map(function (r) { return { value: r.id, label: r.label }; }));
    var topReasons = Object.keys(summary.byReason).sort(function (a, b) { return summary.byReason[b] - summary.byReason[a]; }).slice(0, 3);

    var quick = TM.wrongNoteService.QUICK.map(function (qf) {
      var active = (filter.reason || '') === qf.reason;
      return '<button type="button" class="quick-chip' + (active ? ' is-active' : '') + '" data-action="quick" data-reason="' + qf.reason + '" aria-pressed="' + active + '">' + esc(qf.label) + '</button>';
    }).join('');

    var rest = list.length - limit;
    return '<div class="card note-summary-card">' +
        '<div class="note-counts">' +
          '<div><div class="stat-label">미해결</div><div class="stat-value">' + summary.open + '</div></div>' +
          '<div><div class="stat-label">해결됨</div><div class="stat-value">' + summary.resolved + '</div></div>' +
          '<div><div class="stat-label">원인 미선택</div><div class="stat-value">' + summary.noReason + '</div></div>' +
        '</div>' +
        (topReasons.length ? '<p class="muted small">미해결 오답의 주요 원인: ' + topReasons.map(function (r) { return esc(reasonLabel(r)) + ' ' + summary.byReason[r] + '개'; }).join(' · ') + '</p>' : '') +
      '</div>' +
      '<div class="quick-chips" role="group" aria-label="빠른 필터">' + quick + '</div>' +
      '<div class="card note-filters">' +
        select('status', '상태', [{ value: 'open', label: '미해결' }, { value: 'resolved', label: '해결됨' }, { value: 'all', label: '전체' }], filter.status) +
        select('day', 'DAY', [{ value: '', label: '모든 DAY' }].concat(ctx.content.days.map(function (d) { return { value: d, label: 'DAY ' + d }; })), filter.day) +
        select('part', 'Part', [{ value: '', label: '모든 Part' }, { value: 5, label: 'Part 5' }, { value: 6, label: 'Part 6' }, { value: 7, label: 'Part 7' }], filter.part) +
        select('type', '유형', [{ value: '', label: '모든 유형' }].concat(TM.wrongNoteService.typesIn(all).map(function (t) { return { value: t, label: t }; })), filter.type) +
        select('reason', '오답 원인', reasonOptions, filter.reason) +
      '</div>' +
      '<div class="note-list-head"><span class="muted small">' + list.length + '개 오답</span>' +
        '<button type="button" class="btn btn-primary" data-action="retry-filtered"' + (list.length ? '' : ' disabled') + '>이 목록 다시 풀기 (' + list.length + ')</button></div>' +
      (list.length
        ? list.slice(0, limit).map(function (e) { return renderEntry(ctx, e); }).join('') +
          (rest > 0 ? '<div class="more-row"><button type="button" class="btn" data-action="more">더 보기 (' + rest + '개 남음)</button></div>' : '')
        : '<div class="card"><p class="muted empty-list">조건에 맞는 오답이 없습니다.' + (filter.status === 'open' ? ' 상태를 \'전체\'로 바꿔 해결된 문제도 볼 수 있습니다.' : '') + '</p></div>');
  }

  TM.pages.wrongNotes = {
    title: '오답노트',
    render: function (ctx, params) {
      return '<section class="page notes-page">' +
        '<header class="page-header"><h1>오답노트</h1><p class="muted">한 번이라도 틀린 문제가 모입니다. 다시 풀어 맞히면 \'해결됨\'으로 바뀝니다.</p></header>' +
        '<div data-notes>' + renderBody(ctx, currentFilter(params), PAGE_SIZE) + '</div>' +
      '</section>';
    },
    mount: function (root, ctx, params) {
      var filter = currentFilter(params);
      var limit = PAGE_SIZE;
      var host = root.querySelector('[data-notes]');

      function redraw(keepScroll) {
        var y = window.scrollY;
        try { history.replaceState(null, '', filterHash(filter)); } catch (e) { /* 무시 */ }
        host.innerHTML = renderBody(ctx, filter, limit);
        if (keepScroll) window.scrollTo(0, y);
      }

      function startRetry(ids, title) {
        // 문제 데이터 순서로 정렬한 뒤 연습 순서를 정한다 (같은 지문의 문제가 (1)(2)(3) 순서대로 나오도록)
        var questions = ctx.content.questions.filter(function (q) { return ids.indexOf(q.question_id) >= 0; });
        var ordered = TM.practiceService.orderForPractice(questions, ctx.progress.getAttempts());
        var session = ctx.progress.startPracticeSession({
          title: title, part: questions.length === 1 ? questions[0].part : null, mode: 'wrong-note',
          // 돌아올 때 지금 필터 그대로 (예: /wrong-notes?part=7)
          ids: ordered.map(function (q) { return q.question_id; }), returnTo: filterHash(filter).slice(1), returnLabel: '오답노트'
        });
        ctx.router.navigate('/study?mode=practice&sid=' + session.id);
      }

      function onChange(e) {
        var key = e.target.dataset && e.target.dataset.filter;
        if (!key) return;
        filter[key] = e.target.value;
        limit = PAGE_SIZE;
        redraw(false);
      }

      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn || btn.disabled) return;
        var a = btn.dataset.action;
        if (a === 'quick') { filter.reason = btn.dataset.reason; limit = PAGE_SIZE; redraw(false); }
        else if (a === 'more') { limit += PAGE_SIZE; redraw(true); }
        else if (a === 'reason') { ctx.progress.setWrongReason(btn.dataset.attempt, btn.dataset.reason); redraw(true); }
        else if (a === 'retry-one') { startRetry([btn.dataset.id], '오답 다시 풀기 · ' + ctx.content.questionLabel(btn.dataset.id)); }
        else if (a === 'retry-filtered') {
          var list = TM.wrongNoteService.filterEntries(TM.wrongNoteService.buildEntries(ctx.content, ctx.progress.getAttempts()), filter);
          if (list.length) startRetry(list.map(function (en) { return en.question.question_id; }), '오답 다시 풀기 (' + list.length + '문제)');
        }
      }

      root.addEventListener('change', onChange);
      root.addEventListener('click', onClick);
      return function () {
        root.removeEventListener('change', onChange);
        root.removeEventListener('click', onClick);
      };
    }
  };
})(window.TM = window.TM || {});
