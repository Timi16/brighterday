import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, { 
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Sunny Logo component
const SunnyLogo = () => {
  return (
    <View style={styles.logoContainer}>
      {/* Sun icon */}
      <View style={styles.sunIcon}>
        {/* Sun face */}
        <View style={styles.sunFace}>
          <View style={styles.eyesContainer}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.mouth} />
        </View>
        
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
      </View>
      
      {/* Logo text */}
      <Text style={styles.logoText}>
        <Text style={styles.brightText}>BRIGHTER</Text>{"\n"}
        <Text style={styles.daysText}>DAYS</Text>
      </Text>
    </View>
  );
};

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  // Handle button actions
  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/signup');
  };

  const handleLearnMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/learn-more');
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/login');
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
        {/* Logo Section */}
        <Animated.View 
          entering={FadeIn.delay(100).duration(800)}
          style={styles.logoSection}
        >
          <SunnyLogo />
        </Animated.View>
        
        {/* Welcome Text */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={styles.welcomeTextContainer}
        >
          <Text style={styles.welcomeTitle}>Welcome to{"\n"}Brighter Days</Text>
          <Text style={styles.welcomeSubtitle}>Compassionate tools for your parenting journey</Text>
        </Animated.View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(600).duration(500)}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleLearnMore}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>What is Brighter Days?</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(700).duration(500)}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
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
    opacity: 0.15, // Lighter pattern
    zIndex: -1,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#FFDB58', // More yellow color for Sunny
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  sunRay: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: '#FFDB58', // Match sun color
    borderRadius: 2,
    top: -10,
    left: 38,
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
    marginBottom: 8,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B4513', // Brown eyes
  },
  mouth: {
    width: 16,
    height: 2,
    backgroundColor: '#8B4513', // Brown mouth
    borderRadius: 1,
  },
  logoText: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 36,
    width: '100%',
  },
  brightText: {
    color: Colors.common.primary,
  },
  daysText: {
    color: Colors.common.primary,
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333333',
    width: '100%',
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555555',
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
  },
  getStartedButton: {
    backgroundColor: Colors.common.teal,
    paddingVertical: 16,
    borderRadius: 30,
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
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.common.teal,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.common.teal,
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#555555',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
