import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// 네비게이션 파라미터 타입
export type RootStackParamList = {
  MainTabs: undefined;
  WrongAnswers: undefined;
  Stats: undefined;
  WordDetail: { wordId: string };
  QuizResult: { resultId: string };
};

export type MainTabParamList = {
  Home: undefined;
  WordList: undefined;
  Quiz: undefined;
};

// 화면별 Props 타입
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type WordListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'WordList'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type QuizScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Quiz'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type WrongAnswersScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WrongAnswers'
>;

export type StatsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Stats'
>; 