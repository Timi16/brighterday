import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerTitle: '',
        headerStyle: { 
          backgroundColor: Colors.light.background 
        },
        headerShadowVisible: false,
        headerShown: false, 
        animation: 'fade'
      }} 
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
