import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity,
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

// Age options from 1-14
const ageOptions = Array.from({ length: 14 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1} years old`
}));

// Experience options
const experienceOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

// Feeling options
const feelingOptions = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😣' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😩' }
];

export default function PersonalizeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { updateState } = useAppState();
  
  const [childAge, setChildAge] = useState<string | null>(null);
  const [firstTime, setFirstTime] = useState<string | null>(null);
  const [feeling, setFeeling] = useState<string | null>(null);

  // Handle age selection
  const handleSelectAge = (age: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChildAge(age);
  };

  // Handle experience selection
  const handleSelectExperience = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFirstTime(value);
  };

  // Handle feeling selection
  const handleSelectFeeling = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeeling(value);
  };

  // Handle continue button press
  const handleContinue = () => {
    if (childAge && firstTime && feeling) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Store the personalization data in the app state
      updateState({
        childAge,
        firstTime,
        feeling
      });
      // Navigate to the meet sunny screen
      router.push('/meet-sunny');
    }
  };

  // Check if all required fields are selected
  const isFormComplete = childAge && firstTime && feeling;

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
          <ThemedText style={styles.title}>Let's tailor this for you</ThemedText>
        </Animated.View>

        {/* Age Selection */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ThemedText style={styles.sectionTitle}>My child is:</ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsScroll}
          >
            {ageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  childAge === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelectAge(option.value)}
                activeOpacity={0.7}
              >
                <ThemedText 
                  style={[
                    styles.optionText,
                    childAge === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Experience Selection */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <ThemedText style={styles.sectionTitle}>
            This is my first time using behavior tools:
          </ThemedText>
          <View style={styles.optionsRow}>
            {experienceOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButtonWide,
                  firstTime === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelectExperience(option.value)}
                activeOpacity={0.7}
              >
                <ThemedText 
                  style={[
                    styles.optionText,
                    firstTime === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Feeling Selection */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <ThemedText style={styles.sectionTitle}>
            Today I'm feeling:
          </ThemedText>
          <View style={styles.feelingOptionsContainer}>
            {feelingOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.feelingOption,
                  feeling === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelectFeeling(option.value)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.emojiText}>{option.emoji}</ThemedText>
                <ThemedText 
                  style={[
                    styles.optionText,
                    feeling === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View 
          entering={FadeIn.delay(500).duration(400)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              { opacity: isFormComplete ? 1 : 0.6 }
            ]}
            onPress={handleContinue}
            disabled={!isFormComplete}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
  },
  optionsScroll: {
    paddingRight: 20,
    paddingVertical: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionButtonWide: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: '40%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOption: {
    borderColor: Colors.common.primary,
    backgroundColor: Colors.common.primaryLight,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: Colors.common.primary,
    fontWeight: 'bold',
  },
  feelingOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  feelingOption: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emojiText: {
    fontSize: 28,
    marginBottom: 8,
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
