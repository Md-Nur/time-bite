import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Share, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { ChevronLeft, Heart, Bookmark, Share2 } from 'lucide-react-native';
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
  { id: '301', text: "Space is a hard vacuum with no sound because there are no molecules to transmit it.", category: "Space", color: "#1D3557", likes: 3421 },
  { id: '302', text: "The Sun makes up 99.86% of the total mass in our solar system.", category: "Space", color: "#16697A", likes: 5612 },
  { id: '303', text: "If two pieces of the same metal touch in space, they become permanently stuck together.", category: "Space", color: "#5F0F40", likes: 2109 },
  { id: '304', text: "Messages travel through the human nervous system at up to 120 meters per second.", category: "Science", color: "#D95D39", likes: 4321 },
  { id: '305', text: "99.9% of the DNA of each person is identical to every other person.", category: "Science", color: "#2B2D42", likes: 6710 },
  { id: '306', text: "The human nose can detect and remember approximately 50,000 different scents.", category: "Human Body", color: "#6A994E", likes: 2190 },
  { id: '307', text: "Polar bear hair is actually colorless and hollow, not white.", category: "Animals", color: "#457B9D", likes: 8901 },
  { id: '308', text: "A giraffe has the same number of neck bones as a human: only seven.", category: "Animals", color: "#386641", likes: 3210 },
  { id: '309', text: "Octopuses have three hearts and blue blood.", category: "Animals", color: "#16697A", likes: 11021 },
  { id: '310', text: "The shortest war in history lasted only 38 to 45 minutes between England and Zanzibar.", category: "History", color: "#D62828", likes: 5820 },
  { id: '311', text: "The first computer mouse was made of wood and invented in 1964.", category: "Technology", color: "#312244", likes: 3412 },
  { id: '312', text: "Google rents goats to mow the grass at their headquarters.", category: "Technology", color: "#1D3557", likes: 8700 },
  { id: '313', text: "Bananas, pumpkins, and lemons are botanically considered berries.", category: "Food", color: "#9A031E", likes: 2101 },
  { id: '314', text: "There is more water in cucumbers (95%) than in watermelons (92%).", category: "Food", color: "#003049", likes: 780 },
  { id: '315', text: "Raspberries are members of the rose family.", category: "Nature", color: "#6A994E", likes: 4321 },
  { id: '316', text: "The universe is estimated to be 13.8 billion years old.", category: "Space", color: "#1D3557", likes: 110 },
  { id: '317', text: "Earth rotates once in exactly 23 hours, 56 minutes, and 4 seconds.", category: "Science", color: "#2B2D42", likes: 2310 },
  { id: '318', text: "A chameleon's tongue is at least as long as its entire body.", category: "Animals", color: "#457B9D", likes: 1890 },
  { id: '319', text: "Sea otters have the densest fur of any mammal on Earth.", category: "Animals", color: "#386641", likes: 932 },
  { id: '320', text: "Emperor penguins can dive up to 500 meters deep into the ocean.", category: "Animals", color: "#006400", likes: 1400 },
  { id: '321', text: "Ancient Roman fathers had the legal right to sell family members.", category: "History", color: "#BC4749", likes: 504 },
  { id: '322', text: "Ketchup was once sold in the 1830s as a medicine for diarrhea.", category: "History", color: "#D62828", likes: 3421 },
  { id: '323', text: "The term 'bug' for computer errors came from a moth found in a relay.", category: "Technology", color: "#1D3557", likes: 5612 },
  { id: '324', text: "The first 1 GB hard drive weighed over 500 pounds and cost $40,000.", category: "Technology", color: "#312244", likes: 2109 },
  { id: '325', text: "The QWERTY keyboard layout was designed to slow typists down.", category: "Technology", color: "#16697A", likes: 4321 },
  { id: '326', text: "More than half of Earth's oxygen is produced by the oceans.", category: "Science", color: "#2B2D42", likes: 6710 },
  { id: '327', text: "Eating too many carrots can actually turn your skin orange.", category: "Food", color: "#D95D39", likes: 2190 },
  { id: '328', text: "A gorilla's nose print is as unique as a human's fingerprint.", category: "Animals", color: "#457B9D", likes: 8901 },
  { id: '329', text: "Hippos' closest living relatives are actually whales and dolphins.", category: "Animals", color: "#386641", likes: 3210 },
  { id: '330', text: "Albert Einstein's brain was stolen by a pathologist after his death.", category: "History", color: "#D62828", likes: 11021 },
  { id: '331', text: "Australia once declared war on emus and technically lost.", category: "History", color: "#BC4749", likes: 5820 },
  { id: '332', text: "Cleopatra lived closer to the moon landing than to the Giza Pyramids.", category: "History", color: "#312244", likes: 3412 },
  { id: '333', text: "Farm-raised salmon is naturally white and dyed pink for sale.", category: "Food", color: "#9A031E", likes: 8700 },
  { id: '334', text: "Some people have genes that make cilantro taste like soap.", category: "Science", color: "#006400", likes: 2101 },
  { id: '335', text: "Figs are not strictly vegan because wasps die inside them.", category: "Nature", color: "#6A994E", likes: 780 },
];

export default function FunFactsScreen() {
  const router = useRouter();
  const { width, height: screenHeight } = useWindowDimensions();
  const [containerHeight, setContainerHeight] = useState(screenHeight);
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
      <View style={[styles.cardContainer, { backgroundColor: item.color, width, height: containerHeight }]}>
        <View style={styles.contentArea}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.factText}>{item.text}</Text>
        </View>
        
        <View style={[styles.rightActions, { bottom: containerHeight * 0.15 }]}>
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
          headerShown: true,
          headerTransparent: true,
          title: '',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft color="white" size={24} />
              </Pressable>
              <Text style={[Typography.h3, { marginLeft: Spacing.sm, color: 'white', fontWeight: '700' }]}>Curiosity Bites</Text>
            </View>
          ),
        }} 
      />
      
      <View style={{ flex: 1 }} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
        <FlatList
          data={FACTS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={containerHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          windowSize={3}
          maxToRenderPerBatch={3}
          removeClippedSubviews={true}
        />
      </View>
      <BannerAd />
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
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
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
