// csv-to-ts.js
const fs = require('fs');
const path = require('path');

// CSV 파일 경로
const csvPath = path.join(__dirname, 'assets', 'words.csv');
const outputPath = path.join(__dirname, 'src', 'db', 'words.ts');

// CSV 파일 읽기 및 파싱
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// CSV 파싱 (헤더 제거하고 데이터만 추출)
const lines = csvContent.split('\n').filter(line => line.trim());
const dataLines = lines.slice(1); // 첫 번째 줄(헤더) 제거

// 데이터 파싱 및 변환
const words = dataLines
  .filter(line => line.trim() && line.includes(','))
  .map((line, index) => {
    // CSV 형식 파싱 (쉼표로 구분)
    const columns = line.split(',');
    
    if (columns.length >= 5) {
      return {
        id: `word_${index + 1}`,
        english: columns[0]?.trim() || '',
        korean: columns[1]?.trim() || '',
        example: columns[2]?.trim() || '',
        meaning: columns[3]?.trim() || '',
        level: columns[4]?.trim() || 'easy',
        isBookmarked: false,
        studyCount: 0,
        lastStudied: null,
      };
    }
    return null;
  })
  .filter(word => word && word.english && word.korean); // 유효한 데이터만 필터링

// TypeScript 파일 생성
const tsContent = `// 자동 생성된 단어 데이터
// 이 파일은 csv-to-ts.js 스크립트에 의해 자동 생성됩니다.
// CSV 파일을 수정한 후 'npm run generate-words' 명령어로 재생성하세요.

import { Word } from '../types';

export const words: Word[] = ${JSON.stringify(words, null, 2)};

// 난이도별 단어 개수 통계
export const wordStats = {
  total: words.length,
  easy: words.filter(w => w.level === 'easy').length,
  medium: words.filter(w => w.level === 'medium').length,
  hard: words.filter(w => w.level === 'hard').length,
};

// 난이도별 단어 그룹
export const wordsByLevel = {
  easy: words.filter(w => w.level === 'easy'),
  medium: words.filter(w => w.level === 'medium'),
  hard: words.filter(w => w.level === 'hard'),
};

// 영어 단어로 검색하는 헬퍼 함수
export const findWordByEnglish = (english: string): Word | undefined => {
  return words.find(w => w.english.toLowerCase() === english.toLowerCase());
};

// 한국어 뜻으로 검색하는 헬퍼 함수
export const findWordsByKorean = (korean: string): Word[] => {
  return words.filter(w => w.korean.includes(korean));
};

// 난이도별 랜덤 단어 선택
export const getRandomWordsByLevel = (level: 'easy' | 'medium' | 'hard', count: number): Word[] => {
  const levelWords = wordsByLevel[level];
  const shuffled = [...levelWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// 전체 랜덤 단어 선택
export const getRandomWords = (count: number): Word[] => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
`;

// 파일 쓰기
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`✅ CSV 변환 완료!`);
console.log(`📁 생성된 파일: ${outputPath}`);
console.log(`📊 총 ${words.length}개의 단어가 변환되었습니다.`);
console.log(`📈 난이도별 통계:`);
console.log(`   - Easy: ${words.filter(w => w.level === 'easy').length}개`);
console.log(`   - Medium: ${words.filter(w => w.level === 'medium').length}개`);
console.log(`   - Hard: ${words.filter(w => w.level === 'hard').length}개`);
