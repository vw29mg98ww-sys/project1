// 문제·단어 데이터 검사기. 앱 시작 시 실행되어, 데이터에 오류가 있으면 화면에 위치와 이유를 보여준다.
// errors: 앱이 정상 동작하지 않는 문제 / warnings: 동작은 하지만 확인이 필요한 부분
(function (TM) {
  'use strict';

  TM.validateData = function (questionsData, vocabularyData) {
    var C = TM.constants;
    var errors = [];
    var warnings = [];
    var passages = (questionsData && questionsData.passages) || [];
    var questions = (questionsData && questionsData.questions) || [];
    var words = (vocabularyData && vocabularyData.words) || [];

    if (!questionsData || !Array.isArray(questionsData.questions)) errors.push('문제 데이터(questions.js)를 찾을 수 없거나 questions 배열이 없습니다');
    if (!vocabularyData || !Array.isArray(vocabularyData.words)) errors.push('단어 데이터(vocabulary.js)를 찾을 수 없거나 words 배열이 없습니다');

    var passageIds = {};
    passages.forEach(function (p) {
      var where = '지문 ' + (p.passage_id || '(ID 없음)');
      if (!p.passage_id) errors.push(where + ': passage_id가 필요합니다');
      else if (passageIds[p.passage_id]) errors.push(where + ': 중복된 passage_id입니다');
      passageIds[p.passage_id] = true;
      var docCount = C.PASSAGE_TYPES[p.type];
      if (!docCount) errors.push(where + ': type은 single, double, triple 중 하나여야 합니다');
      else if (!Array.isArray(p.documents) || p.documents.length !== docCount) {
        errors.push(where + ': ' + p.type + ' 지문은 documents가 ' + docCount + '개여야 합니다');
      }
      (p.documents || []).forEach(function (doc) {
        if (!doc.html) errors.push(where + ': 각 document에는 html 본문이 필요합니다');
      });
    });

    var vocabKeys = {};
    words.forEach(function (w) {
      if (!w.word || !w.meaning) errors.push('단어 ' + JSON.stringify(w.word || w) + ': word와 meaning이 필요합니다');
      var key = String(w.word).toLowerCase();
      if (vocabKeys[key]) errors.push('단어 ' + w.word + ': 중복된 단어입니다');
      vocabKeys[key] = true;
    });

    var questionIds = {};
    questions.forEach(function (q) {
      var where = '문제 ' + (q.question_id || '(ID 없음)');
      if (!q.question_id) errors.push(where + ': question_id가 필요합니다');
      else if (questionIds[q.question_id]) errors.push(where + ': 중복된 question_id입니다');
      questionIds[q.question_id] = true;

      if (!Number.isInteger(q.day) || q.day < 1) errors.push(where + ': day는 1 이상의 정수여야 합니다');
      if (!C.PARTS[q.part]) errors.push(where + ': part는 5, 6, 7 중 하나여야 합니다');
      if (!C.DIFFICULTY_LEVELS[q.difficulty]) errors.push(where + ': difficulty는 1~4여야 합니다');
      if (!q.question) errors.push(where + ': question(질문)이 필요합니다');
      if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(where + ': choices(보기)는 4개여야 합니다');
      if (C.CHOICE_LETTERS.indexOf(q.correct_answer) < 0) errors.push(where + ': correct_answer는 "A"~"D" 중 하나여야 합니다');
      if (!q.explanation || !q.explanation.summary) errors.push(where + ': explanation.summary(해설)가 필요합니다');

      if (q.part === 6 || q.part === 7) {
        if (!q.passage_id) errors.push(where + ': Part ' + q.part + ' 문제에는 passage_id가 필요합니다');
        else if (!passageIds[q.passage_id]) errors.push(where + ': 존재하지 않는 지문 ' + q.passage_id + '를 참조합니다');
      }
      if (C.PARTS[q.part] && q.question_type && C.PARTS[q.part].types.indexOf(q.question_type) < 0) {
        warnings.push(where + ': Part ' + q.part + '에 등록되지 않은 문제 유형 "' + q.question_type + '"입니다');
      }
      (q.vocabulary || []).forEach(function (word) {
        if (!vocabKeys[String(word).toLowerCase()]) warnings.push(where + ': 단어 "' + word + '"가 vocabulary.js에 없습니다');
      });
    });

    return { errors: errors, warnings: warnings };
  };
})(window.TM = window.TM || {});
