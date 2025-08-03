import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyState?: {
    icon: string;
    title: string;
    subtitle?: string;
    actionText?: string;
    onAction?: () => void;
  };
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  keyExtractor?: (item: T, index: number) => string;
  getItemLayout?: (data: T[] | null, index: number) => {
    length: number;
    offset: number;
    index: number;
  };
}

export function OptimizedFlatList<T>({
  data,
  renderItem,
  loading = false,
  refreshing = false,
  onRefresh,
  emptyState,
  onEndReached,
  onEndReachedThreshold = 0.1,
  keyExtractor,
  getItemLayout,
  ...props
}: OptimizedFlatListProps<T>) {
  // 메모이제이션된 renderItem 함수
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  );

  // 메모이제이션된 keyExtractor
  const memoizedKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      return `item-${index}`;
    },
    [keyExtractor]
  );

  // 메모이제이션된 getItemLayout
  const memoizedGetItemLayout = useMemo(() => {
    if (getItemLayout) {
      return getItemLayout;
    }
    return undefined;
  }, [getItemLayout]);

  // 로딩 상태
  if (loading && data.length === 0) {
    return <LoadingSpinner message="데이터를 불러오는 중..." />;
  }

  // 빈 상태
  if (!loading && data.length === 0 && emptyState) {
    return (
      <EmptyState
        icon={emptyState.icon as any}
        title={emptyState.title}
        subtitle={emptyState.subtitle}
        actionText={emptyState.actionText}
        onAction={emptyState.onAction}
      />
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      getItemLayout={memoizedGetItemLayout}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
      {...props}
    />
  );
} 