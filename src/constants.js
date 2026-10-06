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

    // 오답 원인. short는 '현재 가장 취약한 영역은 ○○입니다' 문장에 쓰는 짧은 이름
    WRONG_REASONS: [
      { id: 'vocabulary', label: '어휘 부족', short: '어휘' },
      { id: 'grammar', label: '문법', short: '문법' },
      { id: 'structure', label: '문장 구조', short: '문장 구조' },
      { id: 'long_sentence', label: '긴 문장 해석', short: '긴 문장 해석' },
      { id: 'question_understanding', label: '문제 질문 이해', short: '질문 이해' },
      { id: 'passage_understanding', label: '지문 내용 이해', short: '지문 이해' },
      { id: 'inference', label: '추론', short: '추론' },
      { id: 'careless', label: '단순 실수', short: '실수 관리' }
    ],

    // 단어 학습 상태
    MASTERY: {
      UNKNOWN: { id: 'unknown', label: '모름' },
      CONFUSED: { id: 'confused', label: '헷갈림' },
      KNOWN: { id: 'known', label: '알고 있음' }
    },

    CHOICE_LETTERS: ['A', 'B', 'C', 'D'],

    // 예상 점수 계산 기준
    SCORE: {
      MIN_ATTEMPTS: 20,       // 이만큼 풀어야 예상 점수를 보여준다
      RECENT_WINDOW: 100,     // 최근 몇 문제로 계산할지
      // 실제 RC 100문항 중 Part별 비중 (Part 5: 30, Part 6: 16, Part 7: 54)
      PART_WEIGHTS: { 5: 30, 6: 16, 7: 54 }
    },

    // 유형별 약점(추천 학습 영역) 기준: 이만큼 이상 풀었고 정답률이 기준 미만이면 추천
    WEAK_TYPE: { MIN_ATTEMPTS: 3, THRESHOLD: 70 },

    // 맞춤 난이도: 최근 N문제 정답률이 UP 이상이면 한 단계 올리고, DOWN 미만이면 내린다
    ADAPTIVE: { WINDOW: 10, MIN_ATTEMPTS: 5, UP: 80, DOWN: 50, SET_SIZE: { 5: 10, 6: 8, 7: 10 } },

    // 학습분석: 기간 선택과 Part별 목표 풀이 시간(초). 실제 시험 RC 75분 기준의 권장 속도
    ANALYTICS: {
      RANGES: [{ days: 7, label: '최근 7일' }, { days: 30, label: '최근 30일' }, { days: 90, label: '최근 90일' }],
      TARGET_SECONDS: { 5: 25, 6: 35, 7: 70 },
      HEATMAP_WEEKS: 12
    },

    // 오답 원인 분석 기준
    WEAKNESS: {
      RECENT_WINDOW: 50,      // 최근 몇 문제를 볼지
      MIN_TAGGED: 5           // 오답 원인이 이만큼 쌓여야 분석 문장을 보여준다
    }
  };
})(window.TM = window.TM || {});
