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

type NewsItem = {
  id: string;
  heading: string;
  place: string;
  story: string;
  news_image: string | null;
  category_name: string;
  created_at: string;
  updated_at: string;
};

type Tab = { key: string; label: string; endpoint: string };

const TABS: Tab[] = [
  { key: 'breaking', label: 'BREAKING N...', endpoint: 'breaking-news' },
  { key: 'first', label: 'FIRST APPE...', endpoint: 'first-appearance' },
  { key: 'jail', label: 'JAIL DOCKE...', endpoint: 'breaking-news' },
];

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

function NewsCard({ item, onPress }: { item: NewsItem; onPress: (item: NewsItem) => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.cardImageWrap}>
        {item.news_image ? (
          <Image source={{ uri: item.news_image }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <CardPlaceholder />
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={3}>
          {item.heading}
        </Text>
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NewsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const currentTab = TABS[activeTab];

  const fetchData = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (loading && !reset) return;
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/${currentTab.endpoint}?page=${pageNum}&limit=10`);
        const json = await res.json();
        if (json.success) {
          let items: NewsItem[] = json.data;
          if (currentTab.key === 'jail') {
            items = items.filter((i) => i.category_name?.toUpperCase().includes('JAIL'));
          }
          setData((prev) => (reset ? items : [...prev, ...items]));
          setHasMore(json.pagination?.hasNextPage ?? false);
          setPage(pageNum);
        }
      } catch (e) {
        console.error('News fetch error:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentTab, loading]
  );

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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

  const handlePress = (item: NewsItem) => {
    router.push({ pathname: '/news/[id]', params: { id: item.id, data: JSON.stringify(item) } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, i === activeTab && styles.tabActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, i === activeTab && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
        renderItem={({ item }) => <NewsCard item={item} onPress={handlePress} />}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#111111',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888888',
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#111111',
    fontWeight: '700',
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
});
