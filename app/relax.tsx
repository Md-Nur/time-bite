import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { ChevronLeft, Wind, Moon, Sun } from 'lucide-react-native';

export default function RelaxScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<'Inhale' | 'Exhale' | 'Hold'>('Inhale');
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    // Breathing cycle: 4s inhale, 4s hold, 4s exhale
    const startBreathing = () => {
      setPhase('Inhale');
      scale.value = withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.ease) });
      colorProgress.value = withTiming(1, { duration: 4000 });

      setTimeout(() => {
        setPhase('Hold');
        setTimeout(() => {
          setPhase('Exhale');
          scale.value = withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) });
          colorProgress.value = withTiming(0, { duration: 4000 });
        }, 4000);
      }, 4000);
    };

    startBreathing();
    const interval = setInterval(startBreathing, 12000);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#E0F7FA', '#B2EBF2']
    );
    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Relax Mode',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingLeft: Spacing.md }}>
              <ChevronLeft color={Colors.text} size={24} />
            </Pressable>
          ),
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }} 
      />

      <View style={styles.content}>
        <View style={styles.headerInfo}>
          <Moon size={24} color={Colors.primary} />
          <Text style={styles.headerText}>Take a moment to breathe.</Text>
        </View>

        <View style={styles.breathingContainer}>
          <Animated.View style={[styles.circle, animatedStyle]} />
          <Animated.View style={[styles.outerCircle, { opacity: 0.3 }]} />
          <View style={styles.textOverlay}>
            <Text style={styles.phaseText}>{phase}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Wind size={20} color={Colors.textSecondary} />
          <Text style={styles.instructionText}>Follow the circle's rhythm</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl * 2,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerText: {
    ...Typography.h2,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  breathingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    position: 'absolute',
  },
  outerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: Colors.primary,
    position: 'absolute',
  },
  textOverlay: {
    position: 'absolute',
  },
  phaseText: {
    ...Typography.h1,
    color: Colors.primary,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  instructionText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
