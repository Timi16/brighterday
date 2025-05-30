import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Text,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Animated, { 
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

import { Colors } from '../constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const { width } = Dimensions.get('window');

// Focus area options
const focusAreas = [
  { id: 'meltdowns', label: 'Managing meltdowns' },
  { id: 'potty', label: 'Potty training' },
  { id: 'communication', label: 'Communication skills' },
  { id: 'sleep', label: 'Sleep challenges' },
  { id: 'eating', label: 'Picky eating' },
  { id: 'directions', label: 'Following directions' },
  { id: 'other', label: 'Something else' },
  { id: 'unsure', label: 'Not sure yet' }
];

export default function ChooseFocusScreen() {
  const insets = useSafeAreaInsets();
  const { updateState } = useAppState();
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  // Handle focus area selection
  const handleSelectFocus = (focusId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFocus(focusId);
  };

  // Handle continue button press
  const handleContinue = () => {
    if (selectedFocus) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Store the selected focus area in the app state
      updateState({ focusArea: selectedFocus });
      // Navigate to the personalize screen
      router.push('/personalize');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Image
          source={require('../assets/images/sun-pattern.png')}
          style={styles.patternImage}
          contentFit="cover"
        />
      </View>
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.delay(100).duration(600)}>
          <Text style={styles.title}>What would you like help with?</Text>
        </Animated.View>

        <View style={styles.optionsGrid}>
          {focusAreas.map((area, index) => (
            <Animated.View 
              key={area.id}
              entering={FadeInDown.delay(200 + index * 50).duration(400)}
              style={styles.optionWrapper}
            >
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedFocus === area.id && styles.selectedCard
                ]}
                onPress={() => handleSelectFocus(area.id)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.optionText,
                    selectedFocus === area.id && styles.selectedText
                  ]}
                >
                  {area.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View 
          entering={FadeIn.delay(600).duration(400)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              { opacity: selectedFocus ? 1 : 0.6 }
            ]}
            onPress={handleContinue}
            disabled={!selectedFocus}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Use light cream background from Image 2
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
    zIndex: -1,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333', // Dark text for better contrast
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  optionWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  optionCard: {
    borderRadius: 16,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for cards
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#E1E1E1', // Light border
  },
  selectedCard: {
    borderColor: Colors.common.primary,
    backgroundColor: Colors.common.primaryLight,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333333', // Dark text for better contrast
  },
  selectedText: {
    color: Colors.common.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: Colors.common.teal, // Use teal from Image 2
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
