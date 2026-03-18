import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

export const BannerAd = () => {
  return (
    <View style={styles.container}>
      <View style={styles.adBox}>
        <Text style={styles.adText}>BANNER AD PLACEHOLDER</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  adBox: {
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#9E9E9E',
  },
  adText: {
    ...Typography.caption,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
});
