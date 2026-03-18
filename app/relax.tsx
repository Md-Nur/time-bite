import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Layout
} from 'react-native-reanimated';
import { AppColors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { ChevronLeft, Wind, Moon, Sun, Sparkles, Droplets, Palette, CircleDashed } from 'lucide-react-native';
import { BannerAd } from '@/components/BannerAd';
import { useInterstitialAd } from '@/constants/useAds';
import * as Haptics from 'expo-haptics';

// Activity Components
import { BubblePop } from '../components/ZenZone/BubblePop';
import { ParticleFlow } from '../components/ZenZone/ParticleFlow';
import { Breathing } from '../components/ZenZone/Breathing';
import { RippleEffect } from '../components/ZenZone/RippleEffect';
import { ColorFill } from '../components/ZenZone/ColorFill';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - Spacing.md * 3) / 2;

type ActivityType = 'menu' | 'bubble' | 'particle' | 'breathing' | 'ripple' | 'color';

interface ActivityItem {
  id: ActivityType;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const ACTIVITIES: ActivityItem[] = [
  { id: 'bubble', title: 'Bubble Pop', icon: <Sparkles size={32} color="#4FC3F7" />, color: '#E1F5FE' },
  { id: 'particle', title: 'Particle Flow', icon: <Sparkles size={32} color="#9575CD" />, color: '#EDE7F6' },
  { id: 'breathing', title: 'Breathing', icon: <Wind size={32} color="#4DB6AC" />, color: '#E0F2F1' },
  { id: 'ripple', title: 'Wave Touch', icon: <Droplets size={32} color="#64B5F6" />, color: '#E3F2FD' },
  { id: 'color', title: 'Color Fill', icon: <Palette size={32} color="#F06292" />, color: '#FCE4EC' },
  { id: 'menu', title: 'More Coming', icon: <CircleDashed size={32} color="#BDBDBD" />, color: '#F5F5F5' },
];

export default function RelaxScreen() {
  const router = useRouter();
  const [activeActivity, setActiveActivity] = useState<ActivityType>('menu');
  const [sessionSwitches, setSessionSwitches] = useState(0);
  const { show: showInterstitial, loaded: interstitialLoaded } = useInterstitialAd();

  const handleSelectActivity = (id: ActivityType) => {
    if (id === 'menu') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Show interstitial every 2 switches
    const newCount = sessionSwitches + 1;
    setSessionSwitches(newCount);
    
    if (newCount % 2 === 0 && interstitialLoaded) {
      showInterstitial();
    }
    
    setActiveActivity(id);
  };

  const renderActivity = () => {
    switch (activeActivity) {
      case 'bubble':
        return <BubblePop onBack={() => setActiveActivity('menu')} />;
      case 'particle':
        return <ParticleFlow onBack={() => setActiveActivity('menu')} />;
      case 'breathing':
        return <Breathing onBack={() => setActiveActivity('menu')} />;
      case 'ripple':
        return <RippleEffect onBack={() => setActiveActivity('menu')} />;
      case 'color':
        return <ColorFill onBack={() => setActiveActivity('menu')} />;
      default:
        return null;
    }
  };

  if (activeActivity !== 'menu') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        {renderActivity()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Zen Zone',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingLeft: Spacing.md }}>
              <ChevronLeft color={AppColors.text} size={24} />
            </Pressable>
          ),
          headerStyle: { backgroundColor: AppColors.background },
          headerShadowVisible: false,
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Tap. Relax. Breathe.</Text>
        </View>

        <View style={styles.grid}>
          {ACTIVITIES.map((activity) => (
            <Animated.View 
              key={activity.id} 
              entering={FadeIn.delay(100)}
              layout={Layout.springify()}
            >
              <Pressable 
                onPress={() => handleSelectActivity(activity.id)}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: activity.color, transform: [{ scale: pressed ? 0.98 : 1 }] }
                ]}
              >
                {activity.icon}
                <Text style={styles.cardTitle}>{activity.title}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: AppColors.textSecondary,
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  card: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: 16,
    color: AppColors.text,
    textAlign: 'center',
  },
});
