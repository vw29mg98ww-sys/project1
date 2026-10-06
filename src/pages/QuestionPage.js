// 문제 상세 (#/question?id=d1-p5-03): 지문, 정답, 전체 해설, 내 풀이 기록, 다시 풀기
// 단어의 '관련 문제'와 오답노트에서 연결된다.
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };

  function formatTime(iso) {
    var d = new Date(iso);
    return TM.date.toDateKey(d) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function renderHistory(attempts) {
    if (!attempts.length) return '<p class="muted">아직 풀지 않은 문제입니다.</p>';
    return '<ul class="history-list">' + attempts.slice().reverse().map(function (a) {
      var reason = TM.constants.WRONG_REASONS.filter(function (r) { return r.id === a.wrong_reason; })[0];
      return '<li><span class="' + (a.is_correct ? 'ok-text' : 'bad-text') + '">' + (a.is_correct ? '⭕ 정답' : '❌ 오답') + '</span> ' +
        '<span class="muted small">' + esc(formatTime(a.answered_at)) + '</span> · 내 답 (' + esc(a.selected) + ') · ' + TM.date.formatDuration(a.time_ms) +
        (reason ? ' · 원인: ' + esc(reason.label) : '') + '</li>';
    }).join('') + '</ul>';
  }

  TM.pages.question = {
    title: '문제 보기',
    menuPathFor: function (ctx, params) { return params && params.from ? '/' + params.from : null; },
    render: function (ctx, params) {
      var q = ctx.content.getQuestion(params && params.id);
      if (!q) {
        return '<section class="page"><div class="card placeholder"><h1>문제를 찾을 수 없습니다</h1>' +
          '<p><a class="btn btn-primary" href="#/dashboard">Dashboard로</a></p></div></section>';
      }
      var passage = q.passage_id ? ctx.content.getPassage(q.passage_id) : null;
      var attempts = ctx.progress.getAttempts().filter(function (a) { return a.question_id === q.question_id; });
      var last = attempts[attempts.length - 1] || null;
      return '<section class="page question-page">' +
        '<button type="button" class="back-link link-button" data-action="back">← 뒤로</button>' +
        '<header class="page-header"><h1>' + esc(ctx.content.questionLabel(q.question_id)) + '</h1>' +
          '<p class="muted">' + esc(TM.constants.PARTS[q.part].name) + (q.question_type ? ' · ' + esc(q.question_type) : '') +
          ' · ' + esc(TM.constants.DIFFICULTY_LEVELS[q.difficulty].label) + (q.source ? ' · 출처: ' + esc(q.source) : '') + '</p></header>' +
        '<div class="study-body' + (passage ? ' has-passage' : '') + '">' +
          TM.components.renderPassage(passage, TM.studyService.blankNumber(q.question)) +
          '<div class="card question-card">' +
            '<p class="question-text">' + esc(q.question) + '</p>' +
            // 마지막 풀이가 있으면 내 답과 정답을, 없으면 정답만 표시
            TM.components.renderChoices(q, last || { selected: q.correct_answer }) +
            TM.components.renderExplanation(q, ctx.content) +
            '<h2 class="section-title">내 풀이 기록</h2>' + renderHistory(attempts) +
            '<div class="study-next"><button type="button" class="btn btn-primary" data-action="retry">이 문제 다시 풀기</button></div>' +
          '</div>' +
        '</div>' +
      '</section>';
    },
    mount: function (root, ctx, params) {
      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        if (btn.dataset.action === 'back') {
          if (history.length > 1) history.back(); else ctx.router.navigate('/dashboard');
        } else if (btn.dataset.action === 'retry') {
          var q = ctx.content.getQuestion(params.id);
          var fromNotes = params.from === 'wrong-notes';
          var session = ctx.progress.startPracticeSession({
            title: '다시 풀기 · ' + ctx.content.questionLabel(q.question_id), part: q.part, mode: 'retry', ids: [q.question_id],
            returnTo: fromNotes ? '/wrong-notes' : null, returnLabel: fromNotes ? '오답노트' : null
          });
          ctx.router.navigate('/study?mode=practice&sid=' + session.id);
        }
      }
      root.addEventListener('click', onClick);
      return function () { root.removeEventListener('click', onClick); };
    }
  };
})(window.TM = window.TM || {});
