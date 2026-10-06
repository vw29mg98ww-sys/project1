# TOEIC RC 트레이너

토익 RC(Reading Comprehension)를 공부할 수 있는 웹앱입니다. 설치나 빌드 없이 브라우저에서 바로 실행됩니다.

## 실행 방법

`index.html`을 브라우저로 열면 됩니다. 로컬 서버로 띄우려면:

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## 기능

- **파트별 학습**: Part 5(단문 빈칸), Part 6(장문 빈칸·문장 삽입), Part 7(독해)
  - **연습 모드**: 보기를 고르면 바로 채점하고 한국어 해설을 보여줍니다
  - **실전 모드**: 문항당 45초(실제 시험 RC 75분/100문항 기준) 타이머로 풀고, 제출하면 채점합니다
- **미니 모의고사**: Part 5 → 6 → 7 순서로 전체 문항을 실전처럼 풉니다
- **오답노트**: 마지막 풀이에서 틀린 문항만 모아 다시 풉니다. 맞히면 목록에서 빠집니다
- **단어장**: RC 빈출 어휘 플래시카드. 외운 단어를 표시할 수 있습니다
- **학습 통계**: 누적 정답률, 파트별 진행도, 최근 기록
- 키보드 단축키(1–4 / A–D로 선택, Enter로 다음), 모바일 화면, 다크 모드 지원

학습 기록은 브라우저의 localStorage에 저장됩니다.

## 문제 추가하기

`data/questions.js`의 `sets` 배열에 문항을 추가합니다.

```js
{ id: 'p5-23', part: 5, questions: [{
  id: 'p5-23', tag: '품사',
  q: 'The report was ------- prepared.',
  choices: ['care', 'careful', 'carefully', 'caring'],
  answer: 2, // 0 = (A)
  explanation: '동사 prepared를 수식하는 부사 자리입니다.'
}] }
```

Part 6·7은 `passage`(HTML)에 지문을 넣고 `questions`에 여러 문항을 둡니다. 단어는 `vocab` 배열에 추가합니다.

추가한 뒤 데이터를 검사하세요.

```bash
node scripts/validate.js
```
