import React, { useRef, useEffect } from 'react';
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

import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

// Sunny animation with different expressions
const SunnyAnimation = ({ 
  expression = 'happy', 
  size = 80 
}: { 
  expression?: 'happy' | 'excited' | 'thoughtful', 
  size?: number 
}) => {
  const colorScheme = useColorScheme();
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
              <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
              <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
            </View>
            <View style={[
              styles.smile, 
              { 
                width: size * 0.4, 
                height: size * 0.25, 
                borderBottomWidth: 4 
              }
            ]} />
          </View>
        );
      case 'thoughtful':
        return (
          <View style={styles.sunFace}>
            <View style={styles.eyesContainer}>
              <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
              <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
            </View>
            <View style={{ 
              width: size * 0.3, 
              height: 4,
              backgroundColor: '#8B4513',
              borderRadius: 2,
              marginTop: size * 0.15
            }} />
          </View>
        );
      default: // happy
        return (
          <View style={styles.sunFace}>
            <View style={styles.eyesContainer}>
              <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
              <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
            </View>
            <View style={[
              styles.smile, 
              { 
                width: size * 0.4, 
                height: size * 0.2, 
                borderBottomWidth: 3 
              }
            ]} />
          </View>
        );
    }
  };
  
  return (
    <Animated.View style={[styles.sunnyContainer, animatedStyle]}>
      <View style={[styles.sunCircle, { 
        width: size, 
        height: size, 
        borderRadius: size / 2, 
        backgroundColor: Colors.common.accent 
      }]}>
        {/* Sun rays */}
        {Array(12).fill(0).map((_, i) => (
          <View 
            key={`ray-${i}`} 
            style={[
              styles.sunRay, 
              { 
                backgroundColor: Colors.common.accent,
                transform: [{ rotate: `${i * 30}deg` }],
                width: size * 0.08,
                height: size * 0.25,
                top: -size * 0.12,
                left: size * 0.46,
                borderRadius: size * 0.04,
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
  const colorScheme = useColorScheme();
  
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
            <ThemedText style={styles.iconText}>📈</ThemedText>
          </View>
        );
      case 'tips':
        return (
          <View style={[
            styles.iconContainer, 
            { backgroundColor: Colors.common.teal }
          ]}>
            <ThemedText style={styles.iconText}>💡</ThemedText>
          </View>
        );
      case 'profile':
        return (
          <View style={[
            styles.iconContainer, 
            { backgroundColor: Colors.common.accent }
          ]}>
            <ThemedText style={styles.iconText}>👤</ThemedText>
          </View>
        );
    }
  };
  
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).springify()}
      style={[
        styles.featureItem,
        { backgroundColor: Colors[colorScheme ?? 'light'].card }
      ]}
    >
      {getIcon()}
      <View style={styles.featureContent}>
        <ThemedText type="subtitle" style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDescription}>{description}</ThemedText>
      </View>
    </Animated.View>
  );
};

export default function LearnMoreScreen() {
  const colorScheme = useColorScheme();
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
    <ThemedView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Back button */}
      <TouchableOpacity 
        style={[styles.backButton, { marginTop: insets.top || 20 }]}
        onPress={handleBack}
      >
        <ThemedText>← Back</ThemedText>
      </TouchableOpacity>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeIn.delay(200).duration(800)}
          style={styles.header}
        >
          <SunnyAnimation size={100} expression="excited" />
          <ThemedText type="title" style={styles.title}>About Brighter Days</ThemedText>
          <ThemedText style={styles.subtitle}>
            A supportive companion for parents of children with autism
          </ThemedText>
        </Animated.View>
        
        {/* Mission statement */}
        <Animated.View 
          entering={FadeIn.delay(400).duration(800)}
          style={[styles.missionContainer, { backgroundColor: Colors.common.transparentPrimary }]}
        >
          <ThemedText type="subtitle" style={styles.missionTitle}>Our Mission</ThemedText>
          <ThemedText style={styles.missionText}>
            Brighter Days empowers parents with personalized guidance, research-based strategies, and a supportive community to help your child thrive.
          </ThemedText>
        </Animated.View>
        
        {/* Features */}
        <ThemedText 
          type="subtitle" 
          style={[styles.sectionTitle, { marginTop: 40 }]}
        >
          App Features
        </ThemedText>
        
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
          style={[styles.testimonialContainer, { backgroundColor: Colors.common.transparentAccent }]}
        >
          <ThemedText style={styles.testimonialQuote}>
            "Brighter Days has been a game-changer for our family. The strategies suggested by Sunny helped us transform our morning routine from chaos to calm."
          </ThemedText>
          <ThemedText style={styles.testimonialAuthor}>
            - Jamie, parent of a 6-year-old
          </ThemedText>
        </Animated.View>
        
        {/* Get Started button */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(800)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.common.teal }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleGetStarted();
            }}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Get Started Now</ThemedText>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: '90%',
  },
  missionContainer: {
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
  },
  missionTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  testimonialContainer: {
    padding: 20,
    borderRadius: 16,
    marginTop: 32,
    marginBottom: 16,
  },
  testimonialQuote: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  testimonialAuthor: {
    textAlign: 'right',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sunnyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunCircle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunRay: {
    position: 'absolute',
  },
  sunFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginBottom: 10,
  },
  eye: {
    borderRadius: 5,
    backgroundColor: '#8B4513',
  },
  smile: {
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
    borderRadius: 10,
  },
});
