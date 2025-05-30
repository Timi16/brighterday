import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useAppState } from '../hooks/useAppState';

const { width, height } = Dimensions.get('window');

// Sunny animated component
const SunnyAnimated = () => {
  const colorScheme = useColorScheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Fade in
    opacity.value = withTiming(1, { duration: 1000 });
    
    // Gentle rotation animation
    rotation.value = withRepeat(
      withSequence(
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    
    // Gentle pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);
  
  const sunnyStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value * Math.PI}rad` },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });
  
  return (
    <Animated.View style={[styles.sunnyContainer, sunnyStyle]}>
      <View style={[styles.sunCircle, { backgroundColor: Colors.common.accent }]}>
        {/* Sun rays */}
        {Array(12).fill(0).map((_, i) => (
          <View 
            key={`ray-${i}`} 
            style={[
              styles.sunRay, 
              { 
                backgroundColor: Colors.common.accent,
                transform: [{ rotate: `${i * 30}deg` }]
              }
            ]} 
          />
        ))}
        
        {/* Sun face */}
        <View style={styles.sunFace}>
          {/* Eyes */}
          <View style={styles.eyesContainer}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          
          {/* Smile */}
          <View style={styles.smile} />
        </View>
      </View>
    </Animated.View>
  );
};

export default function MeetSunnyScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { state } = useAppState();
  
  // Handle get started button press
  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to the chat screen
    router.replace('/(tabs)/chat');
  };

  // Get personalized greeting based on user selections
  const getPersonalizedGreeting = () => {
    let greeting = "Based on what you've shared, Sunny is ready to help with simple, step-by-step strategies.";
    
    if (state.focusArea) {
      const focusAreaMap: Record<string, string> = {
        'meltdowns': 'managing meltdowns',
        'potty': 'potty training',
        'communication': 'communication skills',
        'sleep': 'sleep challenges',
        'eating': 'picky eating',
        'directions': 'following directions',
        'other': 'your specific challenges',
        'unsure': 'finding the right strategies'
      };
      
      greeting = `Based on what you've shared, Sunny is ready to help with ${focusAreaMap[state.focusArea]} using simple, step-by-step strategies.`;
    }
    
    return greeting;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[
        styles.content,
        { 
          paddingTop: insets.top + 40, 
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24
        }
      ]}>
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.headerContainer}
        >
          <ThemedText style={styles.title}>Your Daily Helper — Meet Sunny</ThemedText>
        </Animated.View>
        
        <Animated.View 
          entering={FadeIn.delay(600).duration(800)}
          style={styles.sunnyWrapper}
        >
          <SunnyAnimated />
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(600)}
          style={styles.messageContainer}
        >
          <ThemedText style={styles.message}>
            {getPersonalizedGreeting()}
          </ThemedText>
          <ThemedText style={styles.subMessage}>
            You can ask questions anytime.
          </ThemedText>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(1400).duration(600)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.getStartedButtonText}>Get Started</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sunnyWrapper: {
    marginBottom: 40,
  },
  sunnyContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sunRay: {
    position: 'absolute',
    width: 10,
    height: 30,
    borderRadius: 5,
    top: -15,
    left: 55,
  },
  sunFace: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginBottom: 10,
  },
  eye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B4513',
  },
  smile: {
    width: 30,
    height: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
    borderRadius: 10,
  },
  messageContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
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
  getStartedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
