import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Strategy type definition
type Strategy = {
  id: string;
  title: string;
  description: string;
  dateAdded: Date;
  category: 'sleep' | 'food' | 'sensory' | 'communication' | 'behavior';
  rating?: 'success' | 'neutral' | 'challenging';
  notes?: string;
};

// Sample strategies
const initialStrategies: Strategy[] = [
  {
    id: '1',
    title: 'Visual bedtime schedule',
    description: 'Created a picture schedule showing bath, pajamas, story, then sleep',
    dateAdded: new Date(2025, 4, 22),
    category: 'sleep',
    rating: 'success',
    notes: 'Reduced bedtime resistance by about 50%. Still working on staying in bed.'
  },
  {
    id: '2',
    title: 'Food exploration play',
    description: 'Playing with vegetables before mealtime without pressure to eat',
    dateAdded: new Date(2025, 4, 24),
    category: 'food',
    rating: 'neutral',
    notes: 'Touched broccoli but still won\'t taste it. Small progress!'
  },
  {
    id: '3',
    title: 'Deep pressure input',
    description: 'Using weighted blanket for 15 minutes before transitions',
    dateAdded: new Date(2025, 5, 20),
    category: 'sensory',
    rating: 'success',
  },
];

// Rating emoji component
const RatingEmoji = ({ rating }: { rating?: 'success' | 'neutral' | 'challenging' }) => {
  switch (rating) {
    case 'success':
      return <ThemedText style={styles.emoji}>👍</ThemedText>;
    case 'neutral':
      return <ThemedText style={styles.emoji}>😐</ThemedText>;
    case 'challenging':
      return <ThemedText style={styles.emoji}>👎</ThemedText>;
    default:
      return <ThemedText style={styles.emoji}>⭐</ThemedText>;
  }
};

// Category badge component
const CategoryBadge = ({ category }: { category: Strategy['category'] }) => {
  const colorScheme = useColorScheme();
  let backgroundColor;
  let label;

  switch (category) {
    case 'sleep':
      backgroundColor = '#A3E4D7'; // Soft green
      label = 'Sleep';
      break;
    case 'food':
      backgroundColor = '#FFD966'; // Warm yellow
      label = 'Food';
      break;
    case 'sensory':
      backgroundColor = '#73C2FB'; // Soft sky blue
      label = 'Sensory';
      break;
    case 'communication':
      backgroundColor = '#C39BD3'; // Soft purple
      label = 'Communication';
      break;
    case 'behavior':
      backgroundColor = '#F5B7B1'; // Soft pink
      label = 'Behavior';
      break;
    default:
      backgroundColor = Colors[colorScheme ?? 'light'].border;
      label = 'Other';
  }

  return (
    <View style={[styles.categoryBadge, { backgroundColor }]}>
      <ThemedText style={styles.categoryText}>{label}</ThemedText>
    </View>
  );
};

// Strategy card component
const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
  const colorScheme = useColorScheme();
  const formattedDate = strategy.dateAdded.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleExpanded}
    >
      <ThemedView style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <View style={styles.cardHeader}>
          <CategoryBadge category={strategy.category} />
          <ThemedText style={styles.date}>{formattedDate}</ThemedText>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" style={styles.title}>{strategy.title}</ThemedText>
            <RatingEmoji rating={strategy.rating} />
          </View>
          
          <ThemedText style={styles.description}>{strategy.description}</ThemedText>
          
          {expanded && strategy.notes && (
            <ThemedView style={styles.notesContainer}>
              <ThemedText type="defaultSemiBold">Notes:</ThemedText>
              <ThemedText style={styles.notes}>{strategy.notes}</ThemedText>
            </ThemedView>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies);

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <ThemedText type="title">Progress Tracker</ThemedText>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline */}
        <View style={styles.timeline}>
          {strategies.map((strategy, index) => (
            <React.Fragment key={strategy.id}>
              <StrategyCard strategy={strategy} />
              {index < strategies.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Add new strategy button */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: Colors.common.teal }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Here you would open a form to add a new strategy
          }}
        >
          <ThemedText style={styles.addButtonText}>+ Add New Strategy</ThemedText>
        </TouchableOpacity>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  timeline: {
    marginTop: 8,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E1E1E1',
    alignSelf: 'center',
    marginVertical: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardContent: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  emoji: {
    fontSize: 18,
  },
  notesContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: Platform.select({
      ios: 'rgba(0,0,0,0.03)',
      default: '#f5f5f5'
    }),
    borderRadius: 8,
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  addButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
