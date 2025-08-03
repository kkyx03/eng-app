import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { HomeScreenProps } from '../types/navigation';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { WordCard } from '../components/WordCard';
import { levelColors } from '../constants/theme';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    studyStats,
    loading,
    error,
    loadData,
    clearAllData,
    getBookmarkedWords,
    getWrongAnswerWords,
    getWordOfTheDay,
    getStudyProgress,
  } = useAppStore();

  const bookmarkedWords = getBookmarkedWords();
  const wrongAnswerWords = getWrongAnswerWords();
  const wordOfTheDay = getWordOfTheDay();
  const studyProgress = getStudyProgress();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    loadData();
  };

  const handleClearData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 학습 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: clearAllData,
        },
      ]
    );
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침입니다!';
    if (hour < 18) return '좋은 오후입니다!';
    return '좋은 저녁입니다!';
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button title="다시 시도" onPress={loadData} icon="refresh" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.title}>영어 단어장</Text>
          </View>
          <Button
            title=""
            onPress={handleClearData}
            variant="ghost"
            icon="settings-outline"
            style={styles.settingsButton}
          />
        </View>

        {/* 오늘의 단어 */}
        {wordOfTheDay && (
          <Card variant="elevated" style={styles.wordOfTheDayCard}>
            <View style={styles.wordOfTheDayHeader}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.wordOfTheDayTitle}>오늘의 단어</Text>
            </View>
            <WordCard
              word={wordOfTheDay}
              showBookmark={false}
              showExample={false}
              compact={true}
            />
          </Card>
        )}

        {/* 학습 진척도 */}
        <Card variant="default" style={styles.progressCard}>
          <Text style={styles.sectionTitle}>학습 진척도</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${studyProgress.percentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {studyProgress.studied} / {studyProgress.total} 단어 학습 완료 ({studyProgress.percentage}%)
          </Text>
        </Card>

        {/* 학습 통계 */}
        <Card variant="default" style={styles.statsCard}>
          <Text style={styles.sectionTitle}>학습 통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.statNumber}>{studyStats?.totalAnswers || 0}</Text>
              <Text style={styles.statLabel}>총 문제</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#34C759" />
              <Text style={styles.statNumber}>{getAccuracy()}%</Text>
              <Text style={styles.statLabel}>정답률</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={24} color="#FF9500" />
              <Text style={styles.statNumber}>{studyStats?.streakDays || 0}</Text>
              <Text style={styles.statLabel}>연속 학습일</Text>
            </View>
          </View>
        </Card>

        {/* 빠른 액션 */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>빠른 액션</Text>
          <View style={styles.actionButtons}>
            <Button
              title="퀴즈 시작"
              onPress={() => navigation.navigate('Quiz')}
              icon="play-circle"
              size="large"
              style={styles.actionButton}
            />
            <Button
              title="단어장 보기"
              onPress={() => navigation.navigate('WordList')}
              icon="book-outline"
              variant="outline"
              size="large"
              style={styles.actionButton}
            />
          </View>
          <View style={styles.actionButtons}>
            <Button
              title="오답노트"
              onPress={() => navigation.navigate('WrongAnswers')}
              icon="close-circle-outline"
              variant="secondary"
              style={styles.actionButton}
            />
            <Button
              title="학습 통계"
              onPress={() => navigation.navigate('Stats')}
              icon="stats-chart-outline"
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* 북마크된 단어 */}
        {bookmarkedWords.length > 0 && (
          <Card variant="default" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>북마크된 단어</Text>
              <Button
                title="전체보기"
                onPress={() => navigation.navigate('WordList')}
                variant="ghost"
                size="small"
              />
            </View>
            {bookmarkedWords.slice(0, 3).map((word) => (
              <WordCard
                key={word.id}
                word={word}
                onPress={() => navigation.navigate('WordList')}
                onBookmarkPress={(wordId) => useAppStore.getState().toggleBookmark(wordId)}
                showExample={false}
                compact={true}
                isBookmarked={true}
              />
            ))}
          </Card>
        )}

        {/* 오답 단어 */}
        {wrongAnswerWords.length > 0 && (
          <Card variant="default" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>틀린 단어</Text>
              <Button
                title="오답노트 보기"
                onPress={() => navigation.navigate('WrongAnswers')}
                variant="ghost"
                size="small"
              />
            </View>
            {wrongAnswerWords.slice(0, 3).map((word) => (
              <WordCard
                key={word.id}
                word={word}
                onPress={() => navigation.navigate('WordList')}
                onBookmarkPress={(wordId) => useAppStore.getState().toggleBookmark(wordId)}
                showExample={false}
                compact={true}
                isBookmarked={bookmarkedWords.some(w => w.id === word.id)}
              />
            ))}
          </Card>
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
  
  greeting: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  
  settingsButton: {
    width: 44,
    height: 44,
  },
  
  wordOfTheDayCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  
  wordOfTheDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  wordOfTheDayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  
  actionSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  
  actionButton: {
    flex: 1,
  },
  
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
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
