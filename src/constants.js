// 앱 전역에서 공유하는 상수. 메뉴·파트·난이도·오답 원인 등을 한 곳에서 관리한다.
//
// [모듈 방식 안내]
// 설치 없이 index.html을 더블클릭해서 열 수 있도록 import/export 대신
// 모든 파일이 window.TM 이라는 하나의 이름 공간에 기능을 등록한다.
// 그래서 index.html의 <script> 순서가 중요하다(먼저 쓰이는 파일이 위에).
(function (TM) {
  'use strict';

  TM.constants = {
    APP_NAME: 'TOEIC 900 MASTER',
    TARGET_SCORE: 900,

    // 사이드바 메뉴 (path는 pages/index.js의 경로와 일치해야 한다)
    MENU: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/day', label: 'DAY 학습', icon: '📅' },
      { path: '/part5', label: 'Part 5', icon: '✏️' },
      { path: '/part6', label: 'Part 6', icon: '📝' },
      { path: '/part7', label: 'Part 7', icon: '📖' },
      { path: '/vocabulary', label: 'Vocabulary', icon: '🔤' },
      { path: '/wrong-notes', label: '오답노트', icon: '❗' },
      { path: '/analytics', label: '학습분석', icon: '📊' },
      { path: '/settings', label: '설정', icon: '⚙️' }
    ],

    PARTS: {
      5: {
        name: 'Part 5',
        title: '단문 빈칸 채우기',
        types: ['품사', '동사', '시제', '태', '수일치', '전치사', '접속사', '관계사', '비교', '수량 표현', '어휘', '어휘 collocation']
      },
      6: {
        name: 'Part 6',
        title: '장문 빈칸 채우기',
        types: ['문법', '어휘', '문맥', '문장 삽입']
      },
      7: {
        name: 'Part 7',
        title: '독해',
        types: ['세부 정보', '목적', '주제', '추론', 'NOT 문제', '동의어', '문장 의미', '정보 연결']
      }
    },

    // Part 7 지문 구조: 지문 종류별 문서 개수
    PASSAGE_TYPES: { single: 1, double: 2, triple: 3 },

    DIFFICULTY_LEVELS: {
      1: { label: 'LEVEL 1', name: '기초' },
      2: { label: 'LEVEL 2', name: '중급' },
      3: { label: 'LEVEL 3', name: '고난도' },
      4: { label: 'LEVEL 4', name: '900+ Challenge' }
    },

    // DAY 하나에 배정하는 기본 학습량
    DAILY_PLAN: { vocabulary: 20, part5: 10, part6: 5, part7: 5 },

    WRONG_REASONS: [
      { id: 'vocabulary', label: '어휘 부족' },
      { id: 'grammar', label: '문법' },
      { id: 'structure', label: '문장 구조' },
      { id: 'long_sentence', label: '긴 문장 해석' },
      { id: 'question_understanding', label: '문제 질문 이해' },
      { id: 'passage_understanding', label: '지문 내용 이해' },
      { id: 'inference', label: '추론' },
      { id: 'careless', label: '단순 실수' }
    ],

    // 단어 학습 상태
    MASTERY: {
      UNKNOWN: { id: 'unknown', label: '모름' },
      CONFUSED: { id: 'confused', label: '헷갈림' },
      KNOWN: { id: 'known', label: '알고 있음' }
    },

    CHOICE_LETTERS: ['A', 'B', 'C', 'D']
  };
})(window.TM = window.TM || {});
