import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Dimensions,
  Alert
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
  Easing
} from 'react-native-reanimated';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

// Playful shape component for decoration
const PlayfulShape = ({ 
  type, 
  size, 
  color, 
  style 
}: { 
  type: 'circle' | 'star' | 'triangle' | 'heart', 
  size: number, 
  color: string, 
  style?: any 
}) => {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.5);
  
  useEffect(() => {
    // Animate in
    scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) });
    
    // Gentle rotation
    rotate.value = withRepeat(
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
        { rotate: `${rotate.value * Math.PI}rad` },
        { scale: scale.value }
      ],
    };
  });
  
  // Render a heart shape
  const renderHeart = () => (
    <View style={{
      width: size,
      height: size,
      transform: [{ rotate: '45deg' }]
    }}>
      <View style={{
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size * 0.35,
        backgroundColor: color,
        position: 'absolute',
        top: 0,
        left: 0,
      }} />
      <View style={{
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size * 0.35,
        backgroundColor: color,
        position: 'absolute',
        top: 0,
        right: 0,
      }} />
      <View style={{
        width: size * 0.7,
        height: size * 0.7,
        backgroundColor: color,
        position: 'absolute',
        bottom: 0,
        left: size * 0.15,
      }} />
    </View>
  );
  
  return (
    <Animated.View style={[styles.shapeContainer, animatedStyle, style]}>
      {type === 'circle' && (
        <View style={[
          styles.circle, 
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color }
        ]} />
      )}
      {type === 'star' && (
        <View style={{ width: size, height: size }}>
          {/* Simplified star shape */}
          <View style={[styles.star, { borderBottomColor: color }]} />
        </View>
      )}
      {type === 'triangle' && (
        <View style={[
          styles.triangle, 
          { borderBottomWidth: size, borderLeftWidth: size / 2, borderRightWidth: size / 2, borderBottomColor: color }
        ]} />
      )}
      {type === 'heart' && renderHeart()}
    </Animated.View>
  );
};

// Animated Input Field component
const AnimatedInputField = ({ 
  label, 
  placeholder, 
  value,
  onChangeText,
  autoCapitalize = 'none',
  keyboardType = 'default',
  delay = 0
}: { 
  label: string, 
  placeholder: string,
  value: string,
  onChangeText: (text: string) => void,
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad',
  delay?: number
}) => {
  const colorScheme = useColorScheme();
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });
  
  return (
    <Animated.View style={[styles.inputContainer, animatedStyle]}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: Colors[colorScheme ?? 'light'].input,
            color: Colors[colorScheme ?? 'light'].text,
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
    </Animated.View>
  );
};

