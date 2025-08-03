import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, StudyStats, QuizResult, FilterOptions } from '../types';
import { words as initialWords } from '../db/words';
import { StorageManager, storageUtils } from '../utils/storage';

interface AppState {
  // Data
  words: Word[];
  studyStats: StudyStats | null;
  bookmarkedIds: string[];
  quizResults: QuizResult[];
  wrongAnswerIds: string[];
  
  // UI State
  loading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  searchQuery: string;
  
  // Quiz State
  currentQuiz: {
    questions: any[];
    currentQuestionIndex: number;
    answers: string[];
    isFinished: boolean;
  } | null;
}

interface AppActions {
  // Data Actions
  loadData: () => Promise<void>;
  toggleBookmark: (wordId: string) => Promise<void>;
  updateWordStudy: (wordId: string, isCorrect: boolean) => Promise<void>;
  addQuizResult: (result: QuizResult) => Promise<void>;
  clearAllData: () => Promise<void>;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  setSearchQuery: (query: string) => void;
  
  // Quiz Actions
  startQuiz: (level?: string, questionCount?: number) => Promise<void>;
  answerQuestion: (answer: string) => void;
  finishQuiz: () => Promise<void>;
  
  // Computed Values
  getFilteredWords: () => Word[];
  getBookmarkedWords: () => Word[];
  getWrongAnswerWords: () => Word[];
  getWordOfTheDay: () => Word | null;
  getStudyProgress: () => { total: number; studied: number; percentage: number };
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      words: initialWords,
      studyStats: null,
      bookmarkedIds: [],
      quizResults: [],
      wrongAnswerIds: [],
      loading: false,
      error: null,
      filterOptions: {
        level: 'all',
        showBookmarkedOnly: false,
        sortBy: 'english',
        sortOrder: 'asc',
      },
      searchQuery: '',
      currentQuiz: null,

      // Data Actions
      loadData: async () => {
        set({ loading: true, error: null });
        try {
          const [words, studyStats, bookmarkedIds, quizResults] = await Promise.all([
            StorageManager.loadWords(),
            StorageManager.loadStudyStats(),
            StorageManager.loadBookmarks(),
            StorageManager.loadQuizResults(),
          ]);

          // Update wrong answer IDs from quiz results
          const wrongIds = new Set<string>();
          quizResults.forEach(result => {
            result.answers.forEach((answer, index) => {
              if (!answer.isCorrect) {
                wrongIds.add(result.questions[index].id);
              }
            });
          });

          set({
            words: words.length > 0 ? words : initialWords,
            studyStats,
            bookmarkedIds,
            quizResults,
            wrongAnswerIds: Array.from(wrongIds),
            loading: false,
          });
        } catch (error) {
          console.error('Failed to load data:', error);
          set({ 
            error: '데이터를 불러오는데 실패했습니다.', 
            loading: false 
          });
        }
      },

      toggleBookmark: async (wordId: string) => {
        const { bookmarkedIds } = get();
        const newBookmarkedIds = bookmarkedIds.includes(wordId)
          ? bookmarkedIds.filter(id => id !== wordId)
          : [...bookmarkedIds, wordId];
        
        set({ bookmarkedIds: newBookmarkedIds });
        await StorageManager.saveBookmarks(newBookmarkedIds);
      },

      updateWordStudy: async (wordId: string, isCorrect: boolean) => {
        const { words } = get();
        const updatedWords = words.map(word =>
          word.id === wordId
            ? {
                ...word,
                studyCount: (word.studyCount || 0) + 1,
                lastStudied: new Date().toISOString(),
                isCorrect,
              }
            : word
        );

        set({ words: updatedWords });
        await StorageManager.saveWords(updatedWords);
        await storageUtils.updateWordStudyRecord(wordId, isCorrect);
      },

      addQuizResult: async (result: QuizResult) => {
        const { quizResults } = get();
        const newResults = [result, ...quizResults];
        set({ quizResults: newResults });
        await StorageManager.saveQuizResults(newResults);
        await storageUtils.updateStudyStats(result);
      },

      clearAllData: async () => {
        await StorageManager.clearAllData();
        set({
          words: initialWords,
          studyStats: null,
          bookmarkedIds: [],
          quizResults: [],
          wrongAnswerIds: [],
        });
      },

