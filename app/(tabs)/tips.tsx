import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Platform, Dimensions, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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

// Sample tips data
const initialTips: Tip[] = [
  {
    id: '1',
    title: 'Creating Visual Schedules',
    summary: 'Step-by-step guide to creating effective visual schedules for daily routines',
    category: 'communication',
    badges: ['expert', 'favorite'],
    imageUrl: require('@/assets/images/icon.png'), // Placeholder image
  },
  {
    id: '2',
    title: 'Managing Mealtime Challenges',
    summary: 'Strategies for introducing new foods and creating positive mealtime experiences',
    category: 'mealtime',
    badges: ['favorite'],
    imageUrl: require('@/assets/images/icon.png'), // Placeholder image
  },
  {
    id: '3',
    title: 'Calming Sensory Activities',
    summary: '10 sensory activities to help regulate emotions and reduce stress',
    category: 'sensory',
    badges: ['quick', 'new'],
    imageUrl: require('@/assets/images/icon.png'), // Placeholder image
  },
  {
    id: '4',
    title: 'Understanding Tantrum Triggers',
    summary: 'How to identify and address common tantrum triggers',
    category: 'tantrums',
    badges: ['expert'],
    imageUrl: require('@/assets/images/icon.png'), // Placeholder image
  },
  {
    id: '5',
    title: 'Bedtime Routine Builder',
    summary: 'Create a customized bedtime routine with sensory-friendly options',
    category: 'sleep',
    badges: ['new'],
    imageUrl: require('@/assets/images/icon.png'), // Placeholder image
  },
  {
    id: '6',
    title: 'Self-Care for Parents',
    summary: 'Quick practices for maintaining your own wellbeing',
    category: 'selfcare',
    badges: ['quick'],
    imageUrl: require('@/assets/images/icon.png'), // Placeholder image
  },
];

// Category filter type
type CategoryFilter = 'all' | Tip['category'];

// Badge component
const Badge = ({ type }: { type: Tip['badges'][0] }) => {
  const colorScheme = useColorScheme();
  let backgroundColor: string;
  let label: string;
  
  switch (type) {
    case 'expert':
      backgroundColor = Colors[colorScheme ?? 'light'].primary;
      label = 'ABA Verified';
      break;
    case 'favorite':
      backgroundColor = Colors.common.accent;
      label = 'Parent Favorite';
      break;
    case 'quick':
      backgroundColor = Colors[colorScheme ?? 'light'].success;
      label = 'Quick Read';
      break;
    case 'new':
      backgroundColor = Colors.common.teal;
      label = 'New';
      break;
    default:
      backgroundColor = Colors[colorScheme ?? 'light'].border;
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
  const colorScheme = useColorScheme();
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
            selected === category.value && { 
              backgroundColor: Colors[colorScheme ?? 'light'].primary,
              borderColor: Colors[colorScheme ?? 'light'].primary,
            }
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(category.value);
          }}
        >
          <ThemedText 
            style={[
              styles.categoryButtonText,
              selected === category.value && { color: '#FFFFFF' }
            ]}
          >
            {category.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Tip card component
const TipCard = ({ tip, onPress }: { tip: Tip, onPress: () => void }) => {
  const colorScheme = useColorScheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.tipCard, 
        { backgroundColor: Colors[colorScheme ?? 'light'].card }
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.7}
    >
      {tip.imageUrl && (
        <Image
          source={tip.imageUrl}
          style={styles.tipImage}
          contentFit="cover"
        />
      )}
      <View style={styles.tipContent}>
        <ThemedText type="subtitle" style={styles.tipTitle}>{tip.title}</ThemedText>
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
  const colorScheme = useColorScheme();
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
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <ThemedText type="title">Tips & Guides</ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Platform.select({
      ios: 'rgba(0,0,0,0.1)',
      default: '#E1E1E1'
    }),
  },
  categorySelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipsList: {
    padding: 16,
    paddingTop: 8,
  },
  tipCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  tipContent: {
    padding: 16,
  },
  tipTitle: {
    marginBottom: 8,
  },
  tipSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
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
