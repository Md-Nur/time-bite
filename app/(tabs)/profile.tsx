import { StyleSheet, View, Text, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, CircleHelp, LogOut } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useState } from 'react';

export default function ProfileScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const MenuItem = ({ icon: Icon, title, value, isLast = false }: any) => (
    <Pressable style={[styles.menuItem, isLast && styles.noBorder]}>
      <View style={styles.menuItemLeft}>
        <Icon size={20} color={Colors.textSecondary} />
        <Text style={[Typography.body, styles.menuItemTitle]}>{title}</Text>
      </View>
      {value !== undefined ? (
        typeof value === 'boolean' ? (
          <Switch 
            value={value} 
            onValueChange={() => setIsNotificationsEnabled(!value)}
            trackColor={{ false: '#D1D1D1', true: Colors.primary }}
          />
        ) : (
          <Text style={Typography.caption}>{value}</Text>
        )
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={40} color={Colors.surface} />
        </View>
        <Text style={Typography.h2}>Guest User</Text>
        <Text style={Typography.caption}>Level 5 • Pro Member</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.card}>
          <MenuItem icon={Bell} title="Notifications" value={isNotificationsEnabled} />
          <MenuItem icon={Shield} title="Privacy & Security" />
          <MenuItem icon={Settings} title="General Settings" isLast={true} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <MenuItem icon={CircleHelp} title="Help Center" />
          <MenuItem icon={LogOut} title="Log Out" isLast={true} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.caption,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    marginLeft: Spacing.md,
  },
  chevron: {
    fontSize: 24,
    color: Colors.border,
    fontWeight: '300',
  },
});
