// 단어 학습 계산: 단어 상태, 현황 요약, 검색·필터, 복습 순서, 관련 문제. (화면과 분리된 순수 함수)
//
// 단어 상태(status)
//   new      : 아직 학습하지 않음
//   unknown  : 모름        ┐
//   confused : 헷갈림      ├ 복습 단어
//   review   : 학습 전이지만 관련 문제를 틀려서 복습 등록됨 ┘
//   known    : 알고 있음
(function (TM) {
  'use strict';

  var STATUS = {
    new: { label: '미학습', mastery: 0 },
    review: { label: '복습 필요', mastery: 0 },
    unknown: { label: '모름', mastery: 1 },
    confused: { label: '헷갈림', mastery: 2 },
    known: { label: '알고 있음', mastery: 3 }
  };

  function entryOf(vocabState, word) {
    return vocabState[String(word).toLowerCase()] || null;
  }

  function statusOf(vocabState, word) {
    var e = entryOf(vocabState, word);
    if (!e) return 'new';
    if (e.status) return e.status;
    return e.needsReview ? 'review' : 'new';
  }

  function isReview(status) { return status === 'unknown' || status === 'confused' || status === 'review'; }

  // 화면에 쓰는 단어 정보: 데이터 + 학습 상태 + 관련 문제
  function wordView(content, vocabState, word) {
    var e = entryOf(vocabState, word.word) || {};
    var status = statusOf(vocabState, word.word);
    return {
      word: word,
      status: status,
      statusLabel: STATUS[status].label,
      mastery_level: STATUS[status].mastery,
      reviewCount: e.reviewCount || 0,
      updatedAt: e.updatedAt || null,
      related: content.getRelatedQuestions(word.word),
      wrongQuestions: e.wrongQuestions || []
    };
  }

  function summarize(words, vocabState) {
    var counts = { total: words.length, new: 0, review: 0, unknown: 0, confused: 0, known: 0, reviewTotal: 0 };
    words.forEach(function (w) {
      var s = statusOf(vocabState, w.word);
      counts[s]++;
      if (isReview(s)) counts.reviewTotal++;
    });
    return counts;
  }

  // filter: { query, day, status: 'all'|'review'|'new'|'unknown'|'confused'|'known', difficulty }
  function filterWords(words, vocabState, filter) {
    filter = filter || {};
    var query = String(filter.query || '').trim().toLowerCase();
    return words.filter(function (w) {
      if (filter.day && Number(filter.day) !== w.day) return false;
      if (filter.difficulty && Number(filter.difficulty) !== w.difficulty) return false;
      var s = statusOf(vocabState, w.word);
      if (filter.status && filter.status !== 'all') {
        if (filter.status === 'review' ? !isReview(s) : s !== filter.status) return false;
      }
      if (query && w.word.toLowerCase().indexOf(query) < 0 && String(w.meaning).indexOf(query) < 0) return false;
      return true;
    });
  }

  // 복습 순서: 모름 → 복습 필요(문제 오답) → 헷갈림, 같은 상태끼리는 오래전에 본 단어부터
  function reviewQueue(words, vocabState) {
    var order = { unknown: 0, review: 1, confused: 2 };
    return words
      .map(function (w, i) { return { w: w, i: i, s: statusOf(vocabState, w.word), e: entryOf(vocabState, w.word) || {} }; })
      .filter(function (x) { return isReview(x.s); })
      .sort(function (a, b) {
        return order[a.s] - order[b.s] || String(a.e.updatedAt || '').localeCompare(String(b.e.updatedAt || '')) || a.i - b.i;
      })
      .map(function (x) { return x.w; });
  }

  // 처음 시작할 위치: 아직 상태를 고르지 않은 첫 단어 (모두 했으면 처음부터)
  function firstUnstudiedIndex(words, vocabState) {
    for (var i = 0; i < words.length; i++) {
      var e = entryOf(vocabState, words[i].word);
      if (!e || !e.status) return i;
    }
    return 0;
  }

  TM.vocabService = {
    STATUS: STATUS,
    statusOf: statusOf,
    isReview: isReview,
    wordView: wordView,
    summarize: summarize,
    filterWords: filterWords,
    reviewQueue: reviewQueue,
    firstUnstudiedIndex: firstUnstudiedIndex
  };
})(window.TM = window.TM || {});
