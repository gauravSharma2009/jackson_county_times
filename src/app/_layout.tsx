import { Feather } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Share, TouchableOpacity, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const HeaderBackButton = () => (
    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => router.back()}>
      <Feather name="arrow-left" size={22} color="#000000" />
    </TouchableOpacity>
  );

  const HeaderShare = () => (
    <TouchableOpacity
      style={{ paddingHorizontal: 8 }}
      onPress={() => {
        Share.share({
          message:
            'Check out the Jackson County Times app! Get local news, obituaries, events and more.\nhttps://jacksoncountytimes.net/',
        }).catch(() => {});
      }}>
      <Feather name="share-2" size={22} color="#000000" />
    </TouchableOpacity>
  );

  const HeaderBell = () => (
    <TouchableOpacity
      style={{ paddingHorizontal: 8 }}
      onPress={() => router.push('/notifications')}>
      <Feather name="bell" size={22} color="#000000" />
    </TouchableOpacity>
  );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#000000',
          headerShadowVisible: true,
          headerLeft: ({ canGoBack }) => (canGoBack ? <HeaderBackButton /> : null),
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: '',
            headerLeft: () => <HeaderShare />,
            headerRight: () => <HeaderBell />,
          }}
        />
        <Stack.Screen name="about" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="contact" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="digital-edition" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="news/index" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="news/[id]" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="obituaries/index" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="obituaries/[id]" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="notifications/index" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="notifications/[id]" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="directory/index" options={{ title: '', headerRight: () => null }} />
        <Stack.Screen name="directory/[id]" options={{ title: '', headerRight: () => null }} />
      </Stack>
    </ThemeProvider>
  );
}
