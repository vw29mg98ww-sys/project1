// 학습 기록 읽기/쓰기. 화면은 저장소를 직접 만지지 않고 이 서비스를 통해 기록을 다룬다.
//
// [저장 형식]
// profile     : { currentDay: 1, startedAt: '2026-10-06', studyDates: ['2026-10-06', ...] }
// attempts    : 문제를 풀 때마다 하나씩 쌓이는 기록(시간 순서)
//   { id, question_id, day, part, question_type, difficulty,
//     selected: 'B', correct_answer: 'C', is_correct: false,
//     time_ms: 41200, wrong_reason: 'vocabulary' | null, answered_at: ISO 시각 }
// vocabState  : { 'implement': { status: 'unknown' | 'confused' | 'known', updatedAt, reviewCount,
//                                needsReview: true, wrongQuestions: ['d1-p5-03'] } }
//   status는 사용자가 단어 학습에서 직접 고른 상태, needsReview는 관련 문제를 틀려서 자동 등록된 복습 표시
// lastPosition: { day: 2, section: 'part6', index: 3, updatedAt } — 마지막으로 풀던 위치(index는 0부터)
(function (TM) {
  'use strict';

  function defaultProfile() {
    return { currentDay: 1, startedAt: null, studyDates: [] };
  }

  // storage: TM.createStorage()로 만든 저장소, options.now: 현재 시각 함수(테스트용)
  TM.createProgressService = function (storage, options) {
    var K = TM.KEYS;
    var now = (options && options.now) || function () { return new Date(); };

    function getProfile() {
      return Object.assign(defaultProfile(), storage.get(K.PROFILE, {}));
    }

    function markStudied() {
      var today = TM.date.toDateKey(now());
      return storage.update(K.PROFILE, function (saved) {
        var profile = Object.assign(defaultProfile(), saved || {});
        if (!profile.startedAt) profile.startedAt = today;
        if (profile.studyDates.indexOf(today) < 0) {
          profile.studyDates = profile.studyDates.concat(today).sort();
        }
        return profile;
      }, null);
    }

    return {
      getProfile: getProfile,
      getAttempts: function () { return storage.get(K.ATTEMPTS, []); },
      getVocabState: function () { return storage.get(K.VOCAB_STATE, {}); },
      markStudied: markStudied,

      // 문제 풀이 결과 저장. question: 문제 데이터, selected: 'A'~'D', timeMs: 풀이 시간
      recordAttempt: function (question, selected, timeMs) {
        var time = now();
        var record = {
          id: time.getTime().toString(36) + Math.random().toString(36).slice(2, 6),
          question_id: question.question_id,
          day: question.day,
          part: question.part,
          question_type: question.question_type || null,
          difficulty: question.difficulty,
          selected: selected,
          correct_answer: question.correct_answer,
          is_correct: selected === question.correct_answer,
          time_ms: Math.max(0, Math.round(timeMs || 0)),
          wrong_reason: null,
          answered_at: time.toISOString()
        };
        storage.update(K.ATTEMPTS, function (list) { return list.concat(record); }, []);
        markStudied();
        return record;
      },

      setWrongReason: function (attemptId, reasonId) {
        storage.update(K.ATTEMPTS, function (list) {
          return list.map(function (a) { return a.id === attemptId ? Object.assign({}, a, { wrong_reason: reasonId }) : a; });
        }, []);
      },

      setVocabStatus: function (word, status) {
        var key = String(word).toLowerCase();
        storage.update(K.VOCAB_STATE, function (state) {
          var prev = state[key] || {};
          state[key] = Object.assign({}, prev, {
            status: status,
            updatedAt: now().toISOString(),
            reviewCount: (prev.reviewCount || 0) + 1,
            needsReview: status === 'known' ? false : !!prev.needsReview
          });
          return state;
        }, {});
        markStudied();
      },

      // 문제를 틀렸을 때 관련 단어를 복습 단어로 등록한다 (이미 '알고 있음'인 단어는 그대로 둔다)
      flagWordsForReview: function (words, questionId) {
        if (!words || !words.length) return [];
        var flagged = [];
        storage.update(K.VOCAB_STATE, function (state) {
          words.forEach(function (word) {
            var key = String(word).toLowerCase();
            var prev = state[key] || {};
            if (prev.status === 'known') return;
            var list = prev.wrongQuestions || [];
            state[key] = Object.assign({}, prev, {
              needsReview: true,
              wrongQuestions: list.indexOf(questionId) >= 0 ? list : list.concat(questionId)
            });
            flagged.push(word);
          });
          return state;
        }, {});
        return flagged;
      },

      getLastPosition: function () { return storage.get(K.LAST_POSITION, null); },

      saveLastPosition: function (day, section, index) {
        storage.set(K.LAST_POSITION, { day: day, section: section, index: index, updatedAt: now().toISOString() });
      },

      clearLastPosition: function () { storage.remove(K.LAST_POSITION); },

      // Part별 연습 세트: 새로고침해도 같은 문제·같은 순서로 이어서 풀 수 있게 저장한다 (한 번에 하나)
      startPracticeSession: function (info) {
        var session = {
          id: now().getTime().toString(36),
          title: info.title, part: info.part || null, mode: info.mode, type: info.type || null,
          returnTo: info.returnTo || null, returnLabel: info.returnLabel || null,
          ids: info.ids, index: 0, createdAt: now().toISOString()
        };
        storage.set(K.PRACTICE_SESSION, session);
        return session;
      },
      getPracticeSession: function () { return storage.get(K.PRACTICE_SESSION, null); },
      // 단어 복습 세트 (Vocabulary 화면에서 시작). 새로고침해도 같은 단어·순서로 이어서 학습한다
      startVocabSession: function (info) {
        var session = { id: now().getTime().toString(36), title: info.title, words: info.words, index: 0, createdAt: now().toISOString() };
        storage.set(K.VOCAB_SESSION, session);
        return session;
      },
      getVocabSession: function () { return storage.get(K.VOCAB_SESSION, null); },
      saveVocabIndex: function (index) {
        storage.update(K.VOCAB_SESSION, function (s) { return s ? Object.assign({}, s, { index: index }) : s; }, null);
      },

      savePracticeIndex: function (index) {
        storage.update(K.PRACTICE_SESSION, function (s) { return s ? Object.assign({}, s, { index: index }) : s; }, null);
      },

      setCurrentDay: function (day) {
        storage.update(K.PROFILE, function (saved) {
          return Object.assign(defaultProfile(), saved || {}, { currentDay: day });
        }, null);
      }
    };
  };

  TM.progress = TM.createProgressService(TM.storage);
})(window.TM = window.TM || {});
