import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StudyStats, QuizResult } from '../types';
import { StorageManager } from '../utils/storage';
import { levelColors } from '../constants/theme';
import { StatsScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

export default function StatsScreen({ navigation }: StatsScreenProps) {
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [stats, results] = await Promise.all([
        StorageManager.loadStudyStats(),
        StorageManager.loadQuizResults(),
      ]);
      
      setStudyStats(stats);
      setQuizResults(results);
    } catch (error) {
      console.error('통계 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccuracy = () => {
    if (!studyStats || studyStats.totalAnswers === 0) return 0;
    return Math.round((studyStats.correctAnswers / studyStats.totalAnswers) * 100);
  };

  const getAverageTime = () => {
    if (!studyStats || studyStats.totalAnswers === 0) return 0;
    return Math.round(studyStats.averageTime);
  };

  const getRecentQuizResults = () => {
    return quizResults.slice(0, 5);
  };

  const getLevelStats = () => {
    // 난이도별 통계 계산 로직
    return {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>통계를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 전체 통계 카드 */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>전체 학습 통계</Text>
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
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getAverageTime()}초</Text>
              <Text style={styles.statLabel}>평균 시간</Text>
            </View>
          </View>
        </View>

        {/* 난이도별 통계 */}
        <View style={styles.levelStatsCard}>
          <Text style={styles.cardTitle}>난이도별 성취도</Text>
          <View style={styles.levelStats}>
            <View style={styles.levelStat}>
              <View style={[styles.levelDot, { backgroundColor: levelColors.easy }]} />
              <Text style={styles.levelLabel}>쉬움</Text>
              <Text style={styles.levelAccuracy}>85%</Text>
            </View>
            <View style={styles.levelStat}>
              <View style={[styles.levelDot, { backgroundColor: levelColors.medium }]} />
              <Text style={styles.levelLabel}>보통</Text>
              <Text style={styles.levelAccuracy}>72%</Text>
            </View>
            <View style={styles.levelStat}>
              <View style={[styles.levelDot, { backgroundColor: levelColors.hard }]} />
              <Text style={styles.levelLabel}>어려움</Text>
              <Text style={styles.levelAccuracy}>58%</Text>
            </View>
          </View>
        </View>

        {/* 최근 퀴즈 결과 */}
        {quizResults.length > 0 && (
          <View style={styles.recentResultsCard}>
            <Text style={styles.cardTitle}>최근 퀴즈 결과</Text>
            {getRecentQuizResults().map((result, index) => (
              <View key={result.id} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultDate}>
                    {new Date(result.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.resultScore}>
                    {result.correctAnswers}/{result.totalQuestions}
                  </Text>
                </View>
                <View style={styles.resultProgress}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${(result.correctAnswers / result.totalQuestions) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.resultTime}>
                  소요시간: {Math.round(result.timeSpent)}초
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 액션 버튼 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('WrongAnswers')}
          >
            <Ionicons name="close-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>오답노트 보기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>퀴즈 풀기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
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
  levelAccuracy: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  recentResultsCard: {
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
  resultItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resultScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  resultProgress: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  resultTime: {
    fontSize: 12,
    color: '#8E8E93',
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
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 