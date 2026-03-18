import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd as GAMBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AppColors, Spacing } from '../constants/theme';
import { AD_IDS } from '../constants/Ads';

export const BannerAd = () => {
  return (
    <View style={styles.container}>
      <GAMBannerAd
        unitId={AD_IDS.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load: ', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
    backgroundColor: AppColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    minHeight: 60,
  },
});
