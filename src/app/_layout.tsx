import { Feather } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Share, TouchableOpacity, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const HeaderMenu = () => (
    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => {}}>
      <Feather name="more-vertical" size={22} color="#ffffff" />
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
      <Feather name="share-2" size={22} color="#ffffff" />
    </TouchableOpacity>
  );

  const HeaderBell = () => (
    <TouchableOpacity
      style={{ paddingHorizontal: 8 }}
      onPress={() => router.push('/notifications')}>
      <Feather name="bell" size={22} color="#ffffff" />
    </TouchableOpacity>
  );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="light" />
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600', fontSize: 18 },
          headerTitleAlign: 'center',
          headerBackTitle: '',
          headerRight: () => <HeaderMenu />,
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Jackson County Times',
            headerLeft: () => <HeaderShare />,
            headerRight: () => <HeaderBell />,
          }}
        />
        <Stack.Screen name="about" options={{ title: 'About Us', headerRight: () => null }} />
        <Stack.Screen name="contact" options={{ title: 'Contact Us' , headerRight: () => null}} />
        <Stack.Screen name="digital-edition" options={{ title: 'Digital Edition' , headerRight: () => null}} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="news/index" options={{ title: 'News' ,headerBackTitle:"Back", headerRight: () => null}} />
        <Stack.Screen name="news/[id]" options={{ title: 'News' ,headerBackTitle:"Back", headerRight: () => null}} />
        <Stack.Screen name="obituaries/index" options={{ title: 'Obituaries' ,headerBackTitle:"Back", headerRight: () => null}} />
        <Stack.Screen name="obituaries/[id]" options={{ title: 'Obituary' ,headerBackTitle:"Back", headerRight: () => null}} />
        <Stack.Screen name="notifications/index" options={{ title: 'Notifications' ,headerBackTitle:"Back", headerRight: () => null}} />
        <Stack.Screen
          name="notifications/[id]"
          options={{ title: 'Notification',headerBackTitle:"Back", headerRight: () => null }}
        />
        <Stack.Screen name="directory/index" options={{ title: 'Directory', headerBackTitle: 'Back', headerRight: () => null }} />
        <Stack.Screen name="directory/[id]" options={({ route }: any) => {
            let title = 'Business';
            try { const d = JSON.parse((route.params as any)?.data ?? '{}'); if (d.name) title = d.name; } catch {}
            return { title, headerBackTitle: 'Back', headerRight: () => null };
          }} />
      </Stack>
    </ThemeProvider>
  );
}
