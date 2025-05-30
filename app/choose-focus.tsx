import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
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
  const colorScheme = useColorScheme();
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
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.delay(100).duration(600)}>
          <ThemedText style={styles.title}>What would you like help with?</ThemedText>
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
                  selectedFocus === area.id && styles.selectedCard,
                  { backgroundColor: colorScheme === 'dark' ? Colors.dark.cardBackground : Colors.light.cardBackground }
                ]}
                onPress={() => handleSelectFocus(area.id)}
                activeOpacity={0.7}
              >
                <ThemedText 
                  style={[
                    styles.optionText,
                    selectedFocus === area.id && styles.selectedText
                  ]}
                >
                  {area.label}
                </ThemedText>
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
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.common.primary,
    backgroundColor: Colors.common.primaryLight,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
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
    backgroundColor: Colors.common.primary,
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
