import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  interpolateColor,
  FadeIn
} from 'react-native-reanimated';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { ChevronLeft, Wind, Moon } from 'lucide-react-native';

interface BreathingProps {
  onBack: () => void;
}

export function Breathing({ onBack }: BreathingProps) {
  const [phase, setPhase] = useState<'Inhale' | 'Exhale' | 'Hold'>('Inhale');
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;
    
    // Breathing cycle: 4s inhale, 4s hold, 4s exhale
    const startBreathing = () => {
      if (!isMounted) return;
      setPhase('Inhale');
      scale.value = withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.ease) });
      colorProgress.value = withTiming(1, { duration: 4000 });

      setTimeout(() => {
        if (!isMounted) return;
        setPhase('Hold');
        setTimeout(() => {
          if (!isMounted) return;
          setPhase('Exhale');
          scale.value = withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) });
          colorProgress.value = withTiming(0, { duration: 4000 });
        }, 4000);
      }, 4000);
    };

    startBreathing();
    const interval = setInterval(startBreathing, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const COLORS = [
    '#E0F7FA', // Cyan 50
    '#B2EBF2', // Cyan 100
    '#E1F5FE', // Light Blue 50
    '#B3E5FC', // Light Blue 100
    '#F3E5F5', // Purple 50
    '#E1BEE7', // Purple 100
    '#FCE4EC', // Pink 50
    '#F8BBD0', // Pink 100
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [COLORS[0], COLORS[1]] // Simple for now, or we could cycle them
    );
    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <ChevronLeft color={AppColors.text} size={28} />
        <Text style={styles.backText}>Breathing</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.headerInfo}>
          <Moon size={24} color={AppColors.primary} />
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
          <Wind size={20} color={AppColors.textSecondary} />
          <Text style={styles.instructionText}>Follow the circle's rhythm</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backText: {
    ...Typography.body,
    color: AppColors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl * 3,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerText: {
    ...Typography.h2,
    color: AppColors.textSecondary,
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
    borderColor: AppColors.primary,
    position: 'absolute',
  },
  textOverlay: {
    position: 'absolute',
  },
  phaseText: {
    ...Typography.h1,
    color: AppColors.primary,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  instructionText: {
    ...Typography.body,
    color: AppColors.textSecondary,
  },
});
