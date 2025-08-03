# 🏗️ 개선된 프로젝트 구조

## 📁 전체 폴더 구조

```
eng-app/
├── src/
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── WordCard.tsx     # 단어 카드 컴포넌트
│   │   ├── SearchBar.tsx    # 검색바 컴포넌트
│   │   ├── FilterChips.tsx  # 필터 칩 컴포넌트
│   │   ├── LoadingSpinner.tsx # 로딩 스피너
│   │   ├── EmptyState.tsx   # 빈 상태 컴포넌트
│   │   └── OptimizedFlatList.tsx # 성능 최적화 FlatList
│   ├── screens/             # 화면 컴포넌트
│   │   ├── HomeScreen.tsx   # 홈 화면
│   │   ├── WordListScreen.tsx # 단어장 화면
│   │   ├── QuizScreen.tsx   # 퀴즈 화면
│   │   ├── WrongAnswersScreen.tsx # 오답노트 화면
│   │   └── StatsScreen.tsx  # 통계 화면
│   ├── navigation/          # 네비게이션 설정
│   │   └── index.tsx        # 루트 네비게이터 (Tab + Stack)
│   ├── types/               # TypeScript 타입 정의
│   │   ├── index.ts         # 기본 타입 정의
│   │   └── navigation.ts    # 네비게이션 타입
│   ├── context/             # Context API
│   │   └── AppContext.tsx   # 전역 상태 관리
│   ├── constants/           # 상수 및 테마
│   │   └── theme.ts         # 색상, 간격, 테마 정의
│   ├── utils/               # 유틸리티 함수
│   │   └── storage.ts       # AsyncStorage 관리
│   └── db/                  # 데이터베이스
│       └── words.ts         # 자동 생성된 단어 데이터
├── assets/
│   └── words.csv           # 원본 CSV 데이터
├── csv-to-ts.js            # CSV → TypeScript 변환 스크립트
├── App.tsx                 # 메인 앱 컴포넌트 (Context Provider)
├── package.json
├── README.md
├── FAQ.md                  # 자주 묻는 질문
└── PROJECT_STRUCTURE.md    # 이 파일
```

## 🔄 네비게이션 구조

### 이전 구조 (문제점)
```
Tab Navigator
├── 홈
├── 단어장
└── 퀴즈
```

### 개선된 구조 (해결책)
```
Stack Navigator
└── MainTabs (Tab Navigator)
    ├── Home
    ├── WordList
    └── Quiz
└── WrongAnswers (Stack Screen)
└── Stats (Stack Screen)
```

**이유:**
- Tab Navigator는 하단 탭에 있는 화면만 이동 가능
- Stack Navigator는 모든 화면 이동 가능
- 오답노트, 통계는 자주 사용하지 않으므로 Stack Screen으로 분리

## 🎯 주요 개선 사항

### 1. 네비게이션 타입 안정성
```typescript
// ❌ 이전: any 타입 사용
export default function HomeScreen({ navigation }: any) {

// ✅ 개선: 명시적 타입 정의
import { HomeScreenProps } from '../types/navigation';
export default function HomeScreen({ navigation }: HomeScreenProps) {
```

### 2. 전역 상태 관리
```typescript
// ❌ 이전: 개별 컴포넌트에서 상태 관리
const [words, setWords] = useState([]);
const [bookmarks, setBookmarks] = useState([]);

// ✅ 개선: Context API 사용
const { state, toggleBookmark } = useApp();
const { words, bookmarkedIds } = state;
```

### 3. 성능 최적화
```typescript
// ❌ 이전: 기본 FlatList
<FlatList data={words} renderItem={renderItem} />

// ✅ 개선: 최적화된 FlatList
<OptimizedFlatList
  data={words}
  renderItem={renderItem}
  loading={loading}
  emptyState={emptyStateConfig}
/>
```

### 4. 사용자 경험 개선
```typescript
// ❌ 이전: 로딩/빈 상태 처리 없음
if (loading) return null;

// ✅ 개선: 적절한 상태 처리
if (loading) return <LoadingSpinner message="로딩 중..." />;
if (data.length === 0) return <EmptyState {...emptyStateProps} />;
```

## 📝 Import 경로 규칙

### 1. 상대 경로 사용
```typescript
// ✅ 권장: 상대 경로
import { WordCard } from '../components/WordCard';
import { StorageManager } from '../utils/storage';

// ❌ 비권장: 절대 경로 (복잡할 때)
import { WordCard } from '../../../components/WordCard';
```

