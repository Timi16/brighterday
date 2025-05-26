import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing,
  interpolate,
  withDelay
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Screen dimensions
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
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.sine) }),
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.sine) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    
    // Gentle pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sine) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.sine) })
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

// Animated background bubbles
const BackgroundBubbles = () => {
  const colorScheme = useColorScheme();
  const bubbles = Array(6).fill(0).map((_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    x: Math.random() * width,
    y: Math.random() * height,
    delay: i * 400,
  }));
  
  return (
    <View style={styles.bubblesContainer}>
      {bubbles.map((bubble) => {
        const translateY = useSharedValue(bubble.y);
        const opacity = useSharedValue(0);
        const scale = useSharedValue(0.5);
        
        useEffect(() => {
          // Start animation after delay
          translateY.value = withDelay(
            bubble.delay,
            withRepeat(
              withTiming(bubble.y - 200, { duration: 15000, easing: Easing.linear }),
              -1,
              false
            )
          );
          
          opacity.value = withDelay(
            bubble.delay,
            withTiming(0.15, { duration: 1000 })
          );
          
          scale.value = withDelay(
            bubble.delay,
            withTiming(1, { duration: 1000 })
          );
        }, []);
        
        const bubbleStyle = useAnimatedStyle(() => {
          return {
            position: 'absolute',
            left: bubble.x,
            top: translateY.value,
            width: bubble.size,
            height: bubble.size,
            borderRadius: bubble.size / 2,
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
            backgroundColor: bubble.id % 2 === 0 ? Colors.common.primary : Colors.common.accent,
          };
        });
        
        return <Animated.View key={bubble.id} style={bubbleStyle} />;
      })}
    </View>
  );
};

// Welcome text animation
const WelcomeTextAnimated = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(1000, withTiming(0, { duration: 800 }));
  }, []);
  
  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  return (
    <Animated.View style={textStyle}>
      <ThemedText style={styles.welcomeTitle} type="title">Welcome to Brighter Days</ThemedText>
      <ThemedText style={styles.welcomeSubtitle}>
        Support for your parenting journey
      </ThemedText>
    </Animated.View>
  );
};

// Button animation
const AnimatedButton = ({ onPress, text, delay = 0 }: { onPress: () => void, text: string, delay?: number }) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  
  useEffect(() => {
    opacity.value = withDelay(1500 + delay, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(1500 + delay, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }));
  }, []);
  
  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  return (
    <Animated.View style={buttonStyle}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: Colors.common.teal }
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.buttonText}>{text}</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // Handle get started press
  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <ThemedView 
      style={[
        styles.container, 
        { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }
      ]}
    >
      {/* Animated background */}
      <BackgroundBubbles />
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Sunny animation */}
        <SunnyAnimated />
        
        {/* Welcome text */}
        <WelcomeTextAnimated />
        
        {/* Get started button */}
        <AnimatedButton 
          text="Get Started" 
          onPress={handleGetStarted}
        />
        
        {/* Learn more button */}
        <AnimatedButton 
          text="Learn About Brighter Days" 
          onPress={() => {/* Would navigate to About screen */}} 
          delay={200}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  bubblesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 32,
  },
  sunnyContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sunCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunRay: {
    position: 'absolute',
    width: 8,
    height: 30,
    borderRadius: 4,
    top: -20,
    left: 56,
  },
  sunFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 10,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B4513',
  },
  smile: {
    width: 40,
    height: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
    borderRadius: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: 280,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
