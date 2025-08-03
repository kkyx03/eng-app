// 앱 전체에서 사용하는 타입 정의
export interface Word {
  id: string;
  english: string;
  korean: string;
  example: string;
  meaning: string;
  level: 'easy' | 'medium' | 'hard';
  isBookmarked?: boolean;
  isCorrect?: boolean;
  lastStudied?: Date;
  studyCount?: number;
}

export interface QuizQuestion {
  id: string;
  word: Word;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface QuizResult {
  id: string;
  date: Date;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  questions: QuizQuestion[];
}

export interface StudyStats {
  totalWords: number;
  studiedWords: number;
  correctAnswers: number;
  totalAnswers: number;
  averageTime: number;
  streakDays: number;
  lastStudyDate?: Date;
}

export interface FilterOptions {
  level?: 'easy' | 'medium' | 'hard';
  searchText?: string;
  bookmarkedOnly?: boolean;
  sortBy?: 'english' | 'korean' | 'level' | 'lastStudied';
  sortOrder?: 'asc' | 'desc';
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
} 