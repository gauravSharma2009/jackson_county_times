import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BASE_URL } from '@/constants/api';
import type { Business } from './index';

const DAYS = [
  { label: 'Mon', key: 'hours_mon' },
  { label: 'Tue', key: 'hours_tue' },
  { label: 'Wed', key: 'hours_wed' },
  { label: 'Thrs', key: 'hours_thu' },
  { label: 'Fri', key: 'hours_fri' },
  { label: 'Sat', key: 'hours_sat' },
  { label: 'Sun', key: 'hours_sun' },
] as const;

export default function BusinessDetailScreen() {
  const params = useLocalSearchParams<{ data: string }>();

  let item: Business | null = null;
  try {
    item = params.data ? JSON.parse(params.data as string) : null;
  } catch {
    item = null;
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Business not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePhone = () => {
    if (item!.phone) Linking.openURL(`tel:${item!.phone}`);
  };

  const handleMapOpen = () => {
    const addr = encodeURIComponent(item!.address);
    const url =
      Platform.OS === 'ios'
        ? `maps://?q=${addr}`
        : `geo:0,0?q=${addr}`;
    Linking.openURL(url);
  };

  const handleWebsite = () => {
    if (item!.website) Linking.openURL(item!.website);
  };

  const hasHours = DAYS.some((d) => !!String((item as any)[d.key] ?? '').trim());

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Banner + Logo */}
        <View style={styles.bannerWrap}>
          {item.logo_image ? (
            <Image source={{ uri: BASE_URL + '/images' + item.logo_image }} style={styles.bannerImage} resizeMode="cover" />
          ) : (
            <View style={styles.bannerPlaceholder} />
          )}
        </View>

        {/* Name */}
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.divider} />

        {/* Address */}
        <Text style={styles.sectionLabel}>Address</Text>
        <Text style={styles.sectionValue}>{item.address}</Text>

        {hasHours && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>Hours of Operations</Text>
            {DAYS.map((d) => {
              const val = String((item as any)[d.key] ?? '').trim();
              if (!val) return null;
              return (
                <Text key={d.key} style={styles.hoursRow}>
                  {d.label}: {val}
                </Text>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={handlePhone} disabled={!item.phone}>
          <Feather name="phone-call" size={24} color={item.phone ? '#333333' : '#bbbbbb'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleMapOpen}>
          <Feather name="map-pin" size={24} color="#333333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleWebsite} disabled={!item.website}>
          <Feather name="globe" size={24} color={item.website ? '#333333' : '#bbbbbb'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f1f1f1' },
  content: { paddingBottom: 16 },
  bannerWrap: {
    height: 200,
    margin: 16,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aab89a',
  },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#aab89a' },
  logoOverlay: { width: 130, height: 130, borderRadius: 65 },
  logoPlaceholderBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    paddingHorizontal: 16,
    marginBottom: 12,
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 14,
    color: '#333333',
    paddingHorizontal: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  hoursRow: {
    fontSize: 14,
    color: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  errorWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 15, color: '#888888' },
});
