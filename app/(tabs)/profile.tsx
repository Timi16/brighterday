import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

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
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
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
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <ThemedText style={styles.settingTitle}>{setting.title}</ThemedText>
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
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <ThemedText style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</ThemedText>
        </View>
        <View style={styles.profileInfo}>
          <ThemedText style={styles.profileName}>{profile.name}</ThemedText>
          <ThemedText style={styles.profileAge}>{profile.age} years old</ThemedText>
        </View>
        <TouchableOpacity
          style={styles.editButton}
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
          <ThemedText style={styles.detailTitle}>Interests</ThemedText>
          <View style={styles.tagContainer}>
            {profile.interests.map((interest, index) => (
              <View 
                key={`interest-${index}`} 
                style={[styles.tag, { backgroundColor: 'rgba(115, 194, 251, 0.2)' }]} // Light blue
              >
                <ThemedText style={styles.tagText}>{interest}</ThemedText>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.detailSection}>
          <ThemedText style={styles.detailTitle}>Current Challenges</ThemedText>
          <View style={styles.tagContainer}>
            {profile.challenges.map((challenge, index) => (
              <View 
                key={`challenge-${index}`} 
                style={[styles.tag, { backgroundColor: 'rgba(255, 219, 88, 0.2)' }]} // Light yellow
              >
                <ThemedText style={styles.tagText}>{challenge}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
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
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Image
          source={require('../../assets/images/sun-pattern.png')}
          style={styles.patternImage}
          contentFit="cover"
          cachePolicy="memory"
        />
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
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
          style={styles.signOutButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSignOut();
          }}
        >
          <ThemedText style={styles.signOutText}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Warm white background
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15,
    zIndex: -1,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
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
    backgroundColor: '#FFDB58', // Sunny yellow
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
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  profileAge: {
    fontSize: 14,
    color: '#777777',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.common.teal,
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
  detailTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
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
    fontSize: 13,
    color: '#333333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333333',
  },
  settingDescription: {
    fontSize: 13,
    color: '#777777',
  },
  signOutButton: {
    marginTop: 8,
    padding: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF6B6B', // Soft red
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)', // Very light red
  },
  signOutText: {
    color: '#FF6B6B', // Soft red
    fontSize: 16,
    fontWeight: '600',
  },
});
