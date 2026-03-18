import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { ChevronLeft, Heart, Bookmark, Share2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const FACTS = [
  { id: '200', text: "The first ever tweet was sent on March 21, 2006 by Jack Dorsey.", category: "Technology", color: "#1D3557", likes: 8210 },
  { id: '201', text: "A group of flamingos is called a 'flamboyance'.", category: "Animals", color: "#457B9D", likes: 4501 },
  { id: '202', text: "The moon has moonquakes.", category: "Space", color: "#16697A", likes: 2190 },
  { id: '203', text: "A bolt of lightning is five times hotter than the sun.", category: "Science", color: "#D95D39", likes: 11021 },
  { id: '100', text: "A cloud can weigh more than a million pounds.", category: "Science", color: "#2B2D42", likes: 5820 },
  { id: '101', text: "Honey never spoils. You can eat 3000-year-old honey.", category: "History", color: "#D62828", likes: 3412 },
  { id: '6', text: "A day on Venus is longer than a year on Venus.", category: "Space", color: "#5F0F40", likes: 8700 },
  { id: '7', text: "Scotland's national animal is the unicorn.", category: "Random", color: "#312244", likes: 2101 },
  { id: '8', text: "Apples float in water because they are 25% air.", category: "Food", color: "#9A031E", likes: 780 },
  { id: '9', text: "Sharks are older than trees.", category: "Nature", color: "#003049", likes: 4321 },
  { id: '10', text: "A jiffy is an actual unit of time: 1/100th of a second.", category: "Science", color: "#D62828", likes: 110 },
  { id: '11', text: "The Eiffel Tower can be 15 cm taller during the summer.", category: "Science", color: "#D95D39", likes: 2310 },
  { id: '12', text: "Human bones are stronger than concrete.", category: "Human Body", color: "#6A994E", likes: 1890 },
  { id: '13', text: "Sloths can hold their breath longer than dolphins.", category: "Animals", color: "#386641", likes: 932 },
  { id: '14', text: "Water makes different sounds depending on its temperature.", category: "Science", color: "#006400", likes: 1400 },
  { id: '15', text: "Cotton candy was invented by a dentist.", category: "History", color: "#BC4749", likes: 504 },
];

export default function FunFactsScreen() {
  const router = useRouter();
  const [likedFacts, setLikedFacts] = useState<Record<string, boolean>>({});
  const [savedFacts, setSavedFacts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const likesRaw = await AsyncStorage.getItem('@factbite_likes');
      const savesRaw = await AsyncStorage.getItem('@factbite_saves');
      if (likesRaw) setLikedFacts(JSON.parse(likesRaw));
      if (savesRaw) setSavedFacts(JSON.parse(savesRaw));
    } catch (e) {
      console.log('Error loading state', e);
    }
  };

  const toggleLike = async (id: string) => {
    try {
      const newLikes = { ...likedFacts, [id]: !likedFacts[id] };
      setLikedFacts(newLikes);
      await AsyncStorage.setItem('@factbite_likes', JSON.stringify(newLikes));
    } catch (e) { console.log(e); }
  };

  const toggleSave = async (id: string) => {
    try {
      const newSaves = { ...savedFacts, [id]: !savedFacts[id] };
      setSavedFacts(newSaves);
      await AsyncStorage.setItem('@factbite_saves', JSON.stringify(newSaves));
    } catch (e) { console.log(e); }
  };

  const shareFact = async (text: string) => {
    try {
      await Share.share({
        message: `Did you know? ${text} \n\nFound this on TimeBite!`,
      });
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const renderItem = ({ item }: { item: typeof FACTS[0] }) => {
    const isLiked = !!likedFacts[item.id];
    const isSaved = !!savedFacts[item.id];
    
    return (
      <View style={[styles.cardContainer, { backgroundColor: item.color }]}>
        <View style={styles.contentArea}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.factText}>{item.text}</Text>
        </View>
        
        <View style={styles.rightActions}>
          <Pressable style={styles.actionButton} onPress={() => toggleLike(item.id)}>
            <Heart color={isLiked ? '#FF2D55' : 'white'} fill={isLiked ? '#FF2D55' : 'transparent'} size={38} />
            <Text style={styles.actionText}>{isLiked ? item.likes + 1 : item.likes}</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => toggleSave(item.id)}>
            <Bookmark color={isSaved ? '#FACC15' : 'white'} fill={isSaved ? '#FACC15' : 'transparent'} size={38} />
            <Text style={styles.actionText}>Save</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => shareFact(item.text)}>
            <Share2 color="white" size={38} />
            <Text style={styles.actionText}>Share</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color="white" size={28} />
            </Pressable>
          ),
        }} 
      />
      <FlatList
        data={FACTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    marginLeft: Spacing.sm,
  },
  cardContainer: {
    width: width,
    height: height,
    flexDirection: 'row',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingRight: 80, // Space for right actions
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginBottom: Spacing.lg,
  },
  categoryText: {
    ...Typography.caption,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1.5,
  },
  factText: {
    ...Typography.h1,
    fontSize: 36,
    lineHeight: 46,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  rightActions: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: height * 0.15,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    ...Typography.caption,
    color: 'white',
    marginTop: Spacing.xs,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
