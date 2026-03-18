import { TestIds } from 'react-native-google-mobile-ads';

// Use TestIds while in development for safety
const IS_DEV = __DEV__;

export const AD_IDS = {
  BANNER: IS_DEV ? TestIds.BANNER : process.env.EXPO_PUBLIC_AD_BANNER_ID || '',
  REWARD_TRANSITION: IS_DEV ? TestIds.REWARDED_INTERSTITIAL : process.env.EXPO_PUBLIC_AD_REWARD_TRANSITION_ID || '',
  REWARD: IS_DEV ? TestIds.REWARDED : process.env.EXPO_PUBLIC_AD_REWARD_ID || '',
  TRANSITION: IS_DEV ? TestIds.INTERSTITIAL : process.env.EXPO_PUBLIC_AD_TRANSITION_ID || '',
};

