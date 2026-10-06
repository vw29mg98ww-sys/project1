# TOEIC 900 MASTER

TOEIC 900점을 목표로 DAY 단위로 학습하는 개인 맞춤형 영어 학습 웹앱입니다.

## 실행 방법 (설치 필요 없음)

1. 이 프로젝트 폴더를 내려받습니다. (GitHub에서 **Code → Download ZIP** 후 압축 풀기)
2. 폴더 안의 **`index.html`을 더블클릭**합니다.
3. 브라우저(Chrome, Edge, Safari 등)에서 앱이 열립니다.

Node.js, npm, 서버 등 **따로 설치할 것이 없습니다.** 인터넷 연결도 필요 없습니다.

> 학습 기록은 **브라우저 안(localStorage)**에 자동 저장됩니다.
> 같은 컴퓨터, 같은 브라우저로 열면 다음 날에도 기록이 그대로 남아 있습니다.

## 학습 기록 지키기 (중요)

학습 기록은 **이 컴퓨터의 이 브라우저 안**에만 저장됩니다. 다음 경우에는 기록이 보이지 않을 수 있습니다.

- 다른 브라우저(예: Chrome → Edge)나 다른 컴퓨터에서 열 때
- 브라우저의 "인터넷 사용 기록 삭제"에서 쿠키·사이트 데이터를 지웠을 때
- Firefox 등 일부 브라우저에서 **앱 폴더를 다른 위치로 옮겼을 때** (Chrome·Edge는 영향 없음)

그래서 **설정 → 백업 파일 내려받기**로 가끔 백업해 두세요. 백업 파일(`toeic900-backup-날짜.json`)을 클라우드 드라이브 등에 보관해 두면,
**설정 → 백업 불러오기**로 언제든 그대로 복원할 수 있습니다. 20문제 이상 풀고 7일 넘게 백업하지 않으면 Dashboard에서 알려줍니다.

그 밖의 보호 장치:
- **영구 보관 요청**: 컴퓨터 저장 공간이 부족해도 브라우저가 기록을 자동으로 지우지 않도록 요청합니다. Chrome·Edge는 자동으로 요청하고, Firefox는 설정 화면에서 요청할 수 있습니다.
- **저장 실패 알림**: 저장 공간이 가득 차는 등 저장에 실패하면 화면에 빨간 알림이 뜹니다.
- **데이터 형식 버전 관리**: 앱을 업데이트해서 저장 형식이 바뀌어도 기존 기록을 자동으로 새 형식으로 바꿔 줍니다.
- **여러 탭**: 다른 탭에서 문제를 풀면 열려 있는 Dashboard·DAY 화면이 자동으로 갱신됩니다.

저장 공간은 약 5MB로, 풀이 기록 약 1만 5천 건(하루 30문제씩 1년 이상)을 저장할 수 있습니다. 사용량은 설정 화면에서 확인할 수 있습니다.

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
    dayService.js       DAY별 학습 구성·진행률·다음 학습·이어서 학습 판단
    studyService.js     문제 풀이 세션: 몇 번째 문제부터 풀지, 결과 요약
    backupService.js    백업 파일 만들기·읽기·복원
    practiceService.js  Part별 유형 정답률, 추천 학습 영역, 연습 세트
    difficultyService.js 맞춤 난이도(LEVEL 1~4) 추천과 문제 고르기
  storage/              학습 기록 저장 (localStorage). 저장 방식이 바뀌면 이 폴더만 수정
    storage.js          저장·읽기, 사용량, 백업용 내보내기/가져오기
    migrations.js       데이터 형식 버전 변환
    persistence.js      영구 보관 요청
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
    "summary": "be동사 뒤 수동태 자리이므로 과거분사 implemented가 정답입니다.",
    "evidence": "will be 뒤 + 정책은 시행되는 대상 → 과거분사(수동태)",
    "structure": "The new policy(주어) + will be implemented(수동태 동사) + next month",
    "wrong_choices": {
      "A": "implement는 동사원형이라 be 뒤에 올 수 없습니다.",
      "C": "implementing은 능동이라 '정책이 시행한다'는 뜻이 됩니다.",
      "D": "implementation은 명사라 '정책이 시행 그 자체다'가 되어 어색합니다."
    },
    "tip": "주어가 동작을 하는지(능동) 받는지(수동)부터 판단하세요."
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
| `explanation.summary` | 간단한 해설 (필수). 정답일 때 보여줍니다 |
| `explanation.evidence` | 정답 근거 (오답일 때 표시) |
| `explanation.structure` | 문장 구조 분석 (오답일 때 표시) |
| `explanation.wrong_choices` | 오답 보기별로 왜 틀렸는지. 키는 `"A"`~`"D"` (정답 제외) |
| `explanation.tip` | 다음에 주의할 점 |
| `explanation.context_analysis` | (문장 삽입 문제) `{ "before": 빈칸 앞 문장, "after": 빈칸 뒤 문장, "clue": 연결 단서 }` |
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

