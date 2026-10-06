// DAY 학습: 주소에 day가 없으면 DAY 목록, 있으면(#/day?day=3) 그 DAY의 상세 화면
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  var STATUS_LABEL = { complete: '완료', in_progress: '진행 중', not_started: '시작 전' };

  function loadState(ctx) {
    return {
      attempts: ctx.progress.getAttempts(),
      vocabState: ctx.progress.getVocabState(),
      profile: ctx.progress.getProfile(),
      position: ctx.progress.getLastPosition()
    };
  }

  function dayProgress(ctx, state, day) {
    return TM.dayService.computeDayProgress({ content: ctx.content, day: day, attempts: state.attempts, vocabState: state.vocabState });
  }

  function statusBadge(status) {
    return '<span class="status status-' + status + '">' + (status === 'complete' ? '✓ ' : '') + STATUS_LABEL[status] + '</span>';
  }

  // 이어서 학습 안내 (저장된 위치가 아직 의미 있을 때만)
  function renderResume(ctx, state) {
    var pos = state.position;
    if (!pos || ctx.content.days.indexOf(pos.day) < 0) return '';
    var progress = dayProgress(ctx, state, pos.day);
    if (!TM.dayService.isResumable(pos, progress)) return '';
    var section = TM.dayService.getSection(pos.section);
    return '<a class="card resume-card" href="' + TM.dayService.studyLink(pos.day, pos.section, pos.index) + '">' +
      '<span class="resume-label">이어서 학습</span>' +
      '<span class="resume-text">DAY ' + pos.day + ' · ' + section.label + ' · ' + (pos.index + 1) + '번째부터</span>' +
      '<span class="resume-arrow" aria-hidden="true">→</span></a>';
  }

  function renderList(ctx, state) {
    var current = state.profile.currentDay;
    var cards = ctx.content.days.map(function (day) {
      var p = dayProgress(ctx, state, day);
      return '<a class="card day-card' + (day === current ? ' is-current' : '') + '" href="#/day?day=' + day + '">' +
        '<div class="day-card-head"><span class="day-name">DAY ' + day + '</span>' +
          (day === current ? '<span class="tag">현재</span>' : '') + statusBadge(p.status) + '</div>' +
        '<div class="day-card-pct">' + p.percent + '<span class="stat-unit">%</span></div>' +
        TM.components.renderMeter({ value: p.percent, label: 'DAY ' + day + ' 진행률' }) +
        '<div class="day-card-sub">' + p.sections.slice(0, 4).map(function (s) {
          return s.label.replace('Vocabulary', '단어') + ' ' + s.done + '/' + s.total;
        }).join(' · ') + '</div>' +
      '</a>';
    }).join('');

    return '<section class="page">' +
      '<header class="page-header"><h1>DAY 학습</h1>' +
        '<p class="muted">하루 학습: Vocabulary → Part 5 → Part 6 → Part 7 → 오답 복습 · 현재 DAY ' + current + '</p></header>' +
      renderResume(ctx, state) +
      '<div class="day-grid">' + cards + '</div>' +
    '</section>';
  }

  function sectionButton(day, s) {
    if (s.total === 0) return '';
    var label = s.complete ? '다시 보기' : s.done > 0 ? '계속' : '시작';
    return '<a class="btn' + (s.complete ? '' : ' btn-primary') + ' btn-sm" href="' + TM.dayService.studyLink(day, s.id) + '">' + label + '</a>';
  }

  function sectionSub(s) {
    var plan = TM.constants.DAILY_PLAN;
    var planned = { vocabulary: plan.vocabulary, part5: plan.part5, part6: plan.part6, part7: plan.part7 }[s.id];
    if (s.kind === 'review') return s.total ? '처음 틀린 문제를 다시 풀어 봅니다' : '아직 복습할 오답이 없습니다';
    if (s.total === 0) return '등록된 ' + (s.kind === 'vocab' ? '단어' : '문제') + '가 없습니다';
    if (planned && s.total < planned) return '권장 ' + planned + '개 · 현재 등록 ' + s.total + '개';
    return '';
  }

  function renderMainAction(ctx, state, p) {
    var day = p.day;
    var days = ctx.content.days;
    var nextDay = days[days.indexOf(day) + 1];
    var isCurrent = state.profile.currentDay === day;

    if (p.complete) {
      var advance = isCurrent && nextDay
        ? '<button class="btn btn-primary btn-lg" type="button" data-action="advance" data-day="' + nextDay + '">DAY ' + nextDay + ' 시작하기</button>'
        : !nextDay ? '<p class="muted small">다음 DAY의 학습 데이터가 아직 없습니다. 문제를 추가하면 이어서 학습할 수 있습니다.</p>' : '';
      return '<div class="day-action"><div class="day-done">🎉 DAY ' + day + ' 학습을 모두 마쳤습니다!</div>' + advance + '</div>';
    }

    if (TM.dayService.isResumable(state.position, p)) {
      var pos = state.position;
      return '<div class="day-action"><a class="btn btn-primary btn-lg" href="' + TM.dayService.studyLink(day, pos.section, pos.index) + '">이어서 학습</a>' +
        '<div class="muted small">' + TM.dayService.getSection(pos.section).label + ' · ' + (pos.index + 1) + '번째부터</div></div>';
    }

    var next = TM.dayService.nextSection(p);
    if (!next) return '';
    return '<div class="day-action"><a class="btn btn-primary btn-lg" href="' + TM.dayService.studyLink(day, next.id) + '">' +
      (p.status === 'not_started' ? '학습 시작' : '이어서 학습') + '</a>' +
      '<div class="muted small">' + next.label + (next.done ? ' · ' + next.done + '/' + next.total + ' 완료' : '부터') + '</div></div>';
  }

  function renderDetail(ctx, state, day) {
    var esc = TM.dom.escapeHtml;
    if (ctx.content.days.indexOf(day) < 0) {
      return '<section class="page"><div class="card placeholder"><h1>DAY ' + esc(String(day)) + '는 아직 학습 데이터가 없습니다</h1>' +
        '<p><a class="btn btn-primary" href="#/day">DAY 목록으로</a></p></div></section>';
    }
    var p = dayProgress(ctx, state, day);
    var isCurrent = state.profile.currentDay === day;

    var rows = p.sections.map(function (s, i) {
      var sub = sectionSub(s);
      var pct = s.total ? (s.done / s.total) * 100 : 0;
      return '<li class="section-row' + (s.complete && s.total ? ' is-complete' : '') + '">' +
        '<span class="section-num">' + (s.complete && s.total ? '✓' : i + 1) + '</span>' +
        '<div class="section-body">' +
          '<div class="section-line"><span class="section-name">' + esc(s.label) + '</span>' +
            '<span class="section-count">' + (s.total ? s.done + ' / ' + s.total : '—') + '</span></div>' +
          TM.components.renderMeter({ value: pct, label: s.label + ' 진행률' }) +
          (sub ? '<div class="section-sub">' + esc(sub) + '</div>' : '') +
        '</div>' +
        '<div class="section-action">' + sectionButton(day, s) + '</div>' +
      '</li>';
    }).join('');

    return '<section class="page">' +
      '<a class="back-link" href="#/day">← DAY 목록</a>' +
      '<header class="page-header day-header"><h1>DAY ' + day + '</h1>' + statusBadge(p.status) +
        (isCurrent ? '<span class="tag">현재 DAY</span>'
          : '<button class="btn btn-sm" type="button" data-action="set-current" data-day="' + day + '">현재 DAY로 설정</button>') +
      '</header>' +

      '<div class="card day-summary">' +
        '<div class="day-summary-main">' +
          '<div class="hero-label">전체 진행률</div>' +
          '<div class="day-summary-pct">' + p.percent + '<span class="stat-unit">%</span></div>' +
          TM.components.renderMeter({ value: p.percent, label: 'DAY ' + day + ' 전체 진행률' }) +
          '<div class="muted small">단어·문제 ' + p.mainDone + ' / ' + p.mainTotal + ' 완료</div>' +
        '</div>' +
        renderMainAction(ctx, state, p) +
      '</div>' +

      '<ol class="section-list card">' + rows + '</ol>' +
    '</section>';
  }

  TM.pages.day = {
    title: 'DAY 학습',
    render: function (ctx, params) {
      var state = loadState(ctx);
      var day = params && params.day ? Number(params.day) : null;
      return day ? renderDetail(ctx, state, day) : renderList(ctx, state);
    },
    mount: function (root, ctx) {
      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var day = Number(btn.dataset.day);
        if (btn.dataset.action === 'set-current') {
          ctx.progress.setCurrentDay(day);
          ctx.router.refresh();
        } else if (btn.dataset.action === 'advance') {
          ctx.progress.setCurrentDay(day);
          ctx.router.navigate('/day?day=' + day);
        }
      }
      root.addEventListener('click', onClick);
      return function () { root.removeEventListener('click', onClick); };
    }
  };
})(window.TM = window.TM || {});
