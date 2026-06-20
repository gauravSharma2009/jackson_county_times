import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../constants/api';

type ContactData = {
  intro: string;
  org_name: string;
  phone: string;
  address: string;
  website: string;
  banner_image: string | null;
  banner_image_url: string | null;
};

export default function ContactScreen() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/contact-us`, { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // console.log('Contact data loaded:', json.data);
          setData(json.data);}
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const contacts = data
    ? [
        {
          id: 'phone',
          icon: 'phone' as const,
          label: 'Call',
          value: data.phone,
          action: () => Linking.openURL(`tel:${data.phone}`),
        },
        {
          id: 'address',
          icon: 'map-pin' as const,
          label: 'Address',
          value: data.address,
          action: () =>
            Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(data.address)}`),
        },
        {
          id: 'website',
          icon: 'globe' as const,
          label: 'Website',
          value: data.website,
          action: () => Linking.openURL(data.website),
        },
      ]
    : [];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          {(data?.banner_image) ? (
            <Image
              source={{ uri: `${BASE_URL}/images/${data.banner_image}` }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : null}
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#111111" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Failed to load contact information.</Text>
          </View>
        ) : (
          <>
            {/* Headline */}
            <Text style={styles.headline}>{data?.intro}</Text>

            {/* Contact box */}
            <View style={styles.contactBox}>
              {contacts.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.contactRow}
                    onPress={item.action}
                    activeOpacity={0.7}>
                    <View style={styles.iconBox}>
                      <Feather name={item.icon} size={20} color="#333333" />
                    </View>
                    <View style={styles.textBox}>
                      <Text style={styles.contactLabel}>{item.label}</Text>
                      <Text style={styles.contactValue}>{item.value}</Text>
                    </View>
                  </TouchableOpacity>
                  {index < contacts.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Footer Logo */}
        <View style={styles.footer}>
          <Text style={styles.footerSmall}>Jackson County</Text>
          <Text style={styles.footerLarge}>TIMES</Text>
        </View>
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
  banner: {
    height: 160,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width:"100%",
    height:160
  },
  bannerOverlay: {
    alignItems: 'center',
  },
  bannerSmall: {
    fontSize: 13,
    color: '#555555',
    fontStyle: 'italic',
  },
  bannerLarge: {
    fontSize: 38,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 2,
    fontFamily: 'serif',
  },
  bannerTag: {
    fontSize: 18,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  centered: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#888888',
  },
  headline: {
    fontSize: 15,
    color: '#333333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    lineHeight: 22,
  },
  headlineBold: {
    fontWeight: '700',
    color: '#111111',
  },
  contactBox: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    fontSize: 13,
    color: '#888888',
  },
  contactValue: {
    fontSize: 14,
    color: '#222222',
    lineHeight: 20,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 66,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 8,
  },
  footerSmall: {
    fontSize: 13,
    color: '#444444',
    fontStyle: 'italic',
  },
  footerLarge: {
    fontSize: 44,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 3,
    fontFamily: 'serif',
  },
});
