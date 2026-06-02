import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = 'http://54.144.41.237:6200/api';

type ObitItem = {
  id: string;
  heading: string;
  place: string;
  story: string;
  story_image: string | null;
  category_name: string;
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

function CardPlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Feather name="image" size={32} color="#aaaaaa" />
    </View>
  );
}

function ObitCard({ item, onPress }: { item: ObitItem; onPress: (item: ObitItem) => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.cardImageWrap}>
        {item.story_image ? (
          <Image source={{ uri: item.story_image }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <CardPlaceholder />
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.heading}
        </Text>
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ObituariesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [data, setData] = useState<ObitItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (loading && !reset) return;
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/obituaries?page=${pageNum}&limit=10`);
        const json = await res.json();
        if (json.success) {
          setData((prev) => (reset ? json.data : [...prev, ...json.data]));
          setHasMore(json.pagination?.hasNextPage ?? false);
          setPage(pageNum);
        }
      } catch (e) {
        console.error('Obituaries fetch error:', e);
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

  const filtered = search.trim()
    ? data.filter((i) => i.heading?.toLowerCase().includes(search.toLowerCase()))
    : data;

  const handlePress = (item: ObitItem) => {
    router.push({
      pathname: '/obituaries/[id]',
      params: { id: item.id, data: JSON.stringify(item) },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color="#999999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by keyword"
          placeholderTextColor="#999999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ObitCard item={item} onPress={handlePress} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#555555" />
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 12,
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
  placeholder: {
    flex: 1,
    backgroundColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 12,
    color: '#555555',
  },
  loaderRow: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
