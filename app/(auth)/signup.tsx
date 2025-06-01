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

// Enhanced Playful Shape component with better animations (matching login)
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
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Staggered entrance animation
    opacity.value = withDelay(Math.random() * 500, withTiming(1, { duration: 800 }));
    scale.value = withDelay(Math.random() * 500, withTiming(1, { 
      duration: 1000, 
      easing: Easing.out(Easing.back(1.2)) 
    }));
    
    // Continuous gentle movement
    rotate.value = withRepeat(
      withSequence(
        withTiming(-0.1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { rotate: `${rotate.value}rad` },
        { scale: scale.value }
      ],
    };
  });
  
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

// Enhanced Input Field with better focus states (matching login)
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
  const [isFocused, setIsFocused] = useState(false);
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const borderColor = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);
  
  useEffect(() => {
    borderColor.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });
  
  const inputStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value === 1 ? Colors.common.teal : '#E5E5E5',
      shadowOpacity: borderColor.value * 0.1,
    };
  });
  
  return (
    <Animated.View style={[styles.inputContainer, animatedStyle]}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <Animated.View style={[styles.inputWrapper, inputStyle]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Animated.View>
    </Animated.View>
  );
};

// Enhanced Button with better press feedback (matching login)
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
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const pressScale = useSharedValue(1);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value * pressScale.value }]
    };
  });
  
  const handlePressIn = () => {
    pressScale.value = withTiming(0.95, { duration: 100 });
  };
  
  const handlePressOut = () => {
    pressScale.value = withTiming(1, { duration: 100 });
  };
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.button,
          primary 
            ? styles.primaryButton
            : styles.secondaryButton
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <ThemedText style={[
          styles.buttonText,
          primary ? styles.primaryButtonText : styles.secondaryButtonText
        ]}>
          {text}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Sunny icon with better animations (matching login)
const SunnyIcon = ({ size = 80 }: { size?: number }) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const rayRotation = useSharedValue(0);
  
  useEffect(() => {
    // Entrance animation
    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.1)) });
    
    // Gentle breathing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.98, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    // Slow ray rotation
    rayRotation.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 20000, easing: Easing.linear }),
      -1
    );
  }, []);
  
  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));
  
  const rayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rayRotation.value}rad` }]
  }));
  
  return (
    <Animated.View style={[styles.sunnyContainer, sunStyle]}>
      <View style={[styles.sunCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        <Animated.View style={[styles.raysContainer, rayStyle]}>
          {Array(8).fill(0).map((_, i) => (
            <View 
              key={`ray-${i}`} 
              style={[
                styles.sunRay, 
                { 
                  transform: [{ rotate: `${i * 45}deg` }],
                  width: size * 0.08,
                  height: size * 0.25,
                  top: -size * 0.125,
                  left: size * 0.46,
                }
              ]} 
            />
          ))}
        </Animated.View>
        
        <View style={styles.sunFace}>
          <View style={styles.eyesContainer}>
            <View style={[styles.eye, { width: size * 0.08, height: size * 0.08 }]} />
            <View style={[styles.eye, { width: size * 0.08, height: size * 0.08 }]} />
          </View>
          <View style={[styles.smile, { width: size * 0.35, height: size * 0.18 }]} />
        </View>
      </View>
    </Animated.View>
  );
};

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const containerOpacity = useSharedValue(0);
  const containerTranslateY = useSharedValue(20);
  
  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 800 });
    containerTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, []);
  
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ translateY: containerTranslateY.value }]
  }));
  
  const handleSignup = () => {
    router.push({ pathname: '/(tabs)' });
  };
  
  const handleGoToLogin = () => {
    router.push({ pathname: '/(auth)/login' });
  };
  
  return (
    <CleanHeader backgroundColor="#FAFAFA">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Enhanced decorative shapes */}
        <PlayfulShape 
          type="circle" 
          size={60} 
          color="rgba(52, 199, 189, 0.15)" 
          style={{ position: 'absolute', top: '15%', right: '10%' }}
        />
        <PlayfulShape 
          type="cloud" 
          size={45} 
          color="rgba(255, 193, 7, 0.2)" 
          style={{ position: 'absolute', top: '8%', left: '8%' }}
        />
        <PlayfulShape 
          type="triangle" 
          size={35} 
          color="rgba(52, 199, 189, 0.12)" 
          style={{ position: 'absolute', bottom: '25%', right: '8%' }}
        />
        <PlayfulShape 
          type="circle" 
          size={25} 
          color="rgba(255, 193, 7, 0.25)" 
          style={{ position: 'absolute', bottom: '35%', left: '12%' }}
        />
        
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 30 }
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.content, containerStyle]}>
            {/* Header */}
            <View style={styles.header}>
              <SunnyIcon size={100} />
              <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
              <ThemedText style={styles.subtitle}>
                Join us on your journey to brighter days
              </ThemedText>
            </View>
            
            {/* Form */}
            <View style={styles.form}>
              <AnimatedInputField
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                delay={200}
              />
              
              <AnimatedInputField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                delay={300}
              />
              
              <AnimatedInputField
                label="Password"
                placeholder="Create a secure password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                delay={400}
              />
              
              <AnimatedButton 
                text="Create Account" 
                onPress={handleSignup}
                delay={500}
              />
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.switchAuthContainer}>
                <ThemedText style={styles.switchAuthText}>
                  Already have an account? 
                </ThemedText>
                <TouchableOpacity onPress={handleGoToLogin}>
                  <ThemedText style={styles.switchAuthLink}>
                    Sign In
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CleanHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height * 0.85,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    maxWidth: '90%',
    lineHeight: 22,
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputWrapper: {
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    height: 54,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: Colors.common.teal,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.common.teal,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: Colors.common.teal,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  switchAuthText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },
  switchAuthLink: {
    color: Colors.common.teal,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 4,
    letterSpacing: -0.1,
  },
  shapeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunCircle: {
    backgroundColor: Colors.common.accent,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.common.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  raysContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sunRay: {
    position: 'absolute',
    backgroundColor: Colors.common.accent,
    borderRadius: 4,
    shadowColor: Colors.common.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  sunFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '45%',
    marginBottom: 8,
  },
  eye: {
    borderRadius: 10,
    backgroundColor: '#8B4513',
  },
  smile: {
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
    borderRadius: 20,
  },
});