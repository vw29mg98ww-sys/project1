import { readFileSync } from 'node:fs';

export function loadJson(relativePath) {
  return JSON.parse(readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
}

export const loadQuestions = () => loadJson('../src/data/questions.json');
export const loadVocabulary = () => loadJson('../src/data/vocabulary.json');
