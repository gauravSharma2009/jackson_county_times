import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BASE_URL } from '@/constants/api';

export type Business = {
  id: string;
  name: string;
  logo_image_url: string | null;
  banner_image_url: string | null; address: string;
  logo_image: string | null;
  latitude: number | null;
  longitude: number | null;
  hours_mon: string | null;
  hours_tue: string | null;
  hours_wed: string | null;
  hours_thu: string | null;
  hours_fri: string | null;
  hours_sat: string | null;
  hours_sun: string | null;
  phone: string | null;
  website: string | null;
};

function BusinessCard({ item, onPress }: { item: Business; onPress: () => void }) {
  const handlePhone = () => {
    if (item.phone) Linking.openURL(`tel:${item.phone}`);
  };
  const handleMap = () => {
    const addr = encodeURIComponent(item.address);
    const url =
      Platform.OS === 'ios'
        ? `maps://?q=${addr}`
        : `geo:0,0?q=${addr}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Banner / Logo area with name overlay */}
      <View style={styles.cardTop}>
        {item.logo_image ? (
          <Image source={{ uri: BASE_URL + '/images' + item.logo_image }}
            style={styles.bannerImage}
            resizeMode="cover" blurRadius={3} />
        ) : (
          <View style={styles.bannerPlaceholder} />
        )}
        <View style={styles.nameOverlay}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.cardIcons}>
            <TouchableOpacity onPress={handlePhone} style={styles.iconBtn}>
              <Feather name="phone-call" size={22} color="#333333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMap} style={styles.iconBtn}>
              <Feather name="map-pin" size={22} color="#333333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const MAP_INITIAL = {
  latitude: 30.775,
  longitude: -85.235,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function DirectoryScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [mapView, setMapView] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<Business[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const fetchData = useCallback(async (pageNum: number, reset: boolean) => {
    if (loadingRef.current && !reset) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/businesses?page=${pageNum}&limit=20`);
      const json = await res.json();
      console.log('Directory fetch:', json);
      if (json.success) {
        setData((prev) => (reset ? json.data : [...prev, ...json.data]));
        setHasMore(json.pagination?.hasNextPage ?? false);
        setPage(pageNum);
      }
    } catch (e) {
      console.error('Directory fetch error:', e);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1, true);
  }, []);


  const filtered = search.trim()
    ? data.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    : data;

  const mappable = filtered
    .map((b) => ({
      ...b,
      latitude: b.latitude != null ? parseFloat(b.latitude as any) : null,
      longitude: b.longitude != null ? parseFloat(b.longitude as any) : null,
    }))
    .filter((b) => b.latitude != null && !isNaN(b.latitude!) && b.longitude != null && !isNaN(b.longitude!));

  const handlePress = (item: Business) => {
    router.push({
      pathname: '/directory/[id]',
      params: { id: item.id, data: JSON.stringify(item) },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Search + toggle row */}
      <View style={styles.topRow}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search businesses"
            placeholderTextColor="#999999"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setMapView((v) => !v)}>
          <Feather name={mapView ? 'list' : 'map'} size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {mapView ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={MAP_INITIAL}
          showsUserLocation
          onMapReady={() => {
            const first = mappable[0];
            if (first) {
              mapRef.current?.animateToRegion(
                { latitude: first.latitude!, longitude: first.longitude!, latitudeDelta: 0.02, longitudeDelta: 0.02 },
                800
              );
            }
          }}
        >
          {mappable.map((b) => (
            <Marker
              key={b.id}
              coordinate={{ latitude: b.latitude!, longitude: b.longitude! }}
              pinColor="red"
              onCalloutPress={() => handlePress(b)}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutName}>{b.name}</Text>
                  <Text style={styles.calloutAddr}>{b.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BusinessCard item={item} onPress={() => handlePress(item)} />
          )}
          onEndReached={() => { if (!loading && hasMore) fetchData(page + 1, false); }}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchData(1, true); }}
              tintColor="#555555"
            />
          }
          ListFooterComponent={
            loading ? (
              <View style={styles.loaderRow}>
                <ActivityIndicator size="small" color="#555555" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No businesses found.</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f1f1f1' },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    padding: 0,
  },
  toggleBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 12, paddingBottom: 24 },
  card: {
    borderRadius: 14,
    backgroundColor: '#d8d8d8',
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardTop: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#aab89a',
  },
  logoOverlay: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  cardIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 4 },
  map: { flex: 1 },
  callout: { padding: 8, maxWidth: 220 },
  calloutName: { fontWeight: '700', fontSize: 13, color: '#111111', marginBottom: 2 },
  calloutAddr: { fontSize: 12, color: '#444444' },
  loaderRow: { paddingVertical: 16, alignItems: 'center' },
  emptyWrap: { paddingTop: 60, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#888888' },
});
