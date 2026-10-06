// DAY 학습 계산: DAY별 학습 구성, 진행률, 다음에 할 학습.
// 화면과 분리된 순수 계산 함수라 테스트하기 쉽다.
//
// [진행률 기준]
// - Vocabulary: 그 DAY 단어 중 학습 상태(모름/헷갈림/알고 있음)를 직접 표시한 단어 수
//   (문제를 틀려 자동으로 복습 등록된 단어는 학습한 것으로 세지 않는다)
// - Part 5/6/7: 그 DAY 문제 중 한 번 이상 푼 문제 수
// - 오답 복습: 그 DAY 문제 중 처음 풀 때 틀린 문제를, 그 뒤에 다시 풀었는지
// 분모는 권장 학습량이 아니라 그 DAY에 실제로 등록된 문제·단어 수다.
(function (TM) {
  'use strict';

  var SECTIONS = [
    { id: 'vocabulary', label: 'Vocabulary', kind: 'vocab' },
    { id: 'part5', label: 'Part 5', kind: 'question', part: 5 },
    { id: 'part6', label: 'Part 6', kind: 'question', part: 6 },
    { id: 'part7', label: 'Part 7', kind: 'question', part: 7 },
    { id: 'review', label: '오답 복습', kind: 'review' }
  ];
  var MAIN_SECTION_IDS = ['vocabulary', 'part5', 'part6', 'part7'];

  function getSection(id) {
    return SECTIONS.filter(function (s) { return s.id === id; })[0] || null;
  }

  // 문제별 풀이 기록을 시간 순서대로 묶는다
  function attemptsByQuestion(attempts) {
    var map = {};
    attempts.forEach(function (a) { (map[a.question_id] = map[a.question_id] || []).push(a); });
    return map;
  }

  // 오답 복습 대상: 처음 풀 때 틀린 문제 / 완료: 그 뒤에 다시 푼 기록이 있음
  function reviewItems(questions, byQuestion) {
    return questions
      .filter(function (q) { var list = byQuestion[q.question_id]; return list && !list[0].is_correct; })
      .map(function (q) { return { question: q, done: byQuestion[q.question_id].length > 1 }; });
  }

  // 한 영역에서 풀 대상 목록 (문제 데이터 순서 유지)
  function getSectionItems(content, day, sectionId, attempts) {
    var section = getSection(sectionId);
    if (!section) return [];
    if (section.kind === 'vocab') return content.getWords({ day: day });
    if (section.kind === 'question') return content.getQuestions({ day: day, part: section.part });
    return reviewItems(content.getQuestions({ day: day }), attemptsByQuestion(attempts || []))
      .map(function (r) { return r.question; });
  }

  // data: { content, day, attempts, vocabState }
  function computeDayProgress(data) {
    var content = data.content, day = data.day;
    var byQuestion = attemptsByQuestion(data.attempts || []);
    var vocabState = data.vocabState || {};

    var sections = SECTIONS.map(function (s) {
      var total, done;
      if (s.kind === 'vocab') {
        var words = content.getWords({ day: day });
        total = words.length;
        done = words.filter(function (w) { var e = vocabState[w.word.toLowerCase()]; return !!(e && e.status); }).length;
      } else if (s.kind === 'question') {
        var qs = content.getQuestions({ day: day, part: s.part });
        total = qs.length;
        done = qs.filter(function (q) { return byQuestion[q.question_id]; }).length;
      } else {
        var items = reviewItems(content.getQuestions({ day: day }), byQuestion);
        total = items.length;
        done = items.filter(function (r) { return r.done; }).length;
      }
      return { id: s.id, label: s.label, kind: s.kind, done: done, total: total, complete: done >= total };
    });

    var main = sections.filter(function (s) { return MAIN_SECTION_IDS.indexOf(s.id) >= 0; });
    var mainDone = main.reduce(function (n, s) { return n + s.done; }, 0);
    var mainTotal = main.reduce(function (n, s) { return n + s.total; }, 0);
    var review = sections[sections.length - 1];
    var started = mainDone > 0;
    var complete = mainTotal > 0 && mainDone >= mainTotal && review.complete;

    return {
      day: day,
      sections: sections,
      mainDone: mainDone,
      mainTotal: mainTotal,
      percent: mainTotal ? Math.round((mainDone / mainTotal) * 100) : 0,
      hasContent: mainTotal > 0,
      complete: complete,
      status: complete ? 'complete' : started ? 'in_progress' : 'not_started'
    };
  }

  // 다음에 할 영역: 순서대로 보면서 아직 끝나지 않은 첫 영역 (내용이 없는 영역은 건너뜀)
  function nextSection(dayProgress) {
    return dayProgress.sections.filter(function (s) { return s.total > 0 && !s.complete; })[0] || null;
  }

  // 저장된 마지막 위치가 아직 이어서 할 의미가 있는지 (해당 영역이 끝나지 않았는지)
  function isResumable(position, dayProgress) {
    if (!position || position.day !== dayProgress.day) return false;
    var section = dayProgress.sections.filter(function (s) { return s.id === position.section; })[0];
    return !!section && section.total > 0 && !section.complete;
  }

  function studyLink(day, sectionId, index) {
    return '#/study?day=' + day + '&section=' + sectionId + (index ? '&q=' + index : '');
  }

  TM.dayService = {
    SECTIONS: SECTIONS,
    getSection: getSection,
    getSectionItems: getSectionItems,
    computeDayProgress: computeDayProgress,
    nextSection: nextSection,
    isResumable: isResumable,
    studyLink: studyLink
  };
})(window.TM = window.TM || {});
