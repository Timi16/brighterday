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
  Easing
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
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
    router.replace('/(tabs)');
  };
  
  // Handle navigation to login
  const handleGoToLogin = () => {
    router.push('/auth/login');
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
            delay={200}
          />
          
          <AnimatedInputField
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            delay={300}
          />
          
          <AnimatedInputField
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            delay={400}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: '80%',
  },
  form: {
    width: '100%',
    gap: 20,
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
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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
