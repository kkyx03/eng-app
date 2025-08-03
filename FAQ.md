# 영어 단어장 앱 - FAQ & 문제 해결 가이드

## 🔧 **자주 발생하는 문제들**

### 1. **네비게이션 관련 문제**

#### Q: `navigation.navigate`가 작동하지 않습니다
**A:** 네비게이션 타입을 확인하세요.
```typescript
// 올바른 사용법
import { HomeScreenProps } from '../types/navigation';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // Tab 화면으로 이동
  navigation.navigate('WordList');
  
  // Stack 화면으로 이동
  navigation.navigate('WrongAnswers');
}
```

#### Q: 화면 간 데이터 전달이 안됩니다
**A:** 타입 안전한 파라미터를 사용하세요.
```typescript
// 네비게이션 타입에 파라미터 정의
export type RootStackParamList = {
  WordDetail: { wordId: string };
  QuizResult: { resultId: string };
};

// 사용법
navigation.navigate('WordDetail', { wordId: 'word_1' });
```

### 2. **Zustand 스토어 관련 문제**

#### Q: 스토어 상태가 업데이트되지 않습니다
**A:** 올바른 훅 사용법을 확인하세요.
```typescript
// 올바른 사용법
const { words, toggleBookmark } = useAppStore();

// 잘못된 사용법 (이렇게 하면 안됨)
const store = useAppStore();
const words = store.words; // 이렇게 하면 업데이트 안됨
```

#### Q: 컴포넌트가 리렌더링되지 않습니다
**A:** 선택적 구독을 사용하세요.
```typescript
// 특정 상태만 구독
const words = useAppStore(state => state.words);
const bookmarkedIds = useAppStore(state => state.bookmarkedIds);
```

### 3. **TypeScript 타입 오류**

#### Q: `CompositeScreenProps` 타입 오류가 발생합니다
**A:** 네비게이션 타입을 올바르게 정의하세요.
```typescript
// 올바른 타입 정의
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;
```

#### Q: 컴포넌트 Props 타입이 맞지 않습니다
**A:** 명시적 타입을 사용하세요.
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  // ... 기타 props
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  // 컴포넌트 구현
};
```

### 4. **성능 관련 문제**

#### Q: FlatList가 느립니다
**A:** 성능 최적화를 적용하세요.
```typescript
// OptimizedFlatList 사용
import { OptimizedFlatList } from '../components/OptimizedFlatList';

<OptimizedFlatList
  data={words}
  renderItem={renderWordItem}
  keyExtractor={(item) => item.id}
  loading={loading}
  emptyState={{
    icon: 'search-outline',
    title: '검색 결과가 없습니다',
    subtitle: '다른 검색어를 입력해보세요',
  }}
/>
```

#### Q: 메모리 사용량이 높습니다
**A:** 메모이제이션을 사용하세요.
```typescript
const renderItem = useCallback(({ item }: { item: Word }) => (
  <WordCard word={item} onPress={handleWordPress} />
), [handleWordPress]);

const keyExtractor = useCallback((item: Word) => item.id, []);
```

### 5. **테마 관련 문제**

#### Q: 다크모드가 적용되지 않습니다
**A:** ThemeProvider로 앱을 감싸고 useTheme 훅을 사용하세요.
```typescript
// App.tsx
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}

// 컴포넌트에서 사용
const { theme, isDark, toggleTheme } = useTheme();
```

#### Q: 테마 색상이 일관되지 않습니다
**A:** 테마 상수를 사용하세요.
```typescript
// 올바른 사용법
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundColor,
  },
  text: {
    color: theme.textPrimary,
  },
});
```

### 6. **데이터 저장 관련 문제**

#### Q: AsyncStorage 데이터가 저장되지 않습니다
**A:** 비동기 처리를 올바르게 하세요.
```typescript
// 올바른 사용법
const saveData = async () => {
  try {
    await AsyncStorage.setItem('key', JSON.stringify(data));
  } catch (error) {
    console.error('저장 실패:', error);
  }
};
```

#### Q: 데이터가 로드되지 않습니다
**A:** 에러 처리를 추가하세요.
```typescript
const loadData = async () => {
  try {
    const data = await AsyncStorage.getItem('key');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('로드 실패:', error);
    return null;
  }
};
```

## 🚀 **성능 최적화 팁**

### 1. **렌더링 최적화**
```typescript
// React.memo 사용
const WordCard = React.memo<WordCardProps>(({ word, onPress }) => {
  // 컴포넌트 구현
});