// Animated Button component
const AnimatedButton = ({ 
  text, 
  onPress, 
  primary = true,
  delay = 0 
}: { 
  text: string, 
  onPress: () => void,
  primary?: boolean,
  delay?: number 
}) => {
  const colorScheme = useColorScheme();
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.button,
          primary 
            ? { backgroundColor: Colors.common.teal } 
            : { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.common.teal }
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        activeOpacity={0.8}
      >
        <ThemedText style={[
          styles.buttonText,
          primary ? { color: '#FFFFFF' } : { color: Colors.common.teal }
        ]}>
          {text}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Envelope animation
const EnvelopeAnimation = ({ size = 100 }: { size?: number }) => {
  const colorScheme = useColorScheme();
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const flap = useSharedValue(-45); // Controls the envelope flap
  
  useEffect(() => {
    // Animate in
    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) });
    
    // Gentle rotation
    rotate.value = withRepeat(
      withSequence(
        withTiming(-0.03, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.03, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    
    // Envelope flap animation
    flap.value = withSequence(
      withDelay(500, withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.cubic) })), // Close flap
      withDelay(1000, withTiming(-3, { duration: 300 })), // Small bounce
      withTiming(0, { duration: 300 }) // Return to closed
    );
  }, []);
  
  const envelopeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotate.value * Math.PI}rad` },
        { scale: scale.value }
      ],
    };
  });
  
  const flapStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: `${flap.value}deg` }
      ],
      // Adding z-index based on flap position to create a 3D effect
      zIndex: flap.value < -20 ? 1 : 3,
    };
  });
  
  return (
    <Animated.View style={[styles.envelopeContainer, envelopeStyle, { width: size, height: size * 0.7 }]}>
      {/* Envelope body */}
      <View style={[
        styles.envelopeBody, 
        { 
          width: size, 
          height: size * 0.7, 
          borderRadius: 8,
          backgroundColor: Colors.common.primary 
        }
      ]}>
        {/* Envelope inner (letter) */}
        <View style={[
          styles.envelopeInner, 
          { 
            width: size * 0.85, 
            height: size * 0.55, 
            borderRadius: 6,
            backgroundColor: '#FFFFFF'
          }
        ]}>
          {/* Letter lines */}
          <View style={[styles.letterLine, { width: size * 0.7, marginTop: size * 0.1 }]} />
          <View style={[styles.letterLine, { width: size * 0.5, marginTop: size * 0.08 }]} />
          <View style={[styles.letterLine, { width: size * 0.6, marginTop: size * 0.08 }]} />
        </View>
      </View>
      
      {/* Envelope flap */}
      <Animated.View style={[
        styles.envelopeFlap, 
        flapStyle,
        { 
          width: size, 
          height: size * 0.7, 
          borderRadius: 8,
          backgroundColor: Colors.common.primary
        }
      ]} />
    </Animated.View>
  );
};

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // Form state
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Header animation
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, []);
  
  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }]
    };
  });
  
  // Handle reset password
  const handleResetPassword = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to reset your password.');
      return;
    }
    
    // In a real app, this would send a reset password email
    setSubmitted(true);
    
    // Simulate success after 1.5 seconds and navigate back to login
    setTimeout(() => {
      router.push({ pathname: '/(auth)/login' });
    }, 3000);
  };
  
  // Handle back to login
  const handleBackToLogin = () => {
    router.push({ pathname: '/(auth)/login' });
  };
  
  // Alternative path to login
  const handleGoToLogin = () => {
    router.push({ pathname: '/(auth)/login' });
  };
  
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#FFFFFF' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      {/* Back button */}
      <TouchableOpacity 
        style={[styles.backButton, { marginTop: insets.top || 20 }]}
        onPress={() => router.back()}
      >
        <ThemedText>← Back</ThemedText>
      </TouchableOpacity>
      
      {/* Decorative shapes */}
      <PlayfulShape 
        type="circle" 
        size={35} 
        color={Colors.common.primary} 
        style={{ position: 'absolute', top: '15%', left: '12%', opacity: 0.15 }}
      />
      <PlayfulShape 
        type="heart" 
        size={25} 
        color={Colors.common.accent} 
        style={{ position: 'absolute', top: '30%', right: '15%', opacity: 0.15 }}
      />
      <PlayfulShape 
        type="triangle" 
        size={30} 
        color={Colors.common.teal} 
        style={{ position: 'absolute', bottom: '25%', left: '15%', opacity: 0.15 }}
      />
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {submitted ? (
          // Success state
          <View style={styles.successContainer}>
            <EnvelopeAnimation size={150} />
            
            <Animated.View style={[styles.header, headerStyle, { marginTop: 40 }]}>
              <ThemedText type="title" style={styles.title}>Email Sent!</ThemedText>
              <ThemedText style={styles.subtitle}>
                We've sent password reset instructions to your email.
              </ThemedText>
            </Animated.View>
            
            <AnimatedButton 
              text="Back to Login" 
              onPress={handleBackToLogin}
              delay={500}
              primary={false}
            />
          </View>
        ) : (
          // Form state
          <>
            <Animated.View style={[styles.header, headerStyle]}>
              <ThemedText type="title" style={styles.title}>Forgot Password?</ThemedText>
              <ThemedText style={styles.subtitle}>
                No worries! Enter your email and we'll send you instructions to reset your password.
              </ThemedText>
            </Animated.View>
            
            <View style={styles.form}>
              <AnimatedInputField
                label="Email"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                delay={200}
              />
              
              {/* Reset button */}
              <AnimatedButton 
                text="Reset Password" 
                onPress={handleResetPassword}
                delay={300}
              />
              
              {/* Back to login link */}
              <TouchableOpacity 
                style={styles.backToLoginLink}
                onPress={handleBackToLogin}
              >
                <ThemedText style={{ color: Colors.common.primary, textAlign: 'center' }}>
                  Remember your password? Log In
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    color: '#555555',
    maxWidth: '80%',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    gap: 24,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginLink: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  shapeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  star: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 15,
    borderBottomWidth: 10,
    borderLeftWidth: 15,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '180deg' }]
  },
  envelopeContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  envelopeBody: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  envelopeFlap: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ rotateX: '-45deg' }],
    transformOrigin: 'top',
    backfaceVisibility: 'hidden',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: '50%',
    zIndex: 2,
  },
  envelopeInner: {
    alignItems: 'center',
  },
  letterLine: {
    height: 2,
    backgroundColor: '#E1E1E1',
    borderRadius: 1,
  },
});