### 2. Import 순서
```typescript
// 1. React 관련
import React, { useState, useEffect } from 'react';

// 2. React Native 컴포넌트
import { View, Text, StyleSheet } from 'react-native';

// 3. 외부 라이브러리
import { Ionicons } from '@expo/vector-icons';

// 4. 내부 타입/유틸리티
import { Word } from '../types';
import { StorageManager } from '../utils/storage';

// 5. 내부 컴포넌트
import { WordCard } from '../components/WordCard';
```

## 🔧 컴포넌트 설계 패턴

### 1. Props 인터페이스 정의
```typescript
interface WordCardProps {
  word: Word;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  showBookmark?: boolean;
  showLevel?: boolean;
  showExample?: boolean;
  compact?: boolean;
}
```

### 2. 기본값 설정
```typescript
export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPress,
  onBookmarkPress,
  showBookmark = true,    // 기본값 설정
  showLevel = true,
  showExample = true,
  compact = false,
}) => {
  // 컴포넌트 로직
};
```

### 3. 조건부 렌더링
```typescript
{showBookmark && (
  <TouchableOpacity onPress={onBookmarkPress}>
    <Ionicons name={word.isBookmarked ? 'bookmark' : 'bookmark-outline'} />
  </TouchableOpacity>
)}
```

## 🎨 스타일링 규칙

### 1. 일관된 색상 팔레트
```typescript
// constants/theme.ts
export const lightTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    // ...
  },
};
```

### 2. 플랫폼별 스타일링
```typescript
const styles = StyleSheet.create({
  card: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    
    // Android
    elevation: 5,
  },
});
```

## 🚀 성능 최적화 포인트

### 1. FlatList 최적화
```typescript
<FlatList
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  updateCellsBatchingPeriod={50}
  getItemLayout={getItemLayout} // 고정 높이일 때
/>
```

### 2. 메모이제이션
```typescript
const memoizedRenderItem = useCallback(
  ({ item, index }) => renderItem(item, index),
  [renderItem]
);
```

### 3. 불필요한 리렌더링 방지
```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

## 📊 데이터 흐름

### 1. Context API를 통한 전역 상태 관리
```
AppContext (Provider)
├── words: Word[]
├── studyStats: StudyStats
├── bookmarkedIds: string[]
├── quizResults: QuizResult[]
└── loading: boolean
```

### 2. 컴포넌트에서 상태 사용
```typescript
const { state, toggleBookmark, updateWordStudy } = useApp();
const { words, bookmarkedIds, loading } = state;
```

### 3. 데이터 동기화
```typescript
// 상태 변경 시 자동으로 AsyncStorage에 저장
const toggleBookmark = async (wordId: string) => {
  dispatch({ type: 'TOGGLE_BOOKMARK', payload: wordId });
  await StorageManager.saveBookmarks(newBookmarkedIds);
};
```

## 🔍 디버깅 및 개발 팁

### 1. TypeScript 타입 체크
```bash
# 타입 에러 확인
npx tsc --noEmit

# 타입 체크와 함께 빌드
npx tsc
```

### 2. 성능 프로파일링
```bash
# React Native Debugger 사용
react-native-debugger

# Flipper 사용
npx flipper-server
```

### 3. 코드 품질 체크
```bash
# ESLint 실행
npx eslint src/

# Prettier 포맷팅
npx prettier --write src/
```

## 📱 배포 전 체크리스트

### 필수 체크 항목:
- [ ] 모든 네비게이션 경로 테스트
- [ ] TypeScript 타입 에러 해결
- [ ] 로딩/에러/빈 상태 처리 확인
- [ ] 성능 최적화 적용
- [ ] 플랫폼별 테스트 (iOS/Android)
- [ ] 메모리 누수 확인
- [ ] 앱 크래시 테스트

### 성능 체크:
- [ ] FlatList 최적화 적용
- [ ] 불필요한 리렌더링 방지
- [ ] 이미지 최적화
- [ ] 번들 크기 확인

### 사용자 경험 체크:
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 빈 상태 처리
- [ ] 네트워크 오프라인 처리
- [ ] 접근성 지원

---

**이 구조를 따라 개발하면 유지보수성과 확장성이 뛰어난 앱을 만들 수 있습니다!** 🚀 