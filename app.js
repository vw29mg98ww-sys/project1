(function () {
  'use strict';

  const DATA = TOEIC_DATA; // data/questions.js에서 선언된 전역 상수
  const STORE_KEY = 'toeic-rc-progress-v1';
  // 실제 시험: RC 100문항 / 75분 → 문항당 45초
  const SECONDS_PER_QUESTION = 45;
  const LETTERS = ['A', 'B', 'C', 'D'];
  const PART_INFO = {
    5: { name: 'Part 5', desc: '단문 빈칸 채우기 · 문법과 어휘' },
    6: { name: 'Part 6', desc: '장문 빈칸 채우기 · 문맥과 문장 삽입' },
    7: { name: 'Part 7', desc: '독해 · 이메일, 광고, 채팅 지문' }
  };

  const $app = document.getElementById('app');

  // ───────── 저장소 ─────────
  function loadProgress() {
    const empty = { attempts: {}, vocabKnown: [], history: [] };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return empty;
      const p = JSON.parse(raw);
      return { attempts: p.attempts || {}, vocabKnown: p.vocabKnown || [], history: p.history || [] };
    } catch (e) {
      return empty;
    }
  }
  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* 저장 불가 환경 */ }
  }
  let progress = loadProgress();

  const questionIndex = {};
  DATA.sets.forEach(set => set.questions.forEach(q => { questionIndex[q.id] = { set, q }; }));

  function recordAnswer(qid, correct) {
    const a = progress.attempts[qid] || { correct: 0, wrong: 0, last: null };
    if (correct) a.correct++; else a.wrong++;
    a.last = correct;
    progress.attempts[qid] = a;
  }

  function wrongIds() {
    return Object.keys(progress.attempts).filter(id => progress.attempts[id].last === false && questionIndex[id]);
  }

  // ───────── 유틸 ─────────
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }
  function setsOfPart(part) { return DATA.sets.filter(s => s.part === part); }
  function questionCount(part) { return setsOfPart(part).reduce((n, s) => n + s.questions.length, 0); }
  function formatTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  // ───────── 상태 ─────────
  let view = 'home';
  let quiz = null;
  let timerId = null;
  let vocab = null;

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function go(next) {
    stopTimer();
    view = next;
    render();
    window.scrollTo(0, 0);
  }

  // ───────── 퀴즈 ─────────
  function startQuiz({ title, mode, sets, onlyIds }) {
    const items = [];
    sets.forEach(set => set.questions.forEach(q => {
      if (!onlyIds || onlyIds.has(q.id)) items.push({ set, q });
    }));
    if (!items.length) return;
    quiz = {
      title, mode, items, index: 0,
      answers: {}, checked: {}, finished: false,
      deadline: mode === 'exam' ? Date.now() + items.length * SECONDS_PER_QUESTION * 1000 : null,
      startedAt: Date.now()
    };
    go('quiz');
    if (mode === 'exam') {
      timerId = setInterval(tick, 1000);
      tick();
    }
  }

  function startPart(part, mode) {
    startQuiz({ title: `${PART_INFO[part].name} ${mode === 'exam' ? '실전' : '연습'}`, mode, sets: shuffle(setsOfPart(part)) });
  }

  function startMock() {
    const sets = [5, 6, 7].flatMap(p => shuffle(setsOfPart(p)));
    startQuiz({ title: '미니 모의고사', mode: 'exam', sets });
  }

  function startReview() {
    const ids = new Set(wrongIds());
    const sets = DATA.sets.filter(s => s.questions.some(q => ids.has(q.id)));
    startQuiz({ title: '오답 다시 풀기', mode: 'practice', sets, onlyIds: ids });
  }

  function tick() {
    const el = document.getElementById('timer');
    const left = Math.max(0, Math.round((quiz.deadline - Date.now()) / 1000));
    if (el) {
      el.textContent = formatTime(left);
      el.classList.toggle('low', left <= 60);
    }
    if (left <= 0) {
      alert('시간이 종료되었습니다. 자동으로 제출합니다.');
      finishQuiz();
    }
  }

  function choose(idx) {
    const { q } = quiz.items[quiz.index];
    if (quiz.mode === 'practice') {
      if (quiz.checked[q.id]) return;
      quiz.answers[q.id] = idx;
      quiz.checked[q.id] = true;
      recordAnswer(q.id, idx === q.answer);
      saveProgress();
    } else {
      quiz.answers[q.id] = idx;
    }
    render();
  }

  function move(delta) {
    const next = quiz.index + delta;
    if (next < 0 || next >= quiz.items.length) return;
    quiz.index = next;
    render();
    window.scrollTo(0, 0);
  }

  function finishQuiz() {
    stopTimer();
    if (quiz.finished) return;
    quiz.finished = true;
    if (quiz.mode === 'exam') {
      quiz.items.forEach(({ q }) => recordAnswer(q.id, quiz.answers[q.id] === q.answer));
    }
    const correct = quiz.items.filter(({ q }) => quiz.answers[q.id] === q.answer).length;
    progress.history.unshift({
      title: quiz.title, date: new Date().toISOString(),
      correct, total: quiz.items.length,
      seconds: Math.round((Date.now() - quiz.startedAt) / 1000)
    });
    progress.history = progress.history.slice(0, 20);
    saveProgress();
    view = 'result';
    render();
    window.scrollTo(0, 0);
  }

  // ───────── 화면: 홈 ─────────
  function renderHome() {
    const attempts = Object.values(progress.attempts);
    const solved = Object.keys(progress.attempts).filter(id => questionIndex[id]).length;
    const total = Object.keys(questionIndex).length;
    const totalTries = attempts.reduce((n, a) => n + a.correct + a.wrong, 0);
    const totalCorrect = attempts.reduce((n, a) => n + a.correct, 0);
    const wrong = wrongIds().length;

    const partCards = [5, 6, 7].map(part => {
      const ids = setsOfPart(part).flatMap(s => s.questions.map(q => q.id));
      const done = ids.filter(id => progress.attempts[id]).length;
      const right = ids.filter(id => progress.attempts[id] && progress.attempts[id].last).length;
      return `<div class="card part-card">
        <h3>${PART_INFO[part].name}</h3>
        <p>${PART_INFO[part].desc} · ${ids.length}문항</p>
        <div class="muted" style="font-size:.85rem">진행 ${done}/${ids.length} · 최근 정답 ${right}</div>
        <div class="bar"><span style="width:${pct(done, ids.length)}%"></span></div>
        <div class="row">
          <button class="btn primary" data-action="part" data-part="${part}" data-mode="practice">연습 모드</button>
          <button class="btn" data-action="part" data-part="${part}" data-mode="exam">실전 모드</button>
        </div>
      </div>`;
    }).join('');

    const history = progress.history.slice(0, 5).map(h => `<tr>
        <td>${esc(h.title)}</td>
        <td>${h.correct}/${h.total} (${pct(h.correct, h.total)}%)</td>
        <td class="muted">${formatTime(h.seconds)}</td>
        <td class="muted">${new Date(h.date).toLocaleDateString('ko-KR')}</td>
      </tr>`).join('');

    return `
      <h1>오늘도 RC 한 세트!</h1>
      <p class="muted">연습 모드는 한 문제씩 바로 채점하고 해설을 보여줍니다. 실전 모드는 문항당 45초 타이머로 실제 시험처럼 풀고 마지막에 채점합니다.</p>

      <div class="grid" style="margin-top:16px">
        <div class="card stat"><div class="value">${solved}<span class="muted" style="font-size:1rem">/${total}</span></div><div class="label">풀어 본 문항</div></div>
        <div class="card stat"><div class="value">${pct(totalCorrect, totalTries)}%</div><div class="label">누적 정답률 (${totalTries}회 풀이)</div></div>
        <div class="card stat"><div class="value">${wrong}</div><div class="label">오답노트 문항</div></div>
        <div class="card stat"><div class="value">${progress.vocabKnown.length}<span class="muted" style="font-size:1rem">/${DATA.vocab.length}</span></div><div class="label">외운 단어</div></div>
      </div>

      <h2>파트별 학습</h2>
      <div class="grid">${partCards}</div>

      <h2>종합</h2>
      <div class="grid">
        <div class="card part-card">
          <h3>미니 모의고사</h3>
          <p>Part 5 → 6 → 7 순서로 전체 ${total}문항 · 제한 시간 ${Math.round(total * SECONDS_PER_QUESTION / 60)}분</p>
          <button class="btn primary" data-action="mock">시작하기</button>
        </div>
        <div class="card part-card">
          <h3>오답노트</h3>
          <p>마지막으로 틀린 문제만 다시 풉니다. 맞히면 노트에서 빠집니다.</p>
          <button class="btn primary" data-action="review-start" ${wrong ? '' : 'disabled'}>오답 ${wrong}문항 풀기</button>
        </div>
        <div class="card part-card">
          <h3>단어장</h3>
          <p>RC 빈출 어휘 ${DATA.vocab.length}개를 플래시카드로 외웁니다.</p>
          <button class="btn primary" data-action="vocab">단어 외우기</button>
        </div>
      </div>

      ${history ? `<h2>최근 기록</h2><div class="card"><table class="vocab-list">${history}</table></div>` : ''}

      <p style="margin-top:32px"><button class="btn danger" data-action="reset">학습 기록 초기화</button></p>
    `;
  }

  // ───────── 화면: 문제 풀이 ─────────
  function renderQuiz() {
    const { set, q } = quiz.items[quiz.index];
    const chosen = quiz.answers[q.id];
    const isPractice = quiz.mode === 'practice';
    const revealed = isPractice && quiz.checked[q.id];
    const isLast = quiz.index === quiz.items.length - 1;

    const choices = q.choices.map((c, i) => {
      let cls = '';
      if (revealed) {
        if (i === q.answer) cls = 'correct';
        else if (i === chosen) cls = 'wrong';
      } else if (i === chosen) {
        cls = 'selected';
      }
      return `<button class="choice ${cls}" data-action="choose" data-idx="${i}" ${revealed ? 'disabled' : ''}>
        <span class="letter">(${LETTERS[i]})</span><span>${esc(c)}</span></button>`;
    }).join('');

    const explanation = revealed ? `<div class="explanation ${chosen === q.answer ? 'good' : 'bad'}">
        <b>${chosen === q.answer ? '정답입니다!' : `오답 · 정답은 (${LETTERS[q.answer]})`}</b><br>${esc(q.explanation)}
      </div>` : '';

    let nav;
    if (isPractice) {
      nav = `<div class="nav-row">
        <button class="btn" data-action="quit">그만 풀기</button>
        ${isLast
          ? `<button class="btn primary" data-action="finish" ${revealed ? '' : 'disabled'}>결과 보기</button>`
          : `<button class="btn primary" data-action="next" ${revealed ? '' : 'disabled'}>다음 문제 →</button>`}
      </div>`;
    } else {
      const answered = Object.keys(quiz.answers).length;
      const palette = quiz.items.map((it, i) => `<button data-action="jump" data-idx="${i}"
          class="${quiz.answers[it.q.id] !== undefined ? 'answered' : ''} ${i === quiz.index ? 'current' : ''}">${i + 1}</button>`).join('');
      nav = `<div class="nav-row">
        <button class="btn" data-action="prev" ${quiz.index === 0 ? 'disabled' : ''}>← 이전</button>
        <button class="btn primary" data-action="submit">제출 (${answered}/${quiz.items.length})</button>
        <button class="btn" data-action="next" ${isLast ? 'disabled' : ''}>다음 →</button>
      </div>
      <div class="palette">${palette}</div>`;
    }

    const passage = set.passage ? `<div class="card passage">${set.title ? `<div class="tag" style="font-family:sans-serif;margin-bottom:8px">${esc(set.title)}</div>` : ''}${set.passage}</div>` : '';

    return `
      <div class="quiz-head">
        <div><b>${esc(quiz.title)}</b> <span class="muted">· ${quiz.index + 1} / ${quiz.items.length}</span></div>
        ${quiz.mode === 'exam' ? '<span class="timer" id="timer"></span>' : ''}
      </div>
      <div class="progress"><span style="width:${pct(quiz.index + 1, quiz.items.length)}%"></span></div>
      <div class="quiz-body ${set.passage ? 'has-passage' : ''}">
        ${passage}
        <div class="card">
          <span class="tag">${PART_INFO[set.part].name}${q.tag ? ' · ' + esc(q.tag) : ''}</span>
          <div class="question-text">${esc(q.q)}</div>
          <div class="choices">${choices}</div>
          ${explanation}
          ${nav}
          <div class="hint">키보드: 1–4 또는 A–D로 선택 · Enter/→ 다음${isPractice ? '' : ' · ← 이전'}</div>
        </div>
      </div>
    `;
  }

  // ───────── 화면: 결과 ─────────
  function renderResult() {
    const items = quiz.items;
    const correct = items.filter(({ q }) => quiz.answers[q.id] === q.answer).length;

    const byPart = [5, 6, 7].map(part => {
      const its = items.filter(it => it.set.part === part);
      if (!its.length) return '';
      const c = its.filter(({ q }) => quiz.answers[q.id] === q.answer).length;
      return `<div class="card stat"><div class="value">${pct(c, its.length)}%</div><div class="label">${PART_INFO[part].name} · ${c}/${its.length}</div></div>`;
    }).join('');

    const list = items.map(({ q }, i) => {
      const a = quiz.answers[q.id];
      const ok = a === q.answer;
      return `<details class="card review-item" ${ok ? '' : 'open'}>
        <summary><span class="mark ${ok ? 'good' : 'bad'}">${ok ? 'O' : 'X'}</span> <span>${i + 1}. ${esc(q.q)}</span></summary>
        <div class="detail">
          <div>내 답: ${a === undefined ? '<span class="muted">미응답</span>' : `(${LETTERS[a]}) ${esc(q.choices[a])}`}</div>
          <div>정답: <b>(${LETTERS[q.answer]}) ${esc(q.choices[q.answer])}</b></div>
          <div class="explanation">${esc(q.explanation)}</div>
        </div>
      </details>`;
    }).join('');

    const wrong = wrongIds().length;
    return `
      <h1>${esc(quiz.title)} 결과</h1>
      <div class="card" style="margin:16px 0">
        <div class="score">${correct} / ${items.length}</div>
        <div class="muted">정답률 ${pct(correct, items.length)}% · 소요 시간 ${formatTime(Math.round((Date.now() - quiz.startedAt) / 1000))}</div>
        <div class="row" style="margin-top:12px">
          <button class="btn primary" data-action="home">홈으로</button>
          ${wrong ? `<button class="btn" data-action="review-start">오답노트 풀기 (${wrong})</button>` : ''}
        </div>
      </div>
      <div class="grid">${byPart}</div>
      <h2>문항별 해설</h2>
      ${list}
    `;
  }

  // ───────── 화면: 오답노트 ─────────
  function renderReview() {
    const ids = wrongIds();
    if (!ids.length) {
      return `<h1>오답노트</h1><div class="card" style="margin-top:16px">틀린 문제가 없습니다. 문제를 풀면 틀린 문항이 여기에 모입니다.
        <div style="margin-top:12px"><button class="btn primary" data-action="home">문제 풀러 가기</button></div></div>`;
    }
    const list = ids.map(id => {
      const { set, q } = questionIndex[id];
      const a = progress.attempts[id];
      return `<details class="card review-item">
        <summary><span class="tag">${PART_INFO[set.part].name}${q.tag ? ' · ' + esc(q.tag) : ''}</span> <span>${esc(q.q)}</span></summary>
        <div class="detail">
          ${set.passage ? `<div class="passage card" style="margin-bottom:10px">${set.passage}</div>` : ''}
          <div class="muted">맞힘 ${a.correct}회 · 틀림 ${a.wrong}회</div>
          <div>정답: <b>(${LETTERS[q.answer]}) ${esc(q.choices[q.answer])}</b></div>
          <div class="explanation">${esc(q.explanation)}</div>
        </div>
      </details>`;
    }).join('');
    return `
      <h1>오답노트</h1>
      <p class="muted">마지막 풀이에서 틀린 ${ids.length}문항입니다. 다시 풀어서 맞히면 목록에서 빠집니다.</p>
      <p><button class="btn primary" data-action="review-start">오답 다시 풀기</button></p>
      ${list}
    `;
  }

  // ───────── 화면: 단어장 ─────────
  function buildVocabDeck(onlyUnknown) {
    const known = new Set(progress.vocabKnown);
    const deck = shuffle(DATA.vocab.filter(v => !onlyUnknown || !known.has(v.word)));
    vocab = { deck, index: 0, flipped: false, onlyUnknown };
  }

  function renderVocab() {
    if (!vocab) buildVocabDeck(true);
    const known = new Set(progress.vocabKnown);
    const list = DATA.vocab.map(v => `<tr>
        <td><b>${esc(v.word)}</b> <span class="muted">${esc(v.pos)}</span></td>
        <td>${esc(v.meaning)}<div class="muted" style="font-size:.88rem">${esc(v.example)}</div></td>
        <td class="known">${known.has(v.word) ? '✓' : ''}</td>
      </tr>`).join('');

    let card;
    if (vocab.index >= vocab.deck.length) {
      card = `<div class="card flashcard" style="cursor:default">
        <div class="meaning">${vocab.deck.length ? '이번 덱을 모두 봤어요!' : '모든 단어를 외웠어요!'}</div>
        <div class="row" style="margin-top:16px;justify-content:center">
          <button class="btn primary" data-action="vocab-restart" data-only="1">모르는 단어만 다시</button>
          <button class="btn" data-action="vocab-restart" data-only="0">전체 다시</button>
        </div></div>`;
    } else {
      const v = vocab.deck[vocab.index];
      card = `<button class="card flashcard" data-action="flip">
          <div class="word">${esc(v.word)}</div>
          <div class="muted">${esc(v.pos)}</div>
          ${vocab.flipped
            ? `<div class="meaning">${esc(v.meaning)}</div><div class="example">${esc(v.example)}</div>`
            : '<div class="muted" style="margin-top:12px">눌러서 뜻 보기 (Space)</div>'}
        </button>
        <div class="row" style="margin-top:12px;justify-content:center">
          <button class="btn" data-action="vocab-mark" data-known="0">모르겠어요</button>
          <button class="btn primary" data-action="vocab-mark" data-known="1">알아요</button>
        </div>
        <p class="muted" style="text-align:center">${vocab.index + 1} / ${vocab.deck.length}${vocab.onlyUnknown ? ' · 모르는 단어만' : ''}</p>`;
    }

    return `
      <h1>단어장</h1>
      <p class="muted">외운 단어 ${known.size} / ${DATA.vocab.length}</p>
      <div style="max-width:520px;margin:16px auto">${card}</div>
      <h2>전체 단어</h2>
      <div class="card"><table class="vocab-list">${list}</table></div>
    `;
  }

  function markVocab(isKnown) {
    const v = vocab.deck[vocab.index];
    const set = new Set(progress.vocabKnown);
    if (isKnown) set.add(v.word); else set.delete(v.word);
    progress.vocabKnown = [...set];
    saveProgress();
    vocab.index++;
    vocab.flipped = false;
    render();
  }

  // ───────── 렌더링 & 이벤트 ─────────
  function render() {
    const views = { home: renderHome, quiz: renderQuiz, result: renderResult, review: renderReview, vocab: renderVocab };
    $app.innerHTML = views[view]();
    if (view === 'quiz' && quiz.mode === 'exam' && timerId) tick();
  }

  function leaveQuizGuard() {
    if (view !== 'quiz' || quiz.finished) return true;
    if (quiz.mode === 'practice' && Object.keys(quiz.checked).length === 0) return true;
    return confirm('풀고 있는 문제를 그만두시겠어요? 지금까지 채점된 기록은 저장됩니다.');
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const action = el.dataset.action;
    switch (action) {
      case 'home':
      case 'review':
        if (leaveQuizGuard()) go(action);
        break;
      case 'vocab':
        if (leaveQuizGuard()) { vocab = null; go('vocab'); }
        break;
      case 'quit':
        if (leaveQuizGuard()) go('home');
        break;
      case 'part': startPart(Number(el.dataset.part), el.dataset.mode); break;
      case 'mock': startMock(); break;
      case 'review-start': startReview(); break;
      case 'choose': choose(Number(el.dataset.idx)); break;
      case 'next': move(1); break;
      case 'prev': move(-1); break;
      case 'jump': quiz.index = Number(el.dataset.idx); render(); break;
      case 'finish': finishQuiz(); break;
      case 'submit': {
        const left = quiz.items.length - Object.keys(quiz.answers).length;
        if (!left || confirm(`아직 ${left}문항을 풀지 않았습니다. 제출할까요?`)) finishQuiz();
        break;
      }
      case 'flip': vocab.flipped = !vocab.flipped; render(); break;
      case 'vocab-mark': markVocab(el.dataset.known === '1'); break;
      case 'vocab-restart': buildVocabDeck(el.dataset.only === '1'); render(); break;
      case 'reset':
        if (confirm('모든 풀이 기록, 오답노트, 외운 단어가 삭제됩니다. 계속할까요?')) {
          progress = { attempts: {}, vocabKnown: [], history: [] };
          saveProgress();
          render();
        }
        break;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // 포커스된 버튼의 Enter/Space는 클릭으로 처리되므로 중복 실행하지 않는다
    if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
    if (view === 'quiz' && !quiz.finished) {
      const key = e.key.toUpperCase();
      const idx = ['1', '2', '3', '4'].indexOf(key) >= 0 ? Number(key) - 1 : LETTERS.indexOf(key);
      if (idx >= 0) { choose(idx); return; }
      const { q } = quiz.items[quiz.index];
      const canAdvance = quiz.mode === 'exam' || quiz.checked[q.id];
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && canAdvance) {
        e.preventDefault();
        if (quiz.index === quiz.items.length - 1) {
          if (quiz.mode === 'practice') finishQuiz();
        } else {
          move(1);
        }
      } else if (e.key === 'ArrowLeft' && quiz.mode === 'exam') {
        move(-1);
      }
    } else if (view === 'vocab' && vocab && vocab.index < vocab.deck.length) {
      if (e.key === ' ') { e.preventDefault(); vocab.flipped = !vocab.flipped; render(); }
      else if (e.key === 'ArrowRight') markVocab(true);
      else if (e.key === 'ArrowLeft') markVocab(false);
    }
  });

  render();
})();
