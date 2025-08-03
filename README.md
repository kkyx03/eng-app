# 영어 단어장 + 퀴즈 앱

React Native(Expo, TypeScript)로 개발된 실전 영어 단어장 및 퀴즈 애플리케이션입니다.

## 🚀 주요 기능

### 📚 단어장 기능
- **127개의 영어 단어** (쉬움 50개, 보통 42개, 어려움 35개)
- **CSV → TypeScript 자동 변환** 시스템
- **검색 및 필터링**: 영어, 한국어, 예문으로 검색
- **난이도별 필터링**: 쉬움/보통/어려움
- **북마크 기능**: 중요 단어 저장
- **정렬 기능**: 영어/한국어/난이도/최근 학습순
- **단어 상세 정보**: 예문, 해석, 난이도 표시

### 🎯 퀴즈 기능
- **4지선다 객관식** 퀴즈
- **난이도별 퀴즈**: 전체/쉬움/보통/어려움
- **문제 수 설정**: 5/10/15/20문제
- **실시간 정답률** 표시
- **진행률 표시** 및 시각적 피드백
- **퀴즈 결과 저장** 및 통계

### 📊 학습 통계
- **전체 정답률** 및 문제 수
- **연속 학습일** 추적
- **난이도별 단어 통계**
- **최근 학습한 단어** 표시
- **북마크된 단어** 관리

### 🔧 추가 기능
- **오답노트**: 틀린 단어만 모아서 복습
- **데이터 영구 저장**: AsyncStorage 활용
- **반응형 UI**: 다양한 화면 크기 지원
- **직관적인 네비게이션**: 탭 기반 구조

## 🛠 기술 스택

- **React Native** 0.79.5
- **Expo** 53.0.20
- **TypeScript** 5.8.3
- **React Navigation** 7.x
- **AsyncStorage** (데이터 저장)
- **Expo Vector Icons** (아이콘)

## 📁 프로젝트 구조

```
eng-app/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── WordCard.tsx     # 단어 카드 컴포넌트
│   │   ├── SearchBar.tsx    # 검색바 컴포넌트
│   │   └── FilterChips.tsx  # 필터 칩 컴포넌트
│   ├── screens/             # 화면 컴포넌트
│   │   ├── HomeScreen.tsx   # 홈 화면
│   │   ├── WordListScreen.tsx # 단어장 화면
│   │   ├── QuizScreen.tsx   # 퀴즈 화면
│   │   └── WrongAnswersScreen.tsx # 오답노트 화면
│   ├── types/               # TypeScript 타입 정의
│   │   └── index.ts
│   ├── constants/           # 상수 및 테마
│   │   └── theme.ts
│   ├── utils/               # 유틸리티 함수
│   │   └── storage.ts       # AsyncStorage 관리
│   └── db/                  # 데이터베이스
│       └── words.ts         # 자동 생성된 단어 데이터
├── assets/
│   └── words.csv           # 원본 CSV 데이터
├── csv-to-ts.js            # CSV → TypeScript 변환 스크립트
├── App.tsx                 # 메인 앱 컴포넌트
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

### 4. 플랫폼별 실행
```bash
# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

## 📝 CSV 데이터 관리

### 데이터 형식
```csv
english,korean,example,meaning,level
apple,사과,I ate an apple.,나 사과 하나 먹었어.,easy
water,물,Drink plenty of water.,물 많이 마셔.,easy
```

### 새 단어 추가
1. `assets/words.csv` 파일에 새 단어 추가
2. `npm run generate-words` 실행
3. 앱 재시작

## 🎨 UI/UX 특징

### 디자인 시스템
- **일관된 색상 팔레트**: iOS 스타일 가이드라인 준수
- **반응형 레이아웃**: 다양한 화면 크기 지원
- **직관적인 네비게이션**: 탭 기반 구조
- **시각적 피드백**: 터치, 로딩, 에러 상태 표시

### 사용자 경험
- **즉시 사용 가능**: 별도 설정 없이 바로 학습 시작
- **개인화된 학습**: 북마크, 통계, 오답노트
- **진행 상황 추적**: 학습 통계 및 연속 학습일
- **오프라인 지원**: 모든 데이터 로컬 저장

## 🔧 개발 팁

### 성능 최적화
- **FlatList 사용**: 대량 데이터 효율적 렌더링
- **메모이제이션**: 불필요한 리렌더링 방지
- **지연 로딩**: 필요한 데이터만 로드

### 코드 품질
- **TypeScript**: 타입 안정성 보장
- **컴포넌트 분리**: 재사용성 및 유지보수성
- **에러 처리**: 사용자 친화적 에러 메시지

### 실전 적용법
- **모듈화**: 기능별 파일 분리
- **상수 관리**: 테마, 색상, 텍스트 중앙화
- **스토리지 패턴**: AsyncStorage 래퍼 클래스

## 🐛 문제 해결

### 자주 발생하는 문제
1. **CSV 변환 실패**: 파일 형식 확인 (UTF-8, 쉼표 구분)
2. **아이콘 표시 안됨**: Expo Vector Icons 설치 확인
3. **네비게이션 오류**: React Navigation 버전 호환성 확인

### 디버깅 팁
- `console.log` 활용한 데이터 흐름 추적
- React Native Debugger 사용
- Expo DevTools 활용

## 📈 향후 개선 계획

- [ ] 다크모드 지원
- [ ] 음성 발음 기능
- [ ] 단어장 공유 기능
- [ ] 클라우드 동기화
- [ ] 게임화 요소 추가
- [ ] AI 기반 학습 추천

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**개발자**: React Native 학습 프로젝트  
**버전**: 1.0.0  
**최종 업데이트**: 2024년 12월 