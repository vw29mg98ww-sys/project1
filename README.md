# TOEIC 900 MASTER

TOEIC 900점을 목표로 DAY 단위로 학습하는 개인 맞춤형 영어 학습 웹앱입니다.

## 실행 방법 (설치 필요 없음)

1. 이 프로젝트 폴더를 내려받습니다. (GitHub에서 **Code → Download ZIP** 후 압축 풀기)
2. 폴더 안의 **`index.html`을 더블클릭**합니다.
3. 브라우저(Chrome, Edge, Safari 등)에서 앱이 열립니다.

Node.js, npm, 서버 등 **따로 설치할 것이 없습니다.** 인터넷 연결도 필요 없습니다.

> 학습 기록은 **브라우저 안(localStorage)**에 자동 저장됩니다.
> 같은 컴퓨터, 같은 브라우저로 열면 다음 날에도 기록이 그대로 남아 있습니다.
> 다른 브라우저나 다른 컴퓨터에서는 기록이 따로 관리됩니다. 기기 간에 기록을 옮기는 백업/복원 기능은 설정 화면에 추가할 예정입니다.
> 브라우저의 "인터넷 사용 기록 삭제"에서 쿠키·사이트 데이터를 지우면 기록도 지워지니 주의하세요.

## 동작 확인 (테스트)

`tests/index.html`을 더블클릭하면 자동 테스트가 실행되고 결과가 표시됩니다.
"모두 통과"가 나오면 정상입니다. 기능을 고친 뒤에는 이 테스트로 기존 기능이 깨지지 않았는지 확인합니다.

## 폴더 구조

```
index.html              앱 시작 파일 (더블클릭해서 실행)
src/
  loader.js             불러올 스크립트 목록 (새 파일을 만들면 여기에 추가)
  main.js               앱 시작: 화면 틀 생성 → 데이터 로드 → 메뉴 이동 연결
  constants.js          메뉴, Part 정보, 문제 유형, 난이도, 오답 원인 등 공통 설정
  components/           여러 화면에서 함께 쓰는 화면 조각 (레이아웃, 카드 등)
  pages/                메뉴별 화면 (Dashboard, DAY 학습, Part 5/6/7 …)
    index.js            주소(#/part5 등)와 화면을 연결하는 표
  data/
    questions.js        문제·지문 데이터
    vocabulary.js       단어 데이터
  services/
    dataService.js      문제·단어 데이터를 불러와 DAY·Part별로 정리
    progressService.js  학습 기록 읽기/쓰기 (풀이 기록, 학습 날짜, 단어 상태)
    statsService.js     학습 기록 → Dashboard 통계 계산
    scoreService.js     예상 점수 계산
    insightService.js   학습 진단 문장 (나중에 AI 분석으로 교체·확장 가능)
  storage/              학습 기록 저장 (localStorage). 저장 방식이 바뀌면 이 폴더만 수정
  utils/                작은 도구 (주소 처리, 데이터 검사, HTML 처리)
  styles/               디자인 (색상 변수, 기본, 레이아웃, 컴포넌트)
tests/
  index.html            자동 테스트 (더블클릭해서 실행)
```

## 문제 추가하기

`src/data/questions.js`를 메모장이나 VS Code로 열어 `questions` 목록에 추가합니다.
파일 확장자는 `.js`지만 `=` 뒤의 `{ }` 안은 **JSON 형식**입니다.
(파일을 더블클릭으로 열 수 있게 하려고 `.js`로 저장합니다. 브라우저는 보안상 직접 연 파일에서 `.json`을 읽지 못하기 때문입니다.)

### 문제 형식

```json
{
  "question_id": "d3-p5-01",
  "day": 3,
  "part": 5,
  "difficulty": 2,
  "passage_id": null,
  "question": "The new policy will be ------- next month.",
  "choices": ["implement", "implemented", "implementing", "implementation"],
  "correct_answer": "B",
  "explanation": {
    "summary": "be동사 뒤 수동태 자리이므로 과거분사 implemented가 정답입니다."
  },
  "vocabulary": ["implement"],
  "grammar_point": "수동태",
  "question_type": "태",
  "source": "자체 제작"
}
```

