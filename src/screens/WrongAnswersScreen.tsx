import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Word, QuizResult } from '../types';
import { StorageManager } from '../utils/storage';
import { WordCard } from '../components/WordCard';
import { levelColors } from '../constants/theme';
import { WrongAnswersScreenProps } from '../types/navigation';

export default function WrongAnswersScreen({ navigation }: WrongAnswersScreenProps) {
  const [wrongAnswers, setWrongAnswers] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWrongAnswers();
  }, []);

  const loadWrongAnswers = async () => {
    try {
      setLoading(true);
      const quizResults = await StorageManager.loadQuizResults();
      
      // 오답 단어들을 수집
      const wrongWords = new Map<string, Word>();
      
      quizResults.forEach(result => {
        result.questions.forEach(question => {
          if (!question.isCorrect) {
            wrongWords.set(question.word.id, question.word);
          }
        });
      });

      setWrongAnswers(Array.from(wrongWords.values()));
    } catch (error) {
      console.error('오답 로드 실패:', error);
      Alert.alert('오류', '오답 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleWordPress = (word: Word) => {
    Alert.alert(
      word.english,
      `${word.korean}\n\n예문: ${word.example}\n\n해석: ${word.meaning}`,
      [
        { text: '닫기', style: 'cancel' },
        {
          text: '단어장에서 보기',
          onPress: () => navigation.navigate('WordList'),
        },
      ]
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <WordCard
      word={item}
      onPress={() => handleWordPress(item)}
      showBookmark={false}
      showLevel={true}
      showExample={false}
      compact={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-circle-outline" size={64} color="#34C759" />
      <Text style={styles.emptyStateTitle}>오답이 없습니다!</Text>
      <Text style={styles.emptyStateSubtitle}>
        모든 문제를 맞추셨네요. 퀴즈를 더 풀어보세요!
      </Text>
      <TouchableOpacity 
        style={styles.quizButton}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.quizButtonText}>퀴즈 풀기</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>오답노트</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={loadWrongAnswers} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>오답 데이터를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wrongAnswers}
        renderItem={renderWordItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    paddingBottom: 20,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  refreshButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  quizButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 