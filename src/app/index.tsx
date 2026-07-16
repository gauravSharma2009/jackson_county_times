import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../constants/api';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Banner = {
  id: string;
  title: string;
  image: string;
};

type GridItem = {
  id: string;
  label: string;
  image: ImageSourcePropType;
  route: string | null;
};

type RibbonItem = {
  id: string;
  text: string;
  website_url: string | null;
};

function TickerRibbon({ items }: { items: RibbonItem[] }) {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [singleWidth, setSingleWidth] = useState(0);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (singleWidth === 0) return;

    const animate = (initial: boolean) => {
      translateX.setValue(initial ? SCREEN_WIDTH : 0);
      animRef.current = Animated.timing(translateX, {
        toValue: -singleWidth,
        duration: (initial ? singleWidth + SCREEN_WIDTH : singleWidth) * 28,
        easing: Easing.linear,
        useNativeDriver: true,
      });
      animRef.current.start(({ finished }) => {
        if (finished) animate(false);
      });
    };

    animate(true);
    return () => animRef.current?.stop();
  }, [singleWidth]);

  if (items.length === 0) return null;

  const renderItems = (keyPrefix: string) =>
    items.map((item, idx) => (
      <View key={`${keyPrefix}-${item.id}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
        {idx > 0 && <View style={ribbonStyles.bullet} />}
        <TouchableOpacity
          onPress={() => item.website_url && Linking.openURL(item.website_url)}
          activeOpacity={0.7}>
          <Text style={ribbonStyles.text}>{item.text}</Text>
        </TouchableOpacity>
      </View>
    ));

  return (
    <View style={ribbonStyles.container}>
      <View style={ribbonStyles.overflow}>
        <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
          {/* measure only the single set */}
          <View style={{ flexDirection: 'row' }} onLayout={(e) => setSingleWidth(e.nativeEvent.layout.width)}>
            {renderItems('a')}
          </View>
          {/* duplicate for seamless loop */}
          <View style={{ flexDirection: 'row' }}>
            {renderItems('b')}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const ribbonStyles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    paddingVertical: 32,
  },
  overflow: {
    overflow: 'hidden',
  },
  text: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
    paddingHorizontal: 12,
    letterSpacing: 0.2,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#444444',
  },
});

const GRID: GridItem[] = [
  { id: 'about', label: 'About Us', image: require('../../assets/images/about_us.png'), route: '/about' },
  { id: 'directory', label: 'Directory', image: require('../../assets/images/directory.png'), route: '/directory' },
  { id: 'obituaries', label: 'Obituaries', image: require('../../assets/images/obitauries.png'), route: '/obituaries' },
  { id: 'contact', label: 'Contact Us', image: require('../../assets/images/contact_us.png'), route: '/contact' },
  { id: 'news', label: 'News', image: require('../../assets/images/news.png'), route: '/news' },
  { id: 'edition', label: 'JCT E Edition', image: require('../../assets/images/JCT_Icon.png'), route: '/digital-edition' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [ribbons, setRibbons] = useState<RibbonItem[]>([]);
  const cardWidth = SCREEN_WIDTH - 32;
  const sliderRef = useRef<ScrollView>(null);
  const currentSlideRef = useRef(0);

  useEffect(() => {
    fetch(`${BASE_URL}/banners/active`, { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => res.json())
      .then((json) => { if (json.success) setBanners(json.data); })
      .catch(() => {});

    fetch(`${BASE_URL}/form-bottom-ribbon?page=1&limit=50`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setRibbons(json.data.filter((r: any) => r.status === 1)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      const next = (currentSlideRef.current + 1) % banners.length;
      sliderRef.current?.scrollTo({ x: next * cardWidth, animated: true });
      currentSlideRef.current = next;
      setCurrentSlide(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, cardWidth]);

  const handleScroll = (event: any) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    const clamped = Math.max(0, Math.min(idx, banners.length - 1));
    currentSlideRef.current = clamped;
    setCurrentSlide(clamped);
  };

  const handlePress = (item: GridItem) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const rows = [GRID.slice(0, 3), GRID.slice(3, 6)];
  const itemSize = Math.floor((SCREEN_WIDTH - 32) / 3);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, ribbons.length > 0 && { paddingBottom: 48 }]}
        showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <Image
          source={require('../../assets/images/jct_logo.png')}
          style={[styles.logoImage, { width: cardWidth }]}
          resizeMode="contain"
        />

        {/* Ad Banner Slider */}
        <View style={styles.sliderCard}>
          <ScrollView
            ref={sliderRef}
            horizontal
            snapToInterval={cardWidth}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ width: cardWidth }}>
            {banners.length > 0 ? (
              banners.map((banner) => (
                <View key={banner.id} style={[styles.slide, { width: cardWidth }]}>
                  <Image
                    source={{ uri: `${BASE_URL}/images${banner.image}` }}
                    style={styles.slideImage}
                    resizeMode="cover"
                  />
                </View>
              ))
            ) : (
              <View style={[styles.slide, { width: cardWidth, backgroundColor: '#f1f1f1' }]}>
                <Feather name="image" size={48} color="#cccccc" />
              </View>
            )}
          </ScrollView>
          {banners.length > 1 && (
            <View style={styles.dotsRow}>
              {banners.map((_, i) => (
                <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
              ))}
            </View>
          )}
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
                  <Image source={item.image} style={styles.gridIcon} resizeMode="contain" />
                  <Text style={styles.gridLabel} numberOfLines={2}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Footer Logo */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerSmall}>Jackson County</Text>
          <Text style={styles.footerLarge}>TIMES</Text>
        </View> */}
      </ScrollView>

      {ribbons.length > 0 && (
        <View style={styles.ribbonWrap}>
          <TickerRibbon items={ribbons} />
        </View>
      )}
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
    paddingBottom: 24,
  },
  logoImage: {
    height: 140,
    alignSelf: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  sliderCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    overflow: 'hidden',
  },
  slide: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: 180,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
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
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  gridIcon: {
    width: 40,
    height: 40,
  },
  gridLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333333',
    lineHeight: 14,
  },
  ribbonWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
