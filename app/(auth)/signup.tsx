import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Dimensions
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
  Easing
} from 'react-native-reanimated';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { CleanHeader } from '../../components/CleanHeader';
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
  type: 'circle' | 'star' | 'triangle', 
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
    </Animated.View>
  );
};

// Animated Input Field component
const AnimatedInputField = ({ 
  label, 
  placeholder, 
  secureTextEntry = false,
  value,
  onChangeText,
  autoCapitalize = 'none',
  keyboardType = 'default',
  delay = 0
}: { 
  label: string, 
  placeholder: string,
  secureTextEntry?: boolean,
  value: string,
  onChangeText: (text: string) => void,
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad',
  delay?: number
}) => {
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
      <ThemedText style={{fontSize: 16, marginBottom: 8, color: '#333333', fontWeight: '500'}}>{label}</ThemedText>
      <TextInput
        style={{
          height: 45,
          width: '100%',
          borderRadius: 10,
          paddingHorizontal: 12,
          fontSize: 14,
          marginBottom: 8,
          backgroundColor: '#f5f5f5',
          color: '#333333',
          borderWidth: 1,
          borderColor: '#e0e0e0',
        }}
        placeholder={placeholder}
        placeholderTextColor={'#999999'}
        secureTextEntry={secureTextEntry}
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
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });
  
  return (
    <Animated.View style={[animatedStyle, { width: '100%', marginTop: 5 }]}>
      <TouchableOpacity 
        style={[
          styles.button,
          primary ? { backgroundColor: Colors.common.primary } : { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.common.teal }
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

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // We'll use a custom approach for the header
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
  
  // Handle signup
  const handleSignup = () => {
    // In a real app, this would validate and submit the form
    // For now, just navigate to the main app
    router.push({ pathname: '/(tabs)' });
  };
  
  // Handle navigation to login
  const handleGoToLogin = () => {
    router.push({ pathname: '/(auth)/login' });
  };
  
  return (
    <CleanHeader backgroundColor="#FFFFFF">
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: '#FFFFFF' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
      {/* Custom back button with no (auth) text */}
      <TouchableOpacity 
        style={[styles.backButton, { marginTop: insets.top || 20 }]}
        onPress={() => router.replace('/welcome')}
      >
        <ThemedText style={{ color: Colors.common.teal, fontWeight: '500', fontSize: 16 }}>Back</ThemedText>
      </TouchableOpacity>
      
      {/* Decorative shapes */}
      <PlayfulShape 
        type="circle" 
        size={40} 
        color={Colors.common.primary} 
        style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.2 }}
      />
      <PlayfulShape 
        type="star" 
        size={30} 
        color={Colors.common.accent} 
        style={{ position: 'absolute', top: '25%', right: '15%', opacity: 0.2 }}
      />
      <PlayfulShape 
        type="triangle" 
        size={25} 
        color={Colors.common.teal} 
        style={{ position: 'absolute', bottom: '30%', left: '15%', opacity: 0.15 }}
      />
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>
            Let's get started on your journey to brighter days
          </ThemedText>
        </Animated.View>
        
        {/* Form */}
        <View style={styles.form}>
          <AnimatedInputField
            label="Full Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            delay={100}
          />
          
          <AnimatedInputField
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            delay={150}
          />
          
          <AnimatedInputField
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            delay={200}
          />
          
          {/* Signup button */}
          <AnimatedButton 
            text="Create Account" 
            onPress={handleSignup}
            delay={500}
          />
          
          {/* Login link */}
          <View style={styles.switchAuthContainer}>
            <ThemedText>Already have an account? </ThemedText>
            <TouchableOpacity onPress={handleGoToLogin}>
              <ThemedText style={{ color: Colors.common.primary, fontWeight: 'bold' }}>
                Log In
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </CleanHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10, // Reduced padding to fit content better
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  header: {
    marginBottom: 10, // Drastically reduced
    alignItems: 'center',
    paddingTop: 5, // Minimal padding
  },
  title: {
    fontSize: 24, // Smaller title
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5, // Minimal margin
    color: '#333333',
  },
  subtitle: {
    fontSize: 14, // Smaller subtitle
    textAlign: 'center',
    color: '#555555',
    marginBottom: 10, // Minimal margin
  },
  form: {
    width: '100%',
    gap: 10, // Reduced gap to fit everything
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
    width: '100%',
    backgroundColor: Colors.common.teal,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
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
});
