import { useEffect, useState, useCallback } from 'react';
import { 
  InterstitialAd, 
  RewardedAd, 
  RewardedInterstitialAd, 
  AdEventType, 
  RewardedAdEventType 
} from 'react-native-google-mobile-ads';
import { AD_IDS } from './Ads';

// Interstitial Ad
export const useInterstitialAd = () => {
  const [ad, setAd] = useState<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(AD_IDS.TRANSITION);
    
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      interstitial.load();
    });

    interstitial.load();
    setAd(interstitial);

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const show = useCallback(() => {
    if (loaded && ad) {
      ad.show();
    } else {
      console.log('Interstitial ad not loaded yet');
    }
  }, [loaded, ad]);

  return { show, loaded };
};

// Rewarded Ad
export const useRewardedAd = () => {
  const [ad, setAd] = useState<RewardedAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(false);

  useEffect(() => {
    const rewarded = RewardedAd.createForAdRequest(AD_IDS.REWARD);
    
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward: ', reward);
      setRewardEarned(true);
    });

    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      setRewardEarned(false);
      rewarded.load();
    });

    rewarded.load();
    setAd(rewarded);

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, []);

  const show = useCallback(() => {
    if (loaded && ad) {
      ad.show();
    } else {
      console.log('Rewarded ad not loaded yet');
    }
  }, [loaded, ad]);

  return { show, loaded, rewardEarned };
};

// Rewarded Interstitial Ad
export const useRewardedInterstitialAd = () => {
  const [ad, setAd] = useState<RewardedInterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(false);

  useEffect(() => {
    const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(AD_IDS.REWARD_TRANSITION);
    
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward: ', reward);
      setRewardEarned(true);
    });

    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      setRewardEarned(false);
      rewardedInterstitial.load();
    });

    rewardedInterstitial.load();
    setAd(rewardedInterstitial);

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, []);

  const show = useCallback(() => {
    if (loaded && ad) {
      ad.show();
    } else {
      console.log('Rewarded interstitial ad not loaded yet');
    }
  }, [loaded, ad]);

  return { show, loaded, rewardEarned };
};
