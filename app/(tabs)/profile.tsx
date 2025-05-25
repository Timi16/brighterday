import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Child profile type
type ChildProfile = {
  id: string;
  name: string;
  age: number;
  interests: string[];
  challenges: string[];
};

// Sample child profile
const initialChildProfile: ChildProfile = {
  id: '1',
  name: 'Alex',
  age: 5,
  interests: ['Dinosaurs', 'Building blocks', 'Water play'],
  challenges: ['Food selectivity', 'Transitions', 'Sleep disruption'],
};

// Setting type
type Setting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'notifications' | 'privacy' | 'preferences';
};

// Sample settings
const initialSettings: Setting[] = [
  {
    id: 'notify-tips',
    title: 'Weekly Tips',
    description: 'Receive a weekly tip based on your child\'s needs',
    enabled: true,
    category: 'notifications',
  },
  {
    id: 'notify-progress',
    title: 'Progress Reminders',
    description: 'Reminders to update your progress tracking',
    enabled: true,
    category: 'notifications',
  },
  {
    id: 'data-anonymous',
    title: 'Anonymous Data Collection',
    description: 'Help improve Sunny with anonymous conversation data',
    enabled: false,
    category: 'privacy',
  },
  {
    id: 'theme-auto',
    title: 'Auto Dark Mode',
    description: 'Switch to dark mode based on system settings',
    enabled: true,
    category: 'preferences',
  },
];

// Profile section component
const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
};

// Setting toggle component
const SettingToggle = ({ 
  setting, 
  onToggle 
}: { 
  setting: Setting, 
  onToggle: (id: string, enabled: boolean) => void 
}) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <ThemedText type="defaultSemiBold">{setting.title}</ThemedText>
        <ThemedText style={styles.settingDescription}>{setting.description}</ThemedText>
      </View>
      <Switch
        trackColor={{ 
          false: Platform.select({ ios: '#E9E9EA', default: '#f4f3f4' }), 
          true: Colors.common.teal 
        }}
        thumbColor={Platform.select({ 
          ios: '#FFFFFF', 
          default: setting.enabled ? '#FFFFFF' : '#f4f3f4'
        })}
        ios_backgroundColor="#E9E9EA"
        onValueChange={(enabled) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle(setting.id, enabled);
        }}
        value={setting.enabled}
      />
    </View>
  );
};

// Child profile card component
const ChildProfileCard = ({ profile, onEdit }: { profile: ChildProfile, onEdit: () => void }) => {
  const colorScheme = useColorScheme();
  
  return (
    <ThemedView style={[styles.profileCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <ThemedText style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</ThemedText>
        </View>
        <View style={styles.profileInfo}>
          <ThemedText type="title">{profile.name}</ThemedText>
          <ThemedText style={styles.profileAge}>{profile.age} years old</ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onEdit();
          }}
        >
          <ThemedText style={styles.editButtonText}>Edit</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileDetails}>
        <View style={styles.detailSection}>
          <ThemedText type="defaultSemiBold">Interests</ThemedText>
          <View style={styles.tagContainer}>
            {profile.interests.map((interest, index) => (
              <View 
                key={`interest-${index}`} 
                style={[styles.tag, { backgroundColor: Colors[colorScheme ?? 'light'].transparentPrimary }]}
              >
                <ThemedText style={styles.tagText}>{interest}</ThemedText>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.detailSection}>
          <ThemedText type="defaultSemiBold">Current Challenges</ThemedText>
          <View style={styles.tagContainer}>
            {profile.challenges.map((challenge, index) => (
              <View 
                key={`challenge-${index}`} 
                style={[styles.tag, { backgroundColor: Colors[colorScheme ?? 'light'].transparentAccent }]}
              >
                <ThemedText style={styles.tagText}>{challenge}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [childProfile, setChildProfile] = useState<ChildProfile>(initialChildProfile);
  const [settings, setSettings] = useState<Setting[]>(initialSettings);

  // Handle setting toggle
  const handleToggleSetting = (id: string, enabled: boolean) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled } : setting
    ));
  };

  // Handle edit profile
  const handleEditProfile = () => {
    // In a real app, this would navigate to a profile edit screen
    Alert.alert('Edit Profile', 'This would open the profile editor');
  };

  // Handle sign out
  const handleSignOut = () => {
    // In a real app, this would sign the user out
    Alert.alert('Sign Out', 'This would sign you out');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <ThemedText type="title">Profile</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Child Profile */}
        <ProfileSection title="Child Information">
          <ChildProfileCard profile={childProfile} onEdit={handleEditProfile} />
        </ProfileSection>
        
        {/* Notification Settings */}
        <ProfileSection title="Notifications">
          {settings
            .filter(setting => setting.category === 'notifications')
            .map(setting => (
              <SettingToggle 
                key={setting.id} 
                setting={setting} 
                onToggle={handleToggleSetting} 
              />
            ))}
        </ProfileSection>
        
        {/* Privacy Settings */}
        <ProfileSection title="Privacy">
          {settings
            .filter(setting => setting.category === 'privacy')
            .map(setting => (
              <SettingToggle 
                key={setting.id} 
                setting={setting} 
                onToggle={handleToggleSetting} 
              />
            ))}
        </ProfileSection>
        
        {/* App Preferences */}
        <ProfileSection title="App Preferences">
          {settings
            .filter(setting => setting.category === 'preferences')
            .map(setting => (
              <SettingToggle 
                key={setting.id} 
                setting={setting} 
                onToggle={handleToggleSetting} 
              />
            ))}
        </ProfileSection>
        
        {/* Sign Out Button */}
        <TouchableOpacity 
          style={[styles.signOutButton, { borderColor: Colors[colorScheme ?? 'light'].error }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSignOut();
          }}
        >
          <ThemedText style={[styles.signOutText, { color: Colors[colorScheme ?? 'light'].error }]}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Platform.select({
      ios: 'rgba(0,0,0,0.1)',
      default: '#E1E1E1'
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.common.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileAge: {
    fontSize: 14,
    opacity: 0.7,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  profileDetails: {
    gap: 16,
  },
  detailSection: {
    gap: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E1E1',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  signOutButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  signOutText: {
    fontWeight: '600',
  },
});
