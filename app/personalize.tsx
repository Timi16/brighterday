import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
  Alert
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
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

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
  const { updateState } = useAppState();
  const { user, userProfile, updateProfile } = useSupabaseAuth();
  
  const [childAge, setChildAge] = useState<string | null>(null);
  const [firstTime, setFirstTime] = useState<string | null>(null);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pre-fill form if user has already set preferences
  useEffect(() => {
    if (userProfile) {
      if (userProfile.childAge) setChildAge(userProfile.childAge);
      if (userProfile.firstTime) setFirstTime(userProfile.firstTime);
      if (userProfile.feeling) setFeeling(userProfile.feeling);
    }
  }, [userProfile]);

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
  const handleContinue = async () => {
    if (childAge && firstTime && feeling) {
      try {
        setIsSubmitting(true);
        setError(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Store the personalization data in the app state
        updateState({
          childAge,
          firstTime,
          feeling
        });
        
        // Store the personalization data in Supabase if user is logged in
        if (user) {
          const { error } = await updateProfile({
            childAge,
            firstTime,
            feeling,
            personalization_completed: true,
            personalization_date: new Date().toISOString()
          });
          
          if (error) {
            console.error('Error updating profile:', error);
            setError('Failed to save your preferences. Please try again.');
            setIsSubmitting(false);
            return;
          }
        }
        
        // Navigate to the meet sunny screen
        router.push('/meet-sunny');
      } catch (err) {
        console.error('Personalization error:', err);
        setError('An unexpected error occurred');
        setIsSubmitting(false);
      }
    }
  };

  // Check if all required fields are selected
  const isFormComplete = childAge && firstTime && feeling;

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
          <Text style={styles.title}>Let's tailor this for you</Text>
        </Animated.View>

        {/* Age Selection */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>My child is:</Text>
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
                <Text 
                  style={[
                    styles.optionText,
                    childAge === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Experience Selection */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={styles.sectionTitle}>
            This is my first time using behavior tools:
          </Text>
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
                <Text 
                  style={[
                    styles.optionText,
                    firstTime === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Feeling Selection */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={styles.sectionTitle}>
            Today I'm feeling:
          </Text>
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
                <Text style={styles.emojiText}>{option.emoji}</Text>
                <Text 
                  style={[
                    styles.optionText,
                    feeling === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(700)}
          style={styles.buttonContainer}
        >
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <TouchableOpacity 
            style={[styles.continueButton, (!isFormComplete || isSubmitting) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!isFormComplete || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
    color: '#333333', // Dark text for better contrast
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
    backgroundColor: '#FFFFFF', // White background for cards
    borderWidth: 1.5,
    borderColor: '#E1E1E1', // Light border
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
    backgroundColor: '#FFFFFF', // White background for cards
    borderWidth: 1.5,
    borderColor: '#E1E1E1', // Light border
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
    color: '#333333', // Dark text for better contrast
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
    borderRadius: 16, // Increased border radius for modern look
    marginBottom: 16,
    backgroundColor: '#FFFFFF', // White background for cards
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E1E1E1', // Light border
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
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
});
