import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/components/useColorScheme';
import { AppColors } from '@/constants/theme';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Configure global ad request settings for content rating consistency
    mobileAds().setRequestConfiguration({
      // Set the max ad content rating to 'G' for general audience
      maxAdContentRating: MaxAdContentRating.G,
      // Tag for child-directed treatment if your app is for children
      tagForChildDirectedTreatment: true,
      // Tag for under age of consent in the EEA
      tagForUnderAgeOfConsent: true,
    });

    // Initialize Mobile Ads
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log(`Mobile Ads SDK initialized with content rating: ${MaxAdContentRating.G}`);
      })
      .catch(error => {
        console.error('Mobile Ads SDK initialization error: ', error);
      });

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ 
          animation: 'slide_from_bottom',
          headerTitleStyle: { fontWeight: '700' },
          headerTintColor: AppColors.text,
          headerBackTitle: '',
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ title: 'Action Quest' }} />
          <Stack.Screen name="puzzle" options={{ title: 'Brain Teaser' }} />
          <Stack.Screen name="memes" options={{ title: 'Laugh Lounge' }} />
          <Stack.Screen name="factbite" options={{ title: 'Curiosity Bites' }} />
          <Stack.Screen name="relax" options={{ title: 'Zen Zone' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
