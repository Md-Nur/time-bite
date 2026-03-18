import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
} from 'react-native-reanimated';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLORS = [
  '#64B5F6', // Blue
  '#81C784', // Green
  '#FF8A65', // Orange
  '#F06292', // Pink
  '#BA68C8', // Amethyst
  '#4DB6AC', // Teal
];

interface RippleProps {
  onBack: () => void;
}

interface RippleData {
  id: string;
  x: number;
  y: number;
  color: string;
}

function Ripple({ data, onFinish }: { data: RippleData; onFinish: (id: string) => void }) {
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0.6);

  React.useEffect(() => {
    scale.value = withTiming(4, { duration: 1500 });
    opacity.value = withTiming(0, { duration: 1500 }, () => {
      runOnJS(onFinish)(data.id);
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    left: data.x - 50,
    top: data.y - 50,
    backgroundColor: data.color,
  }));

  return <Animated.View pointerEvents="none" style={[styles.ripple, animatedStyle]} />;
}

export function RippleEffect({ onBack }: RippleProps) {
  const [ripples, setRipples] = useState<RippleData[]>([]);

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newRipple: RippleData = {
      id: Math.random().toString(36).substr(2, 9),
      x: locationX,
      y: locationY,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    
    setRipples(prev => [...prev, newRipple]);
  };

  const removeRipple = (id: string) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <ChevronLeft color={AppColors.text} size={28} />
        <Text style={styles.backText}>Wave Touch</Text>
      </Pressable>

      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.touchArea}>
          {ripples.map((ripple) => (
            <Ripple key={ripple.id} data={ripple} onFinish={removeRipple} />
          ))}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.hintContainer} pointerEvents="none">
        <Text style={styles.hintText}>Tap anywhere for ripples</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
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
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
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
    color: '#1976D2',
    opacity: 0.6,
  },
});
