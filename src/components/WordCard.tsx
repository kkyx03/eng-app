import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Word } from '../types';
import { levelColors } from '../constants/theme';

interface WordCardProps {
  word: Word;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  showBookmark?: boolean;
  showLevel?: boolean;
  showExample?: boolean;
  compact?: boolean;
}

const { width } = Dimensions.get('window');

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPress,
  onBookmarkPress,
  showBookmark = true,
  showLevel = true,
  showExample = true,
  compact = false,
}) => {
  const getLevelText = (level: string) => {
    switch (level) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return level;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.wordInfo}>
          <Text style={styles.english}>{word.english}</Text>
          <Text style={styles.korean}>{word.korean}</Text>
        </View>
        
        <View style={styles.actions}>
          {showLevel && (
            <View style={[styles.levelBadge, { backgroundColor: levelColors[word.level] }]}>
              <Text style={styles.levelText}>{getLevelText(word.level)}</Text>
            </View>
          )}
          
          {showBookmark && (
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={onBookmarkPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={word.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={word.isBookmarked ? '#FFD700' : '#8E8E93'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showExample && !compact && (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>예문:</Text>
          <Text style={styles.example}>{word.example}</Text>
          <Text style={styles.meaning}>{word.meaning}</Text>
        </View>
      )}

      {word.studyCount && word.studyCount > 0 && (
        <View style={styles.studyInfo}>
          <Ionicons name="time-outline" size={14} color="#8E8E93" />
          <Text style={styles.studyCount}>학습 {word.studyCount}회</Text>
          {word.lastStudied && (
            <Text style={styles.lastStudied}>
              {new Date(word.lastStudied).toLocaleDateString()}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  compactContainer: {
    padding: 12,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wordInfo: {
    flex: 1,
    marginRight: 12,
  },
  english: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  korean: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookmarkButton: {
    padding: 4,
  },
  exampleContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  example: {
    fontSize: 14,
    color: '#333333',
    fontStyle: 'italic',
    marginBottom: 4,
    lineHeight: 20,
  },
  meaning: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  studyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  studyCount: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lastStudied: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 'auto',
  },
}); 