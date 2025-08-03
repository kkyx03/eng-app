# 영어 단어장 앱 (English Vocabulary App)

React Native (Expo) 기반의 영어 단어 학습 앱입니다. TypeScript로 작성되었으며, 실용적이고 확장 가능한 프로젝트 구조를 가지고 있습니다.

## 🚀 주요 기능

### 📚 단어 관리
- **CSV에서 TypeScript 데이터 자동 변환**: `npm run generate-words` 명령으로 CSV 파일을 TypeScript 데이터로 변환
- **단어 검색**: 영어, 한국어, 예문으로 검색 가능
- **필터링**: 난이도별, 북마크별 필터링
- **정렬**: 영어, 한국어, 난이도, 최근 학습순 정렬
- **북마크**: 중요 단어 북마크 기능

### 🎯 퀴즈 시스템
- **다양한 난이도**: 쉬움, 보통, 어려움 난이도별 퀴즈
- **문제 수 설정**: 5-20문제까지 선택 가능
- **실시간 피드백**: 정답/오답 즉시 표시
- **진행률 표시**: 퀴즈 진행 상황 시각화

### 📊 학습 통계
- **전체 통계**: 총 문제 수, 정답률, 연속 학습일
- **진척도 추적**: 학습한 단어 수와 백분율
- **오답 노트**: 틀린 단어들만 따로 복습
- **최근 결과**: 최근 퀴즈 결과 히스토리

### 🏠 홈 대시보드
- **오늘의 단어**: 매일 다른 단어 추천
- **학습 진척도**: 시각적 진행률 표시
- **빠른 액션**: 주요 기능으로 바로 이동
- **북마크/오답 미리보기**: 최근 북마크 및 오답 단어

## 🛠 기술 스택

- **React Native** (Expo SDK 53)
- **TypeScript** - 타입 안전성
- **Zustand** - 상태 관리 (Context API 대체)
- **React Navigation** - 네비게이션 (Tab + Stack 하이브리드)
- **AsyncStorage** - 로컬 데이터 저장
- **Expo Vector Icons** - 아이콘

## 📁 프로젝트 구조

