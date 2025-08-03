# FAQ - 자주 묻는 질문 및 문제 해결

## 🚨 네비게이션 관련 문제

### Q: `navigation.navigate("오답노트")`가 동작하지 않아요
**A:** 네비게이션 구조를 Tab + Stack 혼합으로 변경했습니다.

**해결 방법:**
```typescript
// ❌ 이전 방식 (동작 안함)
navigation.navigate('오답노트')

// ✅ 새로운 방식
navigation.navigate('WrongAnswers')
```

**이유:** 
- Tab Navigator는 하단 탭에 있는 화면만 이동 가능
- Stack Navigator는 모든 화면 이동 가능
- 오답노트, 통계는 Stack Screen으로 분리

### Q: 네비게이션 타입 에러가 발생해요
**A:** TypeScript 타입을 명시적으로 정의했습니다.

**해결 방법:**
```typescript
// ❌ 이전 방식
export default function HomeScreen({ navigation }: any) {

// ✅ 새로운 방식
import { HomeScreenProps } from '../types/navigation';
export default function HomeScreen({ navigation }: HomeScreenProps) {
```

## 📁 파일 구조 및 Import 문제

### Q: `Module not found` 에러가 발생해요
**A:** 파일 경로를 확인하고 절대 경로를 사용하세요.

**해결 방법:**
```typescript
// ❌ 상대 경로 (복잡할 때)
import { WordCard } from '../../../components/WordCard';

// ✅ 절대 경로 (권장)
import { WordCard } from '../components/WordCard';
```

**파일 구조:**
```
src/
├── components/     # 재사용 컴포넌트
├── screens/        # 화면 컴포넌트
├── types/          # 타입 정의
├── utils/          # 유틸리티 함수
├── context/        # Context API
└── navigation/     # 네비게이션 설정
```

### Q: Import 순서가 헷갈려요
**A:** 일관된 import 순서를 사용하세요.

**권장 순서:**
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

## 🔧 성능 관련 문제

### Q: FlatList가 느려요
**A:** 성능 최적화를 적용하세요.

**해결 방법:**
```typescript
// ❌ 기본 FlatList
<FlatList data={words} renderItem={renderItem} />

// ✅ 최적화된 FlatList
<OptimizedFlatList
  data={words}
  renderItem={renderItem}
  loading={loading}
  emptyState={{
    icon: 'search-outline',
    title: '검색 결과가 없습니다',
    subtitle: '다른 검색어를 입력해보세요'
  }}
/>
```

**최적화 포인트:**
- `removeClippedSubviews={true}`
- `maxToRenderPerBatch={10}`
- `windowSize={10}`
- `getItemLayout` 사용 (고정 높이)

### Q: 데이터가 실시간으로 업데이트되지 않아요
**A:** Context API를 사용하여 전역 상태를 관리하세요.

**해결 방법:**
```typescript
// ❌ 개별 컴포넌트에서 상태 관리
const [words, setWords] = useState([]);

// ✅ Context API 사용
const { state, toggleBookmark } = useApp();
const { words, bookmarkedIds } = state;
```

## 🎨 UI/UX 관련 문제

### Q: 로딩 상태가 없어서 사용자가 답답해해요
**A:** 로딩 컴포넌트를 추가하세요.

**해결 방법:**
```typescript
// ❌ 로딩 상태 없음
if (loading) return null;

// ✅ 로딩 스피너 표시
if (loading) {
  return <LoadingSpinner message="데이터를 불러오는 중..." />;
}
```

### Q: 빈 상태가 너무 심심해요
**A:** EmptyState 컴포넌트를 사용하세요.

**해결 방법:**
```typescript
// ❌ 단순한 텍스트
{data.length === 0 && <Text>데이터가 없습니다</Text>}

// ✅ 인터랙티브한 빈 상태
<EmptyState
  icon="search-outline"
  title="검색 결과가 없습니다"
  subtitle="다른 검색어를 입력하거나 필터를 조정해보세요"
  actionText="전체보기"
  onAction={() => resetFilters()}
/>
```

## 📱 플랫폼별 문제

### Q: iOS에서 SafeAreaView 문제가 있어요
**A:** react-native-safe-area-context를 사용하세요.

**해결 방법:**
```typescript
// ❌ 기본 SafeAreaView
import { SafeAreaView } from 'react-native';

// ✅ 안전한 SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';
```

### Q: Android에서 그림자가 안 보여요
**A:** Android는 elevation을 사용해야 합니다.

**해결 방법:**
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

## 🗄️ 데이터 관리 문제

### Q: AsyncStorage 에러가 발생해요
**A:** 에러 처리를 추가하세요.

**해결 방법:**
```typescript
// ❌ 에러 처리 없음
const data = await AsyncStorage.getItem('key');

// ✅ 에러 처리 추가
try {
  const data = await AsyncStorage.getItem('key');
  return data ? JSON.parse(data) : null;
} catch (error) {
  console.error('AsyncStorage 에러:', error);
  return null;
}
```

### Q: 데이터가 저장되지 않아요
**A:** 비동기 처리를 확인하세요.

**해결 방법:**
```typescript
// ❌ 동기적으로 처리
const saveData = () => {
  AsyncStorage.setItem('key', JSON.stringify(data));
  console.log('저장 완료'); // 실제로는 아직 저장 중
};

// ✅ 비동기 처리
const saveData = async () => {
  try {
    await AsyncStorage.setItem('key', JSON.stringify(data));
    console.log('저장 완료');
  } catch (error) {
    console.error('저장 실패:', error);
  }
};
```

## 🚀 배포 전 체크리스트

### 필수 체크 항목:
- [ ] 모든 네비게이션 경로가 올바른지 확인
- [ ] TypeScript 타입 에러가 없는지 확인
- [ ] 로딩/에러/빈 상태 처리가 되어 있는지 확인
- [ ] 성능 최적화가 적용되었는지 확인
- [ ] 플랫폼별 테스트 완료
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

## 🔍 디버깅 팁

### 1. React Native Debugger 사용
```bash
# 설치
npm install -g react-native-debugger

# 실행
react-native-debugger
```

### 2. Flipper 사용
- 네트워크 요청 모니터링
- AsyncStorage 내용 확인
- 성능 프로파일링

### 3. Console.log 활용
```typescript
// 데이터 흐름 추적
console.log('데이터 로드:', data);
console.log('상태 업데이트:', state);
console.log('네비게이션:', route.name);
```

### 4. 에러 바운더리 추가
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('에러 발생:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <Text>문제가 발생했습니다</Text>;
    }
    return this.props.children;
  }
}
```

---

**추가 도움이 필요하시면 언제든 문의해주세요!** 🚀 