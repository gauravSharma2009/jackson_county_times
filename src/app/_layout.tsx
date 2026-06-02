import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const HeaderMenu = () => (
    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => {}}>
      <Feather name="more-vertical" size={22} color="#ffffff" />
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
          headerRight: () => <HeaderMenu />,
        }}>
        <Stack.Screen name="index" options={{ title: 'Jackson County Times' }} />
        <Stack.Screen name="about" options={{ title: 'About Us' }} />
        <Stack.Screen name="contact" options={{ title: 'Contact Us' }} />
        <Stack.Screen name="digital-edition" options={{ title: 'Digital Edition' }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="news/index" options={{ title: 'News' }} />
        <Stack.Screen name="news/[id]" options={{ title: 'News' }} />
        <Stack.Screen name="obituaries/index" options={{ title: 'Obituaries' }} />
        <Stack.Screen name="obituaries/[id]" options={{ title: 'Obituary' }} />
      </Stack>
    </ThemeProvider>
  );
}
