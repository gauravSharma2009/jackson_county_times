import { Feather } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContactItem = {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  action: () => void;
};

const CONTACTS: ContactItem[] = [
  {
    id: 'phone',
    icon: 'phone',
    label: 'Call',
    value: '+18505261501',
    action: () => Linking.openURL('tel:+18505261501'),
  },
  {
    id: 'address',
    icon: 'map-pin',
    label: 'Address',
    value: '2866 Madison Street, Marianna, Florida 32448',
    action: () =>
      Linking.openURL(
        'https://maps.google.com/?q=2866+Madison+Street,+Marianna,+Florida+32448'
      ),
  },
  {
    id: 'website',
    icon: 'globe',
    label: 'Website',
    value: 'https://jacksoncountytimes.net/',
    action: () => Linking.openURL('https://jacksoncountytimes.net/'),
  },
];

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerSmall}>Jackson County</Text>
            <Text style={styles.bannerLarge}>TIMES</Text>
            <Text style={styles.bannerTag}>contact</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Get in touch with <Text style={styles.headlineBold}>Jackson County Times</Text>
        </Text>

        {/* Contact box */}
        <View style={styles.contactBox}>
          {CONTACTS.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.contactRow} onPress={item.action} activeOpacity={0.7}>
                <View style={styles.iconBox}>
                  <Feather name={item.icon} size={20} color="#333333" />
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>
              </TouchableOpacity>
              {index < CONTACTS.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

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
    backgroundColor: '#ffffff',
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
    position: 'relative',
  },
  bannerOverlay: {
    alignItems: 'center',
    position: 'relative',
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
