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
  type: 'circle' | 'star' | 'triangle' | 'cloud', 
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
  
  // Render a cloud shape
  const renderCloud = () => (
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
        backgroundColor: color,
        position: 'absolute',
        left: size * 0.2,
      }} />
      <View style={{
        width: size * 0.8,
        height: size * 0.8,
        borderRadius: size,
        backgroundColor: color,
        position: 'absolute',
        left: size * 0.6,
      }} />
      <View style={{
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size,
        backgroundColor: color,
        position: 'absolute',
        left: size * 1,
      }} />
      <View style={{
        width: size * 1.6,
        height: size * 0.5,
        borderRadius: size,
        backgroundColor: color,
        position: 'absolute',
        bottom: size * 0.15,
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
      {type === 'cloud' && renderCloud()}
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
          height: 45, // Reduced from 56
          width: '100%',
          borderRadius: 10, // Reduced from 12
          paddingHorizontal: 12, // Reduced from 16
          fontSize: 14, // Reduced from 16
          marginBottom: 8, // Reduced from 16
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

// Sunny icon component
const SunnyIcon = ({ size = 60 }: { size?: number }) => {
  const scale = useSharedValue(0.8);
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
  
  return (
    <Animated.View style={[styles.sunnyContainer, animatedStyle]}>
      <View style={[styles.sunCircle, { 
        width: size, 
        height: size, 
        borderRadius: size / 2, 
        backgroundColor: Colors.common.accent 
      }]}>
        {/* Sun rays */}
        {Array(8).fill(0).map((_, i) => (
          <View 
            key={`ray-${i}`} 
            style={[
              styles.sunRay, 
              { 
                backgroundColor: Colors.common.accent,
                transform: [{ rotate: `${i * 45}deg` }],
                width: size * 0.1,
                height: size * 0.3,
                top: -size * 0.15,
                left: size * 0.45,
              }
            ]} 
          />
        ))}
        
        {/* Sun face */}
        <View style={styles.sunFace}>
          {/* Eyes */}
          <View style={styles.eyesContainer}>
            <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
            <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
          </View>
          
          {/* Smile */}
          <View style={[styles.smile, { width: size * 0.4, height: size * 0.2 }]} />
        </View>
      </View>
    </Animated.View>
  );
};

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // Form state
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
  
  // Handle login
  const handleLogin = () => {
    // In a real app, this would validate and submit the form
    // For now, just navigate to the main app
    router.push({ pathname: '/(tabs)' });
  };
  
  // Handle navigation to signup
  const handleGoToSignup = () => {
    router.push({ pathname: '/(auth)/signup' });
  };
  
  // Handle navigation to forgot password
  const handleGoToForgotPassword = () => {
    router.push({ pathname: '/(auth)/forgot-password' });
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
        style={{ position: 'absolute', top: '20%', right: '15%', opacity: 0.2 }}
      />
      <PlayfulShape 
        type="cloud" 
        size={30} 
        color={Colors.common.accent} 
        style={{ position: 'absolute', top: '10%', left: '10%', opacity: 0.2 }}
      />
      <PlayfulShape 
        type="triangle" 
        size={25} 
        color={Colors.common.teal} 
        style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.15 }}
      />
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Sunny */}
        <Animated.View style={[styles.header, headerStyle]}>
          <SunnyIcon size={80} />
          <ThemedText type="title" style={styles.title}>Welcome Back!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Log in to continue your journey
          </ThemedText>
        </Animated.View>
        
        {/* Form */}
        <View style={styles.form}>
          <AnimatedInputField
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            delay={100}
          />
          
          <AnimatedInputField
            label="Password"
            placeholder="Your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            delay={150}
          />
          
          {/* Forgot password link - made more compact */}
          <TouchableOpacity
            style={[styles.forgotPassword, { marginTop: 2, marginBottom: 5 }]}
            onPress={handleGoToForgotPassword}
          >
            <ThemedText style={{ color: Colors.common.primary, textAlign: 'right', fontSize: 13 }}>
              Forgot your password?
            </ThemedText>
          </TouchableOpacity>
          
          {/* Login button */}
          <AnimatedButton 
            text="Log In" 
            onPress={handleLogin}
            delay={200} /* faster animation */
          />
          
          {/* Signup link - made more compact */}
          <View style={[styles.switchAuthContainer, {marginTop: 5}]}>
            <ThemedText style={{fontSize: 13}}>Don't have an account? </ThemedText>
            <TouchableOpacity onPress={handleGoToSignup}>
              <ThemedText style={{ color: Colors.common.primary, fontWeight: 'bold', fontSize: 13 }}>
                Sign Up
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
    marginBottom: 20, // Reduced from 40
    alignItems: 'center',
    paddingTop: 10, // Added padding at top
  },
  title: {
    fontSize: 28, // Reduced from 30
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10, // Reduced from 20
    color: '#333333', // Darker color for better contrast
  },
  subtitle: {
    fontSize: 16, // Reduced from 17
    textAlign: 'center',
    color: '#555555', // Medium dark for better contrast
    maxWidth: '85%',
    marginBottom: 20, // Added bottom margin
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
    height: 45, // Reduced from 56
    width: '100%',
    backgroundColor: Colors.common.teal,
    borderRadius: 10, // Reduced from 12
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8, // Reduced from 24
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    color: Colors.common.teal,
    fontWeight: '500',
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
  sunnyContainer: {
    width: 80,
    height: 80,
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
    borderRadius: 4,
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
