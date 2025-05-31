import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Platform, Dimensions, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

// Tip/Guide type definition
type Tip = {
  id: string;
  title: string;
  summary: string;
  category: 'mealtime' | 'tantrums' | 'communication' | 'sleep' | 'sensory' | 'selfcare';
  badges: Array<'expert' | 'favorite' | 'quick' | 'new'>;
  content?: string;
  imageUrl?: string;
};

// Sample tips data with working Unsplash images
const initialTips: Tip[] = [
  {
    id: '1',
    title: 'Creating Visual Schedules',
    summary: 'Step-by-step guide to creating effective visual schedules for daily routines',
    category: 'communication',
    badges: ['expert', 'favorite'],
    imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: '2',
    title: 'Managing Mealtime Challenges',
    summary: 'Strategies for introducing new foods and creating positive mealtime experiences',
    category: 'mealtime',
    badges: ['favorite'],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: '3',
    title: 'Understanding Tantrum Triggers',
    summary: 'How to identify and address common tantrum triggers',
    category: 'tantrums',
    badges: ['expert'],
    imageUrl: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: '4',
    title: 'Bedtime Routine Builder',
    summary: 'Create a customized bedtime routine with sensory-friendly options',
    category: 'sleep',
    badges: ['new'],
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: '5',
    title: 'Self-Care for Parents',
    summary: 'Quick practices for maintaining your own wellbeing while supporting your child',
    category: 'selfcare',
    badges: ['quick'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: '6',
    title: 'Healthy Snack Ideas',
    summary: 'Autism-friendly snacks that are both nutritious and appealing',
    category: 'mealtime',
    badges: ['quick', 'favorite'],
    imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: '7',
    title: 'Transition Strategies',
    summary: 'Making daily transitions smoother with visual and verbal cues',
    category: 'communication',
    badges: ['favorite', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop&auto=format',
  },
];

// Category filter type
type CategoryFilter = 'all' | Tip['category'];

// Badge component
const Badge = ({ type }: { type: Tip['badges'][0] }) => {
  let backgroundColor: string;
  let label: string;
  
  switch (type) {
    case 'expert':
      backgroundColor = Colors.common.teal;
      label = 'ABA Verified';
      break;
    case 'favorite':
      backgroundColor = '#FFDB58';
      label = 'Parent Favorite';
      break;
    case 'quick':
      backgroundColor = '#73C2FB';
      label = 'Quick Read';
      break;
    case 'new':
      backgroundColor = '#C39BD3';
      label = 'New';
      break;
    default:
      backgroundColor = '#E1E1E1';
      label = type;
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText style={styles.badgeText}>{label}</ThemedText>
    </View>
  );
};

// Category selector component
const CategorySelector = ({ 
  selected, 
  onSelect 
}: { 
  selected: CategoryFilter, 
  onSelect: (category: CategoryFilter) => void 
}) => {
  const categories: Array<{ value: CategoryFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'mealtime', label: 'Mealtime' },
    { value: 'tantrums', label: 'Tantrums' },
    { value: 'communication', label: 'Communication' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'sensory', label: 'Sensory' },
    { value: 'selfcare', label: 'Self-care' },
  ];
  
  return (
    <View style={styles.categorySelectorContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categorySelector}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.categoryButton,
              selected === category.value && styles.categoryButtonSelected
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(category.value);
            }}
          >
            <ThemedText 
              style={[
                styles.categoryButtonText,
                selected === category.value && styles.categoryButtonTextSelected
              ]}
            >
              {category.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Tip card component
const TipCard = ({ tip, onPress }: { tip: Tip, onPress: () => void }) => {
  return (
    <TouchableOpacity 
      style={styles.tipCard}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.7}
    >
      {tip.imageUrl && (
        <Image
          source={{ uri: tip.imageUrl }}
          style={styles.tipImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory"
        />
      )}
      <View style={styles.tipContent}>
        <ThemedText style={styles.tipTitle}>{tip.title}</ThemedText>
        <ThemedText style={styles.tipSummary}>{tip.summary}</ThemedText>
        
        <View style={styles.badgeContainer}>
          {tip.badges.map((badge, index) => (
            <Badge key={`${tip.id}-badge-${index}`} type={badge} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TipsScreen() {
  const insets = useSafeAreaInsets();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [tips, setTips] = useState<Tip[]>(initialTips);
  
  // Filter tips based on selected category
  const filteredTips = categoryFilter === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === categoryFilter);

  // Handle tip selection
  const handleTipPress = (tip: Tip) => {
    // In a real app, this would navigate to a detailed view of the tip
    console.log(`Selected tip: ${tip.title}`);
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Image
          source={require('../../assets/images/sun-pattern.png')}
          style={styles.patternImage}
          contentFit="cover"
          cachePolicy="memory"
        />
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <ThemedText style={styles.headerTitle}>Tips & Guides</ThemedText>
      </View>
      
      {/* Category filter */}
      <CategorySelector selected={categoryFilter} onSelect={setCategoryFilter} />
      
      {/* Tips list */}
      <FlatList
        data={filteredTips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TipCard tip={item} onPress={() => handleTipPress(item)} />
        )}
        contentContainerStyle={styles.tipsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15,
    zIndex: -1,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  categorySelectorContainer: {
    backgroundColor: '#FFF9F0',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categorySelector: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    minWidth: 85,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.common.teal,
    borderColor: Colors.common.teal,
    shadowColor: Colors.common.teal,
    shadowOpacity: 0.3,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
    textAlign: 'center',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  tipsList: {
    padding: 16,
    paddingTop: 8,
  },
  tipCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  tipContent: {
    padding: 16,
  },
  tipTitle: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  tipSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#555555',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});