import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableWithoutFeedback } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor,
} from 'react-native-reanimated';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const COLORS = [
  '#FCE4EC', // Pink
  '#F3E5F5', // Purple
  '#E8EAF6', // Indigo
  '#E3F2FD', // Blue
  '#E0F2F1', // Teal
  '#E8F5E9', // Green
  '#FFFDE7', // Yellow
  '#FFF3E0', // Orange
  '#F1F8E9', // Light Green
  '#E1BEE7', // Lavender
  '#FFCCBC', // Peach
  '#B3E5FC', // Sky Blue
  '#D1C4E9', // Lilac
  '#F8BBD0', // Rose
  '#E0F7FA', // Cyan
  '#F9FBE7', // Lime
];

interface ColorFillProps {
  onBack: () => void;
}

export function ColorFill({ onBack }: ColorFillProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const colorProgress = useSharedValue(0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIndex = (colorIndex + 1) % COLORS.length;
    setColorIndex(nextIndex);
    colorProgress.value = withTiming(nextIndex, { duration: 600 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      COLORS.map((_, i) => i),
      COLORS
    );
    return { backgroundColor };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, animatedStyle]} />
      
      <Pressable onPress={onBack} style={styles.backButton}>
        <ChevronLeft color={AppColors.text} size={28} />
        <Text style={styles.backText}>Color Fill</Text>
      </Pressable>

      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.touchArea}>
          <View style={styles.hintContainer} pointerEvents="none">
            <Text style={styles.hintText}>Tap to change color</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
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
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintContainer: {
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    ...Typography.body,
    color: AppColors.text,
    opacity: 0.4,
  },
});