// useMemo 사용
const filteredWords = useMemo(() => {
  return words.filter(word => word.level === selectedLevel);
}, [words, selectedLevel]);
```

### 2. **이벤트 핸들러 최적화**
```typescript
// useCallback 사용
const handleWordPress = useCallback((word: Word) => {
  navigation.navigate('WordDetail', { wordId: word.id });
}, [navigation]);
```

### 3. **이미지 최적화**
```typescript
// 이미지 캐싱
import { Image } from 'expo-image';

<Image
  source={require('../assets/icon.png')}
  style={styles.icon}
  cachePolicy="memory-disk"
/>
```

## 🔍 **디버깅 팁**

### 1. **콘솔 로그 활용**
```typescript
// 개발 중에만 로그 출력
if (__DEV__) {
  console.log('디버그 정보:', data);
}
```

### 2. **React Native Debugger 사용**
```bash
# 설치
npm install -g react-native-debugger

# 실행
react-native-debugger
```

### 3. **Flipper 사용**
```bash
# Flipper 설치 및 설정
# https://fbflipper.com/docs/getting-started/react-native/
```

## 📱 **플랫폼별 주의사항**

### iOS
- **SafeAreaView** 사용 필수
- **StatusBar** 설정 주의
- **KeyboardAvoidingView** 사용 권장

### Android
- **BackHandler** 처리
- **Permissions** 설정
- **Hardware Back Button** 처리

### 공통
- **Platform.OS** 체크
- **Dimensions** 사용 시 주의
- **Font** 크기 조정

## 🛠 **개발 도구 설정**

### 1. **ESLint 설정**
```json
{
  "extends": [
    "@react-native-community",
    "prettier"
  ],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "warn"
  }
}
```

### 2. **Prettier 설정**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 3. **TypeScript 설정**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true
  }
}
```

## 📊 **성능 모니터링**

### 1. **메모리 사용량 체크**
```typescript
import { PerformanceObserver } from 'react-native';

// 성능 모니터링
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});
```

### 2. **렌더링 성능 체크**
```typescript
// React DevTools Profiler 사용
import { Profiler } from 'react';

<Profiler id="WordList" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}}>
  <WordList />
</Profiler>
```

## 🔄 **업데이트 및 마이그레이션**

### 1. **의존성 업데이트**
```bash
# 안전한 업데이트
npm audit fix
npm update

# 메이저 버전 업데이트 시 주의
npm install react-native@latest
```

### 2. **코드 마이그레이션**
```typescript
// 이전 버전
const [state, setState] = useState();

// 새 버전 (타입 안전성 향상)
const [state, setState] = useState<StateType>(initialState);
```

## 📞 **지원 및 도움말**

### 문제 해결 순서
1. **콘솔 로그 확인**
2. **TypeScript 오류 체크**
3. **네트워크 요청 확인**
4. **디바이스/시뮬레이터 재시작**
5. **캐시 클리어**
6. **의존성 재설치**

### 유용한 명령어
```bash
# 캐시 클리어
npx react-native start --reset-cache

# iOS 빌드 클리어
cd ios && rm -rf build && cd ..

# Android 빌드 클리어
cd android && ./gradlew clean && cd ..

# 의존성 재설치
rm -rf node_modules && npm install
```

---

**마지막 업데이트**: 2024년 12월  
**버전**: 2.0.0  
**지원**: React Native & TypeScript 전문가 