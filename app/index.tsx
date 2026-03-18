import { StyleSheet, View, Text, ScrollView, FlatList, Pressable, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gamepad2, Puzzle, Laugh, Sparkles, Coffee, Award } from 'lucide-react-native';
import { AppColors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/Card';
import { BannerAd } from '@/components/BannerAd';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Hello';
  };

  const activities = [
    { 
      id: '1', 
      title: 'Action Quest', 
      icon: <Gamepad2 size={32} color={AppColors.primary} />, 
      color: AppColors.cardBlue,
      onPress: () => router.push('/game')
    },
    { 
      id: '2', 
      title: 'Brain Teaser', 
      icon: <Puzzle size={32} color={AppColors.secondary} />, 
      color: AppColors.cardGreen,
      onPress: () => router.push('/puzzle')
    },
    { 
      id: '3', 
      title: 'Laugh Lounge', 
      icon: <Laugh size={32} color={AppColors.accent} />, 
      color: AppColors.cardYellow,
      onPress: () => router.push('/memes')
    },
    { 
      id: '4', 
      title: 'Curiosity Bites', 
      icon: <Sparkles size={32} color={AppColors.error} />, 
      color: AppColors.cardRed,
      onPress: () => router.push('/factbite')
    },
    { 
      id: '5', 
      title: 'Zen Zone', 
      icon: <Coffee size={32} color="#E91E63" />, 
      color: AppColors.cardPink,
      onPress: () => router.push('/relax')
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={Typography.caption}>Ready for a quick adventure?</Text>
        <Text style={Typography.h1}>{getGreeting()}, Explorer 👋</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top }]}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item, index }) => (
          <Card
            title={item.title}
            icon={item.icon}
            backgroundColor={item.color}
            onPress={item.onPress}
            delay={index * 100}
            style={[
              styles.card,
              item.id === '5' && styles.cardZen,
            ]}
          />
        )}
      />
      <BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  listContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  levelText: {
    ...Typography.caption,
    fontWeight: '700',
    marginLeft: Spacing.xs,
    color: AppColors.text,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  card: {
    flex: 1,
  },
  cardZen: {
    aspectRatio: 1.8,
  },
});