```
eng-app/
├── src/
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx      # 다양한 스타일의 버튼
│   │   ├── Card.tsx        # 카드 컴포넌트
│   │   ├── WordCard.tsx    # 단어 카드 (애니메이션 포함)
│   │   ├── SearchBar.tsx   # 검색바
│   │   ├── FilterChips.tsx # 필터 칩
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── OptimizedFlatList.tsx
│   ├── screens/            # 화면 컴포넌트
│   │   ├── HomeScreen.tsx  # 홈 대시보드
│   │   ├── WordListScreen.tsx # 단어장
│   │   ├── QuizScreen.tsx  # 퀴즈
│   │   ├── WrongAnswersScreen.tsx # 오답노트
│   │   └── StatsScreen.tsx # 통계
│   ├── navigation/         # 네비게이션 설정
│   │   └── index.tsx       # Tab + Stack 하이브리드
│   ├── store/              # Zustand 상태 관리
│   │   └── useAppStore.ts  # 메인 스토어
│   ├── types/              # TypeScript 타입 정의
│   │   ├── index.ts        # 기본 타입
│   │   └── navigation.ts   # 네비게이션 타입
│   ├── utils/              # 유틸리티 함수
│   │   └── storage.ts      # AsyncStorage 래퍼
│   ├── constants/          # 상수 정의
│   │   └── theme.ts        # 테마 및 색상
│   └── db/                 # 데이터베이스
│       └── words.ts        # 자동 생성된 단어 데이터
├── assets/
│   └── words.csv          # 원본 CSV 데이터
├── csv-to-ts.js           # CSV to TypeScript 변환 스크립트
└── package.json
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. CSV 데이터 변환
```bash
npm run generate-words
```

### 3. 앱 실행
```bash
npm start
```

## 🔧 주요 개선사항

### 1. 상태 관리 개선 (Zustand)
- **Context API → Zustand**: 더 나은 성능과 개발자 경험
- **자동 지속성**: AsyncStorage와 자동 동기화
- **타입 안전성**: 완전한 TypeScript 지원
- **개발자 도구**: Redux DevTools 지원

### 2. 네비게이션 구조 개선
- **Tab + Stack 하이브리드**: 
  - Tab: Home, WordList, Quiz
  - Stack: WrongAnswers, Stats
- **타입 안전한 네비게이션**: `CompositeScreenProps` 사용
- **일관된 헤더**: 모든 화면에서 일관된 UI

### 3. UI/UX 개선
- **재사용 가능한 컴포넌트**: Button, Card, WordCard 등
- **애니메이션**: 터치 피드백 및 전환 애니메이션
- **로딩/에러 상태**: 모든 화면에서 적절한 상태 표시
- **반응형 디자인**: 다양한 화면 크기 지원

### 4. 성능 최적화
- **FlatList 최적화**: `removeClippedSubviews`, `maxToRenderPerBatch` 등
- **메모이제이션**: `useCallback`, `useMemo` 활용
- **지연 로딩**: 필요할 때만 데이터 로드

### 5. 데이터 관리 개선
- **자동 동기화**: 로컬 저장소와 실시간 동기화
- **오답 추적**: 퀴즈 결과 기반 오답 단어 자동 추적
- **학습 통계**: 상세한 학습 진행 상황 추적

## 📱 화면별 기능

### 홈 화면 (HomeScreen)
- **오늘의 단어**: 매일 다른 단어 추천
- **학습 진척도**: 시각적 진행률 표시
- **빠른 액션 버튼**: 주요 기능으로 바로 이동
- **북마크/오답 미리보기**: 최근 3개씩 표시

### 단어장 화면 (WordListScreen)
- **고급 검색**: 영어, 한국어, 예문으로 검색
- **필터링**: 난이도별, 북마크별 필터
- **정렬**: 4가지 기준으로 정렬
- **북마크 토글**: 원터치 북마크 설정

### 퀴즈 화면 (QuizScreen)
- **난이도 선택**: 쉬움/보통/어려움/전체
- **문제 수 설정**: 5-20문제 선택
- **실시간 피드백**: 정답/오답 즉시 표시
- **진행률 표시**: 시각적 진행 상황

### 오답노트 화면 (WrongAnswersScreen)
- **오답 단어 목록**: 틀린 단어들만 표시
- **학습 통계**: 오답률 및 개선 상황
- **복습 기능**: 오답 단어로 퀴즈 시작

### 통계 화면 (StatsScreen)
- **전체 통계**: 총 문제, 정답률, 연속 학습일
- **난이도별 통계**: 레벨별 성취도
- **최근 결과**: 최근 퀴즈 결과 히스토리
- **학습 추이**: 시간별 학습 패턴

## 🔄 데이터 플로우

1. **초기 로드**: 앱 시작 시 AsyncStorage에서 데이터 로드
2. **상태 업데이트**: Zustand 스토어에서 상태 변경
3. **자동 저장**: 변경사항 자동으로 AsyncStorage에 저장
4. **UI 업데이트**: 상태 변경에 따른 자동 UI 업데이트

## 🎨 테마 시스템

- **일관된 색상**: 앱 전체에서 일관된 색상 사용
- **난이도별 색상**: 쉬움(초록), 보통(주황), 어려움(빨강)
- **다크모드 준비**: 향후 다크모드 지원 가능한 구조

## 🚀 향후 확장 계획

### 단기 계획
- [ ] 다크모드 지원
- [ ] 단어 추가/편집 기능
- [ ] 퀴즈 타이머 기능
- [ ] 알림 시스템

### 중기 계획
- [ ] 클라우드 동기화
- [ ] 소셜 기능 (친구와 경쟁)
- [ ] 게임화 요소 (배지, 레벨)
- [ ] 음성 발음 기능

### 장기 계획
- [ ] AI 기반 개인화 학습
- [ ] 문장 생성 퀴즈
- [ ] 커뮤니티 기능
- [ ] 다국어 지원

## 🐛 문제 해결

### 일반적인 문제들

1. **네비게이션 오류**
   ```typescript
   // 올바른 네비게이션 사용법
   navigation.navigate('WrongAnswers'); // Stack 화면
   navigation.navigate('WordList');     // Tab 화면
   ```

2. **타입 오류**
   ```typescript
   // 화면 Props 타입 사용
   import { HomeScreenProps } from '../types/navigation';
   export default function HomeScreen({ navigation }: HomeScreenProps) {
   ```

3. **상태 동기화 문제**
   ```typescript
   // Zustand 스토어 사용
   const { words, toggleBookmark } = useAppStore();
   ```

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 있거나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**개발자**: React Native & TypeScript 전문가  
**버전**: 2.0.0  
**최종 업데이트**: 2024년 12월 