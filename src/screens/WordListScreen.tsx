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
import { Word, FilterOptions } from '../types';
import { words } from '../db/words';
import { StorageManager, storageUtils } from '../utils/storage';
import { WordCard } from '../components/WordCard';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { levelColors } from '../constants/theme';
import { WordListScreenProps } from '../types/navigation';

export default function WordListScreen({ navigation }: WordListScreenProps) {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'english' | 'korean' | 'level' | 'lastStudied'>('english');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allWords, searchText, selectedLevel, showBookmarkedOnly, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      // 저장된 단어 데이터 로드 (없으면 기본 데이터 사용)
      let savedWords = await StorageManager.loadWords();
      if (savedWords.length === 0) {
        savedWords = words;
        await StorageManager.saveWords(words);
      }
      setAllWords(savedWords);

      // 북마크된 단어 ID 로드
      const bookmarks = await StorageManager.loadBookmarks();
      setBookmarkedIds(bookmarks);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setAllWords(words);
    }
  };

  const applyFilters = () => {
    let filtered = [...allWords];

    // 검색 필터
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        word =>
          word.english.toLowerCase().includes(searchLower) ||
          word.korean.includes(searchText) ||
          word.example.toLowerCase().includes(searchLower)
      );
    }

    // 난이도 필터
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(word => word.level === selectedLevel);
    }

    // 북마크 필터
    if (showBookmarkedOnly) {
      filtered = filtered.filter(word => bookmarkedIds.includes(word.id));
    }

    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'english':
          comparison = a.english.localeCompare(b.english);
          break;
        case 'korean':
          comparison = a.korean.localeCompare(b.korean);
          break;
        case 'level':
          const levelOrder = { easy: 1, medium: 2, hard: 3 };
          comparison = levelOrder[a.level] - levelOrder[b.level];
          break;
        case 'lastStudied':
          const aDate = a.lastStudied ? new Date(a.lastStudied).getTime() : 0;
          const bDate = b.lastStudied ? new Date(b.lastStudied).getTime() : 0;
          comparison = aDate - bDate;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredWords(filtered);
  };

  const handleBookmarkToggle = async (wordId: string) => {
    try {
      await storageUtils.toggleBookmark(wordId);
      
      // 북마크 목록 업데이트
      const newBookmarks = bookmarkedIds.includes(wordId)
        ? bookmarkedIds.filter(id => id !== wordId)
        : [...bookmarkedIds, wordId];
      setBookmarkedIds(newBookmarks);

      // 단어 데이터 업데이트
      const updatedWords = allWords.map(word =>
        word.id === wordId ? { ...word, isBookmarked: !word.isBookmarked } : word
      );
      setAllWords(updatedWords);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      Alert.alert('오류', '북마크 설정에 실패했습니다.');
    }
  };

  const handleWordPress = (word: Word) => {
    Alert.alert(
      word.english,
      `${word.korean}\n\n예문: ${word.example}\n\n해석: ${word.meaning}`,
      [
        { text: '닫기', style: 'cancel' },
        {
          text: '북마크',
          onPress: () => handleBookmarkToggle(word.id),
        },
      ]
    );
  };

  const handleSortPress = () => {
    Alert.alert(
      '정렬 기준',
      '정렬 기준을 선택하세요',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '영어 단어',
          onPress: () => setSortBy('english'),
        },
        {
          text: '한국어 뜻',
          onPress: () => setSortBy('korean'),
        },
        {
          text: '난이도',
          onPress: () => setSortBy('level'),
        },
        {
          text: '최근 학습',
          onPress: () => setSortBy('lastStudied'),
        },
      ]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <WordCard
      word={item}
      onPress={() => handleWordPress(item)}
      onBookmarkPress={() => handleBookmarkToggle(item.id)}
      showBookmark={true}
      showLevel={true}
      showExample={false}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>단어장</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSortPress} style={styles.sortButton}>
            <Ionicons name="funnel-outline" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
            <Ionicons
              name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="단어, 뜻, 예문으로 검색..."
      />

      <FilterChips
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        showBookmarkedOnly={showBookmarkedOnly}
        onBookmarkedToggle={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
      />

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          총 {filteredWords.length}개 단어
          {searchText && ` (검색: "${searchText}")`}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#C7C7CC" />
      <Text style={styles.emptyStateTitle}>검색 결과가 없습니다</Text>
      <Text style={styles.emptyStateSubtitle}>
        다른 검색어를 입력하거나 필터를 조정해보세요
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredWords}
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
    backgroundColor: '#F2F2F7',
    paddingBottom: 8,
  },
  headerTop: {
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
  sortButton: {
    padding: 4,
  },
  statsBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  statsText: {
    fontSize: 14,
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
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#C7C7CC',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
