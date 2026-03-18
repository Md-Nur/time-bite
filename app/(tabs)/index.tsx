import { StyleSheet, View, Text, ScrollView, FlatList, Pressable, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gamepad2, Puzzle, Laugh, Sparkles, Coffee, Award } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/Card';

export default function TabOneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const activities = [
    { 
      id: '1', 
      title: 'Play Game', 
      icon: <Gamepad2 size={32} color={Colors.primary} />, 
      color: Colors.cardBlue,
      onPress: () => router.push('/game')
    },
    { 
      id: '2', 
      title: 'Daily Puzzle', 
      icon: <Puzzle size={32} color={Colors.secondary} />, 
      color: Colors.cardGreen,
      onPress: () => router.push('/puzzle')
    },
    { 
      id: '3', 
      title: 'Memes', 
      icon: <Laugh size={32} color={Colors.accent} />, 
      color: Colors.cardYellow,
      onPress: () => router.push('/memes')
    },
    { 
      id: '4', 
      title: 'FactBite', 
      icon: <Sparkles size={32} color={Colors.error} />, 
      color: Colors.cardRed,
      onPress: () => router.push('/facts')
    },
    { 
      id: '5', 
      title: 'Relax Mode', 
      icon: <Coffee size={32} color="#E91E63" />, 
      color: Colors.cardPink,
      onPress: () => router.push('/relax')
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={Typography.caption}>Pick a Bite of Fun,</Text>
        <Text style={Typography.h1}>Guest User 👋</Text>
      </View>
      <View style={styles.levelBadge}>
        <Award size={16} color={Colors.accent} />
        <Text style={styles.levelText}>Lv. 5</Text>
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
            style={styles.card}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelText: {
    ...Typography.caption,
    fontWeight: '700',
    marginLeft: Spacing.xs,
    color: Colors.text,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  card: {
    flex: 1,
    // The Card component in components/Card.tsx uses aspectRatio: 1,
    // so it will be square. We just need to manage the grid spacing.
  },
});
