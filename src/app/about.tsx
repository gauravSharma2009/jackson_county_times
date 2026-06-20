import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../constants/api';

type AboutData = {
  intro: string;
  org_name: string;
  org_subtitle: string;
  org_description: string;
  phone: string;
  website: string;
  founded_year: string;
  mission_title: string;
  mission_text: string;
};

export default function AboutScreen() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/about-us`, { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111111" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load about information.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>{data.intro}</Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.companyName}>{data.org_name}</Text>
          <Text style={styles.companyLine}>{data.org_subtitle}</Text>
          <Text style={styles.focus}>{data.org_description}</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${data.phone}`)}>
              <Feather name="phone" size={18} color="#888888" />
            </TouchableOpacity>
            <Text style={styles.iconRowText}>{data.phone}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(data.website)}>
              <Feather name="globe" size={18} color="#888888" />
            </TouchableOpacity>
            <Text style={styles.iconRowText}>{data.website}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="clock" size={20} color="#333333" />
          <Text style={styles.infoText}>
            {'  '}
            <Text style={styles.infoBold}>Founded : {data.founded_year}</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="disc" size={20} color="#333333" />
          <Text style={styles.infoText}>
            {'  '}
            <Text style={styles.infoBold}>{data.mission_title}</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.mission}>{data.mission_text}</Text>

        <View style={styles.divider} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#888888',
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: '#222222',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 4,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  companyLine: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  focus: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginTop: 12,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  iconRowText: {
    fontSize: 14,
    color: '#555555',
    marginRight: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
  },
  infoBold: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111111',
  },
  mission: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
