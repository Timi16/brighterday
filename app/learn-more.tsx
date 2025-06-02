import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  Text,
  SafeAreaView,
  StatusBar
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

const { width, height } = Dimensions.get('window');

// Sunny animation with different expressions
const SunnyAnimation = ({ 
  expression = 'happy', 
  size = 80 
}: { 
  expression?: 'happy' | 'excited' | 'thoughtful', 
  size?: number 
}) => {
  const scale = useSharedValue(0.9);
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    // Gentle pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    
    // Gentle rotation animation
    rotation.value = withRepeat(
      withSequence(
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value * Math.PI}rad` }
      ],
    };
  });
  
  // Different faces based on expression
  const renderFace = () => {
    switch (expression) {
      case 'excited':
        return (
          <View style={styles.sunFace}>
            <View style={styles.eyesContainer}>
              <View style={[styles.eye, { width: size * 0.075, height: size * 0.075 }]} />
              <View style={[styles.eye, { width: size * 0.075, height: size * 0.075 }]} />
            </View>
            <View style={[
              styles.mouth, 
              { 
                width: size * 0.3, 
                height: size * 0.025,
                borderRadius: 1,
              }
            ]} />
          </View>
        );
      case 'thoughtful':
        return (
          <View style={styles.sunFace}>
            <View style={styles.eyesContainer}>
              <View style={[styles.eye, { width: size * 0.075, height: size * 0.075 }]} />
              <View style={[styles.eye, { width: size * 0.075, height: size * 0.075 }]} />
            </View>
            <View style={[
              styles.mouth, 
              { 
                width: size * 0.2, 
                height: size * 0.025,
                borderRadius: 1,
              }
            ]} />
          </View>
        );
      default: // happy
        return (
          <View style={styles.sunFace}>
            <View style={styles.eyesContainer}>
              <View style={[styles.eye, { width: size * 0.075, height: size * 0.075 }]} />
              <View style={[styles.eye, { width: size * 0.075, height: size * 0.075 }]} />
            </View>
            <View style={[
              styles.mouth, 
              { 
                width: size * 0.2, 
                height: size * 0.025,
                borderRadius: 1,
              }
            ]} />
          </View>
        );
    }
  };
  
  return (
    <Animated.View style={[styles.sunnyContainer, animatedStyle]}>
      <View style={[styles.sunIcon, { 
        width: size, 
        height: size, 
        borderRadius: size / 2 
      }]}>
        {/* Sun rays */}
        {Array(12).fill(0).map((_, i) => (
          <View 
            key={`ray-${i}`} 
            style={[
              styles.sunRay, 
              { 
                transform: [{ rotate: `${i * 30}deg` }],
                width: size * 0.05,
                height: size * 0.25,
                top: -size * 0.125,
                left: size * 0.475,
              }
            ]} 
          />
        ))}
        
        {/* Sun face */}
        {renderFace()}
      </View>
    </Animated.View>
  );
};

// Feature item component with animation
const FeatureItem = ({ 
  icon, 
  title, 
  description, 
  delay = 0
}: { 
  icon: 'chat' | 'progress' | 'tips' | 'profile', 
  title: string, 
  description: string,
  delay?: number
}) => {
  
  // Get icon based on type
  const getIcon = () => {
    switch (icon) {
      case 'chat':
        return <SunnyAnimation size={60} expression="happy" />;
      case 'progress':
        return (
          <View style={[
            styles.iconContainer, 
            { backgroundColor: Colors.common.primary }
          ]}>
            <Text style={styles.iconText}>📈</Text>
          </View>
        );
      case 'tips':
        return (
          <View style={[
            styles.iconContainer, 
            { backgroundColor: Colors.common.teal }
          ]}>
            <Text style={styles.iconText}>💡</Text>
          </View>
        );
      case 'profile':
        return (
          <View style={[
            styles.iconContainer, 
            { backgroundColor: '#FFDB58' }
          ]}>
            <Text style={styles.iconText}>👤</Text>
          </View>
        );
    }
  };
  
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).springify()}
      style={styles.featureItem}
    >
      {getIcon()}
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

export default function LearnMoreScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Handle back button press
  const handleBack = () => {
    router.back();
  };
  
  // Handle get started press
  const handleGetStarted = () => {
    router.push('/(auth)/signup');
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
      
      {/* Back button */}
      <TouchableOpacity 
        style={[styles.backButton, { marginTop: insets.top + 20 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleBack();
        }}
      >
        <View style={styles.backArrow}>
          <View style={styles.backArrowLine} />
          <View style={styles.backArrowPoint} />
        </View>
      </TouchableOpacity>
      
      <SafeAreaView style={[styles.content, { paddingTop: insets.top }]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View 
            entering={FadeIn.delay(200).duration(800)}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <SunnyAnimation size={100} expression="excited" />
            </View>
            <Text style={styles.welcomeTitle}>About Brighter Days</Text>
            <Text style={styles.welcomeSubtitle}>
              A supportive companion for parents of children with autism
            </Text>
          </Animated.View>
          
          {/* Mission statement */}
          <Animated.View 
            entering={FadeIn.delay(400).duration(800)}
            style={styles.missionContainer}
          >
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              Brighter Days empowers parents with personalized guidance, research-based strategies, and a supportive community to help your child thrive.
            </Text>
          </Animated.View>
          
          {/* Features */}
          <Text style={styles.sectionTitle}>App Features</Text>
          
          <View style={styles.featuresContainer}>
            <FeatureItem
              icon="chat"
              title="Chat with Sunny"
              description="Get personalized strategies and answers to your parenting questions anytime."
              delay={600}
            />
            
            <FeatureItem
              icon="progress"
              title="Progress Tracker"
              description="Track what works for your child with a visual timeline of strategies and outcomes."
              delay={700}
            />
            
            <FeatureItem
              icon="tips"
              title="Tips & Guides"
              description="Access expert-verified resources tailored to your child's unique needs."
              delay={800}
            />
            
            <FeatureItem
              icon="profile"
              title="Personalized Profile"
              description="Customize your experience based on your child's age, interests, and challenges."
              delay={900}
            />
          </View>
          
          {/* Testimonial */}
          <Animated.View 
            entering={FadeIn.delay(1000).duration(800)}
            style={styles.testimonialContainer}
          >
            <Text style={styles.testimonialQuote}>
              "Brighter Days has been a game-changer for our family. The strategies suggested by Sunny helped us transform our morning routine from chaos to calm."
            </Text>
            <Text style={styles.testimonialAuthor}>
              - Jamie, parent of a 6-year-old
            </Text>
          </Animated.View>
          
          {/* Get Started button */}
          <Animated.View
            entering={FadeIn.delay(1200).duration(800)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleGetStarted();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedButtonText}>Get Started For Free</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Same warm white background as welcome
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15, // Same pattern opacity as welcome
    zIndex: -1,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60, // Space for back button
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: Colors.common.teal,
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  backArrow: {
    width: 22,
    height: 12,
    position: 'relative',
  },
  backArrowLine: {
    position: 'absolute',
    top: 5,
    left: 1,
    width: 18,
    height: 2,
    backgroundColor: 'white',
  },
  backArrowPoint: {
    position: 'absolute',
    top: 5,
    left: 0,
    width: 8,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white',
    transform: [{ rotate: '45deg' }, { translateY: -3 }],
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  missionContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 224, 0.2)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  missionTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.common.teal,
  },
  missionText: {
    lineHeight: 22,
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 224, 0.2)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.common.teal,
  },
  featureDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    fontWeight: '500',
  },
  testimonialContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 224, 0.2)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testimonialQuote: {
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 12,
    color: '#333333',
    fontSize: 15,
    fontWeight: '500',
  },
  testimonialAuthor: {
    fontWeight: 'bold',
    textAlign: 'right',
    color: Colors.common.teal,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
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
  sunnyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunIcon: {
    backgroundColor: '#FFDB58', // Same yellow color as welcome
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sunRay: {
    position: 'absolute',
    backgroundColor: '#FFDB58', // Match sun color
    borderRadius: 2,
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
    borderRadius: 3,
    backgroundColor: '#8B4513', // Brown eyes like welcome
  },
  mouth: {
    backgroundColor: '#8B4513', // Brown mouth like welcome
    borderRadius: 1,
  },
});