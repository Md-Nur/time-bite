import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable, Share, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Spacing, Typography } from '@/constants/theme';
import { ChevronLeft, Share2, Heart, Download } from 'lucide-react-native';

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

// Meme API Response format
interface Meme {
  url: string;
  title: string;
  ups: number;
  author: string;
  postLink: string;
  nsfw: boolean;
}

export default function MemeScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedMemes, setLikedMemes] = useState<Record<string, boolean>>({});
  
  // Double tap tracking
  const lastTapRef = useRef<{ [key: string]: number }>({});
  
  useEffect(() => {
    loadLikedMemes();
    fetchMemes();
  }, []);

  const loadLikedMemes = async () => {
    try {
      const stored = await AsyncStorage.getItem('@meme_likes');
      if (stored) {
        setLikedMemes(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load likes', e);
    }
  };

  const saveLikeStatus = async (likes: Record<string, boolean>) => {
    try {
      await AsyncStorage.setItem('@meme_likes', JSON.stringify(likes));
    } catch (e) {
      console.error('Failed to save likes', e);
    }
  };

  const fetchMemes = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // 20 memes per request
      const res = await fetch('https://meme-api.com/gimme/20');
      const data = await res.json();
      if (data && data.memes) {
        // filter out nsfw for safety (optional but good practice)
        const safeMemes = data.memes.filter((m: Meme) => !m.nsfw);
        setMemes(prev => [...prev, ...safeMemes]);
      }
    } catch (error) {
      console.error('Error fetching memes', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (url: string) => {
    setLikedMemes(prev => {
      const next = { ...prev, [url]: !prev[url] };
      saveLikeStatus(next);
      return next;
    });
  };

  const handleDoubleTap = (meme: Meme) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[meme.url] || 0;
    
    // Tap within 300ms is considered double tap
    if (now - lastTap < 300) {
      if (!likedMemes[meme.url]) {
        toggleLike(meme.url);
      }
    }
    lastTapRef.current[meme.url] = now;
  };

  const handleShare = async (meme: Meme) => {
    try {
      await Share.share({
        message: `Check out this meme: ${meme.url}`,
      });
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  const handleSave = async (meme: Meme) => {
    // Basic "Save" -> mark as liked to be viewed later
    // Real save would use expo-media-library to download the image
    toggleLike(meme.url);
  };

  // Viewability setup to track user swipes for our Ad Strategy
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const currentIndex = viewableItems[0].index;
      
      // Ad Strategy log: Trigger every 5 swipes
      if (currentIndex > 0 && currentIndex % 5 === 0) {
        // Here we trigger the AdMob intersitital.
        // As per the plan, we are mocking the interaction to avoid build errors in Expo Go
        console.log(`[AdMob Mock] Showing Interstitial Ad after ${currentIndex} swipes`);
      }
    }
  }, []);

  const renderItem = ({ item }: { item: Meme }) => {
    const isLiked = likedMemes[item.url];

    return (
      <Pressable onPress={() => handleDoubleTap(item)} style={[styles.memeContainer, { width, height }]}>
        <Image 
          source={{ uri: item.url }} 
          style={styles.image} 
          resizeMode="contain"
        />
        <View style={styles.overlay}>
          <View style={styles.bottomContent}>
            <View style={styles.textContainer}>
              <Text style={styles.memeTitle} numberOfLines={3}>{item.title}</Text>
              <Text style={styles.authorText}>by u/{item.author}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.actionItem} onPress={() => toggleLike(item.url)}>
                <Heart size={36} color={isLiked ? "#ff2b54" : "white"} fill={isLiked ? "#ff2b54" : "transparent"} />
                <Text style={styles.actionText}>{item.ups + (isLiked ? 1 : 0)}</Text>
              </Pressable>
              
              <Pressable style={styles.actionItem} onPress={() => handleSave(item)}>
                <Download size={32} color="white" />
                <Text style={styles.actionText}>Save</Text>
              </Pressable>

              <Pressable style={styles.actionItem} onPress={() => handleShare(item)}>
                <Share2 size={32} color="white" />
                <Text style={styles.actionText}>Share</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTransparent: true,
          title: '',
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <ChevronLeft color="white" size={24} />
            </Pressable>
          ),
        }} 
      />
      
      {memes.length > 0 ? (
        <FlatList
          data={memes}
          keyExtractor={(item, index) => item.url + index}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          onEndReached={fetchMemes}
          onEndReachedThreshold={1}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListFooterComponent={
            loading ? (
              <View style={[styles.loaderContainer, { width, height }]}>
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : null
          }
        />
      ) : (
        <View style={[styles.loadingCenter, { width, height }]}>
           <ActivityIndicator size="large" color="#ff2b54" />
           <Text style={styles.loadingText}>Loading Memes...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    ...Typography.body,
    color: '#aaa',
    marginTop: Spacing.md,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  memeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    paddingBottom: 100, // Safe space for bottom navigation
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.xl,
  },
  memeTitle: {
    ...Typography.h3,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: Spacing.xs,
  },
  authorText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 13,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
});
