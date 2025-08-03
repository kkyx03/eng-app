import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { levelColors } from '../constants/theme';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onPress,
  color = '#007AFF',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && { backgroundColor: color, borderColor: color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          isSelected && styles.selectedChipText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface FilterChipsProps {
  selectedLevel?: 'easy' | 'medium' | 'hard' | 'all';
  onLevelChange: (level: 'easy' | 'medium' | 'hard' | 'all') => void;
  showBookmarkedOnly?: boolean;
  onBookmarkedToggle?: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedLevel = 'all',
  onLevelChange,
  showBookmarkedOnly = false,
  onBookmarkedToggle,
}) => {
  const levelOptions = [
    { key: 'all', label: '전체', color: '#8E8E93' },
    { key: 'easy', label: '쉬움', color: levelColors.easy },
    { key: 'medium', label: '보통', color: levelColors.medium },
    { key: 'hard', label: '어려움', color: levelColors.hard },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {levelOptions.map((option) => (
        <FilterChip
          key={option.key}
          label={option.label}
          isSelected={selectedLevel === option.key}
          onPress={() => onLevelChange(option.key as any)}
          color={option.color}
        />
      ))}
      
      {onBookmarkedToggle && (
        <FilterChip
          label="북마크"
          isSelected={showBookmarkedOnly}
          onPress={onBookmarkedToggle}
          color="#FFD700"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 