| 항목 | 설명 |
|---|---|
| `question_id` | 겹치지 않는 고유 번호. 권장 형식 `d{DAY}-p{Part}-{번호}` |
| `day` | 학습 DAY (1 이상) |
| `part` | 5, 6, 7 |
| `difficulty` | 1 기초 · 2 중급 · 3 고난도 · 4 900+ Challenge |
| `passage_id` | Part 6·7은 지문 번호, Part 5는 `null` |
| `choices` | 보기 4개 |
| `correct_answer` | `"A"` ~ `"D"` |
| `explanation.summary` | 해설 (필수) |
| `vocabulary` | 관련 단어. `vocabulary.js`의 단어와 자동 연결됩니다 |
| `question_type` | Part 5: 품사, 동사, 시제, 태, 수일치, 전치사, 접속사, 관계사, 비교, 수량 표현, 어휘, 어휘 collocation · Part 6: 문법, 어휘, 문맥, 문장 삽입 · Part 7: 세부 정보, 목적, 주제, 추론, NOT 문제, 동의어, 문장 의미, 정보 연결 |
| `source` | 출처 (예: 자체 제작, 직접 입력한 교재 이름) |

### 지문 형식 (Part 6·7)

`passages` 목록에 추가하고, 문제의 `passage_id`로 연결합니다.
`type`은 `single`(문서 1개), `double`(2개), `triple`(3개)이며 `documents` 개수가 맞아야 합니다.

```json
{
  "passage_id": "d3-p7-psg1",
  "day": 3,
  "part": 7,
  "type": "double",
  "documents": [
    { "title": "E-mail", "html": "<p>첫 번째 문서 본문</p>" },
    { "title": "Invoice", "html": "<p>두 번째 문서 본문</p>" }
  ]
}
```

### 단어 형식 (`src/data/vocabulary.js`)

```json
{ "word": "implement", "meaning": "시행하다", "part_of_speech": "v.",
  "example_sentence": "The new policy will be implemented in July.",
  "day": 1, "difficulty": 1, "source": "자체 제작" }
```

데이터에 실수가 있으면(쉼표 누락, 정답 형식 오류 등) 앱을 열었을 때 **어느 문제의 어떤 항목이 잘못됐는지** 화면에 표시됩니다.

## 예상 점수는 어떻게 계산되나요?

- 최근 100문제(최소 20문제)의 Part별 정답률을 실제 RC 구성 비중(Part 5 : 6 : 7 = 30 : 16 : 54)으로 평균합니다.
- 그 정답률을 RC 점수(5~495점)로 환산하고, LC도 같은 수준이라고 가정해 2배 한 값이 총점입니다.
- 공식 환산표가 아닌 **학습용 추정치**입니다. 계산 방식은 `src/services/scoreService.js`에서 바꿀 수 있습니다.

## 저작권 안내

실제 TOEIC 기출문제를 무단으로 복제·크롤링하지 않습니다. 기본 문제는 모두 자체 제작한 TOEIC 스타일 문제이며,
본인이 보유한 교재 문제를 개인 학습용으로 직접 입력하거나 저작권 문제가 없는 데이터를 추가해서 사용하세요.

## 개발 진행 상황

- [x] STEP 1 프로젝트 구조 생성
- [x] STEP 2 Dashboard
- [ ] STEP 3 DAY 시스템
- [ ] STEP 4 문제 풀이 시스템
- [ ] STEP 5 학습 기록 저장
- [ ] STEP 6 Part 5 / 6 / 7
- [ ] STEP 7 Vocabulary
- [ ] STEP 8 오답노트
- [ ] STEP 9 Analytics
- [ ] STEP 10 UI 개선 및 테스트
