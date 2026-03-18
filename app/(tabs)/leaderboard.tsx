import { StyleSheet, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

const DATA = [
  { id: '1', name: 'Alex Johnson', score: '2,450', rank: 1 },
  { id: '2', name: 'Sam Smith', score: '2,100', rank: 2 },
  { id: '3', name: 'Jordan Lee', score: '1,950', rank: 3 },
  { id: '4', name: 'Casey Rivera', score: '1,800', rank: 4 },
  { id: '5', name: 'Taylor Swift', score: '1,750', rank: 5 },
  { id: '6', name: 'Morgan Freeman', score: '1,600', rank: 6 },
];

export default function LeaderboardScreen() {
  const renderItem = ({ item }: { item: typeof DATA[0] }) => (
    <View style={styles.item}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rank, item.rank <= 3 && styles.topRank]}>{item.rank}</Text>
      </View>
      <View style={styles.info}>
        <Text style={Typography.body}>{item.name}</Text>
      </View>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Trophy color={Colors.accent} size={32} />
        <Text style={[Typography.h1, styles.title]}>Leaderboard</Text>
      </View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    marginLeft: Spacing.sm,
  },
  list: {
    padding: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rank: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  topRank: {
    color: Colors.primary,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  score: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
  },
});
