import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          We are a weekly newspaper that publishes every Thursday. View online articles about our
          community, obituaries, police reports, upcoming events and more.
        </Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.companyName}>JC Times</Text>
          <Text style={styles.companyLine}>Jackson County Times</Text>
          <Text style={styles.companyLine}>News</Text>

          <Text style={styles.focus}>
            Focused on Community Events, Human Interest Stories, Agriculture, Senior Citizens,
            Jackson County Business News. Editorials, Contributing Writers.
          </Text>

          <View style={styles.iconRow}>
            <Feather name="phone" size={18} color="#888888" />
            <Feather name="globe" size={18} color="#888888" />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="clock" size={20} color="#333333" />
          <Text style={styles.infoText}>
            {'  '}
            <Text style={styles.infoBold}>Founded : 2006</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="disc" size={20} color="#333333" />
          <Text style={styles.infoText}>
            {'  '}
            <Text style={styles.infoBold}>Mission</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.mission}>
          All of today's top news stories from Jackson County Times. Get the full analysis behind
          how media bias impacts breaking news.
        </Text>

        <View style={styles.divider} />
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
    marginHorizontal: 0,
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
    gap: 20,
    marginTop: 12,
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
