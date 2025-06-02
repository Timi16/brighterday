import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { 
  supabase,
  signUpUser, 
  signInUser, 
  signOutUser, 
  resetPassword, 
  getCurrentUser,
  updateUserProfile,
  getUserProfile 
} from '../supabase/supabaseClient';

// Create the auth context
const SupabaseAuthContext = createContext();

// Context provider component
export const SupabaseAuthProvider = ({ children }) => {
  // State for user and loading
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Initialize: check for existing session on mount
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        if (session?.user) {
          // User is logged in, first load their profile
          await fetchUserProfile(session.user.id);
          
          // Check if they've completed personalization
          const storedProfile = await AsyncStorage.getItem('userProfile');
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            
            if (profile.personalization_completed) {
              console.log('User has already completed personalization, redirecting to meet-sunny');
              // Add a small delay to ensure the app is ready for navigation
              setTimeout(() => {
                router.replace('/meet-sunny');
              }, 500);
            }
          }
        }
      } catch (error) {
        console.error('Error in checking user and redirect:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAndRedirect();
    
    // Set up auth state change listener using the Supabase client
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        // Clear local storage
        AsyncStorage.removeItem('userProfile').catch(err => {
          console.error('Error removing profile from storage:', err);
        });
      }
    });

    // Cleanup listener on unmount
    return () => {
      if (authListener && typeof authListener.subscription?.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);


  // Check if user is already logged in
  const checkUser = async () => {
    try {
      setAuthError(null);
      
      // Use the Supabase client directly
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking user:', error);
        setAuthError(error.message);
      } else if (session) {
        setUser(session.user);
        
        // If we have a user, try to load their profile
        if (session.user) {
          fetchUserProfile(session.user.id);
        }
      }
    } catch (error) {
      console.error('Unexpected error in checkUser:', error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile data - CLIENT FIRST APPROACH
  const fetchUserProfile = async (userId) => {
    try {
      if (!userId) {
        console.log('No userId provided to fetchUserProfile');
        return { error: 'No userId provided' };
      }
      
      // Try loading from local storage first (this is our primary source of truth)
      let localProfile = null;
      try {
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        if (cachedProfile) {
          localProfile = JSON.parse(cachedProfile);
          console.log('Loaded profile from local storage');
          setUserProfile(localProfile);
          
          // If we have a local profile already, we can return it immediately
          // and perform the database check in the background
          if (localProfile) {
            // We already have profile data, so schedule a background check but return immediately
            setTimeout(() => {
              // Try to sync with server in the background
              syncProfileWithServer(userId, localProfile).catch(err => {
                console.log('Background profile sync error (non-blocking):', err);
              });
            }, 100);
            
            return { profile: localProfile };
          }
        }
      } catch (cacheError) {
        console.error('Error loading cached profile:', cacheError);
      }
      
      // If we get here, we don't have a local profile, so create one and try to sync
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        // Create the local profile first
        const newProfile = {
          id: userData.user.id,
          email: userData.user.email,
          name: userData.user.user_metadata?.name || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Update local profile immediately
        setUserProfile(newProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
        
        // Try to sync with server in background
        syncProfileWithServer(userId, newProfile).catch(err => {
          console.log('New profile sync error (non-blocking):', err);
        });
        
        return { profile: newProfile };
      }
      
      return { error: 'Could not get user data', profile: localProfile || {} };
    } catch (error) {
      console.error('Unexpected error in fetchUserProfile:', error);
      return { error, profile: {} };
    }
  };
  
  // Helper function for background sync attempts
  const syncProfileWithServer = async (userId, localProfile) => {
    console.log('Attempting to sync profile with server');
    
    try {
      // First try to get the server profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors
      
      if (error) {
        console.log('Server profile retrieval error:', error);
        
        // Try to create minimal profile
        const minimalProfile = {
          id: userId,
          email: localProfile.email,
          updated_at: new Date().toISOString()
        };
        
        await supabase
          .from('profiles')
          .insert([minimalProfile]);
          
        console.log('Attempted to create minimal profile on server');
      }
      else if (data) {
        // We have both local and server data - merge and update both
        console.log('Retrieved server profile, merging with local');
        
        // Prefer local data for most fields but keep server timestamps if newer
        const serverDate = data.updated_at ? new Date(data.updated_at) : new Date(0);
        const localDate = localProfile.updated_at ? new Date(localProfile.updated_at) : new Date();
        
        const mergedProfile = { ...data, ...localProfile };
        
        // Only update server if local is newer
        if (localDate > serverDate) {
          console.log('Local profile is newer, updating server');
          await supabase
            .from('profiles')
            .update({
              email: mergedProfile.email,
              name: mergedProfile.name,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        }
        
        // Always update local with merged data
        setUserProfile(mergedProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(mergedProfile));
      }
    } catch (syncError) {
      console.log('Profile sync error:', syncError);
      // Non-blocking - we continue with local profile
    }
  };

  // Register a new user
  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Sign up with Supabase Auth using the client directly
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      // If signup successful, don't try to create a profile yet
      // We'll do that on first login or when personalizing
      if (data?.user) {
        // Set user in state
        setUser(data.user);
        
        // Create a basic local profile for immediate use
        const initialProfile = {
          id: data.user.id,
          email: email,
          name: name,
          created_at: new Date().toISOString()
        };
        
        // Store locally first
        setUserProfile(initialProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(initialProfile));
        
        // We'll create the actual profile when the user completes the personalization step
        console.log('User created, profile will be created during personalization');
        
        return { user: data.user };
      }
    } catch (error) {
      console.error('Unexpected error in signup:', error);
      setAuthError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Sign in with Supabase Auth using the client directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      // Set user in state
      if (data?.user) {
        setUser(data.user);
        fetchUserProfile(data.user.id);
        return { user: data.user };
      }
    } catch (error) {
      console.error('Unexpected error in login:', error);
      setAuthError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Sign out using the Supabase client directly
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      // Clear user data from state
      setUser(null);
      setUserProfile(null);
      
      // Clear local storage
      await AsyncStorage.removeItem('userProfile');
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error in logout:', error);
      setAuthError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Password reset
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Use Supabase client directly for password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error in forgotPassword:', error);
      setAuthError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile - LOCAL FIRST APPROACH
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        setAuthError('User must be logged in to update profile');
        return { error: 'User not authenticated' };
      }
      
      setLoading(true);
      setAuthError(null);
      
      // Create a merged profile 
      const currentProfile = userProfile || {};
      const updatedProfile = { 
        ...currentProfile,
        ...updates,
        id: user.id, 
        updated_at: new Date().toISOString()
      };
      
      // If this is the first time saving, add created_at
      if (!currentProfile.created_at) {
        updatedProfile.created_at = new Date().toISOString();
      }
      
      // Always update local storage first (client-first approach)
      console.log('Updating local profile');
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Try to update the database, but don't block on it
      console.log('Attempting to sync with database');
      
      try {
        // Try creating a minimal profile record first
        const minimalProfile = {
          id: user.id,
          email: user.email || updatedProfile.email,
          updated_at: new Date().toISOString()
        };
        
        // First approach: Just try to insert the minimal data to create the record
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([minimalProfile]);
        
        if (!insertError) {
          console.log('Successfully created minimal profile');
        }
        
        // Second approach: Try to update the most important fields only
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            email: user.email || updatedProfile.email,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        if (!updateError) {
          console.log('Successfully updated basic profile info');
        }
      } catch (dbError) {
        console.log('Non-blocking database error:', dbError);
        // This is intentionally non-blocking
      }
      
      // Return the updated profile regardless of database success
      return { profile: updatedProfile };
    } catch (error) {
      console.error('Unexpected error in updateProfile:', error);
      
      // Still return whatever profile we have
      return { 
        error: error.message || 'Unknown error updating profile', 
        profile: userProfile || {}
      };
    } finally {
      setLoading(false);
    }
  };

  // Value for the context provider
  const value = {
    user,
    userProfile,
    loading,
    authError,
    signup,
    login,
    logout,
    forgotPassword,
    updateProfile,
    refreshProfile: () => user && fetchUserProfile(user.id),
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export default SupabaseAuthContext;
