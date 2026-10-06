// 문제 화면 조각: 지문, 보기, 채점 결과·해설, 오답 원인 선택
(function (TM) {
  'use strict';

  TM.components = TM.components || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };
  var LETTERS = function () { return TM.constants.CHOICE_LETTERS; };

  // 지문: 문서가 여러 개(이중·삼중 지문)면 문서마다 제목과 번호를 붙인다.
  // 지문 HTML은 직접 작성한 데이터이므로 그대로 넣고, 현재 문제의 빈칸만 강조한다.
  function renderPassage(passage, activeBlank) {
    if (!passage) return '';
    var docs = passage.documents;
    var html = docs.map(function (doc, i) {
      var body = doc.html;
      if (activeBlank) body = body.split('<span class="blank">(' + activeBlank + ')</span>').join('<span class="blank is-active">(' + activeBlank + ')</span>');
      var title = doc.title || (docs.length > 1 ? '문서 ' + (i + 1) : '');
      return '<article class="passage-doc">' +
        (title || docs.length > 1 ? '<div class="passage-title">' + (docs.length > 1 ? '<span class="passage-no">' + (i + 1) + '/' + docs.length + '</span>' : '') + esc(title) + '</div>' : '') +
        '<div class="passage-body">' + body + '</div></article>';
    }).join('');
    return '<div class="card passage">' + html + '</div>';
  }

  function renderChoices(question, attempt) {
    return '<div class="choices" role="group" aria-label="보기">' + question.choices.map(function (choice, i) {
      var letter = LETTERS()[i];
      var cls = '';
      var mark = '';
      if (attempt) {
        if (letter === question.correct_answer) { cls = ' is-correct'; mark = '<span class="choice-mark">정답</span>'; }
        else if (letter === attempt.selected) { cls = ' is-wrong'; mark = '<span class="choice-mark">내 답</span>'; }
      }
      return '<button type="button" class="choice' + cls + '" data-action="choose" data-letter="' + letter + '"' + (attempt ? ' disabled' : '') + '>' +
        '<span class="choice-letter">(' + letter + ')</span><span class="choice-text">' + esc(choice) + '</span>' + mark + '</button>';
    }).join('') + '</div>';
  }

  function choiceText(question, letter) {
    return '(' + letter + ') ' + question.choices[LETTERS().indexOf(letter)];
  }

  function detailRow(label, content) {
    if (!content) return '';
    return '<div class="fb-row"><div class="fb-label">' + esc(label) + '</div><div class="fb-content">' + content + '</div></div>';
  }

  function renderKeyWords(question, content) {
    var words = (question.vocabulary || []).map(function (w) { return content.getWord(w); }).filter(Boolean);
    if (!words.length) return '';
    return '<ul class="key-words">' + words.map(function (w) {
      return '<li><a class="key-word" href="#/vocabulary?q=' + encodeURIComponent(w.word) + '"><b>' + esc(w.word) + '</b></a> <span class="muted">' + esc(w.part_of_speech || '') + '</span> ' + esc(w.meaning) + '</li>';
    }).join('') + '</ul>';
  }

  // 문장 삽입 문제: 빈칸 앞 문장, 뒤 문장, 연결 단서
  function renderContext(ctxInfo) {
    if (!ctxInfo) return '';
    return '<dl class="context-analysis">' +
      '<dt>빈칸 앞</dt><dd>' + esc(ctxInfo.before) + '</dd>' +
      '<dt>빈칸 뒤</dt><dd>' + esc(ctxInfo.after) + '</dd>' +
      '<dt>연결 단서</dt><dd>' + esc(ctxInfo.clue) + '</dd>' +
    '</dl>';
  }

  function questionTypeText(question) {
    var C = TM.constants;
    var parts = [C.PARTS[question.part].name];
    if (question.question_type) parts.push(question.question_type);
    if (question.grammar_point && question.grammar_point !== question.question_type) parts.push(question.grammar_point);
    var level = C.DIFFICULTY_LEVELS[question.difficulty];
    if (level) parts.push(level.label + ' ' + level.name);
    return parts.map(esc).join(' · ');
  }

  // 오답 원인 선택 (선택하면 학습 분석에 쓰인다)
  function renderReasonPicker(attempt) {
    return '<div class="reason-picker">' +
      '<div class="reason-question">왜 틀렸나요? <span class="muted small">선택하면 취약 영역 분석에 반영됩니다</span></div>' +
      '<div class="reason-chips">' + TM.constants.WRONG_REASONS.map(function (r) {
        var on = attempt.wrong_reason === r.id;
        return '<button type="button" class="reason-chip' + (on ? ' is-selected' : '') + '" data-action="reason" data-reason="' + r.id + '" aria-pressed="' + on + '">' + esc(r.label) + '</button>';
      }).join('') + '</div></div>';
  }

  // 채점 결과와 해설. 정답이면 간단히, 오답이면 자세히 보여준다.
  function renderFeedback(question, attempt, content, flaggedWords) {
    var ex = question.explanation || {};
    var time = '<span class="fb-time">풀이 시간 ' + TM.date.formatDuration(attempt.time_ms) + '</span>';

    if (attempt.is_correct) {
      return '<div class="feedback is-correct" role="status">' +
        '<div class="fb-head"><span class="fb-title">⭕ 정답입니다</span>' + time + '</div>' +
        '<p class="fb-summary">' + esc(ex.summary) + '</p>' +
        detailRow('앞뒤 문맥', renderContext(ex.context_analysis)) +
        detailRow('핵심 어휘', renderKeyWords(question, content)) +
      '</div>';
    }

    var why = ex.wrong_choices && ex.wrong_choices[attempt.selected];
    return '<div class="feedback is-wrong" role="status">' +
      '<div class="fb-head"><span class="fb-title">❌ 오답입니다</span>' + time + '</div>' +
      '<div class="fb-answers">' +
        '<div>내 답 <b>' + esc(choiceText(question, attempt.selected)) + '</b></div>' +
        '<div>정답 <b class="fb-correct">' + esc(choiceText(question, question.correct_answer)) + '</b></div>' +
      '</div>' +
      detailRow('왜 틀렸는지', esc(why || '선택한 보기는 정답 근거와 맞지 않습니다. 아래 정답 근거를 확인하세요.')) +
      detailRow('정답 근거', esc(ex.evidence || ex.summary)) +
      detailRow('앞뒤 문맥', renderContext(ex.context_analysis)) +
      detailRow('문장 구조', ex.structure ? esc(ex.structure) : '') +
      detailRow('핵심 어휘', renderKeyWords(question, content) +
        (flaggedWords && flaggedWords.length ? '<div class="muted small">→ 복습 단어로 등록했습니다</div>' : '')) +
      detailRow('문제 유형', questionTypeText(question)) +
      detailRow('다음에 주의할 점', ex.tip ? esc(ex.tip) : '') +
      renderReasonPicker(attempt) +
    '</div>';
  }

  // 문제 상세 화면용 전체 해설: 정답 근거, 문맥, 구조, 보기별 오답 이유, 핵심 어휘, 유형, 주의점
  function renderExplanation(question, content) {
    var ex = question.explanation || {};
    var wrongs = ex.wrong_choices ? Object.keys(ex.wrong_choices).sort().map(function (l) {
      return '<li><b>(' + l + ')</b> ' + esc(ex.wrong_choices[l]) + '</li>';
    }).join('') : '';
    return '<div class="feedback is-explain">' +
      '<div class="fb-head"><span class="fb-title">정답 (' + esc(question.correct_answer) + ') ' + esc(question.choices[LETTERS().indexOf(question.correct_answer)]) + '</span></div>' +
      '<p class="fb-summary">' + esc(ex.summary) + '</p>' +
      detailRow('정답 근거', ex.evidence ? esc(ex.evidence) : '') +
      detailRow('앞뒤 문맥', renderContext(ex.context_analysis)) +
      detailRow('문장 구조', ex.structure ? esc(ex.structure) : '') +
      detailRow('오답 보기', wrongs ? '<ul class="wrong-list">' + wrongs + '</ul>' : '') +
      detailRow('핵심 어휘', renderKeyWords(question, content)) +
      detailRow('문제 유형', questionTypeText(question)) +
      detailRow('다음에 주의할 점', ex.tip ? esc(ex.tip) : '') +
    '</div>';
  }

  TM.components.renderExplanation = renderExplanation;
  TM.components.renderPassage = renderPassage;
  TM.components.renderChoices = renderChoices;
  TM.components.renderFeedback = renderFeedback;
})(window.TM = window.TM || {});
