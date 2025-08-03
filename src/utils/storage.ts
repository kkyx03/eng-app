import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, QuizResult, StudyStats } from '../types';
import { STORAGE_KEYS } from '../constants/theme';

// 스토리지 유틸리티 클래스
export class StorageManager {
  // 단어 데이터 저장/로드
  static async saveWords(words: Word[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
    } catch (error) {
      console.error('단어 저장 실패:', error);
    }
  }

  static async loadWords(): Promise<Word[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('단어 로드 실패:', error);
      return [];
    }
  }

  // 퀴즈 결과 저장/로드
  static async saveQuizResults(results: QuizResult[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
    } catch (error) {
      console.error('퀴즈 결과 저장 실패:', error);
    }
  }

  static async loadQuizResults(): Promise<QuizResult[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('퀴즈 결과 로드 실패:', error);
      return [];
    }
  }

  // 학습 통계 저장/로드
  static async saveStudyStats(stats: StudyStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('학습 통계 저장 실패:', error);
    }
  }

  static async loadStudyStats(): Promise<StudyStats | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STUDY_STATS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('학습 통계 로드 실패:', error);
      return null;
    }
  }

  // 북마크된 단어 저장/로드
  static async saveBookmarks(bookmarkedIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedIds));
    } catch (error) {
      console.error('북마크 저장 실패:', error);
    }
  }

  static async loadBookmarks(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('북마크 로드 실패:', error);
      return [];
    }
  }

  // 테마 설정 저장/로드
  static async saveTheme(isDark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
    } catch (error) {
      console.error('테마 저장 실패:', error);
    }
  }

  static async loadTheme(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('테마 로드 실패:', error);
      return false;
    }
  }

  // 모든 데이터 초기화
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.WORDS,
        STORAGE_KEYS.QUIZ_RESULTS,
        STORAGE_KEYS.STUDY_STATS,
        STORAGE_KEYS.BOOKMARKS,
        STORAGE_KEYS.THEME,
      ]);
    } catch (error) {
      console.error('데이터 초기화 실패:', error);
    }
  }
}

// 헬퍼 함수들
export const storageUtils = {
  // 단어 북마크 토글
  async toggleBookmark(wordId: string): Promise<void> {
    const bookmarks = await StorageManager.loadBookmarks();
    const isBookmarked = bookmarks.includes(wordId);
    
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter(id => id !== wordId);
      await StorageManager.saveBookmarks(newBookmarks);
    } else {
      const newBookmarks = [...bookmarks, wordId];
      await StorageManager.saveBookmarks(newBookmarks);
    }
  },

  // 단어 학습 기록 업데이트
  async updateWordStudyRecord(wordId: string, isCorrect: boolean): Promise<void> {
    const words = await StorageManager.loadWords();
    const wordIndex = words.findIndex(w => w.id === wordId);
    
    if (wordIndex !== -1) {
      words[wordIndex].studyCount = (words[wordIndex].studyCount || 0) + 1;
      words[wordIndex].lastStudied = new Date().toISOString();
      words[wordIndex].isCorrect = isCorrect;
      await StorageManager.saveWords(words);
    }
  },

  // 학습 통계 업데이트
  async updateStudyStats(correctAnswers: number, totalAnswers: number, timeSpent: number): Promise<void> {
    const currentStats = await StorageManager.loadStudyStats();
    const today = new Date().toDateString();
    
    const newStats: StudyStats = {
      totalWords: currentStats?.totalWords || 0,
      studiedWords: currentStats?.studiedWords || 0,
      correctAnswers: (currentStats?.correctAnswers || 0) + correctAnswers,
      totalAnswers: (currentStats?.totalAnswers || 0) + totalAnswers,
      averageTime: currentStats?.averageTime || 0,
      streakDays: currentStats?.streakDays || 0,
      lastStudyDate: new Date().toISOString(),
    };

    // 연속 학습일 계산
    if (currentStats?.lastStudyDate) {
      const lastDate = new Date(currentStats.lastStudyDate).toDateString();
      if (lastDate !== today) {
        newStats.streakDays = (currentStats.streakDays || 0) + 1;
      } else {
        newStats.streakDays = currentStats.streakDays || 0;
      }
    } else {
      newStats.streakDays = 1;
    }

    await StorageManager.saveStudyStats(newStats);
  },
}; 