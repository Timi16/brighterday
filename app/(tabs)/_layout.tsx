import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';

// Custom tab bar background component
const CustomTabBarBackground = () => {
  return Platform.OS === 'ios' ? (
    <BlurView 
      tint="light" 
      intensity={95} 
      style={StyleSheet.absoluteFill}
    />
  ) : (
    <View style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    }} />
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.common.teal,
        tabBarInactiveTintColor: '#555555',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: CustomTabBarBackground,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)',
          elevation: 8,
          height: 60 + (Platform.OS === 'ios' ? insets.bottom : 0),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
          paddingTop: 5,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -4,
        },
      }}>
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat with Sunny',
          tabBarIcon: ({ color, size }) => <Ionicons name="sunny" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips & Guides',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