## 문제 풀이 방법

1. DAY 화면에서 영역의 **시작** 버튼(또는 **이어서 학습**)을 누릅니다.
2. 보기를 누르거나 키보드 **1~4 / A~D**로 답을 고르면 바로 채점됩니다.
   - 정답: "정답입니다" + 간단한 해설
   - 오답: "오답입니다" + 왜 틀렸는지 · 정답 근거 · 문장 구조 · 핵심 어휘 · 문제 유형 · 다음에 주의할 점
3. 틀렸다면 **왜 틀렸는지(오답 원인)**를 골라 주세요. Dashboard의 취약 영역 분석에 쓰입니다.
4. **다음 문제**(또는 Enter)로 넘어갑니다. 마지막 문제 뒤에는 결과 요약과 다음 학습 안내가 나옵니다.

- 선택한 답, 정답 여부, 풀이 시간(다른 탭을 보는 시간 제외), 오답 원인이 자동 저장됩니다.
- 틀린 문제의 핵심 어휘는 자동으로 **복습 단어**에 등록됩니다.
- 중간에 브라우저를 닫아도 다음에 **이어서 학습**을 누르면 풀던 곳부터 계속합니다.

## Part 5 · 6 · 7 연습

사이드바의 **Part 5 / Part 6 / Part 7** 메뉴에서 DAY와 별개로 연습할 수 있습니다.

- **유형별 정답률**: 품사·시제·관계사(Part 5), 문법·문맥·문장 삽입(Part 6), 세부 정보·추론·정보 연결(Part 7) 등 유형별 정답률과 풀이 횟수를 보여줍니다. 유형 옆 **풀기**로 그 유형만 모아 풉니다.
- **추천 학습 영역**: 3번 이상 풀고 정답률이 70% 미만인 유형을 자동으로 추천합니다. Dashboard에도 안내가 나옵니다.
- **맞춤 난이도 연습**: 그 Part의 최근 10문제 정답률이 80% 이상이면 다음 연습의 난이도를 한 단계 올리고, 50% 미만이면 한 단계 내립니다 (LEVEL 1 기초 ~ LEVEL 4 900+ Challenge). 기준값은 `src/constants.js`의 `ADAPTIVE`에서 바꿀 수 있습니다.
- 연습 순서는 **틀린 문제 → 안 푼 문제 → 맞힌 문제**이며, Part 6·7은 같은 지문의 문제를 묶어서 냅니다.
- 연습 기록도 정답률·오답노트·학습 분석에 반영됩니다. DAY 진행률과 DAY의 "이어서 학습" 위치에는 영향을 주지 않습니다.
- 연습 중 새로고침하거나 창을 닫아도 같은 문제 세트를 이어서 풉니다 (가장 최근 연습 세트 1개).

## DAY 진행률은 어떻게 계산되나요?

- 하루 학습: Vocabulary → Part 5 → Part 6 → Part 7 → 오답 복습
- 단어는 학습 상태(모름/헷갈림/알고 있음)를 표시하면, 문제는 한 번 풀면 완료로 셉니다.
- 분모는 그 DAY에 **실제로 등록된** 단어·문제 수입니다. 권장 학습량(단어 20 · Part 5 10 · Part 6 5 · Part 7 5)보다 적으면 화면에 "권장 ○개 · 현재 등록 ○개"로 알려줍니다.
- 오답 복습: 그 DAY에서 처음 풀 때 틀린 문제를 다시 풀면 완료입니다. DAY는 오답 복습까지 마쳐야 완료됩니다.
- DAY를 완료하면 "다음 DAY 시작하기" 버튼으로 현재 DAY가 넘어갑니다. 원하는 DAY를 직접 "현재 DAY로 설정"할 수도 있습니다.

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
- [x] STEP 3 DAY 시스템
- [x] STEP 4 문제 풀이 시스템
- [x] STEP 5 학습 기록 저장
- [x] STEP 6 Part 5 / 6 / 7
- [ ] STEP 7 Vocabulary
- [ ] STEP 8 오답노트
- [ ] STEP 9 Analytics
- [ ] STEP 10 UI 개선 및 테스트
