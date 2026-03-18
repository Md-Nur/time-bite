import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Home, Trophy, User } from 'lucide-react-native';

import { Colors as ThemeColors } from '@/constants/theme';
import { BannerAd } from '@/components/BannerAd';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ThemeColors.primary,
          tabBarInactiveTintColor: ThemeColors.textSecondary,
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              height: 90,
              paddingBottom: 30,
            },
            default: {
              height: 70,
              paddingBottom: 10,
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Rank',
            tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Me',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
      <BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
