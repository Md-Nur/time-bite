import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable, Share, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { ChevronLeft, Share2, Heart, Download } from 'lucide-react-native';
import { BannerAd } from '@/components/BannerAd';

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

type MemeItem = 
  | { type: 'meme'; data: Meme; id: string }
  | { type: 'ad'; id: string };

export default function MemeScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  
  const [memes, setMemes] = useState<MemeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedMemes, setLikedMemes] = useState<Record<string, boolean>>({});
  const [savedMemes, setSavedMemes] = useState<Record<string, boolean>>({});
  const [containerHeight, setContainerHeight] = useState(height);
  
  // Double tap tracking
  const lastTapRef = useRef<{ [key: string]: number }>({});
  
  useEffect(() => {
    loadMemeState();
    fetchMemes();
  }, []);

  const loadMemeState = async () => {
    try {
      const liked = await AsyncStorage.getItem('@meme_likes');
      const saved = await AsyncStorage.getItem('@meme_saves');
      if (liked) setLikedMemes(JSON.parse(liked));
      if (saved) setSavedMemes(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load meme state', e);
    }
  };

  const saveMemeState = async (key: string, data: Record<string, boolean>) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save meme state', e);
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
        
        // Transform and insert Ads every 5 items
        const newItems: MemeItem[] = [];
        safeMemes.forEach((m: Meme, index: number) => {
          newItems.push({ type: 'meme', data: m, id: m.url + index + Date.now() });
          // Insert ad every 5 items
          if ((memes.length + newItems.length) % 6 === 0) {
            newItems.push({ type: 'ad', id: `ad-${Date.now()}-${index}` });
          }
        });
        
        setMemes(prev => [...prev, ...newItems]);
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
      saveMemeState('@meme_likes', next);
      return next;
    });
  };

  const toggleSave = (url: string) => {
    setSavedMemes(prev => {
      const next = { ...prev, [url]: !prev[url] };
      saveMemeState('@meme_saves', next);
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

  const handleSave = (meme: Meme) => {
    toggleSave(meme.url);
  };

  const renderItem = ({ item }: { item: MemeItem }) => {
    if (item.type === 'ad') {
      return (
        <View style={[styles.memeContainer, { width, height: containerHeight, justifyContent: 'center', backgroundColor: AppColors.cardBlue }]}>
           <View style={{ alignItems: 'center', padding: Spacing.xl }}>
             <Text style={[Typography.h2, { color: AppColors.primary, marginBottom: Spacing.sm }]}>Sponsored</Text>
             <Text style={[Typography.body, { textAlign: 'center', color: AppColors.textSecondary, marginBottom: Spacing.xl }]}>
               Enjoying TimeBite? Check out our partners!
             </Text>
             <BannerAd />
             <Text style={[Typography.caption, { marginTop: Spacing.xl, color: AppColors.textSecondary }]}>Swipe to continue laughing</Text>
           </View>
        </View>
      );
    }

    const meme = item.data;
    const isLiked = likedMemes[meme.url];
    const isSaved = savedMemes[meme.url];

    return (
      <Pressable onPress={() => handleDoubleTap(meme)} style={[styles.memeContainer, { width, height: containerHeight }]}>
        <Image 
          source={{ uri: meme.url }} 
          style={styles.image} 
          resizeMode="contain"
        />
        <View style={styles.overlay}>
          <View style={styles.bottomContent}>
            <View style={styles.textContainer}>
              <Text style={styles.memeTitle} numberOfLines={3}>{meme.title}</Text>
              <Text style={styles.authorText}>by u/{meme.author}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.actionItem} onPress={() => toggleLike(meme.url)}>
                <Heart size={36} color={isLiked ? "#ff2b54" : AppColors.text} fill={isLiked ? "#ff2b54" : "transparent"} />
                <Text style={[styles.actionText, isLiked && { color: "#ff2b54" }]}>{meme.ups + (isLiked ? 1 : 0)}</Text>
              </Pressable>
              
              <Pressable style={styles.actionItem} onPress={() => handleSave(meme)}>
                <Download size={32} color={isSaved ? AppColors.primary : AppColors.text} />
                <Text style={[styles.actionText, isSaved && { color: AppColors.primary }]}>{isSaved ? 'Saved' : 'Save'}</Text>
              </Pressable>

              <Pressable style={styles.actionItem} onPress={() => handleShare(meme)}>
                <Share2 size={32} color={AppColors.text} />
                <Text style={styles.actionText}>Share</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };


  return (
    <View 
      style={styles.container} 
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTransparent: false,
          headerStyle: { backgroundColor: AppColors.background },
          headerShadowVisible: false,
          title: '',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable 
                onPress={() => router.back()} 
                style={styles.backButton}
              >
                <ChevronLeft color={AppColors.text} size={24} />
              </Pressable>
              <Text style={[Typography.h3, { marginLeft: Spacing.sm, color: AppColors.text }]}>Memes</Text>
            </View>
          ),
        }} 
      />
      
      {memes.length > 0 ? (
        <FlatList
          data={memes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          onEndReached={fetchMemes}
          onEndReachedThreshold={1}
          ListFooterComponent={
            loading ? (
              <View style={[styles.loaderContainer, { width, height: containerHeight }]}>
                <ActivityIndicator size="large" color={AppColors.text} />
              </View>
            ) : null
          }
        />
      ) : (
        <View style={[styles.loadingCenter, { width, height: containerHeight }]}>
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
    backgroundColor: AppColors.background,
  },
  loadingCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
  },
  loadingText: {
    ...Typography.body,
    color: AppColors.textSecondary,
    marginTop: Spacing.md,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: AppColors.cardBlue,
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
    backgroundColor: AppColors.surface,
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
    paddingBottom: 100, // Pulled up for better visibility
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
    ...Typography.h2,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: Spacing.xs,
  },
  authorText: {
    ...Typography.caption,
    color: AppColors.textSecondary,
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
    color: AppColors.text,
    fontSize: 13,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
});
