import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Stack 
      screenOptions={{
        // Completely hide header
        headerShown: false,
        
        // Set white background to avoid any previous screen showing through
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
        
        // Use slide animation for smoother transitions
        animation: 'slide_from_right',
        
        // Ensure no header text shows up by using a component
        headerTitle: () => null,
      }} 
    >
      <Stack.Screen 
        name="login" 
        options={{
          title: '',
          headerTitle: () => null
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{
          title: '',
          headerTitle: () => null
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{
          title: '',
          headerTitle: () => null
        }} 
      />
    </Stack>
  );
}
