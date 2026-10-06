// 그래프 조각 (라이브러리 없이 HTML·SVG로 그린다)
// - 막대는 24px 이하·끝 4px 둥글게, 선은 2px, 격자는 얇은 실선. 색은 variables.css의 --viz-* 토큰만 쓴다.
// - 마우스를 올리거나 키보드로 초점을 옮기면 값이 보인다(attachChartTooltips). 모든 값은 '표로 보기'에도 있다.
// - 축 글자·값은 글자색 토큰을 쓰고, 데이터 색은 막대·선·점에만 쓴다.
(function (TM) {
  'use strict';

  TM.components = TM.components || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };

  // 툴팁 정보를 data 속성으로 담는다. rows: [[이름, 값], ...]
  function tipAttrs(title, rows) {
    return ' tabindex="0" data-tip-title="' + esc(title) + '" data-tip-rows="' + esc(JSON.stringify(rows || [])) + '"';
  }

  // 축 눈금: 보기 좋은 최댓값. 가운데 눈금(절반)도 정수가 되도록 짝수만 쓴다 (예: 3 → 4, 13 → 20, 47 → 50)
  function niceMax(max) {
    var steps = [2, 4, 6, 8, 10, 20, 30, 40, 50, 60, 80, 100, 150, 200, 300, 400, 500, 600, 800, 1000];
    for (var i = 0; i < steps.length; i++) if (max <= steps[i]) return steps[i];
    return Math.ceil(max / 1000) * 1000;
  }

  function yAxis(max, unit) {
    var ticks = [0, max / 2, max];
    return {
      labels: '<div class="chart-yaxis" aria-hidden="true">' + ticks.map(function (t) {
        return '<span style="bottom:' + (t / max) * 100 + '%">' + Math.round(t) + (unit || '') + '</span>';
      }).join('') + '</div>',
      grid: ticks.map(function (t, i) { return '<i class="chart-gridline' + (i === 0 ? ' is-base' : '') + '" style="bottom:' + (t / max) * 100 + '%"></i>'; }).join('')
    };
  }

  // x축 이름: 너무 많으면 고르게 몇 개만 (마지막은 항상)
  function xAxis(labels) {
    var n = labels.length;
    var every = Math.max(1, Math.ceil(n / 7));
    return '<div class="chart-xaxis" aria-hidden="true">' + labels.map(function (l, i) {
      if (i % every !== 0 && i !== n - 1) return '';
      if (i !== n - 1 && n - 1 - i < every / 2) return ''; // 마지막 이름과 겹치지 않게
      return '<span style="left:' + ((i + 0.5) / n) * 100 + '%">' + esc(l) + '</span>';
    }).join('') + '</div>';
  }

  // 세로 막대 (일별 학습량). data: [{ label, value, title, rows }]
  function columnChart(opts) {
    var data = opts.data;
    var max = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; }).concat(1)));
    var y = yAxis(max, opts.unit);
    return '<div class="chart" role="img" aria-label="' + esc(opts.ariaLabel) + '">' +
      '<div class="chart-body" style="height:' + (opts.height || 180) + 'px">' + y.labels +
        '<div class="chart-plot">' + y.grid +
          '<div class="chart-cols">' + data.map(function (d) {
            return '<div class="chart-col"' + tipAttrs(d.title, d.rows) + '>' +
              (d.value ? '<span class="chart-bar" style="height:' + (d.value / max) * 100 + '%"></span>' : '') + '</div>';
          }).join('') + '</div>' +
        '</div>' +
      '</div>' + xAxis(data.map(function (d) { return d.label; })) +
    '</div>';
  }

  // 꺾은선 (일별 정답률, 0~100). value가 null인 날은 선을 끊는다. data: [{ label, value, title, rows }]
  function lineChart(opts) {
    var data = opts.data;
    var n = data.length;
    var max = opts.max || 100;
    var y = yAxis(max, opts.unit);
    var segments = [], current = [];
    data.forEach(function (d, i) {
      if (d.value == null) { if (current.length) segments.push(current); current = []; }
      else current.push([i + 0.5, 100 - (d.value / max) * 100]);
    });
    if (current.length) segments.push(current);
    var paths = segments.map(function (seg) {
      var line = seg.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ');
      var area = seg.length > 1 ? '<path class="chart-area" d="' + line + ' L' + seg[seg.length - 1][0] + ' 100 L' + seg[0][0] + ' 100 Z"></path>' : '';
      return area + '<path class="chart-line" d="' + line + '"></path>';
    }).join('');
    var lastIdx = -1;
    data.forEach(function (d, i) { if (d.value != null) lastIdx = i; });
    var dots = data.map(function (d, i) {
      if (d.value == null) return '';
      var style = 'left:' + ((i + 0.5) / n) * 100 + '%;bottom:' + (d.value / max) * 100 + '%';
      return '<span class="chart-dot" style="' + style + '"></span>' +
        (i === lastIdx ? '<span class="chart-endlabel" style="' + style + '">' + d.value + (opts.unit || '') + '</span>' : '');
    }).join('');
    return '<div class="chart" role="img" aria-label="' + esc(opts.ariaLabel) + '">' +
      '<div class="chart-body" style="height:' + (opts.height || 180) + 'px">' + y.labels +
        '<div class="chart-plot">' + y.grid +
          '<svg class="chart-svg" viewBox="0 0 ' + n + ' 100" preserveAspectRatio="none" aria-hidden="true">' + paths + '</svg>' + dots +
          '<div class="chart-cols">' + data.map(function (d) { return '<div class="chart-col is-cross"' + tipAttrs(d.title, d.rows) + '></div>'; }).join('') + '</div>' +
        '</div>' +
      '</div>' + xAxis(data.map(function (d) { return d.label; })) +
    '</div>';
  }

  // 가로 막대 목록 (Part별·유형별 정답률, 오답 원인). rows: [{ label, sub, value, display, title, rows, mark }]
  function barList(opts) {
    var max = opts.max || Math.max.apply(null, opts.rows.map(function (r) { return r.value || 0; }).concat(1));
    return '<div class="bar-list" role="list">' + opts.rows.map(function (r) {
      return '<div class="bar-row' + (r.mark ? ' is-marked' : '') + '" role="listitem"' + tipAttrs(r.title || r.label, r.rows) + '>' +
        '<div class="bar-label"><span>' + esc(r.label) + '</span>' + (r.sub ? '<span class="muted small">' + esc(r.sub) + '</span>' : '') + '</div>' +
        '<div class="bar-track"><span class="bar-fill" style="width:' + (r.value == null ? 0 : (r.value / max) * 100) + '%"></span></div>' +
        '<div class="bar-value">' + esc(r.display) + (r.mark ? ' <span class="tag tag-warn">' + esc(r.mark) + '</span>' : '') + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  // 한 줄 누적 막대 (단어 암기 상태). segments: [{ label, value, color: 'viz-1' }]
  function stackedBar(opts) {
    var total = opts.segments.reduce(function (n, s) { return n + s.value; }, 0) || 1;
    return '<div class="stack" role="img" aria-label="' + esc(opts.ariaLabel) + '">' + opts.segments.filter(function (s) { return s.value; }).map(function (s) {
      return '<span class="stack-seg" style="flex-grow:' + s.value + ';background:var(--' + s.color + ')"' +
        tipAttrs(s.label, [[s.label, s.value + '개 (' + Math.round((s.value / total) * 100) + '%)']]) + '></span>';
    }).join('') + '</div>' +
    '<ul class="legend">' + opts.segments.map(function (s) {
      return '<li><span class="legend-swatch" style="background:var(--' + s.color + ')"></span>' + esc(s.label) + ' <b>' + s.value + '</b></li>';
    }).join('') + '</ul>';
  }

  // 학습 달력 (주 단위 열, 일~토 행). cells: [{ date, attempts, studied }]
  function heatmap(opts) {
    function level(c) {
      if (!c.studied) return 0;
      if (c.attempts >= 20) return 4;
      if (c.attempts >= 10) return 3;
      if (c.attempts >= 1) return 2;
      return 1; // 단어만 학습한 날
    }
    var first = TM.date.parseDateKey(opts.cells[0].date).getDay();
    var pad = []; for (var i = 0; i < first; i++) pad.push('<span class="heat-pad"></span>');
    var dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return '<div class="heat-wrap"><div class="heat-days" aria-hidden="true">' + dayNames.map(function (d, i) { return '<span>' + (i % 2 ? d : '') + '</span>'; }).join('') + '</div>' +
      '<div class="heat-grid" role="img" aria-label="' + esc(opts.ariaLabel) + '">' + pad.join('') + opts.cells.map(function (c) {
        var d = TM.date.parseDateKey(c.date);
        var title = (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + dayNames[d.getDay()] + ')';
        return '<span class="heat-cell heat-' + level(c) + '"' + tipAttrs(title, [[c.studied ? '학습함' : '학습 안 함', c.attempts ? c.attempts + '문제' : (c.studied ? '단어 학습' : '-')]]) + '></span>';
      }).join('') + '</div></div>' +
      '<div class="heat-legend muted small" aria-hidden="true">적음 <span class="heat-cell heat-1"></span><span class="heat-cell heat-2"></span><span class="heat-cell heat-3"></span><span class="heat-cell heat-4"></span> 많음</div>';
  }

  // 표로 보기 (모든 그래프의 값을 색 없이 읽을 수 있게)
  function tableView(columns, rows) {
    return '<details class="table-view"><summary>표로 보기</summary><div class="table-wrap"><table>' +
      '<thead><tr>' + columns.map(function (c, i) { return '<th scope="col"' + (i ? ' class="num"' : '') + '>' + esc(c) + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (v, i) { return i ? '<td class="num">' + esc(v) + '</td>' : '<th scope="row">' + esc(v) + '</th>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div></details>';
  }

  // 툴팁: 그래프 요소에 마우스를 올리거나 키보드 초점이 가면 값 표시 (글자는 textContent로 넣는다)
  function attachChartTooltips(root) {
    var tip = document.createElement('div');
    tip.className = 'chart-tooltip';
    tip.hidden = true;
    document.body.appendChild(tip);
    var active = null;

    function fill(el) {
      tip.textContent = '';
      var rows = [];
      try { rows = JSON.parse(el.dataset.tipRows || '[]'); } catch (e) { /* 무시 */ }
      rows.forEach(function (r) {
        var row = document.createElement('div');
        row.className = 'tip-row';
        var v = document.createElement('b'); v.textContent = r[1];
        var l = document.createElement('span'); l.textContent = r[0];
        row.appendChild(v); row.appendChild(l);
        tip.appendChild(row);
      });
      var t = document.createElement('div'); t.className = 'tip-title'; t.textContent = el.dataset.tipTitle;
      tip.insertBefore(t, tip.firstChild);
    }
    function place(x, y) {
      tip.hidden = false;
      var w = tip.offsetWidth, h = tip.offsetHeight;
      var left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 12));
      var top = y - h - 12 < 8 ? y + 16 : y - h - 12;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }
    function show(el, x, y) {
      if (active !== el) { if (active) active.classList.remove('is-hover'); active = el; el.classList.add('is-hover'); fill(el); }
      place(x, y);
    }
    function hide() { tip.hidden = true; if (active) active.classList.remove('is-hover'); active = null; }

    function onMove(e) {
      var el = e.target.closest && e.target.closest('[data-tip-title]');
      if (!el || !root.contains(el)) { hide(); return; }
      show(el, e.clientX, e.clientY);
    }
    function onFocus(e) {
      var el = e.target.closest && e.target.closest('[data-tip-title]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      show(el, r.left + r.width / 2, r.top);
    }
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', hide);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('focusout', hide);
    window.addEventListener('scroll', hide, true);
    return function () {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', hide);
      root.removeEventListener('focusin', onFocus);
      root.removeEventListener('focusout', hide);
      window.removeEventListener('scroll', hide, true);
      tip.remove();
    };
  }

  TM.components.charts = {
    niceMax: niceMax, columnChart: columnChart, lineChart: lineChart, barList: barList,
    stackedBar: stackedBar, heatmap: heatmap, tableView: tableView, attachChartTooltips: attachChartTooltips
  };
})(window.TM = window.TM || {});
