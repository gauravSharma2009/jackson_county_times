import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BASE_URL } from '@/constants/api';

type NotificationItem = {
  id: string;
  heading: string;
  place: string;
  story: string;
  news_image: string | null;
  created_at: string;
  updated_at: string;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hour12 = d.getHours() % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  return `${mm}-${dd}-${yyyy} ${String(hour12).padStart(2, '0')}:${min} ${ampm}`;
};

function NotificationCard({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
      {!!item.news_image && (
        <View style={styles.cardImageWrap}>
          <Image source={{ uri: item.news_image }} style={styles.cardImage} resizeMode="cover" />
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.heading}
        </Text>
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [data, setData] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (loading && !reset) return;
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/notification?page=${pageNum}&limit=10`, {
          headers: { 'Cache-Control': 'no-cache' },
        });
        const json = await res.json();
        if (json.success) {
          const items: NotificationItem[] = json.data;
          setData((prev) => (reset ? items : [...prev, ...items]));
          setHasMore(json.pagination?.hasNextPage ?? false);
          setPage(pageNum);
        }
      } catch (e) {
        console.error('Notification fetch error:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchData(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchData(page + 1, false);
  };

  const handlePress = (item: NotificationItem) => {
    router.push({
      pathname: '/notifications/[id]',
      params: { id: item.id, data: JSON.stringify(item) },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} onPress={handlePress} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#555555" />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No notifications found.</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color="#555555" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#d8d8d8',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardImageWrap: {
    width: 110,
    height: 90,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 19,
  },
  cardDate: {
    fontSize: 12,
    color: '#555555',
  },
  loaderRow: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
  },
});
