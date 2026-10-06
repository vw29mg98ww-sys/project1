// 문제 풀이 세션 계산: 어떤 문제를 어떤 순서로, 몇 번째부터 풀지 정한다. (화면과 분리된 순수 함수)
(function (TM) {
  'use strict';

  function attemptCount(attempts, questionId) {
    return attempts.filter(function (a) { return a.question_id === questionId; }).length;
  }

  // 처음 시작할 위치: 아직 안 푼 첫 문제(오답 복습은 아직 다시 안 푼 첫 문제). 모두 했으면 처음부터.
  function firstUnfinishedIndex(items, attempts, sectionKind) {
    for (var i = 0; i < items.length; i++) {
      var count = attemptCount(attempts, items[i].question_id);
      if (sectionKind === 'review' ? count <= 1 : count === 0) return i;
    }
    return 0;
  }

  // params.q가 있으면(이어서 학습) 그 위치, 없으면 아직 안 푼 첫 문제
  function buildSession(content, day, sectionId, attempts, requestedIndex) {
    var section = TM.dayService.getSection(sectionId);
    if (!section || section.kind === 'vocab') return null;
    var items = TM.dayService.getSectionItems(content, day, sectionId, attempts);
    var start = firstUnfinishedIndex(items, attempts, section.kind);
    var requested = Number(requestedIndex);
    if (requestedIndex !== undefined && requestedIndex !== '' && Number.isInteger(requested) && requested >= 0 && requested < items.length) {
      start = requested;
    }
    return { day: day, section: section, items: items, startIndex: start };
  }

  // 이번 세션 결과 요약
  function summarize(results) {
    var correct = results.filter(function (r) { return r.is_correct; }).length;
    var time = results.reduce(function (n, r) { return n + r.time_ms; }, 0);
    return {
      answered: results.length,
      correct: correct,
      wrong: results.length - correct,
      accuracy: results.length ? Math.round((correct / results.length) * 100) : null,
      avgTimeMs: results.length ? Math.round(time / results.length) : 0
    };
  }

  // Part 6 질문 '빈칸 (2)에 …'에서 빈칸 번호를 찾는다 (지문의 해당 빈칸을 강조하기 위해)
  function blankNumber(questionText) {
    var m = /빈칸\s*\((\d+)\)/.exec(questionText || '');
    return m ? Number(m[1]) : null;
  }

  TM.studyService = {
    buildSession: buildSession,
    firstUnfinishedIndex: firstUnfinishedIndex,
    summarize: summarize,
    blankNumber: blankNumber
  };
})(window.TM = window.TM || {});
