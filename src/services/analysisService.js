// 학습 분석 문장 만들기.
//
// [구조] analyticsService가 만든 요약(summary) → 분석기(provider)들 → 분석 결과 목록
//   분석 결과 형식: { id, tone: 'focus' | 'good' | 'info', message, action?: { label, kind, ... } }
//   - 지금은 규칙 기반 분석기 하나가 등록되어 있다.
//   - AI 분석을 붙일 때는 같은 형식을 돌려주는 분석기를 registerProvider로 추가하면 된다.
//     예) registerProvider({ id: 'ai', analyze: function (summary) { return fetch(...).then(...) } })
//     (Promise를 돌려줘도 된다. 화면은 analyze()의 Promise 결과를 그린다)
//   - buildPrompt(summary)는 같은 요약을 AI에게 보낼 수 있는 글로 만든다(화면의 '요약 복사' 버튼).
(function (TM) {
  'use strict';

  var providers = [];

  function partName(p) { return TM.constants.PARTS[p].name; }

  // 규칙 기반 분석기
  var ruleBased = {
    id: 'rules',
    analyze: function (s) {
      var C = TM.constants;
      var out = [];
      var during = s.range.label + ' 동안 ';
      if (!s.totals.attempts) {
        out.push({ id: 'no-data', tone: 'info', message: s.range.label + ' 동안 푼 문제가 없습니다. 오늘의 학습을 시작해 보세요.', action: { label: '오늘의 학습 시작', kind: 'link', href: '#/day' } });
        return out;
      }

      // 1) 가장 낮은 Part (5문제 이상 푼 Part가 2개 이상일 때)
      var measured = [5, 6, 7].filter(function (p) { return s.parts[p].attempts >= 5; });
      var weakestPart = null;
      if (measured.length >= 2) {
        weakestPart = measured.reduce(function (a, b) { return s.parts[b].accuracy < s.parts[a].accuracy ? b : a; });
        out.push({ id: 'weakest-part', tone: 'focus', message: during + partName(weakestPart) + ' 정답률이 ' + s.parts[weakestPart].accuracy + '%로 가장 낮습니다.' });
      } else if (measured.length === 1) {
        weakestPart = measured[0];
      }

      // 2) 가장 많은 오답 원인 (원인을 5개 이상 기록했을 때)
      if (s.reasons.tagged >= 5 && s.reasons.list.length) {
        var top = s.reasons.list[0];
        var base = s.reasons.untagged ? '원인을 기록한 오답의 ' : '전체 오답의 ';
        out.push({ id: 'top-reason', tone: 'focus', message: TM.korean.particle(top.label, '로', '으로') + ' 인한 오답이 ' + base + top.share + '%입니다.' });
      }

      // 3) 가장 약한 유형 (3번 이상 풀고 70% 미만)
      var weakType = s.types.filter(function (t) { return t.attempts >= C.WEAK_TYPE.MIN_ATTEMPTS && t.accuracy < C.WEAK_TYPE.THRESHOLD; })[0];
      if (weakType) {
        out.push({ id: 'weak-type', tone: 'focus', message: '\'' + weakType.type + '\' 유형(' + partName(weakType.part) + ') 정답률이 ' + weakType.accuracy + '%로 낮습니다.' });
      }

      // 4) 풀이 시간 (목표보다 30% 이상 오래 걸리는 Part)
      [5, 6, 7].forEach(function (p) {
        var part = s.parts[p];
        var target = C.ANALYTICS.TARGET_SECONDS[p];
        if (part.attempts >= 5 && part.avgSeconds > target * 1.3) {
          out.push({ id: 'slow-' + p, tone: 'info', message: partName(p) + ' 평균 풀이 시간이 ' + part.avgSeconds + '초로 목표(' + target + '초)보다 깁니다. 실전에서는 시간이 부족할 수 있습니다.' });
        }
      });

      // 5) 정답률 변화 (기간 앞·뒤 절반 각각 10문제 이상)
      var t = s.trend;
      if (t.firstHalf.attempts >= 10 && t.secondHalf.attempts >= 10) {
        var diff = t.secondHalf.accuracy - t.firstHalf.accuracy;
        if (diff >= 5) out.push({ id: 'trend-up', tone: 'good', message: '기간 후반 정답률이 전반보다 ' + diff + '%p 올랐습니다. 좋은 흐름입니다.' });
        else if (diff <= -5) out.push({ id: 'trend-down', tone: 'focus', message: '기간 후반 정답률이 전반보다 ' + (-diff) + '%p 떨어졌습니다. 오답노트로 복습해 보세요.', action: { label: '오답노트', kind: 'link', href: '#/wrong-notes' } });
      }

      // 6) 다음 학습 추천: 약한 Part의 약한 유형 5문제 + 복습 단어 최대 20개
      var recPart = weakType ? weakType.part : weakestPart;
      if (recPart) {
        var recType = weakType && weakType.part === recPart ? weakType.type
          : (s.types.filter(function (x) { return x.part === recPart; })[0] || {}).type;
        var vocabN = Math.min(20, s.vocab.reviewTotal);
        var parts = [partName(recPart) + (recType ? ' ' + recType : '') + ' 문제 5개'];
        if (vocabN) parts.push('어휘 복습 ' + vocabN + '개');
        out.push({
          id: 'recommend', tone: 'info', message: '다음 학습에서는 ' + parts.join('와 ') + '를 추천합니다.',
          action: { label: '추천 문제 풀기', kind: 'practice', part: recPart, type: recType || null, count: 5 },
          secondary: vocabN ? { label: '어휘 복습', kind: 'vocab-review' } : null
        });
      }
      return out;
    }
  };

  function registerProvider(provider) {
    providers = providers.filter(function (p) { return p.id !== provider.id; }).concat(provider);
  }

  function unregisterProvider(id) {
    providers = providers.filter(function (p) { return p.id !== id; });
  }

  // 등록된 모든 분석기의 결과를 합친다 (동기 결과와 Promise 모두 지원)
  function analyze(summary) {
    return Promise.all(providers.map(function (p) {
      return Promise.resolve().then(function () { return p.analyze(summary); }).catch(function () { return []; });
    })).then(function (lists) { return lists.reduce(function (all, l) { return all.concat(l || []); }, []); });
  }

  // 규칙 기반 결과만 즉시(동기) 얻기 — 화면 첫 그리기와 테스트용
  function analyzeSync(summary) { return ruleBased.analyze(summary); }

  // AI에게 그대로 붙여 넣을 수 있는 분석 요청 글
  function buildPrompt(summary) {
    var compact = {
      range: summary.range, totals: summary.totals, trend: summary.trend, parts: summary.parts,
      types: summary.types, wrong_reasons: summary.reasons, vocabulary: summary.vocab, streak: summary.streak,
      daily: summary.daily.filter(function (d) { return d.attempts; })
    };
    return '나는 TOEIC 900점을 목표로 RC(Part 5·6·7)를 공부하고 있어. 아래는 내 ' + summary.range.label + ' 학습 기록 요약(JSON)이야.\n' +
      '1) 가장 취약한 영역과 그 이유, 2) 다음 일주일 학습 계획(하루 단위), 3) 900점까지 가장 효과적인 개선 방법을 알려 줘.\n\n' +
      JSON.stringify(compact, null, 2);
  }

  registerProvider(ruleBased);

  TM.analysisService = { registerProvider: registerProvider, unregisterProvider: unregisterProvider, analyze: analyze, analyzeSync: analyzeSync, buildPrompt: buildPrompt };
})(window.TM = window.TM || {});
