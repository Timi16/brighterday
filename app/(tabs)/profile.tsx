import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch, Platform, Alert, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

// Child profile type
type ChildProfile = {
  id: string;
  name: string;
  age: number;
  interests: string[];
  challenges: string[];
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

// Child profile form component
const ChildProfileForm = ({ 
  visible, 
  initialData, 
  onSave, 
  onCancel 
}: { 
  visible: boolean, 
  initialData?: Partial<ChildProfile>, 
  onSave: (data: Partial<ChildProfile>) => void, 
  onCancel: () => void 
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState(initialData?.age?.toString() || '');
  const [interests, setInterests] = useState(initialData?.interests?.join(', ') || '');
  const [challenges, setChallenges] = useState(initialData?.challenges?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    setIsSubmitting(true);
    // Convert interests and challenges to arrays
    const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i);
    const challengesArray = challenges.split(',').map(c => c.trim()).filter(c => c);
    
    // Create child profile data
    const childData: Partial<ChildProfile> = {
      name,
      age: parseInt(age) || 0,
      interests: interestsArray,
      challenges: challengesArray
    };
    
    onSave(childData);
    setIsSubmitting(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>
            {initialData?.id ? 'Update Child Profile' : 'Add Child Profile'}
          </ThemedText>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Child's name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Age</ThemedText>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Child's age"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Interests (comma separated)</ThemedText>
            <TextInput
              style={styles.input}
              value={interests}
              onChangeText={setInterests}
              placeholder="Dinosaurs, Building blocks, etc."
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Challenges (comma separated)</ThemedText>
            <TextInput
              style={styles.input}
              value={challenges}
              onChangeText={setChallenges}
              placeholder="Sleep, Transitions, etc."
            />
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Save</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, userProfile, logout, updateProfile } = useSupabaseAuth();
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [showChildForm, setShowChildForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile data when component mounts
  useEffect(() => {
    if (userProfile) {
      // If user has child data in profile, use it
      if (userProfile.childProfile) {
        try {
          const parsedChildProfile = typeof userProfile.childProfile === 'string' 
            ? JSON.parse(userProfile.childProfile) 
            : userProfile.childProfile;
          
          setChildProfile(parsedChildProfile);
        } catch (e) {
          console.error('Error parsing child profile:', e);
        }
      }
      
      // Load user settings if available
      if (userProfile.settings) {
        try {
          const parsedSettings = typeof userProfile.settings === 'string'
            ? JSON.parse(userProfile.settings)
            : userProfile.settings;
            
          if (Array.isArray(parsedSettings)) {
            setSettings(parsedSettings);
          }
        } catch (e) {
          console.error('Error parsing settings:', e);
        }
      }
      
      setLoading(false);
    }
  }, [userProfile]);

  // Handle setting toggle and save to database
  const handleToggleSetting = async (id: string, enabled: boolean) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, enabled } : setting
    );
    
    setSettings(updatedSettings);
    
    // Save settings to Supabase
    if (user) {
      try {
        await updateProfile({
          settings: JSON.stringify(updatedSettings)
        });
      } catch (e) {
        console.error('Error saving settings:', e);
      }
    }
  };

  // Handle child profile form submission
  const handleSaveChildProfile = async (data: Partial<ChildProfile>) => {
    const newChildProfile: ChildProfile = {
      id: childProfile?.id || '1',
      name: data.name || 'Child',
      age: data.age || 0,
      interests: data.interests || [],
      challenges: data.challenges || []
    };
    
    setChildProfile(newChildProfile);
    setShowChildForm(false);
    
    // Save to Supabase
    if (user) {
      try {
        await updateProfile({
          childProfile: JSON.stringify(newChildProfile)
        });
        Alert.alert('Success', 'Child profile saved successfully');
      } catch (e) {
        console.error('Error saving child profile:', e);
        Alert.alert('Error', 'There was an error saving the child profile');
      }
    }
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setShowChildForm(true);
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'There was an error signing out');
    }
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
          ) : childProfile ? (
            <ChildProfileCard profile={childProfile} onEdit={handleEditProfile} />
          ) : (
            <TouchableOpacity 
              style={styles.addChildButton}
              onPress={() => setShowChildForm(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.addChildText}>Add Child Information</ThemedText>
            </TouchableOpacity>
          )}
        </ProfileSection>
        
        {/* Child Profile Form */}
        <ChildProfileForm 
          visible={showChildForm} 
          initialData={childProfile || undefined} 
          onSave={handleSaveChildProfile} 
          onCancel={() => setShowChildForm(false)} 
        />
        
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
    marginTop: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 25,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B', // Solid red
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addChildText: {
    marginLeft: 8,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.light.text,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
