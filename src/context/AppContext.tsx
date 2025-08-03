import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Word, StudyStats, QuizResult } from '../types';
import { StorageManager } from '../utils/storage';

// 상태 타입 정의
interface AppState {
  words: Word[];
  studyStats: StudyStats | null;
  bookmarkedIds: string[];
  quizResults: QuizResult[];
  loading: boolean;
  error: string | null;
}

// 액션 타입 정의
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WORDS'; payload: Word[] }
  | { type: 'SET_STUDY_STATS'; payload: StudyStats | null }
  | { type: 'SET_BOOKMARKED_IDS'; payload: string[] }
  | { type: 'SET_QUIZ_RESULTS'; payload: QuizResult[] }
  | { type: 'TOGGLE_BOOKMARK'; payload: string }
  | { type: 'UPDATE_WORD_STUDY'; payload: { wordId: string; isCorrect: boolean } }
  | { type: 'ADD_QUIZ_RESULT'; payload: QuizResult };

// 초기 상태
const initialState: AppState = {
  words: [],
  studyStats: null,
  bookmarkedIds: [],
  quizResults: [],
  loading: true,
  error: null,
};

// 리듀서
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_WORDS':
      return { ...state, words: action.payload };
    
    case 'SET_STUDY_STATS':
      return { ...state, studyStats: action.payload };
    
    case 'SET_BOOKMARKED_IDS':
      return { ...state, bookmarkedIds: action.payload };
    
    case 'SET_QUIZ_RESULTS':
      return { ...state, quizResults: action.payload };
    
    case 'TOGGLE_BOOKMARK':
      const newBookmarkedIds = state.bookmarkedIds.includes(action.payload)
        ? state.bookmarkedIds.filter(id => id !== action.payload)
        : [...state.bookmarkedIds, action.payload];
      
      return { ...state, bookmarkedIds: newBookmarkedIds };
    
    case 'UPDATE_WORD_STUDY':
      const updatedWords = state.words.map(word =>
        word.id === action.payload.wordId
          ? {
              ...word,
              studyCount: (word.studyCount || 0) + 1,
              lastStudied: new Date().toISOString(),
              isCorrect: action.payload.isCorrect,
            }
          : word
      );
      return { ...state, words: updatedWords };
    
    case 'ADD_QUIZ_RESULT':
      return {
        ...state,
        quizResults: [action.payload, ...state.quizResults],
      };
    
    default:
      return state;
  }
}

// Context 생성
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadData: () => Promise<void>;
  toggleBookmark: (wordId: string) => Promise<void>;
  updateWordStudy: (wordId: string, isCorrect: boolean) => Promise<void>;
  addQuizResult: (result: QuizResult) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 컴포넌트
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 데이터 로드
  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const [words, studyStats, bookmarkedIds, quizResults] = await Promise.all([
        StorageManager.loadWords(),
        StorageManager.loadStudyStats(),
        StorageManager.loadBookmarks(),
        StorageManager.loadQuizResults(),
      ]);

      dispatch({ type: 'SET_WORDS', payload: words });
      dispatch({ type: 'SET_STUDY_STATS', payload: studyStats });
      dispatch({ type: 'SET_BOOKMARKED_IDS', payload: bookmarkedIds });
      dispatch({ type: 'SET_QUIZ_RESULTS', payload: quizResults });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '데이터 로드에 실패했습니다.' });
      console.error('데이터 로드 실패:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 북마크 토글
  const toggleBookmark = async (wordId: string) => {
    try {
      dispatch({ type: 'TOGGLE_BOOKMARK', payload: wordId });
      
      // 스토리지에 저장
      const newBookmarkedIds = state.bookmarkedIds.includes(wordId)
        ? state.bookmarkedIds.filter(id => id !== wordId)
        : [...state.bookmarkedIds, wordId];
      
      await StorageManager.saveBookmarks(newBookmarkedIds);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      // 실패 시 원래 상태로 되돌리기
      dispatch({ type: 'SET_BOOKMARKED_IDS', payload: state.bookmarkedIds });
    }
  };

  // 단어 학습 기록 업데이트
  const updateWordStudy = async (wordId: string, isCorrect: boolean) => {
    try {
      dispatch({ type: 'UPDATE_WORD_STUDY', payload: { wordId, isCorrect } });
      
      // 스토리지에 저장
      const updatedWords = state.words.map(word =>
        word.id === wordId
          ? {
              ...word,
              studyCount: (word.studyCount || 0) + 1,
              lastStudied: new Date().toISOString(),
              isCorrect,
            }
          : word
      );
      
      await StorageManager.saveWords(updatedWords);
    } catch (error) {
      console.error('단어 학습 기록 업데이트 실패:', error);
    }
  };

  // 퀴즈 결과 추가
  const addQuizResult = async (result: QuizResult) => {
    try {
      dispatch({ type: 'ADD_QUIZ_RESULT', payload: result });
      
      // 스토리지에 저장
      const updatedResults = [result, ...state.quizResults];
      await StorageManager.saveQuizResults(updatedResults);
    } catch (error) {
      console.error('퀴즈 결과 저장 실패:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    loadData,
    toggleBookmark,
    updateWordStudy,
    addQuizResult,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 