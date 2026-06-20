import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BASE_URL } from '@/constants/api';

type Category = {
  id: number;
  category_name: string;
};

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

export default function NewsScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch categories once on mount
  useEffect(() => {
    fetch(`${BASE_URL}/categories`, { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) setCategories(json.data);
      })
      .catch(() => {})
      .finally(() => setCatLoading(false));
  }, []);

  const activeCategory = categories[activeTab];

  const fetchNews = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (!activeCategory) return;
      if (loading && !reset) return;
      setLoading(true);
      try {

        console.log("url :", `${BASE_URL}/news?category_id=${activeCategory.id}&page=${pageNum}&limit=10`)
        const res = await fetch(
          `${BASE_URL}/breaking-news?category_id=${activeCategory.id}&page=${pageNum}&limit=10`,
          { headers: { 'Cache-Control': 'no-cache' } }
        );
        const json = await res.json();
        if (json.success) {
          const items: NewsItem[] = json.data;
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
    [activeCategory, loading]
  );

  // Re-fetch when active tab changes (after categories are loaded)
  useEffect(() => {
    if (!activeCategory) return;
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchNews(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeCategory?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchNews(page + 1, false);
  };

  const filtered = search.trim()
    ? data.filter((i) => i.heading?.toLowerCase().includes(search.toLowerCase()))
    : data;

  const handlePress = (item: NewsItem) => {
    router.push({ pathname: '/news/[id]', params: { id: item.id, data: JSON.stringify(item) } });
  };

  if (catLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111111" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Tabs from API */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.tab, i === activeTab && styles.tabActive]}
              onPress={() => { setActiveTab(i); setSearch(''); }}
              activeOpacity={0.8}>
              <Text style={[styles.tabText, i === activeTab && styles.tabTextActive]}>
                {cat.category_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No articles found.</Text>
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
    backgroundColor: '#f1f1f1',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabScroll: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 13,
    paddingHorizontal: 16,
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
  emptyWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
  },
});
