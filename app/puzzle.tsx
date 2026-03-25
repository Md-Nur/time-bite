import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
  if (!AsyncStorage) throw new Error('AsyncStorage is null');
} catch (e) {
  console.warn('AsyncStorage is not available. Falling back to in-memory storage.');
  const memoryStorage = new Map<string, string>();
  AsyncStorage = {
    getItem: async (key: string) => memoryStorage.get(key) || null,
    setItem: async (key: string, value: string) => { memoryStorage.set(key, value); },
    removeItem: async (key: string) => { memoryStorage.delete(key); },
    clear: async () => { memoryStorage.clear(); },
  };
}

import { AppColors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { ChevronLeft, Brain, CheckCircle, XCircle, Flame, Award, Lightbulb, Play } from 'lucide-react-native';
import { getDailyPuzzle, getRandomPuzzle, Puzzle } from '@/constants/puzzles';
import { BannerAd } from '@/components/BannerAd';
import { useInterstitialAd, useRewardedAd, useRewardedInterstitialAd } from '@/constants/useAds';

export default function PuzzleScreen() {
  const router = useRouter();
  const { show: showInterstitial, loaded: interstitialLoaded } = useInterstitialAd();
  const { show: showRewarded, loaded: rewardedLoaded, rewardEarned: hintEarned } = useRewardedAd();
  const { show: showBonusAd, loaded: bonusAdLoaded, rewardEarned: bonusEarned } = useRewardedInterstitialAd();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // State from AsyncStorage
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedStreak = await AsyncStorage.getItem('bb_streak');
      const storedScore = await AsyncStorage.getItem('bb_score');
      const storedLastPlayed = await AsyncStorage.getItem('bb_last_played');
      
      let currentStreak = storedStreak ? parseInt(storedStreak, 10) : 0;
      let currentScore = storedScore ? parseInt(storedScore, 10) : 0;
      
      const todayStr = new Date().toDateString();
      let completed = false;

      if (storedLastPlayed) {
        if (storedLastPlayed === todayStr) {
          completed = true;
        } else {
          // Check if yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (storedLastPlayed !== yesterday.toDateString()) {
            currentStreak = 0; // Missed a day
          }
        }
      }

      setStreak(currentStreak);
      setScore(currentScore);
      setIsCompletedToday(completed);

      setPuzzle(getDailyPuzzle());
      
    } catch (e) {
      console.error("Failed to load user data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newStreak: number, newScore: number, markCompleted: boolean) => {
    try {
      await AsyncStorage.setItem('bb_streak', newStreak.toString());
      await AsyncStorage.setItem('bb_score', newScore.toString());
      if (markCompleted) {
        await AsyncStorage.setItem('bb_last_played', new Date().toDateString());
      }
    } catch (e) {
      console.error("Failed to save user data", e);
    }
  };

  const handleOptionPress = (index: number) => {
    if (showResult || !puzzle) return;
    
    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = puzzle.correctIndex === index;
    
    let newStreak = streak;
    let newScore = score;
    let markCompleted = false;

    // If this is the daily puzzle, increase streak
    if (!isCompletedToday) {
      newStreak += 1;
      markCompleted = true;
      setIsCompletedToday(true);
      if (isCorrect) {
        newScore += 10;
      }
      // Reached milestone?
      if (newStreak === 3) {
        setTimeout(() => Alert.alert("🔥 3 Day Streak!", "You unlocked a bonus puzzle!"), 1500);
      } else if (newStreak === 7) {
        setTimeout(() => Alert.alert("🏆 7 Day Streak!", "You earned a Reward Badge!"), 1500);
      }
    } else {
      // Bonus puzzle logic
      if (isCorrect) {
        newScore += 5; 
      }
    }

    setStreak(newStreak);
    setScore(newScore);
    saveData(newStreak, newScore, markCompleted);

    // Show Interstitial Ad every 4 solves
    const newSolved = puzzlesSolved + 1;
    setPuzzlesSolved(newSolved);
    
    if (newSolved % 4 === 0 && interstitialLoaded) {
      setTimeout(() => {
        showInterstitial();
      }, 600);
    }
  };

  const handleGetHint = () => {
    if (!rewardedLoaded) {
      Alert.alert('Ad not ready', 'Please wait a moment and try again.');
      return;
    }
    Alert.alert(
      'Watch Ad for Hint?',
      'Watch a short video to reveal the explanation!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Watch', 
          onPress: () => {
            showRewarded();
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (hintEarned && puzzle) {
      Alert.alert("Hint", puzzle.explanation);
    }
  }, [hintEarned, puzzle]);

  const loadBonusPuzzle = () => {
    if (!bonusAdLoaded) {
      Alert.alert('Ad not ready', 'Please wait a moment and try again.');
      return;
    }
    Alert.alert(
      'Unlock Bonus Puzzle?',
      'Watch a short video to play another puzzle!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Watch Ad', 
          onPress: () => {
            showBonusAd();
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (bonusEarned && puzzle) {
      setPuzzle(getRandomPuzzle(puzzle.id));
      setSelectedOption(null);
      setShowResult(false);
    }
  }, [bonusEarned, puzzle]);

  if (isLoading || !puzzle) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Brain Teaser',
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

      <View style={styles.statsBar}>
        <View style={styles.statBadge}>
          <Flame size={20} color={AppColors.error} />
          <Text style={styles.statText}>{streak} Streak</Text>
        </View>
        <View style={styles.statBadge}>
          <Award size={20} color={'#FFA000'} />
          <Text style={styles.statText}>{score} Pts</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerInfo}>
          <Brain size={24} color={AppColors.secondary} />
          <Text style={styles.headerText}>
             {isCompletedToday && showResult 
               ? "Great job today! Play a bonus puzzle?" 
               : "Brain Workout of the Day!"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.questionText}>{puzzle.question}</Text>
          
          <View style={styles.optionsContainer}>
            {puzzle.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = puzzle.correctIndex === index;
              
              let bgColor = AppColors.surface;
              let borderColor = AppColors.border;

              if (showResult) {
                if (isCorrect) {
                  bgColor = AppColors.cardGreen;
                  borderColor = AppColors.secondary;
                } else if (isSelected && !isCorrect) {
                  bgColor = AppColors.cardRed;
                  borderColor = AppColors.error;
                }
              } else if (isSelected) {
                bgColor = AppColors.cardBlue;
                borderColor = AppColors.primary;
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => handleOptionPress(index)}
                  disabled={showResult}
                  style={[
                    styles.optionButton,
                    { backgroundColor: bgColor, borderColor: borderColor }
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    showResult && isCorrect && { color: AppColors.secondary, fontWeight: '700' }
                  ]}>
                    {option}
                  </Text>
                  {showResult && isCorrect && <CheckCircle size={20} color={AppColors.secondary} />}
                  {showResult && isSelected && !isCorrect && <XCircle size={20} color={AppColors.error} />}
                </Pressable>
              );
            })}
          </View>

          {!showResult && (
            <Pressable style={styles.hintButton} onPress={handleGetHint}>
              <Lightbulb size={18} color={AppColors.accent} />
              <Text style={styles.hintButtonText}>Get Hint (Ad)</Text>
            </Pressable>
          )}

          {showResult && (
            <Animated.View style={styles.resultContainer}>
              <View style={styles.factBox}>
                <Text style={styles.factTitle}>Explanation</Text>
                <Text style={styles.factText}>{puzzle.explanation}</Text>
              </View>
              
              {isCompletedToday && (
                <Pressable onPress={loadBonusPuzzle} style={styles.bonusButton}>
                  <Play size={20} color={AppColors.surface} style={{ marginRight: 8 }} />
                  <Text style={styles.bonusButtonText}>Unlock Bonus Puzzle (Ad)</Text>
                </Pressable>
              )}
            </Animated.View>
          )}
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
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    ...Typography.body,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardGreen,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  headerText: {
    ...Typography.caption,
    color: AppColors.secondary,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  questionText: {
    ...Typography.h2,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  optionText: {
    ...Typography.body,
    fontSize: 18,
    flex: 1,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  hintButtonText: {
    ...Typography.caption,
    color: AppColors.accent,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: Spacing.xl,
  },
  factBox: {
    backgroundColor: AppColors.cardYellow,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  factTitle: {
    ...Typography.caption,
    fontWeight: '700',
    color: AppColors.accent,
    marginBottom: Spacing.xs,
  },
  factText: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 22,
  },
  bonusButton: {
    flexDirection: 'row',
    backgroundColor: AppColors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bonusButtonText: {
    ...Typography.body,
    color: AppColors.surface,
    fontWeight: '600',
  },
});
