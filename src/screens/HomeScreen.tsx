import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Word, StudyStats } from '../types';
import { words, wordStats } from '../db/words';
import { StorageManager, storageUtils } from '../utils/storage';
import { levelColors } from '../constants/theme';
import { HomeScreenProps } from '../types/navigation';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<Word[]>([]);
  const [recentWords, setRecentWords] = useState<Word[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 학습 통계 로드
      const stats = await StorageManager.loadStudyStats();
      setStudyStats(stats);

      // 북마크된 단어 로드
      const bookmarks = await StorageManager.loadBookmarks();
      const bookmarked = words.filter(word => bookmarks.includes(word.id));
      setBookmarkedWords(bookmarked.slice(0, 5)); // 최대 5개만 표시

      // 최근 학습한 단어 로드
      const allWords = await StorageManager.loadWords();
      const recent = allWords
        .filter(word => word.lastStudied)
        .sort((a, b) => new Date(b.lastStudied!).getTime() - new Date(a.lastStudied!).getTime())
        .slice(0, 5);
      setRecentWords(recent);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const getAccuracy = () => {
    if (!studyStats || studyStats.totalAnswers === 0) return 0;
    return Math.round((studyStats.correctAnswers / studyStats.totalAnswers) * 100);
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return level;
    }
  };

  const handleStartQuiz = () => {
    navigation.navigate('Quiz');
  };

  const handleViewAllWords = () => {
    navigation.navigate('WordList');
  };

  const handleClearData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 학습 데이터를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await StorageManager.clearAllData();
            loadData();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>영어 단어장</Text>
          <TouchableOpacity onPress={handleClearData} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* 학습 통계 카드 */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>학습 통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{studyStats?.totalAnswers || 0}</Text>
              <Text style={styles.statLabel}>총 문제</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getAccuracy()}%</Text>
              <Text style={styles.statLabel}>정답률</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{studyStats?.streakDays || 0}</Text>
              <Text style={styles.statLabel}>연속 학습일</Text>
            </View>
          </View>
        </View>

        {/* 난이도별 통계 */}
        <View style={styles.levelStatsCard}>
          <Text style={styles.sectionTitle}>난이도별 단어</Text>
          <View style={styles.levelStats}>
            <View style={styles.levelStat}>
              <View style={[styles.levelDot, { backgroundColor: levelColors.easy }]} />
              <Text style={styles.levelLabel}>쉬움</Text>
              <Text style={styles.levelCount}>{wordStats.easy}개</Text>
            </View>
            <View style={styles.levelStat}>
              <View style={[styles.levelDot, { backgroundColor: levelColors.medium }]} />
              <Text style={styles.levelLabel}>보통</Text>
              <Text style={styles.levelCount}>{wordStats.medium}개</Text>
            </View>
            <View style={styles.levelStat}>
              <View style={[styles.levelDot, { backgroundColor: levelColors.hard }]} />
              <Text style={styles.levelLabel}>어려움</Text>
              <Text style={styles.levelCount}>{wordStats.hard}개</Text>
            </View>
          </View>
        </View>

        {/* 빠른 액션 버튼 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleStartQuiz}>
            <Ionicons name="play-circle" size={32} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>퀴즈 시작</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleViewAllWords}>
            <Ionicons name="book-outline" size={32} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>단어장 보기</Text>
          </TouchableOpacity>
        </View>

        {/* 추가 액션 버튼 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={() => navigation.navigate('WrongAnswers')}
          >
            <Ionicons name="close-circle-outline" size={32} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>오답노트</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={() => navigation.navigate('Stats')}
          >
            <Ionicons name="stats-chart-outline" size={32} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>학습 통계</Text>
          </TouchableOpacity>
        </View>

        {/* 북마크된 단어 */}
        {bookmarkedWords.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>북마크된 단어</Text>
              <TouchableOpacity onPress={handleViewAllWords}>
                <Text style={styles.seeAllText}>전체보기</Text>
              </TouchableOpacity>
            </View>
            {bookmarkedWords.map((word) => (
              <View key={word.id} style={styles.wordItem}>
                <View style={styles.wordInfo}>
                  <Text style={styles.wordEnglish}>{word.english}</Text>
                  <Text style={styles.wordKorean}>{word.korean}</Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: levelColors[word.level] }]}>
                  <Text style={styles.levelBadgeText}>{getLevelText(word.level)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 최근 학습한 단어 */}
        {recentWords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>최근 학습한 단어</Text>
            {recentWords.map((word) => (
              <View key={word.id} style={styles.wordItem}>
                <View style={styles.wordInfo}>
                  <Text style={styles.wordEnglish}>{word.english}</Text>
                  <Text style={styles.wordKorean}>{word.korean}</Text>
                  <Text style={styles.studyInfo}>
                    {word.studyCount}회 학습 • {new Date(word.lastStudied!).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: levelColors[word.level] }]}>
                  <Text style={styles.levelBadgeText}>{getLevelText(word.level)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  settingsButton: {
    padding: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  levelStatsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  levelStat: {
    alignItems: 'center',
  },
  levelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  levelLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  levelCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: '#5856D6',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  wordInfo: {
    flex: 1,
    marginRight: 12,
  },
  wordEnglish: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  wordKorean: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  studyInfo: {
    fontSize: 12,
    color: '#8E8E93',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
