import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SLIDES = [
  { id: '1', bg: '#f0f8ff' },
  { id: '2', bg: '#f0fff4' },
  { id: '3', bg: '#fffaf0' },
  { id: '4', bg: '#fdf0ff' },
  { id: '5', bg: '#fff0f0' },
];

type GridItem = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  route: string | 'share' | null;
};

const GRID: GridItem[] = [
  { id: 'about', label: 'About Us', icon: 'briefcase', route: '/about' },
  { id: 'home', label: 'Home', icon: 'home', route: null },
  { id: 'share', label: 'Tell a Friend', icon: 'share-2', route: 'share' },
  { id: 'directory', label: 'Directory', icon: 'folder', route: null },
  { id: 'obituaries', label: 'Obituaries', icon: 'book-open', route: '/obituaries' },
  { id: 'breaking', label: 'Breaking N...', icon: 'bell', route: '/news' },
  { id: 'contact', label: 'Contact Us', icon: 'user', route: '/contact' },
  { id: 'news', label: 'News', icon: 'file-text', route: '/news' },
  { id: 'edition', label: 'JCT E Edition', icon: 'globe', route: '/digital-edition' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardWidth = SCREEN_WIDTH - 32;

  const handleScroll = (event: any) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    setCurrentSlide(Math.max(0, Math.min(idx, SLIDES.length - 1)));
  };

  const handlePress = async (item: GridItem) => {
    if (item.route === 'share') {
      try {
        await Share.share({
          message:
            'Check out the Jackson County Times app! Get local news, obituaries, events and more.\nhttps://jacksoncountytimes.net/',
        });
      } catch {}
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const rows = [GRID.slice(0, 3), GRID.slice(3, 6), GRID.slice(6, 9)];
  const itemSize = Math.floor((SCREEN_WIDTH - 32 - 16) / 3);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Ad Banner Slider */}
        <View style={styles.sliderCard}>
          <ScrollView
            horizontal
            snapToInterval={cardWidth}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ width: cardWidth }}>
            {SLIDES.map((slide, index) => (
              <View key={slide.id} style={[styles.slide, { width: cardWidth, backgroundColor: slide.bg }]}>
                <Feather name="image" size={48} color="#cccccc" />
                <Text style={styles.slideLabel}>Advertisement {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Navigation Grid */}
        <View style={styles.grid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.gridRow}>
              {row.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.gridItem, { width: itemSize, height: itemSize }]}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}>
                  <Feather name={item.icon} size={34} color="#333333" />
                  <Text style={styles.gridLabel} numberOfLines={2}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
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
    paddingBottom: 24,
  },
  sliderCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  slide: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  slideLabel: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#ffffff',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cccccc',
  },
  dotActive: {
    backgroundColor: '#555555',
  },
  grid: {
    paddingHorizontal: 8,
    gap: 8,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gridItem: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  gridLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333333',
    lineHeight: 14,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 28,
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
