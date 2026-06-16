import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSizeModal } from '@/components/font-size-modal';
import { useArticleDisplay } from '@/hooks/use-article-display';

const stripHtml = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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

export default function NotificationDetailScreen() {
  const params = useLocalSearchParams<{ data: string }>();
  const {
    darkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    fontScale,
    fontSizeModalVisible,
    openFontSizeModal,
    closeFontSizeModal,
  } = useArticleDisplay();

  let item: any = null;
  try {
    item = params.data ? JSON.parse(params.data as string) : null;
  } catch {
    item = null;
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Notification not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const storyText = stripHtml(item.story);

  const handleShare = async () => {
    try {
      await Share.share({ title: item.heading, message: `${item.heading}\n\n${storyText}` });
    } catch {}
  };

  return (
    <SafeAreaView style={[styles.safe, darkMode && styles.safeDark]} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Meta */}
        <View style={styles.meta}>
          <Text
            style={[
              styles.heading,
              darkMode && styles.textDark,
              { fontSize: 18 * fontScale, lineHeight: 26 * fontScale },
            ]}>
            {item.heading}
          </Text>
          <Text style={[styles.metaDate, darkMode && styles.metaDark, { fontSize: 13 * fontScale }]}>
            {formatDate(item.created_at)}
          </Text>
          <Text style={[styles.metaPlace, darkMode && styles.metaDark, { fontSize: 13 * fontScale }]}>
            {item.place || 'Jackson County, Florida'}
          </Text>
        </View>

        {/* Image */}
        {!!item.news_image && (
          <View style={[styles.imageCard, darkMode && styles.imageCardDark]}>
            <Image source={{ uri: item.news_image }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {/* Body */}
        <Text
          style={[
            styles.body,
            darkMode && styles.textDark,
            { fontSize: 15 * fontScale, lineHeight: 25 * fontScale },
          ]}>
          {storyText}
        </Text>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleDarkMode}>
          <Feather name={darkMode ? 'moon' : 'sun'} size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={openFontSizeModal}>
          <Feather name="type" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Feather name="share" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <FontSizeModal
        visible={fontSizeModalVisible}
        value={fontSize}
        darkMode={darkMode}
        onSelect={setFontSize}
        onClose={closeFontSizeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeDark: {
    backgroundColor: '#1a1a1a',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  meta: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 26,
    marginBottom: 4,
  },
  metaDate: {
    fontSize: 13,
    color: '#555555',
  },
  metaPlace: {
    fontSize: 13,
    color: '#555555',
  },
  textDark: {
    color: '#f0f0f0',
  },
  metaDark: {
    color: '#aaaaaa',
  },
  imageCard: {
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageCardDark: {
    borderColor: '#333333',
  },
  image: {
    width: '100%',
    height: 200,
  },
  body: {
    fontSize: 15,
    color: '#222222',
    lineHeight: 25,
    paddingHorizontal: 16,
    letterSpacing: 0.1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  actionBtn: {
    padding: 8,
  },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#888888',
  },
});
