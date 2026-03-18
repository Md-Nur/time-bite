import React from 'react';
import { StyleSheet, View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  withDelay 
} from 'react-native-reanimated';
import { AppColors, BorderRadius, Spacing, Typography } from '../constants/theme';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({ 
  title, 
  icon, 
  onPress, 
  style, 
  backgroundColor = AppColors.surface,
  delay = 0 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 100 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
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

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl, // Larger border radius for Google style
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  iconContainer: {
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: AppColors.text,
  },
});
