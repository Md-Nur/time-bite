import React from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  Extrapolation,
  FadeIn,
  SharedValue
} from 'react-native-reanimated';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { ChevronLeft } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 15;
const COLORS = [
  '#9575CD', // Purple
  '#64B5F6', // Blue
  '#4DB6AC', // Teal
  '#81C784', // Green
  '#FF8A65', // Orange
  '#F06292', // Pink
  '#BA68C8', // Amethyst
];

interface ParticleFlowProps {
  onBack: () => void;
}

function Particle({ index, touchX, touchY }: { index: number, touchX: SharedValue<number>, touchY: SharedValue<number> }) {
  const x = useSharedValue(SCREEN_WIDTH / 2);
  const y = useSharedValue(SCREEN_HEIGHT / 2);
  const color = React.useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], []);

  const config = {
    damping: 15 + index,
    stiffness: 80 - index * 2,
    mass: 1 + index * 0.1,
  };

  const animatedStyle = useAnimatedStyle(() => {
    x.value = withSpring(touchX.value, config);
    y.value = withSpring(touchY.value, config);

    const size = interpolate(index, [0, PARTICLE_COUNT], [10, 3], Extrapolation.CLAMP);
    const opacity = interpolate(index, [0, PARTICLE_COUNT], [0.7, 0.1], Extrapolation.CLAMP);

    return {
      transform: [
        { translateX: x.value - size / 2 },
        { translateY: y.value - size / 2 },
      ],
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: opacity,
      backgroundColor: color,
    };
  });

  return <Animated.View style={[styles.particle, animatedStyle]} />;
}

export function ParticleFlow({ onBack }: ParticleFlowProps) {
  const touchX = useSharedValue(SCREEN_WIDTH / 2);
  const touchY = useSharedValue(SCREEN_HEIGHT / 2);
  const isActive = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onStart((event) => {
      touchX.value = event.x;
      touchY.value = event.y;
      isActive.value = true;
    })
    .onUpdate((event) => {
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onEnd(() => {
      isActive.value = false;
    });

  const hintStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isActive.value ? 0 : 0.6),
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ChevronLeft color={AppColors.text} size={28} />
          <Text style={styles.backText}>Particle Flow</Text>
        </Pressable>

        <GestureDetector gesture={gesture}>
          <Animated.View style={styles.content}>
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
              <Particle key={i} index={i} touchX={touchX} touchY={touchY} />
            ))}
            
            <Animated.View style={[styles.hintContainer, hintStyle]} pointerEvents="none">
              <Text style={styles.hintText}>Follow your finger</Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6',
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
  particle: {
    position: 'absolute',
    shadowColor: '#9575CD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    ...Typography.body,
    color: '#673AB7',
  },
});
