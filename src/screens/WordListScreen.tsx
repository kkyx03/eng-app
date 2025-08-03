import React, { useEffect } from 'react';
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
import { Word } from '../types';
import { useAppStore } from '../store/useAppStore';
import { WordCard } from '../components/WordCard';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { levelColors } from '../constants/theme';
import { WordListScreenProps } from '../types/navigation';

export default function WordListScreen({ navigation }: WordListScreenProps) {
  const {
    loading,
    error,
    filterOptions,
    searchQuery,
    setSearchQuery,
    setFilterOptions,
    getFilteredWords,
    toggleBookmark,
    bookmarkedIds,
  } = useAppStore();

  const filteredWords = getFilteredWords();

    useEffect(() => {
    // Data is automatically loaded by the store
  }, []);

  const handleBookmarkToggle = async (wordId: string) => {
    await toggleBookmark(wordId);
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
          onPress: () => setFilterOptions({ sortBy: 'english' }),
        },
        {
          text: '한국어 뜻',
          onPress: () => setFilterOptions({ sortBy: 'korean' }),
        },
        {
          text: '난이도',
          onPress: () => setFilterOptions({ sortBy: 'level' }),
        },
        {
          text: '최근 학습',
          onPress: () => setFilterOptions({ sortBy: 'lastStudied' }),
        },
      ]
    );
  };

  const toggleSortOrder = () => {
    setFilterOptions({ 
      sortOrder: filterOptions.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <WordCard
      word={item}
      onPress={() => handleWordPress(item)}
      onBookmarkPress={() => handleBookmarkToggle(item.id)}
      showBookmark={true}
      showLevel={true}
      showExample={false}
      isBookmarked={bookmarkedIds.includes(item.id)}
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
              name={filterOptions.sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="단어, 뜻, 예문으로 검색..."
      />

      <FilterChips
        selectedLevel={filterOptions.level}
        onLevelChange={(level) => setFilterOptions({ level })}
        showBookmarkedOnly={filterOptions.showBookmarkedOnly}
        onBookmarkedToggle={(show) => setFilterOptions({ showBookmarkedOnly: show })}
      />

             <View style={styles.statsBar}>
         <Text style={styles.statsText}>
           총 {filteredWords.length}개 단어
           {searchQuery && ` (검색: "${searchQuery}")`}
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
