import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS,
  FadeIn,
  FadeOut,
  Layout
} from 'react-native-reanimated';
import { AppColors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BubbleProps {
  onBack: () => void;
}

interface BubbleData {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

const COLORS = [
  '#E1F5FE', // Light Blue
  '#B3E5FC', // Sky Blue
  '#E1BEE7', // Lavender
  '#F8BBD0', // Rose
  '#C8E6C9', // Mint
  '#FFF9C4', // Lemon
  '#FFCCBC', // Peach
  '#D1C4E9', // Lilac
];

function Bubble({ data, onPop }: { data: BubbleData; onPop: (id: string) => void }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1);
  }, []);

  const handlePop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withTiming(1.4, { duration: 100 });
    opacity.value = withTiming(0, { duration: 100 }, () => {
      runOnJS(onPop)(data.id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    left: data.x - data.size / 2,
    top: data.y - data.size / 2,
    width: data.size,
    height: data.size,
    borderRadius: data.size / 2,
    backgroundColor: data.color,
  }));

  return (
    <TouchableWithoutFeedback onPress={handlePop}>
      <Animated.View style={[styles.bubble, animatedStyle]} />
    </TouchableWithoutFeedback>
  );
}

export function BubblePop({ onBack }: BubbleProps) {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  const spawnBubble = useCallback(() => {
    const size = Math.random() * 40 + 60;
    const newBubble: BubbleData = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (SCREEN_WIDTH - 100) + 50,
      y: Math.random() * (SCREEN_HEIGHT - 200) + 100,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.length < 15) {
        spawnBubble();
      }
    }, 800);
    return () => clearInterval(interval);
  }, [bubbles.length, spawnBubble]);

  const removeBubble = (id: string) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <ChevronLeft color={AppColors.text} size={28} />
        <Text style={styles.backText}>Bubble Pop</Text>
      </Pressable>

      <View style={styles.content}>
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} data={bubble} onPop={removeBubble} />
        ))}
      </View>

      <View style={styles.hintContainer} pointerEvents="none">
        <Text style={styles.hintText}>Tap to pop</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
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
  },
  bubble: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    ...Typography.body,
    color: '#0288D1',
    opacity: 0.6,
  },
});
