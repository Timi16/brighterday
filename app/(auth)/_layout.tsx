import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
        animation: 'slide_from_right'
      }} 
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
