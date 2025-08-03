import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Word } from '../types';
import { levelColors } from '../constants/theme';
import { Card } from './Card';

interface WordCardProps {
  word: Word;
  onPress?: (word: Word) => void;
  onBookmarkPress?: (wordId: string) => void;
  showBookmark?: boolean;
  showLevel?: boolean;
  showExample?: boolean;
  showMeaning?: boolean;
  compact?: boolean;
  isBookmarked?: boolean;
  variant?: 'default' | 'quiz' | 'result';
  isCorrect?: boolean;
  showAnswer?: boolean;
}

const { width } = Dimensions.get('window');

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPress,
  onBookmarkPress,
  showBookmark = true,
  showLevel = true,
  showExample = true,
  showMeaning = true,
  compact = false,
  isBookmarked = false,
  variant = 'default',
  isCorrect,
  showAnswer = false,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [showDetails, setShowDetails] = useState(false);

  const handlePress = () => {
    if (onPress) {
      // Add press animation
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress(word);
    } else {
      setShowDetails(!showDetails);
    }
  };

  const handleBookmarkPress = () => {
    if (onBookmarkPress) {
      onBookmarkPress(word.id);
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return level;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'quiz':
        return styles.quizCard;
      case 'result':
        return isCorrect ? styles.correctCard : styles.incorrectCard;
      default:
        return styles.defaultCard;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'result':
        return isCorrect ? styles.correctText : styles.incorrectText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Card variant="default" style={[styles.container, getVariantStyle()] as any}>
        <TouchableOpacity
          style={styles.content}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={styles.header}>
            <View style={styles.wordInfo}>
              <Text style={[styles.english, getVariantTextStyle()]}>
                {word.english}
              </Text>
              {showAnswer && (
                <Text style={[styles.korean, getVariantTextStyle()]}>
                  {word.korean}
                </Text>
              )}
            </View>
            
            <View style={styles.actions}>
              {showLevel && (
                <View style={[styles.levelBadge, { backgroundColor: levelColors[word.level] }]}>
                  <Text style={styles.levelText}>
                    {getLevelText(word.level)}
                  </Text>
                </View>
              )}
              
              {showBookmark && onBookmarkPress && (
                <TouchableOpacity
                  style={styles.bookmarkButton}
                  onPress={handleBookmarkPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={isBookmarked ? '#FF9500' : '#8E8E93'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {showMeaning && word.meaning && (
            <Text style={[styles.meaning, getVariantTextStyle()]}>
              {word.meaning}
            </Text>
          )}

          {showExample && word.example && (
            <Text style={[styles.example, getVariantTextStyle()]}>
              "{word.example}"
            </Text>
          )}

          {variant === 'result' && (
            <View style={styles.resultIndicator}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={isCorrect ? '#34C759' : '#FF3B30'}
              />
              <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.incorrectText]}>
                {isCorrect ? '정답' : '오답'}
              </Text>
            </View>
          )}

          {!compact && showDetails && (
            <View style={styles.details}>
              <Text style={styles.detailText}>
                학습 횟수: {word.studyCount || 0}회
              </Text>
              {word.lastStudied && (
                <Text style={styles.detailText}>
                  마지막 학습: {new Date(word.lastStudied).toLocaleDateString()}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  
  content: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  wordInfo: {
    flex: 1,
    marginRight: 12,
  },
  
  english: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  
  korean: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  
  meaning: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 20,
  },
  
  example: {
    fontSize: 13,
    color: '#8E8E93',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  bookmarkButton: {
    padding: 4,
  },
  
  resultIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  
  resultText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  details: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  
  detailText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  
  // Variant styles
  defaultCard: {
    backgroundColor: '#FFFFFF',
  },
  
  quizCard: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  
  correctCard: {
    backgroundColor: '#F0FFF4',
    borderWidth: 2,
    borderColor: '#34C759',
  },
  
  incorrectCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  
  // Text variants
  defaultText: {
    color: '#000000',
  },
  
  correctText: {
    color: '#34C759',
  },
  
  incorrectText: {
    color: '#FF3B30',
  },
}); 