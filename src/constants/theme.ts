import { Theme } from '../types';

// 라이트 테마
export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

// 다크 테마
export const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#64D2FF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

// 난이도별 색상
export const levelColors = {
  easy: '#34C759',
  medium: '#FF9500',
  hard: '#FF3B30',
};

// 스토리지 키
export const STORAGE_KEYS = {
  WORDS: 'words',
  QUIZ_RESULTS: 'quiz_results',
  STUDY_STATS: 'study_stats',
  BOOKMARKS: 'bookmarks',
  THEME: 'theme',
  SETTINGS: 'settings',
} as const; 