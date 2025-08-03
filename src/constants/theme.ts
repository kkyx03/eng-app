import { Theme } from '../types';

// Light Theme
export const lightTheme: Theme = {
  backgroundColor: '#F2F2F7',
  cardBackground: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#8E8E93',
  borderColor: '#E5E5EA',
  shadowColor: '#000000',
  shadowOpacity: 0.1,
  successColor: '#34C759',
  errorColor: '#FF3B30',
  warningColor: '#FF9500',
  infoColor: '#007AFF',
};

// Dark Theme
export const darkTheme: Theme = {
  backgroundColor: '#000000',
  cardBackground: '#1C1C1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  borderColor: '#38383A',
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  successColor: '#30D158',
  errorColor: '#FF453A',
  warningColor: '#FF9F0A',
  infoColor: '#0A84FF',
};

// Level Colors (works for both themes)
export const levelColors = {
  easy: '#34C759',
  medium: '#FF9500',
  hard: '#FF3B30',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  WORDS: 'words',
  QUIZ_RESULTS: 'quiz_results',
  STUDY_STATS: 'study_stats',
  BOOKMARKS: 'bookmarks',
  THEME: 'theme',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
  CUSTOM_WORDS: 'custom_words',
} as const;

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto';

// Theme Context Type
export interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
} 