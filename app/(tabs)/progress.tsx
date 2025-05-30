import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Platform, TextInput, Modal } from 'react-native';
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

// Strategy creation modal component
const AddStrategyModal = ({
  visible,
  onClose,
  onSave
}: {
  visible: boolean,
  onClose: () => void,
  onSave: (strategy: Omit<Strategy, 'id' | 'dateAdded'>) => void
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Strategy['category']>('behavior');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    
    onSave({
      title,
      description,
      category,
      notes: notes.trim() || undefined,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('behavior');
    setNotes('');
    
    onClose();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <ThemedText style={styles.modalTitle}>Add New Strategy</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Title</ThemedText>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="What's your strategy called?"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what you did..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <View style={styles.categoryButtons}>
              {(['sleep', 'food', 'sensory', 'communication', 'behavior'] as Strategy['category'][]).map(cat => (
                <TouchableOpacity 
                  key={cat}
                  style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCategory(cat);
                  }}
                >
                  <ThemedText 
                    style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextActive]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Notes (Optional)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes or observations..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={!title.trim() || !description.trim()}
          >
            <ThemedText style={styles.saveButtonText}>Save Strategy</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies);
  const [modalVisible, setModalVisible] = useState(false);

  // Handle adding a new strategy
  const handleAddStrategy = (newStrategyData: Omit<Strategy, 'id' | 'dateAdded'>) => {
    const newStrategy: Strategy = {
      ...newStrategyData,
      id: Date.now().toString(),
      dateAdded: new Date()
    };

    setStrategies([newStrategy, ...strategies]);
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
            setModalVisible(true);
          }}
        >
          <ThemedText style={styles.addButtonText}>+ Add New Strategy</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Strategy Modal */}
      <AddStrategyModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSave={handleAddStrategy} 
      />
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
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalContent: {
    padding: 16,
    maxHeight: '70%',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: Colors.common.teal,
    borderColor: Colors.common.teal,
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#333333',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.common.teal,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
