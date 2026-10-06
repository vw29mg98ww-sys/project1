// Dashboard: 목표·예상 점수, 오늘의 학습 시작, 학습 통계, 취약 영역 안내
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};

  function fmtPct(v) { return v == null ? '—' : String(v); }

  function renderHero(stats, resume) {
    var C = TM.constants;
    var est = stats.estimate;
    var hasEstimate = est.total != null;
    var gap = hasEstimate ? C.TARGET_SCORE - est.total : null;

    var gapText = !hasEstimate
      ? '문제를 ' + C.SCORE.MIN_ATTEMPTS + '개 이상 풀면 예상 점수가 계산됩니다 (현재 ' + est.basedOn + '문제).'
      : gap > 0 ? '목표까지 ' + gap + '점 남았습니다.'
      : '목표 점수에 도달했습니다! 고난도 문제로 실력을 유지하세요.';

    return '<div class="card hero">' +
      '<div class="hero-main">' +
        '<div class="hero-label">현재 예상 점수</div>' +
        '<div class="hero-figure">' + (hasEstimate ? est.total : '<span class="hero-figure-empty">계산 전</span>') +
          '<span class="hero-target"> / 목표 ' + C.TARGET_SCORE + '</span></div>' +
        TM.components.renderMeter({ value: hasEstimate ? (est.total / C.TARGET_SCORE) * 100 : 0, label: '목표 점수 대비 예상 점수' }) +
        '<p class="hero-note">' + TM.dom.escapeHtml(gapText) + '</p>' +
        (hasEstimate ? '<p class="muted small">최근 ' + est.basedOn + '문제 RC 정답률 ' + est.accuracy + '% 기준 · RC 약 ' + est.rc + '점, LC도 같은 수준으로 가정한 추정치</p>' : '') +
      '</div>' +
      '<div class="hero-action">' +
        '<a class="btn btn-primary btn-lg" href="#/day?day=' + stats.currentDay + '">오늘의 학습 시작</a>' +
        '<div class="muted small">DAY ' + stats.currentDay + (stats.studiedToday ? ' · 오늘 학습 기록 있음' : '') + '</div>' +
        (resume ? '<a class="resume-link" href="' + resume.href + '">이어서 학습: ' + TM.dom.escapeHtml(resume.text) + ' →</a>' : '') +
      '</div>' +
    '</div>';
  }

  function renderInsights(stats) {
    var esc = TM.dom.escapeHtml;
    if (stats.isEmpty) {
      return '<div class="card insight-card">' +
        '<h2 class="insight-title">환영합니다!</h2>' +
        '<p>아직 학습 기록이 없습니다. <b>오늘의 학습 시작</b>을 눌러 DAY 1을 시작하세요.</p>' +
        '<p class="muted small">문제를 풀고 틀린 이유를 기록하면, 여기에서 가장 취약한 영역을 분석해 알려드립니다.</p>' +
      '</div>';
    }

    var insights = TM.insightService.buildDashboardInsights(stats);
    var w = stats.weakness;
    var reasons = w.enough
      ? '<div class="reason-list">' + w.distribution.slice(0, 4).map(function (r) {
          return '<div class="reason-row"><span class="reason-label">' + esc(r.label) + '</span>' +
            TM.components.renderMeter({ value: r.share, label: r.label + ' ' + r.share + '%' }) +
            '<span class="reason-value">' + r.share + '%</span></div>';
        }).join('') + '<p class="muted small">최근 ' + TM.constants.WEAKNESS.RECENT_WINDOW + '문제 중 원인을 기록한 오답 ' + w.tagged + '개 기준</p></div>'
      : '<p class="muted small">오답 원인을 ' + TM.constants.WEAKNESS.MIN_TAGGED + '개 이상 기록하면 취약 영역을 분석합니다 (현재 ' + w.tagged + '개).</p>';

    return '<div class="card insight-card">' +
      '<h2 class="insight-title">학습 진단</h2>' +
      (insights.length
        ? '<ul class="insight-list">' + insights.map(function (i) {
            return '<li class="insight insight-' + i.tone + '">' + esc(i.message) + '</li>';
          }).join('') + '</ul>'
        : '<p class="muted">좋은 흐름입니다. 오늘의 학습을 이어가세요.</p>') +
      reasons +
    '</div>';
  }

  // 저장된 마지막 학습 위치가 아직 이어서 할 의미가 있으면 링크 정보를 돌려준다
  function findResume(ctx) {
    var pos = ctx.progress.getLastPosition();
    if (!pos || ctx.content.days.indexOf(pos.day) < 0) return null;
    var dp = TM.dayService.computeDayProgress({ content: ctx.content, day: pos.day, attempts: ctx.progress.getAttempts(), vocabState: ctx.progress.getVocabState() });
    if (!TM.dayService.isResumable(pos, dp)) return null;
    return { href: TM.dayService.studyLink(pos.day, pos.section, pos.index), text: 'DAY ' + pos.day + ' · ' + TM.dayService.getSection(pos.section).label };
  }

  TM.pages.dashboard = {
    title: 'Dashboard',
    render: function (ctx) {
      var C = TM.constants;
      var stat = TM.components.renderStatCard;
      var stats = TM.statsService.computeDashboard({
        attempts: ctx.progress.getAttempts(),
        profile: ctx.progress.getProfile(),
        vocabState: ctx.progress.getVocabState(),
        today: TM.date.toDateKey(new Date())
      });

      var partCards = [5, 6, 7].map(function (p) {
        var part = stats.parts[p];
        return stat({
          label: C.PARTS[p].name + ' 정답률',
          value: fmtPct(part.accuracy),
          unit: part.accuracy == null ? '' : '%',
          sub: part.total ? part.correct + ' / ' + part.total + '문제' : '아직 풀지 않음',
          extra: TM.components.renderMeter({ value: part.accuracy, label: C.PARTS[p].name + ' 정답률' })
        });
      }).join('');

      return '<section class="page dashboard">' +
        '<header class="page-header"><h1>Dashboard</h1>' +
          '<p class="muted">DAY 1부터 매일 조금씩, 목표 ' + C.TARGET_SCORE + '점까지.</p></header>' +

        renderHero(stats, findResume(ctx)) +
        renderInsights(stats) +

        '<h2 class="section-title">학습 현황</h2>' +
        '<div class="stat-grid">' +
          stat({ label: '현재 DAY', value: 'DAY ' + stats.currentDay }) +
          stat({ label: '연속 학습일', value: String(stats.streak), unit: '일', sub: stats.studiedToday ? '오늘 학습함' : '오늘 아직 학습 전' }) +
          stat({ label: '누적 문제 수', value: String(stats.totalAttempts), unit: '문제' }) +
          stat({ label: '전체 정답률', value: fmtPct(stats.accuracy), unit: stats.accuracy == null ? '' : '%', sub: stats.totalAttempts ? stats.correct + '문제 정답' : '' }) +
          stat({ label: '누적 오답 수', value: String(stats.wrong), unit: '회', sub: '오답노트 ' + stats.wrongNote + '문제' }) +
          stat({ label: '암기한 단어', value: String(stats.vocab.known), unit: '개', sub: '전체 ' + ctx.content.words.length + '개 중' }) +
          stat({ label: '복습할 단어', value: String(stats.vocab.review), unit: '개', sub: '모름 · 헷갈림' }) +
        '</div>' +

        '<h2 class="section-title">Part별 정답률</h2>' +
        '<div class="stat-grid part-grid">' + partCards + '</div>' +
      '</section>';
    }
  };
})(window.TM = window.TM || {});
