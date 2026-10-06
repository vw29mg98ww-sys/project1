test('실제 문제·단어 데이터에 오류가 없다', function () {
  var r = TM.validateData(TM_DATA.questions, TM_DATA.vocabulary);
  assert.deepEqual(r.errors, []);
});

test('DAY·Part별로 문제를 조회할 수 있다', function () {
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  assert.ok(content.days.indexOf(1) >= 0, 'DAY 1이 있어야 합니다');
  var list = content.getQuestions({ day: 1, part: 5 });
  assert.ok(list.length > 0);
  assert.ok(list.every(function (q) { return q.day === 1 && q.part === 5; }));
});

test('문제와 단어가 양방향으로 연결된다', function () {
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  var linked = content.questions.filter(function (q) { return q.vocabulary.length; })[0];
  var word = linked.vocabulary[0];
  assert.ok(content.getWord(word), '문제의 단어를 단어장에서 찾을 수 있어야 합니다');
  assert.ok(content.getRelatedQuestions(word).indexOf(linked.question_id) >= 0, '단어에서 문제를 찾을 수 있어야 합니다');
});

test('Part 6/7 문제는 지문을 찾을 수 있다', function () {
  var content = TM.dataService.buildContent(TM_DATA.questions, TM_DATA.vocabulary);
  [6, 7].forEach(function (part) {
    content.getQuestions({ part: part }).forEach(function (q) {
      assert.ok(content.getPassage(q.passage_id), q.question_id + ' 지문 없음');
    });
  });
});

function minimalData() {
  return {
    questions: {
      passages: [{ passage_id: 'psg1', type: 'double', documents: [{ html: '<p>a</p>' }, { html: '<p>b</p>' }] }],
      questions: [
        { question_id: 'q1', day: 1, part: 5, difficulty: 1, passage_id: null, question: 'Q', choices: ['a', 'b', 'c', 'd'], correct_answer: 'A', explanation: { summary: 's' }, vocabulary: ['submit'], question_type: '품사' },
        { question_id: 'q2', day: 1, part: 7, difficulty: 3, passage_id: 'psg1', question: 'Q', choices: ['a', 'b', 'c', 'd'], correct_answer: 'D', explanation: { summary: 's' }, vocabulary: [], question_type: '정보 연결' }
      ]
    },
    vocabulary: { words: [{ word: 'submit', meaning: '제출하다' }] }
  };
}

test('올바른 최소 데이터(이중 지문 포함)는 통과한다', function () {
  var d = minimalData();
  assert.deepEqual(TM.validateData(d.questions, d.vocabulary), { errors: [], warnings: [] });
});

test('잘못된 데이터는 이유와 함께 거부한다', function () {
  var d = minimalData();
  d.questions.questions[0].correct_answer = 'E';
  d.questions.questions[0].choices.pop();
  d.questions.questions[1].passage_id = 'missing';
  d.questions.questions.push(Object.assign({}, d.questions.questions[1], { question_id: 'q1', passage_id: 'psg1' }));
  d.questions.passages[0].documents.pop(); // double인데 문서 1개
  var text = TM.validateData(d.questions, d.vocabulary).errors.join('\n');
  assert.match(text, /correct_answer/);
  assert.match(text, /보기\)는 4개/);
  assert.match(text, /존재하지 않는 지문 missing/);
  assert.match(text, /중복된 question_id/);
  assert.match(text, /documents가 2개/);
  assert.throws(function () { TM.dataService.buildContent(d.questions, d.vocabulary); }, /오류/);
});

test('단어장에 없는 단어나 미등록 유형은 경고로 알려준다', function () {
  var d = minimalData();
  d.questions.questions[0].vocabulary.push('unknownword');
  d.questions.questions[0].question_type = '이상한 유형';
  var r = TM.validateData(d.questions, d.vocabulary);
  assert.deepEqual(r.errors, []);
  assert.equal(r.warnings.length, 2);
});
