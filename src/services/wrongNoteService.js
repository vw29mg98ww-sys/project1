// 오답노트 계산: 한 번이라도 틀린 문제를 모아 상태·원인·필터를 정리한다. (화면과 분리된 순수 함수)
//
// 상태: open(미해결) = 마지막 풀이가 오답, resolved(해결됨) = 틀린 뒤 다시 풀어 마지막 풀이가 정답
// 오답 원인: 가장 최근 오답의 원인 (없으면 그 이전 오답 중 원인을 고른 가장 최근 것)
(function (TM) {
  'use strict';

  // 빠른 필터: 원인 기준 (어휘 오답, 긴 문장 오답, 원인 미선택)
  var QUICK = [
    { id: 'all', label: '전체', reason: '' },
    { id: 'vocabulary', label: '어휘 오답', reason: 'vocabulary' },
    { id: 'long_sentence', label: '긴 문장 오답', reason: 'long_sentence' },
    { id: 'none', label: '원인 미선택', reason: 'none' }
  ];

  function buildEntries(content, attempts) {
    var byQuestion = {};
    attempts.forEach(function (a) { (byQuestion[a.question_id] = byQuestion[a.question_id] || []).push(a); });
    var entries = [];
    Object.keys(byQuestion).forEach(function (id) {
      var list = byQuestion[id];
      var wrongs = list.filter(function (a) { return !a.is_correct; });
      var question = content.getQuestion(id);
      if (!wrongs.length || !question) return;
      var lastWrong = wrongs[wrongs.length - 1];
      var tagged = wrongs.filter(function (a) { return a.wrong_reason; });
      var latest = list[list.length - 1];
      entries.push({
        question: question,
        lastWrong: lastWrong,
        latest: latest,
        resolved: latest.is_correct,
        wrongCount: wrongs.length,
        attemptCount: list.length,
        reason: lastWrong.wrong_reason || (tagged.length ? tagged[tagged.length - 1].wrong_reason : null)
      });
    });
    // 최근에 틀린 문제부터
    return entries.sort(function (a, b) { return String(b.lastWrong.answered_at).localeCompare(String(a.lastWrong.answered_at)); });
  }

  // filter: { status: 'open'|'resolved'|'all', day, part, type, reason: 원인 id | 'none' }
  function filterEntries(entries, filter) {
    filter = filter || {};
    var status = filter.status || 'open';
    return entries.filter(function (e) {
      var q = e.question;
      if (status === 'open' && e.resolved) return false;
      if (status === 'resolved' && !e.resolved) return false;
      if (filter.day && Number(filter.day) !== q.day) return false;
      if (filter.part && Number(filter.part) !== q.part) return false;
      if (filter.type && filter.type !== q.question_type) return false;
      if (filter.reason === 'none' && e.reason) return false;
      if (filter.reason && filter.reason !== 'none' && filter.reason !== e.reason) return false;
      return true;
    });
  }

  function summarize(entries) {
    var s = { total: entries.length, open: 0, resolved: 0, noReason: 0, byReason: {} };
    entries.forEach(function (e) {
      if (e.resolved) s.resolved++; else s.open++;
      if (!e.resolved) {
        if (e.reason) s.byReason[e.reason] = (s.byReason[e.reason] || 0) + 1;
        else s.noReason++;
      }
    });
    return s;
  }

  // 필터 목록에 쓸 유형: 오답에 실제로 있는 유형만, Part 순서대로
  function typesIn(entries) {
    var seen = {};
    var types = [];
    [5, 6, 7].forEach(function (p) {
      TM.constants.PARTS[p].types.forEach(function (t) {
        if (!seen[t] && entries.some(function (e) { return e.question.question_type === t; })) { seen[t] = true; types.push(t); }
      });
    });
    return types;
  }

  TM.wrongNoteService = { QUICK: QUICK, buildEntries: buildEntries, filterEntries: filterEntries, summarize: summarize, typesIn: typesIn };
})(window.TM = window.TM || {});
