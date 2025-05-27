import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

/**
 * CleanHeader provides a clean header without any folder name segments
 * This solves the problem of (auth) showing in the navigation header
 */
interface CleanHeaderProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export function CleanHeader({ children, backgroundColor = '#FFFFFF' }: CleanHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
      
      {/* This overlay completely hides the default header with (auth) text */}
      <View 
        style={[
          styles.headerOverlay, 
          { 
            height: insets.top + 40,
            backgroundColor
          }
        ]}
      />
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it sits on top of everything
  }
});
