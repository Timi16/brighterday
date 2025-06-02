import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Initialize: check for existing session on mount
  useEffect(() => {
    checkUser();
    
    // Set up auth state change listener using the Supabase client
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user || null);
          if (session?.user) {
            fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          await AsyncStorage.removeItem('userProfile');
        }
      }
    );

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

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId) => {
    try {
      // Try to get from local storage first for faster loading
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }

      // Then fetch from Supabase to ensure we have latest data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
      } else if (profile) {
        setUserProfile(profile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Unexpected error in fetchUserProfile:', error);
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
      
      // If signup successful, create a profile record
      if (data?.user) {
        // Create a user profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name,
            email,
            created_at: new Date().toISOString(),
          });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          setAuthError('Account created but there was an issue setting up your profile');
          return { error: profileError };
        }
        
        // Set user in state
        setUser(data.user);
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

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        setAuthError('User must be logged in to update profile');
        return { error: 'User not authenticated' };
      }
      
      setLoading(true);
      setAuthError(null);
      
      // Use Supabase client directly to update profile
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      // Update local profile state
      if (data?.[0]) {
        setUserProfile({...userProfile, ...data[0]});
        await AsyncStorage.setItem('userProfile', JSON.stringify({...userProfile, ...data[0]}));
        return { profile: data[0] };
      }
    } catch (error) {
      console.error('Unexpected error in updateProfile:', error);
      setAuthError(error.message);
      return { error };
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