      // UI Actions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      setFilterOptions: (options: Partial<FilterOptions>) => 
        set(state => ({ 
          filterOptions: { ...state.filterOptions, ...options } 
        })),
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),

      // Quiz Actions
      startQuiz: async (level = 'all', questionCount = 10) => {
        const { words } = get();
        let filteredWords = words;
        
        if (level !== 'all') {
          filteredWords = words.filter(word => word.level === level);
        }
        
        if (filteredWords.length < questionCount) {
          questionCount = filteredWords.length;
        }

        // Shuffle and select questions
        const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
        const selectedWords = shuffled.slice(0, questionCount);
        
        const questions = selectedWords.map(word => {
          // Generate wrong answers
          const wrongWords = words.filter(w => w.id !== word.id);
          const shuffledWrong = [...wrongWords].sort(() => Math.random() - 0.5);
          const wrongAnswers = shuffledWrong.slice(0, 3).map(w => w.korean);
          
          // Create options with correct answer
          const options = [...wrongAnswers, word.korean];
          const shuffledOptions = options.sort(() => Math.random() - 0.5);
          
          return {
            id: word.id,
            word,
            question: `"${word.english}"의 뜻은?`,
            options: shuffledOptions,
            correctAnswer: word.korean,
          };
        });

        set({
          currentQuiz: {
            questions,
            currentQuestionIndex: 0,
            answers: [],
            isFinished: false,
          },
        });
      },

      answerQuestion: (answer: string) => {
        const { currentQuiz } = get();
        if (!currentQuiz) return;

        const newAnswers = [...currentQuiz.answers, answer];
        const isLastQuestion = currentQuiz.currentQuestionIndex === currentQuiz.questions.length - 1;

        set({
          currentQuiz: {
            ...currentQuiz,
            answers: newAnswers,
            currentQuestionIndex: currentQuiz.currentQuestionIndex + 1,
            isFinished: isLastQuestion,
          },
        });
      },

      finishQuiz: async () => {
        const { currentQuiz } = get();
        if (!currentQuiz) return;

        const result: QuizResult = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          questions: currentQuiz.questions.map(q => q.word),
          answers: currentQuiz.questions.map((q, index) => ({
            wordId: q.id,
            userAnswer: currentQuiz.answers[index],
            correctAnswer: q.correctAnswer,
            isCorrect: currentQuiz.answers[index] === q.correctAnswer,
          })),
          totalQuestions: currentQuiz.questions.length,
          correctAnswers: currentQuiz.answers.filter((answer, index) => 
            answer === currentQuiz.questions[index].correctAnswer
          ).length,
          timeSpent: 0, // TODO: Implement timer
        };

        // Update word study records
        result.answers.forEach(answer => {
          get().updateWordStudy(answer.wordId, answer.isCorrect);
        });

        await get().addQuizResult(result);
        set({ currentQuiz: null });
      },

      // Computed Values
      getFilteredWords: () => {
        const { words, filterOptions, searchQuery } = get();
        let filtered = words;

        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(word =>
            word.english.toLowerCase().includes(query) ||
            word.korean.toLowerCase().includes(query) ||
            word.meaning.toLowerCase().includes(query)
          );
        }

        // Level filter
        if (filterOptions.level !== 'all') {
          filtered = filtered.filter(word => word.level === filterOptions.level);
        }

        // Bookmark filter
        if (filterOptions.showBookmarkedOnly) {
          const { bookmarkedIds } = get();
          filtered = filtered.filter(word => bookmarkedIds.includes(word.id));
        }

        // Sort
        filtered.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filterOptions.sortBy) {
            case 'english':
              aValue = a.english.toLowerCase();
              bValue = b.english.toLowerCase();
              break;
            case 'korean':
              aValue = a.korean.toLowerCase();
              bValue = b.korean.toLowerCase();
              break;
            case 'level':
              aValue = a.level;
              bValue = b.level;
              break;
            case 'lastStudied':
              aValue = a.lastStudied || '';
              bValue = b.lastStudied || '';
              break;
            default:
              aValue = a.english.toLowerCase();
              bValue = b.english.toLowerCase();
          }

          if (filterOptions.sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        });

        return filtered;
      },

      getBookmarkedWords: () => {
        const { words, bookmarkedIds } = get();
        return words.filter(word => bookmarkedIds.includes(word.id));
      },

      getWrongAnswerWords: () => {
        const { words, wrongAnswerIds } = get();
        return words.filter(word => wrongAnswerIds.includes(word.id));
      },

      getWordOfTheDay: () => {
        const { words } = get();
        if (words.length === 0) return null;
        
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = seed % words.length;
        
        return words[index];
      },

      getStudyProgress: () => {
        const { words } = get();
        const total = words.length;
        const studied = words.filter(word => word.studyCount && word.studyCount > 0).length;
        const percentage = total > 0 ? Math.round((studied / total) * 100) : 0;
        
        return { total, studied, percentage };
      },
    }),
    {
      name: 'eng-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        words: state.words,
        studyStats: state.studyStats,
        bookmarkedIds: state.bookmarkedIds,
        quizResults: state.quizResults,
        wrongAnswerIds: state.wrongAnswerIds,
      }),
    }
  )
); 