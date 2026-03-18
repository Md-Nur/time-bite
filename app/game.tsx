import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Vibration, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withSpring 
} from 'react-native-reanimated';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { ChevronLeft, Timer, Play, Pause, RotateCcw, Award } from 'lucide-react-native';
import { BannerAd } from '@/components/BannerAd';

const TAP_COLORS = [Colors.primary, Colors.secondary, Colors.accent, Colors.error, '#9C27B0', '#00BCD4'];

export default function GameScreen() {
  const router = useRouter();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'result'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [tapColor, setTapColor] = useState(TAP_COLORS[0]);

  const scale = useSharedValue(1);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTapColor(TAP_COLORS[Math.floor(Math.random() * TAP_COLORS.length)]);
    setGameState('playing');
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const handleGameOver = () => {
    setGameState('result');
    if (score > highScore) setHighScore(score);
    const newRounds = roundsPlayed + 1;
    setRoundsPlayed(newRounds);
    
    // Interstitial Ad Trigger every 3 rounds
    if (newRounds % 3 === 0) {
      setTimeout(() => {
        Alert.alert('Interstitial Ad', 'Pretend a full-screen banner is playing right now!', [
          { text: 'Close Ad' }
        ]);
      }, 500); // Small delay to let result screen render
    }
  };

  const handleTap = () => {
    if (gameState !== 'playing') return;
    
    setScore((prev) => prev + 1);
    
    // Visual feedback
    scale.value = withSequence(withSpring(0.85, { duration: 50 }), withSpring(1, { damping: 12, stiffness: 200 }));
    
    // Change color on tap
    const nextColors = TAP_COLORS.filter(c => c !== tapColor);
    setTapColor(nextColors[Math.floor(Math.random() * nextColors.length)]);
    
    Vibration.vibrate(40);
  };

  const animatedTargetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'TapRush',
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
        
        {/* TOP BAR / HEADER (Score, Timer, Pause) */}
        {gameState !== 'start' && (
          <View style={styles.headerBar}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
            
            <View style={styles.timerContainer}>
              <Timer size={24} color={timeLeft <= 5 ? Colors.error : Colors.primary} />
              <Text style={[styles.timerValue, timeLeft <= 5 && { color: Colors.error }]}>
                {timeLeft}s
              </Text>
            </View>

            {gameState === 'playing' ? (
              <Pressable onPress={pauseGame} style={styles.iconButton}>
                <Pause size={24} color={Colors.text} />
              </Pressable>
            ) : gameState === 'paused' ? (
              <Pressable onPress={resumeGame} style={styles.iconButton}>
                <Play size={24} color={Colors.text} />
              </Pressable>
            ) : (
              <View style={styles.iconSpacer} />
            )}
          </View>
        )}

        {/* START SCREEN */}
        {gameState === 'start' && (
          <View style={styles.centerSection}>
            <Text style={styles.gameTitle}>TapRush</Text>
            <Text style={styles.gameSubtitle}>Tap as fast as you can before time runs out!</Text>
            <Pressable style={styles.primaryButton} onPress={startGame}>
              <Text style={styles.primaryButtonText}>Start Game</Text>
            </Pressable>
            <View style={styles.highScoreBox}>
              <Award size={20} color={Colors.accent} />
              <Text style={styles.highScoreText}>High Score: {highScore}</Text>
            </View>
          </View>
        )}

        {/* PLAYING / PAUSED SCREEN */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <View style={styles.playArea}>
            <Pressable 
              onPress={handleTap} 
              style={styles.tapContainer}
              disabled={gameState === 'paused'}
            >
              <Animated.View style={[
                  styles.tapTarget, 
                  animatedTargetStyle, 
                  { backgroundColor: tapColor },
                  gameState === 'paused' && { opacity: 0.5 }
                ]}
              >
                <Text style={styles.tapText}>TAP!</Text>
              </Animated.View>
            </Pressable>
            {gameState === 'paused' && (
              <View style={styles.pausedOverlay}>
                <Text style={styles.pausedText}>PAUSED</Text>
              </View>
            )}
          </View>
        )}

        {/* RESULT SCREEN */}
        {gameState === 'result' && (
          <View style={styles.centerSection}>
            <Text style={styles.gameOverText}>Time's Up!</Text>
            <View style={styles.finalScoreBox}>
              <Text style={styles.finalScoreLabel}>Final Score</Text>
              <Text style={styles.finalScoreValue}>{score}</Text>
            </View>
            
            <View style={styles.highScoreBoxSmall}>
              <Award size={16} color={Colors.accent} />
              <Text style={styles.highScoreTextSmall}>Best: {highScore}</Text>
            </View>

            <Pressable style={styles.primaryButton} onPress={startGame}>
              <RotateCcw size={20} color={Colors.surface} style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Play Again</Text>
            </Pressable>
          </View>
        )}

      </View>
      
      {/* BANNER AD PLACEHOLDER */}
      <BannerAd />
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
    padding: Spacing.lg,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    ...Typography.h1,
    fontSize: 48,
    color: Colors.primary,
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  gameSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  scoreValue: {
    ...Typography.h2,
    color: Colors.text,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBlue,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  timerValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  iconButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.cardPurple,
    borderRadius: BorderRadius.full,
  },
  iconSpacer: {
    width: 44, // rough width of iconButton
  },
  playArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapContainer: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 350,
  },
  tapTarget: {
    flex: 1,
    borderRadius: 200, // Make it very round
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tapText: {
    ...Typography.h1,
    fontSize: 42,
    color: Colors.surface,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pausedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 200,
    margin: Spacing.lg,
  },
  pausedText: {
    ...Typography.h1,
    color: Colors.text,
    letterSpacing: 4,
  },
  gameOverText: {
    ...Typography.h1,
    fontSize: 40,
    color: Colors.error,
    marginBottom: Spacing.xl,
  },
  finalScoreBox: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    width: '100%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: Spacing.lg,
  },
  finalScoreLabel: {
    ...Typography.h2,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  finalScoreValue: {
    ...Typography.h1,
    fontSize: 64,
    color: Colors.primary,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    ...Typography.h2,
    color: Colors.surface,
  },
  highScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    backgroundColor: Colors.cardYellow,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  highScoreText: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.text,
  },
  highScoreBoxSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  highScoreTextSmall: {
    ...Typography.caption,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
});
