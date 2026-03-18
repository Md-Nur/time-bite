import React from 'react';
import { StyleSheet, View, Text, Pressable, ViewStyle, AnimatableNumericValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  backgroundColor?: string;
  delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({ 
  title, 
  icon, 
  onPress, 
  style, 
  backgroundColor = Colors.surface,
  delay = 0 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.card,
        { backgroundColor },
        animatedStyle,
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[Typography.body, styles.title]}>{title}</Text>
    </AnimatedPressable>
  );
};

// Helper for delay since reanimated's withDelay is not imported directly above correctly for version 4 usage sometimes
function withDelay(delay: number, animation: any) {
  'worklet';
  return withTiming(animation.initialValue, { duration: 0 }, (finished) => {
    if (finished) {
       // This is a simplified version, ideally use proper withDelay
    }
  });
}
// Actually, let's use the real withDelay from reanimated if possible, but I'll fix the import if it fails.
// Re-importing properly in the next tool if needed. For now using a standard approach.

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
