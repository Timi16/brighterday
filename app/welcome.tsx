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

// Playful background elements
const PlayfulBackground = () => {
  const colorScheme = useColorScheme();
  
  // Create different playful shapes
  const shapes = [
    // Circles
    ...Array(5).fill(0).map((_, i) => ({
      id: `circle-${i}`,
      type: 'circle',
      size: Math.random() * 50 + 20,
      x: Math.random() * width,
      y: Math.random() * height,
      delay: i * 300,
      color: i % 3 === 0 ? Colors.common.primary : 
             i % 3 === 1 ? Colors.common.accent : 
             Colors.common.teal,
      opacity: 0.12 + (Math.random() * 0.08)
    })),
    
    // Stars
    ...Array(4).fill(0).map((_, i) => ({
      id: `star-${i}`,
      type: 'star',
      size: Math.random() * 30 + 15,
      x: Math.random() * width,
      y: Math.random() * height,
      delay: i * 400 + 200,
      color: i % 2 === 0 ? Colors.common.accent : Colors.common.teal,
      opacity: 0.15 + (Math.random() * 0.1)
    })),
    
    // Clouds
    ...Array(3).fill(0).map((_, i) => ({
      id: `cloud-${i}`,
      type: 'cloud',
      size: Math.random() * 60 + 40,
      x: Math.random() * width,
      y: Math.random() * (height / 2),
      delay: i * 500 + 100,
      color: '#FFFFFF',
      opacity: 0.2 + (Math.random() * 0.1)
    })),
  ];
  
  // Render a star shape
  const renderStar = (size: number) => (
    <View style={{
      width: size,
      height: size,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        width: size,
        height: size * 0.4,
        backgroundColor: 'currentColor',
        borderRadius: size / 10,
        position: 'absolute',
        transform: [{ rotate: '0deg' }]
      }} />
      <View style={{
        width: size,
        height: size * 0.4,
        backgroundColor: 'currentColor',
        borderRadius: size / 10,
        position: 'absolute',
        transform: [{ rotate: '72deg' }]
      }} />
      <View style={{
        width: size,
        height: size * 0.4,
        backgroundColor: 'currentColor',
        borderRadius: size / 10,
        position: 'absolute',
        transform: [{ rotate: '144deg' }]
      }} />
      <View style={{
        width: size,
        height: size * 0.4,
        backgroundColor: 'currentColor',
        borderRadius: size / 10,
        position: 'absolute',
        transform: [{ rotate: '-72deg' }]
      }} />
      <View style={{
        width: size,
        height: size * 0.4,
        backgroundColor: 'currentColor',
        borderRadius: size / 10,
        position: 'absolute',
        transform: [{ rotate: '-144deg' }]
      }} />
    </View>
  );
  
  // Render a cloud shape
  const renderCloud = (size: number) => (
    <View style={{
      width: size * 1.8,
      height: size,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        width: size * 0.6,
        height: size * 0.6,
        borderRadius: size,
        backgroundColor: 'currentColor',
        position: 'absolute',
        left: size * 0.2,
      }} />
      <View style={{
        width: size * 0.8,
        height: size * 0.8,
        borderRadius: size,
        backgroundColor: 'currentColor',
        position: 'absolute',
        left: size * 0.6,
      }} />
      <View style={{
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size,
        backgroundColor: 'currentColor',
        position: 'absolute',
        left: size * 1,
      }} />
      <View style={{
        width: size * 1.6,
        height: size * 0.5,
        borderRadius: size,
        backgroundColor: 'currentColor',
        position: 'absolute',
        bottom: size * 0.15,
      }} />
    </View>
  );
  
  return (
    <View style={styles.backgroundContainer}>
      {shapes.map((shape) => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);
        const opacity = useSharedValue(0);
        const scale = useSharedValue(0.5);
        const rotate = useSharedValue(0);
        
        useEffect(() => {
          // Start animations after delay
          opacity.value = withDelay(
            shape.delay,
            withTiming(shape.opacity, { duration: 1000 })
          );
          
          scale.value = withDelay(
            shape.delay,
            withTiming(1, { duration: 1000 })
          );
          
          // Different movement for different shapes
          if (shape.type === 'circle') {
            // Gentle floating animation
            translateY.value = withDelay(
              shape.delay,
              withRepeat(
                withSequence(
                  withTiming(-15, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
                  withTiming(15, { duration: 3000, easing: Easing.inOut(Easing.sin) })
                ),
                -1,
                true
              )
            );
            
            // Slight rotation
            rotate.value = withDelay(
              shape.delay,
              withRepeat(
                withTiming(Math.PI * 2, { duration: 20000, easing: Easing.linear }),
                -1,
                false
              )
            );
          } else if (shape.type === 'star') {
            // Gentle twinkling
            scale.value = withDelay(
              shape.delay,
              withRepeat(
                withSequence(
                  withTiming(1, { duration: 1000 }),
                  withTiming(0.85, { duration: 1000 }),
                  withTiming(1.1, { duration: 800 }),
                  withTiming(0.9, { duration: 1200 }),
                  withTiming(1, { duration: 1000 })
                ),
                -1,
                false
              )
            );
            
            // Slow rotation
            rotate.value = withDelay(
              shape.delay,
              withRepeat(
                withTiming(Math.PI / 6, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
                -1,
                true
              )
            );
          } else if (shape.type === 'cloud') {
            // Slow horizontal movement
            translateX.value = withDelay(
              shape.delay,
              withRepeat(
                withSequence(
                  withTiming(width / 2, { duration: 40000, easing: Easing.linear }),
                  withTiming(-width / 2, { duration: 0 }) // Reset position
                ),
                -1,
                false
              )
            );
          }
        }, []);
        
        const shapeStyle = useAnimatedStyle(() => {
          return {
            position: 'absolute',
            left: shape.x + translateX.value,
            top: shape.y + translateY.value,
            opacity: opacity.value,
            transform: [
              { scale: scale.value },
              { rotate: `${rotate.value}rad` }
            ],
          };
        });
        
        return (
          <Animated.View 
            key={shape.id} 
            style={[shapeStyle, { zIndex: -1 }]}
          >
            <View style={{ color: shape.color }}>
              {shape.type === 'circle' && (
                <View 
                  style={{
                    width: shape.size,
                    height: shape.size,
                    borderRadius: shape.size / 2,
                    backgroundColor: 'currentColor',
                  }}
                />
              )}
              {shape.type === 'star' && renderStar(shape.size)}
              {shape.type === 'cloud' && renderCloud(shape.size)}
            </View>
          </Animated.View>
        );
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
    router.push('/auth/signup');
  };
  
  // Handle learn more press
  const handleLearnMore = () => {
    router.push('/learn-more');
  };
  
  return (
    <ThemedView 
      style={[
        styles.container, 
        { 
          backgroundColor: '#FFFFFF', // Pure white background for kid-friendly look
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }
      ]}
    >
      {/* Playful animated background */}
      <PlayfulBackground />
      
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
          onPress={handleLearnMore} 
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
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
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
