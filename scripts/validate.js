// 문제 데이터 무결성 검사: node scripts/validate.js
const data = require('../data/questions.js');

const errors = [];
const ids = new Set();

for (const set of data.sets) {
  if (![5, 6, 7].includes(set.part)) errors.push(`${set.id}: part는 5, 6, 7 중 하나여야 합니다`);
  if (set.part !== 5 && !set.passage) errors.push(`${set.id}: Part ${set.part}에는 지문(passage)이 필요합니다`);
  if (!Array.isArray(set.questions) || set.questions.length === 0) errors.push(`${set.id}: 문항이 없습니다`);
  for (const q of set.questions || []) {
    if (ids.has(q.id)) errors.push(`${q.id}: 중복된 문항 ID입니다`);
    ids.add(q.id);
    if (!q.q) errors.push(`${q.id}: 질문(q)이 없습니다`);
    if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(`${q.id}: 보기는 4개여야 합니다`);
    else if (new Set(q.choices).size !== 4) errors.push(`${q.id}: 보기가 중복됩니다`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${q.id}: answer는 0~3이어야 합니다`);
    if (!q.explanation) errors.push(`${q.id}: 해설(explanation)이 없습니다`);
  }
}

const words = new Set();
for (const v of data.vocab) {
  if (!v.word || !v.meaning) errors.push(`단어장: word와 meaning이 필요합니다 (${JSON.stringify(v)})`);
  if (words.has(v.word)) errors.push(`단어장: 중복 단어 ${v.word}`);
  words.add(v.word);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const counts = [5, 6, 7].map(p => data.sets.filter(s => s.part === p).reduce((n, s) => n + s.questions.length, 0));
console.log(`OK: Part 5 ${counts[0]}문항, Part 6 ${counts[1]}문항, Part 7 ${counts[2]}문항, 단어 ${data.vocab.length}개`);
