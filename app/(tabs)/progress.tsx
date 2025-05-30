import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

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
      backgroundColor = '#E1E1E1';
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
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <CategoryBadge category={strategy.category} />
          <ThemedText style={styles.date}>{formattedDate}</ThemedText>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{strategy.title}</ThemedText>
            <RatingEmoji rating={strategy.rating} />
          </View>
          
          <ThemedText style={styles.description}>{strategy.description}</ThemedText>
          
          {expanded && strategy.notes && (
            <View style={styles.notesContainer}>
              <ThemedText style={styles.notesLabel}>Notes:</ThemedText>
              <ThemedText style={styles.notes}>{strategy.notes}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies);

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
        <ThemedText style={styles.headerTitle}>Progress Tracker</ThemedText>
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
          style={styles.addButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Here you would open a form to add a new strategy
          }}
        >
          <ThemedText style={styles.addButtonText}>+ Add New Strategy</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Warm white background
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
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    marginVertical: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    backgroundColor: 'white',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },
  date: {
    fontSize: 12,
    color: '#888888',
  },
  emoji: {
    fontSize: 18,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  notesContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  notesLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#333333',
  },
  notes: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555555',
  },
  addButton: {
    marginTop: 24,
    padding: 14,
    borderRadius: 25,
    backgroundColor: Colors.common.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
