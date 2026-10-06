// 학습분석: 기간 선택 → 핵심 숫자 → 분석 리포트 → 그래프(일별 학습량·정답률, Part별·유형별 정답률, 오답 원인, 단어, 학습 달력)
// 기간은 주소에 저장된다(#/analytics?range=30). 모든 숫자는 analyticsService의 요약 하나에서 나온다.
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };
  var DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

  function rangeDays(params) {
    var r = Number(params && params.range);
    return TM.constants.ANALYTICS.RANGES.some(function (x) { return x.days === r; }) ? r : 7;
  }

  function shortDate(key) { var d = TM.date.parseDateKey(key); return (d.getMonth() + 1) + '/' + d.getDate(); }
  function longDate(key) { var d = TM.date.parseDateKey(key); return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + DAY_NAMES[d.getDay()] + ')'; }
  function fmtPct(v) { return v == null ? '—' : v + '%'; }
  function fmtSec(v) { return v == null ? '—' : v + '초'; }

  function buildSummary(ctx, days) {
    return TM.analyticsService.buildSummary({
      content: ctx.content, attempts: ctx.progress.getAttempts(), vocabState: ctx.progress.getVocabState(),
      profile: ctx.progress.getProfile(), today: TM.date.toDateKey(new Date()), rangeDays: days
    });
  }

  function card(title, sub, body, wide) {
    return '<section class="card chart-card' + (wide ? ' is-wide' : '') + '"><header class="chart-head"><h2>' + esc(title) + '</h2>' +
      (sub ? '<p class="muted small">' + sub + '</p>' : '') + '</header>' + body + '</section>';
  }

  function empty(text) { return '<p class="chart-empty muted">' + esc(text) + '</p>'; }

  function renderReport(insights) {
    return '<ul class="report-list">' + insights.map(function (i, idx) {
      var actions = [i.action, i.secondary].filter(Boolean).map(function (a, k) {
        return a.kind === 'link'
          ? '<a class="btn btn-sm" href="' + esc(a.href) + '">' + esc(a.label) + '</a>'
          : '<button type="button" class="btn btn-sm' + (k === 0 ? ' btn-primary' : '') + '" data-action="insight" data-index="' + idx + '" data-which="' + (k === 0 ? 'action' : 'secondary') + '">' + esc(a.label) + '</button>';
      }).join('');
      return '<li class="report-item tone-' + i.tone + '"><span class="report-text">' + esc(i.message) + '</span>' + (actions ? '<span class="report-actions">' + actions + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }

  function render(ctx, params) {
    var C = TM.constants;
    var ch = TM.components.charts;
    var days = rangeDays(params);
    var s = buildSummary(ctx, days);
    var insights = TM.analysisService.analyzeSync(s);
    var has = s.totals.attempts > 0;

    var ranges = '<div class="segmented" role="group" aria-label="기간">' + C.ANALYTICS.RANGES.map(function (r) {
      return '<a class="seg' + (r.days === days ? ' is-active' : '') + '" href="#/analytics?range=' + r.days + '"' + (r.days === days ? ' aria-current="true"' : '') + '>' + r.label + '</a>';
    }).join('') + '</div>';

    var kpi = function (label, value, unit, sub) {
      return '<div class="card stat-card"><div class="stat-label">' + esc(label) + '</div><div class="stat-value">' + esc(value) +
        (unit ? '<span class="stat-unit">' + esc(unit) + '</span>' : '') + '</div>' + (sub ? '<div class="stat-sub">' + esc(sub) + '</div>' : '') + '</div>';
    };

    // 1. 일별 학습량
    var volume = card('일별 학습량', s.range.label + ' · 하루에 푼 문제 수',
      has ? ch.columnChart({
        ariaLabel: '일별 푼 문제 수', unit: '',
        data: s.daily.map(function (d) { return { label: shortDate(d.date), value: d.attempts, title: longDate(d.date), rows: [['푼 문제', d.attempts + '문제'], ['정답', d.correct + '문제']] }; })
      }) + ch.tableView(['날짜', '푼 문제', '정답'], s.daily.filter(function (d) { return d.attempts; }).map(function (d) { return [longDate(d.date), d.attempts, d.correct]; }))
      : empty('이 기간에 푼 문제가 없습니다.'));

    // 2. 일별 정답률
    var accuracy = card('일별 정답률', '문제를 푼 날만 선으로 이어집니다',
      has ? ch.lineChart({
        ariaLabel: '일별 정답률', unit: '%', max: 100,
        data: s.daily.map(function (d) { return { label: shortDate(d.date), value: d.accuracy, title: longDate(d.date), rows: d.attempts ? [['정답률', d.accuracy + '%'], ['정답', d.correct + ' / ' + d.attempts]] : [['정답률', '학습 안 함']] }; })
      }) + ch.tableView(['날짜', '정답률', '정답 / 문제'], s.daily.filter(function (d) { return d.attempts; }).map(function (d) { return [longDate(d.date), d.accuracy + '%', d.correct + ' / ' + d.attempts]; }))
      : empty('이 기간에 푼 문제가 없습니다.'));

    // 3. Part별 정답률 (+ 평균 풀이 시간)
    var measured = [5, 6, 7].filter(function (p) { return s.parts[p].attempts; });
    var lowPart = measured.length >= 2 ? measured.reduce(function (a, b) { return s.parts[b].accuracy < s.parts[a].accuracy ? b : a; }) : null;
    var partCard = card('Part별 정답률', '막대 = 정답률 · 아래 = 문제 수와 평균 풀이 시간 (목표: Part 5 ' + C.ANALYTICS.TARGET_SECONDS[5] + '초 · Part 6 ' + C.ANALYTICS.TARGET_SECONDS[6] + '초 · Part 7 ' + C.ANALYTICS.TARGET_SECONDS[7] + '초)',
      has ? ch.barList({ max: 100, rows: [5, 6, 7].map(function (p) {
        var x = s.parts[p];
        return { label: C.PARTS[p].name, sub: x.attempts ? x.attempts + '문제 · ' + fmtSec(x.avgSeconds) : '풀지 않음',
          value: x.accuracy, display: fmtPct(x.accuracy), mark: p === lowPart ? '가장 낮음' : '',
          rows: [['정답률', fmtPct(x.accuracy)], ['푼 문제', x.attempts + '문제'], ['평균 풀이 시간', fmtSec(x.avgSeconds)]] };
      }) }) + ch.tableView(['Part', '정답률', '푼 문제', '평균 시간', '목표 시간'], [5, 6, 7].map(function (p) {
        var x = s.parts[p]; return [C.PARTS[p].name, fmtPct(x.accuracy), x.attempts, fmtSec(x.avgSeconds), C.ANALYTICS.TARGET_SECONDS[p] + '초'];
      }))
      : empty('이 기간에 푼 문제가 없습니다.'));

    // 4. 오답 원인
    var reasonCard = card('오답 원인', s.reasons.wrong ? '오답 ' + s.reasons.wrong + '개 중 원인을 기록한 ' + s.reasons.tagged + '개 기준' : '',
      s.reasons.tagged ? ch.barList({ rows: s.reasons.list.map(function (r) {
        return { label: r.label, value: r.count, display: r.share + '% · ' + r.count + '개', rows: [['비율', r.share + '%'], ['오답', r.count + '개']] };
      }) }) + (s.reasons.untagged ? '<p class="muted small chart-note">원인을 고르지 않은 오답 ' + s.reasons.untagged + '개는 <a href="#/wrong-notes?reason=none">오답노트</a>에서 기록할 수 있습니다.</p>' : '') +
        ch.tableView(['오답 원인', '비율', '개수'], s.reasons.list.map(function (r) { return [r.label, r.share + '%', r.count]; }))
      : empty(s.reasons.wrong ? '오답 원인을 기록하면 여기에 분포가 나타납니다.' : '이 기간에 틀린 문제가 없습니다.'));

    // 5. 문제 유형별 정답률 (낮은 순, 처음에는 약한 8개만)
    var TYPE_LIMIT = 8;
    function typeRow(t) {
      var weak = t.attempts >= C.WEAK_TYPE.MIN_ATTEMPTS && t.accuracy < C.WEAK_TYPE.THRESHOLD;
      return { label: t.type, sub: C.PARTS[t.part].name + ' · ' + t.attempts + '문제', value: t.accuracy, display: t.accuracy + '%', mark: weak ? '약점' : '',
        title: C.PARTS[t.part].name + ' · ' + t.type, rows: [['정답률', t.accuracy + '%'], ['정답', t.correct + ' / ' + t.attempts]] };
    }
    var typeCard = card('문제 유형별 정답률', '정답률이 낮은 유형부터 · ' + C.WEAK_TYPE.MIN_ATTEMPTS + '번 이상 풀고 ' + C.WEAK_TYPE.THRESHOLD + '% 미만이면 \'약점\'',
      s.types.length ? ch.barList({ max: 100, rows: s.types.slice(0, TYPE_LIMIT).map(typeRow) }) +
        (s.types.length > TYPE_LIMIT ? '<details class="more-types"><summary>나머지 ' + (s.types.length - TYPE_LIMIT) + '개 유형 보기</summary>' +
          ch.barList({ max: 100, rows: s.types.slice(TYPE_LIMIT).map(typeRow) }) + '</details>' : '') +
        ch.tableView(['유형', 'Part', '정답률', '정답 / 문제'], s.types.map(function (t) { return [t.type, C.PARTS[t.part].name, t.accuracy + '%', t.correct + ' / ' + t.attempts]; }))
      : empty('이 기간에 푼 문제가 없습니다.'), true);

    // 6. 단어 암기량
    var v = s.vocab;
    var segments = [
      { label: '알고 있음', value: v.known, color: 'viz-1' }, { label: '헷갈림', value: v.confused, color: 'viz-2' },
      { label: '모름', value: v.unknown, color: 'viz-3' }, { label: '복습 필요(문제 오답)', value: v.review, color: 'viz-4' },
      { label: '미학습', value: v.new, color: 'viz-rest' }
    ];
    var vocabCard = card('단어 암기 현황', '전체 ' + v.total + '개 중 알고 있음 ' + v.known + '개 · ' + s.range.label + ' 동안 ' + v.markedInRange + '개 학습',
      ch.stackedBar({ ariaLabel: '단어 암기 상태 비율', segments: segments }) +
      ch.tableView(['상태', '단어 수'], segments.map(function (x) { return [x.label, x.value]; })));

    // 7. 연속 학습일 + 학습 달력
    var studied = s.heatmap.filter(function (c) { return c.studied; });
    var streakCard = card('연속 학습일', '최근 ' + C.ANALYTICS.HEATMAP_WEEKS + '주 학습 달력 · 색이 진할수록 많이 푼 날',
      '<div class="streak-nums"><div><div class="stat-label">현재 연속</div><div class="stat-value">' + s.streak.current + '<span class="stat-unit">일</span></div></div>' +
        '<div><div class="stat-label">최고 기록</div><div class="stat-value">' + s.streak.best + '<span class="stat-unit">일</span></div></div>' +
        '<div><div class="stat-label">누적 학습일</div><div class="stat-value">' + s.streak.totalStudyDays + '<span class="stat-unit">일</span></div></div></div>' +
      ch.heatmap({ ariaLabel: '최근 학습 달력', cells: s.heatmap }) +
      ch.tableView(['학습한 날', '푼 문제'], studied.slice().reverse().map(function (c) { return [longDate(c.date), c.attempts || '단어 학습']; })));

    return '<section class="page analytics-page">' +
      '<header class="page-header analytics-head"><div><h1>학습분석</h1><p class="muted">' + esc(s.range.from.replace(/-/g, '.')) + ' ~ ' + esc(s.range.to.replace(/-/g, '.')) + '</p></div>' + ranges + '</header>' +
      '<div class="stat-grid kpi-row">' +
        kpi('푼 문제', String(s.totals.attempts), '문제', s.range.label) +
        kpi('정답률', s.totals.accuracy == null ? '—' : String(s.totals.accuracy), s.totals.accuracy == null ? '' : '%', s.totals.correct + '문제 정답') +
        kpi('학습한 날', String(s.totals.studyDays), '/ ' + days + '일', '') +
        kpi('평균 풀이 시간', s.totals.avgSeconds == null ? '—' : String(s.totals.avgSeconds), s.totals.avgSeconds == null ? '' : '초', '문제당') +
        kpi('연속 학습일', String(s.streak.current), '일', '최고 ' + s.streak.best + '일') +
      '</div>' +
      '<section class="card report-card"><header class="chart-head"><h2>분석 리포트</h2><p class="muted small">' + esc(s.range.label) + ' 기록을 바탕으로 한 진단과 다음 학습 추천</p></header>' +
        '<div data-report>' + renderReport(insights) + '</div>' +
        '<details class="ai-box"><summary>AI에게 더 자세한 분석 받기</summary>' +
          '<p class="muted small">아래 버튼으로 학습 기록 요약을 복사해 Claude 같은 AI 대화창에 붙여 넣으면, 취약점 분석과 주간 학습 계획을 받을 수 있습니다. 개인 정보는 들어 있지 않고 학습 통계만 들어 있습니다.</p>' +
          '<div class="row-actions"><button type="button" class="btn" data-action="copy-prompt">학습 요약 복사</button></div>' +
          '<textarea class="input ai-text" id="ai-prompt" rows="6" readonly hidden></textarea>' +
        '</details>' +
      '</section>' +
      '<div class="chart-grid">' + volume + accuracy + partCard + reasonCard + typeCard + vocabCard + streakCard + '</div>' +
    '</section>';
  }

  TM.pages.analytics = {
    title: '학습분석',
    render: render,
    mount: function (root, ctx, params) {
      var days = rangeDays(params);
      var summary = buildSummary(ctx, days);
      var insights = TM.analysisService.analyzeSync(summary);
      var reportEl = root.querySelector('[data-report]');
      var alive = true;
      // 등록된 분석기(나중에 AI 포함)의 결과를 모두 받아 다시 그린다
      TM.analysisService.analyze(summary).then(function (all) {
        if (!alive || all.length === insights.length) return;
        insights = all;
        reportEl.innerHTML = renderReport(insights);
      });

      function runAction(a) {
        if (a.kind === 'practice') {
          var set = TM.practiceService.buildPracticeSet(ctx.content, ctx.progress.getAttempts(),
            a.type ? { part: a.part, mode: 'type', type: a.type } : { part: a.part, mode: 'adaptive' });
          var items = set.items.slice(0, a.count || 5);
          if (!items.length) { TM.components.toast('추천할 문제가 없습니다.', 'info'); return; }
          var session = ctx.progress.startPracticeSession({ title: '추천 학습 · ' + set.title, part: a.part, mode: 'recommend',
            ids: items.map(function (q) { return q.question_id; }), returnTo: '/analytics?range=' + days, returnLabel: '학습분석' });
          ctx.router.navigate('/study?mode=practice&sid=' + session.id);
        } else if (a.kind === 'vocab-review') {
          var queue = TM.vocabService.reviewQueue(ctx.content.words, ctx.progress.getVocabState()).slice(0, 20);
          if (!queue.length) { TM.components.toast('복습할 단어가 없습니다.', 'info'); return; }
          var vs = ctx.progress.startVocabSession({ title: '추천 어휘 복습', words: queue.map(function (w) { return w.word; }) });
          ctx.router.navigate('/vocab-study?sid=' + vs.id);
        }
      }

      function copyPrompt() {
        var text = TM.analysisService.buildPrompt(summary);
        var area = root.querySelector('#ai-prompt');
        area.value = text;
        function fallback() {
          area.hidden = false;
          area.focus();
          area.select();
          TM.components.toast('복사 버튼이 동작하지 않는 환경입니다. 선택된 글을 Ctrl+C(Mac은 Cmd+C)로 복사하세요.', 'info');
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            TM.components.toast('학습 요약을 복사했습니다. AI 대화창에 붙여 넣으세요.', 'success');
          }, fallback);
        } else {
          fallback();
        }
      }

      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        if (btn.dataset.action === 'insight') {
          var i = insights[Number(btn.dataset.index)];
          if (i && i[btn.dataset.which]) runAction(i[btn.dataset.which]);
        } else if (btn.dataset.action === 'copy-prompt') {
          copyPrompt();
        }
      }
      root.addEventListener('click', onClick);
      var detachTips = TM.components.charts.attachChartTooltips(root);
      return function () {
        alive = false;
        root.removeEventListener('click', onClick);
        detachTips();
      };
    }
  };
})(window.TM = window.TM || {});
