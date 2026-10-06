// Part 5 / 6 / 7 화면: Part별 정답률, 추천 학습 영역(자주 틀리는 유형), 유형별 정답률·연습, 맞춤 난이도 연습
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };

  function practiceButton(label, mode, extra, primary, disabled) {
    return '<button type="button" class="btn' + (primary ? ' btn-primary' : '') + '" data-action="practice" data-mode="' + mode + '"' +
      (extra && extra.type ? ' data-type="' + esc(extra.type) + '"' : '') + (disabled ? ' disabled' : '') + '>' + esc(label) + '</button>';
  }

  function passageMix(content, part) {
    var counts = { single: 0, double: 0, triple: 0 };
    content.passages.forEach(function (p) { if (p.part === part) counts[p.type]++; });
    return '지문 구성: 단일 ' + counts.single + ' · 이중 ' + counts.double + ' · 삼중 ' + counts.triple;
  }

  TM.pages.createPartPage = function (part) {
    var info = TM.constants.PARTS[part];
    return {
      title: info.name,
      render: function (ctx) {
        var C = TM.constants;
        var content = ctx.content;
        var attempts = ctx.progress.getAttempts();
        var partAttempts = attempts.filter(function (a) { return a.part === part; });
        var questions = content.getQuestions({ part: part });
        var correct = partAttempts.filter(function (a) { return a.is_correct; }).length;
        var accuracy = partAttempts.length ? Math.round((correct / partAttempts.length) * 100) : null;
        var stats = TM.practiceService.typeStats(content, attempts, part);
        var weak = TM.practiceService.weakTypes(stats);
        var weakNames = weak.map(function (w) { return w.type; });
        var rec = TM.difficultyService.recommendLevel(partAttempts);
        var level = C.DIFFICULTY_LEVELS[rec.level];

        var levelCounts = [1, 2, 3, 4].map(function (l) {
          return C.DIFFICULTY_LEVELS[l].label + ' ' + questions.filter(function (q) { return q.difficulty === l; }).length;
        }).join(' · ');

        var weakCard = weak.length
          ? '<div class="card weak-card">' +
              '<h2 class="card-title">🎯 추천 학습 영역</h2>' +
              '<p class="muted small">자주 틀리는 유형입니다 (' + C.WEAK_TYPE.MIN_ATTEMPTS + '번 이상 풀고 정답률 ' + C.WEAK_TYPE.THRESHOLD + '% 미만).</p>' +
              '<ul class="weak-list">' + weak.slice(0, 3).map(function (w) {
                return '<li><b>' + esc(w.type) + '</b> <span class="muted">정답률 ' + w.accuracy + '% (' + w.correct + '/' + w.attempts + ')</span></li>';
              }).join('') + '</ul>' +
              practiceButton('추천 문제 풀기', 'weak', null, true) +
            '</div>'
          : '<div class="card weak-card is-empty"><h2 class="card-title">🎯 추천 학습 영역</h2>' +
              '<p class="muted">' + (partAttempts.length ? '아직 자주 틀리는 유형이 없습니다. 좋습니다!' : '문제를 풀면 자주 틀리는 유형을 찾아 추천합니다.') +
              ' (유형별 ' + C.WEAK_TYPE.MIN_ATTEMPTS + '번 이상 풀면 분석)</p></div>';

        var rows = stats.map(function (s) {
          var isWeak = weakNames.indexOf(s.type) >= 0;
          return '<tr' + (isWeak ? ' class="is-weak"' : '') + '>' +
            '<th scope="row">' + esc(s.type) + (isWeak ? ' <span class="tag tag-warn">추천</span>' : '') + '</th>' +
            '<td class="num col-questions">' + s.questions + '</td>' +
            '<td><div class="type-acc">' + TM.components.renderMeter({ value: s.accuracy, label: s.type + ' 정답률' }) +
              '<span class="num">' + (s.accuracy == null ? '—' : s.accuracy + '%') + '</span></div></td>' +
            '<td class="num muted">' + s.attempts + '회</td>' +
            '<td class="type-action">' + practiceButton('풀기', 'type', { type: s.type }, false, s.questions === 0) + '</td>' +
          '</tr>';
        }).join('');

        return '<section class="page part-page">' +
          '<header class="page-header"><h1>' + esc(info.name) + ' · ' + esc(info.title) + '</h1>' +
            '<p class="muted">등록 문제 ' + questions.length + '개 · ' + levelCounts + (part === 7 ? ' · ' + passageMix(content, 7) : '') + '</p></header>' +

          '<div class="card part-summary">' +
            '<div class="part-summary-stat">' +
              '<div class="hero-label">' + esc(info.name) + ' 정답률</div>' +
              '<div class="day-summary-pct">' + (accuracy == null ? '—' : accuracy + '<span class="stat-unit">%</span>') + '</div>' +
              '<div class="muted small">' + (partAttempts.length ? correct + ' / ' + partAttempts.length + '회 정답' : '아직 풀지 않았습니다') + '</div>' +
            '</div>' +
            '<div class="part-summary-level">' +
              '<div class="hero-label">다음 추천 난이도</div>' +
              '<div class="level-name">' + esc(level.label) + ' <span>' + esc(level.name) + '</span></div>' +
              '<div class="muted small">' + esc(rec.reason) + '</div>' +
            '</div>' +
            '<div class="part-summary-actions">' +
              practiceButton('맞춤 난이도 연습', 'adaptive', null, true) +
              practiceButton('전체 문제 풀기', 'all') +
            '</div>' +
          '</div>' +

          weakCard +

          '<h2 class="section-title">유형별 정답률</h2>' +
          '<div class="card table-card"><table class="type-table">' +
            '<thead><tr><th scope="col">유형</th><th scope="col" class="num col-questions">문제</th><th scope="col">정답률</th><th scope="col" class="num">풀이</th><th scope="col"><span class="sr-only">연습</span></th></tr></thead>' +
            '<tbody>' + rows + '</tbody></table></div>' +
          '<p class="muted small">연습 모드에서 푼 기록도 정답률·오답노트·학습 분석에 반영됩니다. DAY 진행률과 이어서 학습 위치에는 영향을 주지 않습니다.</p>' +
        '</section>';
      },

      mount: function (root, ctx) {
        function onClick(e) {
          var btn = e.target.closest('[data-action="practice"]');
          if (!btn || btn.disabled) return;
          var set = TM.practiceService.buildPracticeSet(ctx.content, ctx.progress.getAttempts(), {
            part: part, mode: btn.dataset.mode, type: btn.dataset.type
          });
          if (!set.items.length) {
            TM.components.toast('연습할 문제가 없습니다.', 'info');
            return;
          }
          var session = ctx.progress.startPracticeSession({
            title: set.title, part: part, mode: btn.dataset.mode, type: btn.dataset.type,
            ids: set.items.map(function (q) { return q.question_id; })
          });
          ctx.router.navigate('/study?mode=practice&sid=' + session.id);
        }
        root.addEventListener('click', onClick);
        return function () { root.removeEventListener('click', onClick); };
      }
    };
  };
})(window.TM = window.TM || {});
