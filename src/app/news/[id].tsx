import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function NewsDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ data: string }>();

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
          <Text style={styles.errorText}>Story not found.</Text>
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Meta */}
        <View style={styles.meta}>
          <Text style={styles.heading}>{item.heading}</Text>
          <Text style={styles.metaDate}>{formatDate(item.created_at)}</Text>
          <Text style={styles.metaPlace}>{item.place || 'Jackson County, Florida'}</Text>
        </View>

        {/* Image */}
        <View style={styles.imageCard}>
          {item.news_image ? (
            <Image source={{ uri: item.news_image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={48} color="#cccccc" />
            </View>
          )}
        </View>

        {/* Body */}
        <Text style={styles.body}>{storyText}</Text>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="sun" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="type" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="message-circle" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Feather name="share" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="bookmark" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
  imageCard: {
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
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
