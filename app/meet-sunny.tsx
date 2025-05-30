import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
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

import { Colors } from '../constants/Colors';
import { useAppState } from '../hooks/useAppState';

const { width, height } = Dimensions.get('window');

// Sunny animated component
const SunnyAnimated = () => {
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
      <View style={styles.sunCircle}>
        {/* Sun rays */}
        {Array(12).fill(0).map((_, i) => (
          <View 
            key={`ray-${i}`} 
            style={[
              styles.sunRay, 
              { transform: [{ rotate: `${i * 30}deg` }] }
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Image
          source={require('../assets/images/sun-pattern.png')}
          style={styles.patternImage}
          contentFit="cover"
          cachePolicy="memory"
        />
      </View>
      
      <SafeAreaView style={[styles.content, { paddingTop: insets.top }]}>
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.headerContainer}
        >
          <Text style={styles.title}>Your Daily Helper — Meet Sunny</Text>
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
          <Text style={styles.message}>
            {getPersonalizedGreeting()}
          </Text>
          <Text style={styles.subMessage}>
            You can ask questions anytime.
          </Text>
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
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Warm white background like in Image 3
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333333',
  },
  sunnyWrapper: {
    marginBottom: 40,
  },
  sunnyContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFDB58', 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sunRay: {
    position: 'absolute',
    width: 6,
    height: 24,
    borderRadius: 3,
    backgroundColor: '#FFDB58', 
    top: -15,
    left: 57,
  },
  sunFace: {
    width: '60%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 10,
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B4513', 
  },
  smile: {
    width: 30,
    height: 16,
    borderBottomWidth: 2.5,
    borderBottomColor: '#8B4513', 
    borderRadius: 10,
  },
  messageContainer: {
    marginVertical: 40,
    width: '100%',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 26,
    color: '#333333',
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: Colors.common.teal,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    minWidth: 220,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
