import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Word, QuizQuestion, QuizResult } from '../types';
import { words, getRandomWords, getRandomWordsByLevel } from '../db/words';
import { StorageManager, storageUtils } from '../utils/storage';
import { levelColors } from '../constants/theme';
import { QuizScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

export default function QuizScreen({ navigation }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isQuizStarted && questions.length > 0) {
      setStartTime(new Date());
    }
  }, [isQuizStarted, questions]);

  const generateQuestions = () => {
    let selectedWords: Word[];
    
    if (selectedLevel === 'all') {
      selectedWords = getRandomWords(questionCount);
    } else {
      selectedWords = getRandomWordsByLevel(selectedLevel, questionCount);
    }

    const quizQuestions: QuizQuestion[] = selectedWords.map((word, index) => {
      // 오답 생성 (다른 단어들의 한국어 뜻을 사용)
      const otherWords = words.filter(w => w.id !== word.id);
      const wrongAnswers = otherWords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.korean);

      // 4지선다 옵션 생성
      const options = [...wrongAnswers, word.korean].sort(() => 0.5 - Math.random());

      return {
        id: `question_${index}`,
        word,
        options,
        correctAnswer: word.korean,
      };
    });

    setQuestions(quizQuestions);
    setUserAnswers(new Array(quizQuestions.length).fill(''));
    setCurrentQuestionIndex(0);
    setIsQuizStarted(true);
    setIsQuizFinished(false);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    // 다음 문제로 이동
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      // 퀴즈 완료
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!startTime) return;

    const endTime = new Date();
    const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000; // 초 단위

    // 결과 계산
    let correctAnswers = 0;
    const completedQuestions = questions.map((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        ...question,
        userAnswer,
        isCorrect,
      };
    });

    const quizResult: QuizResult = {
      id: `quiz_${Date.now()}`,
      date: new Date(),
      totalQuestions: questions.length,
      correctAnswers,
      wrongAnswers: questions.length - correctAnswers,
      timeSpent,
      questions: completedQuestions,
    };

    // 결과 저장
    try {
      const existingResults = await StorageManager.loadQuizResults();
      const updatedResults = [quizResult, ...existingResults];
      await StorageManager.saveQuizResults(updatedResults);

      // 학습 통계 업데이트
      await storageUtils.updateStudyStats(correctAnswers, questions.length, timeSpent);

      // 각 단어의 학습 기록 업데이트
      for (const question of completedQuestions) {
        await storageUtils.updateWordStudyRecord(
          question.word.id,
          question.isCorrect || false
        );
      }
    } catch (error) {
      console.error('퀴즈 결과 저장 실패:', error);
    }

    setIsQuizFinished(true);
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex];
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getAccuracy = () => {
    const answered = userAnswers.filter(answer => answer !== '');
    const correct = answered.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    );
    return answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0;
  };

  const renderQuestion = () => {
    const question = getCurrentQuestion();
    if (!question) return null;

    const userAnswer = userAnswers[currentQuestionIndex];
    const isAnswered = userAnswer !== '';

    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} 
          />
        </View>
        
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
          <Text style={styles.accuracyText}>정답률: {getAccuracy()}%</Text>
        </View>

        <View style={styles.wordCard}>
          <Text style={styles.englishWord}>{question.word.english}</Text>
          <Text style={styles.exampleText}>{question.word.example}</Text>
        </View>

        <Text style={styles.questionText}>
          다음 중 "{question.word.english}"의 올바른 뜻을 고르세요.
        </Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = userAnswer === option;
            const isCorrect = option === question.correctAnswer;
            let optionStyle = styles.optionButton;
            let textStyle = styles.optionText;

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = [styles.optionButton, styles.correctOption];
                textStyle = [styles.optionText, styles.correctOptionText];
              } else if (isSelected && !isCorrect) {
                optionStyle = [styles.optionButton, styles.wrongOption];
                textStyle = [styles.optionText, styles.wrongOptionText];
              }
            } else if (isSelected) {
              optionStyle = [styles.optionButton, styles.selectedOption];
              textStyle = [styles.optionText, styles.selectedOptionText];
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => !isAnswered && handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                <Text style={textStyle}>{option}</Text>
                {isAnswered && isCorrect && (
                  <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderQuizSettings = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>퀴즈 설정</Text>
      
      <View style={styles.settingGroup}>
        <Text style={styles.settingLabel}>난이도</Text>
        <View style={styles.levelButtons}>
          {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.selectedLevelButton,
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <Text style={[
                styles.levelButtonText,
                selectedLevel === level && styles.selectedLevelButtonText,
              ]}>
                {level === 'all' ? '전체' : level === 'easy' ? '쉬움' : level === 'medium' ? '보통' : '어려움'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingGroup}>
        <Text style={styles.settingLabel}>문제 수</Text>
        <View style={styles.countButtons}>
          {[5, 10, 15, 20].map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.countButton,
                questionCount === count && styles.selectedCountButton,
              ]}
              onPress={() => setQuestionCount(count)}
            >
              <Text style={[
                styles.countButtonText,
                questionCount === count && styles.selectedCountButtonText,
              ]}>
                {count}개
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={generateQuestions}>
        <Text style={styles.startButtonText}>퀴즈 시작</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuizResult = () => {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const accuracy = Math.round((correctAnswers / questions.length) * 100);

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>퀴즈 완료!</Text>
        
        <View style={styles.resultStats}>
          <View style={styles.resultStat}>
            <Text style={styles.resultStatNumber}>{correctAnswers}</Text>
            <Text style={styles.resultStatLabel}>정답</Text>
          </View>
          <View style={styles.resultStat}>
            <Text style={styles.resultStatNumber}>{questions.length - correctAnswers}</Text>
            <Text style={styles.resultStatLabel}>오답</Text>
          </View>
          <View style={styles.resultStat}>
            <Text style={styles.resultStatNumber}>{accuracy}%</Text>
            <Text style={styles.resultStatLabel}>정답률</Text>
          </View>
        </View>

        <View style={styles.resultActions}>
          <TouchableOpacity 
            style={styles.resultButton} 
            onPress={() => {
              setIsQuizStarted(false);
              setIsQuizFinished(false);
            }}
          >
            <Text style={styles.resultButtonText}>다시 풀기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resultButton, styles.homeButton]} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.resultButtonText}>홈으로</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>퀴즈</Text>
        {!isQuizStarted && (
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {!isQuizStarted && !isQuizFinished && renderQuizSettings()}
      {isQuizStarted && !isQuizFinished && renderQuestion()}
      {isQuizFinished && renderQuizResult()}

      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>퀴즈 설정</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          {renderQuizSettings()}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
  },
  settingGroup: {
    marginBottom: 30,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedLevelButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  selectedLevelButtonText: {
    color: '#FFFFFF',
  },
  countButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  countButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedCountButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  countButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  selectedCountButtonText: {
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  accuracyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  englishWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  correctOption: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  wrongOption: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  correctOptionText: {
    color: '#FFFFFF',
  },
  wrongOptionText: {
    color: '#FFFFFF',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  resultStat: {
    alignItems: 'center',
  },
  resultStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  resultStatLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  resultActions: {
    gap: 12,
  },
  resultButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#8E8E93',
  },
  resultButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});
