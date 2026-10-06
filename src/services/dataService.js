// 문제·단어 데이터를 불러오고, 화면에서 쓰기 쉬운 형태(색인)로 정리한다.
// 데이터 출처가 바뀌어도(API 등) loadContent만 고치면 나머지 코드는 그대로 쓸 수 있다.
(function (TM) {
  'use strict';

  function lower(s) { return String(s).toLowerCase(); }

  // 원본 데이터 → 색인. 오류가 있으면 details에 이유 목록을 담아 예외를 던진다.
  function buildContent(questionsData, vocabularyData) {
    var result = TM.validateData(questionsData, vocabularyData);
    if (result.errors.length) {
      var err = new Error('문제 데이터에 오류가 있습니다');
      err.details = result.errors;
      throw err;
    }

    var passages = questionsData.passages || [];
    var questions = questionsData.questions;
    var words = vocabularyData.words;

    var passageById = new Map(passages.map(function (p) { return [p.passage_id, p]; }));
    var questionById = new Map(questions.map(function (q) { return [q.question_id, q]; }));
    var wordByKey = new Map(words.map(function (w) { return [lower(w.word), w]; }));

    // 단어 → 이 단어가 등장하는 문제 목록 (문제와 단어를 양방향으로 연결)
    var questionsByWord = new Map();
    questions.forEach(function (q) {
      (q.vocabulary || []).forEach(function (word) {
        var key = lower(word);
        if (!questionsByWord.has(key)) questionsByWord.set(key, []);
        questionsByWord.get(key).push(q.question_id);
      });
    });

    var daySet = new Set(questions.map(function (q) { return q.day; }));
    words.forEach(function (w) { if (w.day) daySet.add(w.day); });
    var days = Array.from(daySet).sort(function (a, b) { return a - b; });

    // 문제 번호: 같은 DAY·Part 안에서 데이터 순서대로 1, 2, 3 …
    var questionNumber = {};
    var counters = {};
    questions.forEach(function (q) {
      var key = q.day + '-' + q.part;
      counters[key] = (counters[key] || 0) + 1;
      questionNumber[q.question_id] = counters[key];
    });

    return {
      passages: passages,
      questions: questions,
      words: words,
      days: days,
      warnings: result.warnings,
      getQuestion: function (id) { return questionById.get(id) || null; },
      getPassage: function (id) { return passageById.get(id) || null; },
      getWord: function (word) { return wordByKey.get(lower(word)) || null; },
      getRelatedQuestions: function (word) { return questionsByWord.get(lower(word)) || []; },
      // 'DAY 1 · Part 5 · Question 3'
      questionLabel: function (id) {
        var q = questionById.get(id);
        return q ? 'DAY ' + q.day + ' · Part ' + q.part + ' · Question ' + questionNumber[id] : id;
      },
      // filter 예: { day: 1, part: 5 } — 생략한 조건은 전체
      getQuestions: function (filter) {
        filter = filter || {};
        return questions.filter(function (q) {
          return (filter.day === undefined || q.day === filter.day) && (filter.part === undefined || q.part === filter.part);
        });
      },
      getWords: function (filter) {
        filter = filter || {};
        return words.filter(function (w) { return filter.day === undefined || w.day === filter.day; });
      }
    };
  }

  // 현재는 data/questions.js, data/vocabulary.js가 window.TM_DATA에 넣어 둔 데이터를 사용한다
  function loadContent() {
    var data = window.TM_DATA || {};
    return buildContent(data.questions, data.vocabulary);
  }

  TM.dataService = { buildContent: buildContent, loadContent: loadContent };
})(window.TM = window.TM || {});
