import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

// Supabase API configuration
const SUPABASE_URL = 'https://znlrqzqhyjsxjbhusqcl.supabase.co';
const SUPABASE_KEY = Constants.expoConfig?.extra?.supabaseKey || process.env.SUPABASE_KEY;

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Storage keys for auth data
const AUTH_STORAGE_KEY = '@brighterday_auth';
const PROFILE_STORAGE_KEY = '@brighterday_profile';

/**
 * Direct API caller for Supabase
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - API response
 */
async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    ...options.headers,
  };

  // If we have auth, add the authorization header
  const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (authData) {
    const { access_token } = JSON.parse(authData);
    if (access_token) {
      headers['Authorization'] = `Bearer ${access_token}`;
    }
  }

  // Make the API request
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }
    
    return { data };
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return { error: error.message || 'Network error' };
  }
}

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} metadata - Additional user data (name, etc.)
 * @returns {Promise} Supabase response
 */
export const signUpUser = async (email, password, metadata = {}) => {
  const { data, error } = await supabaseFetch('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      data: metadata,
    }),
  });

  if (data) {
    // Store auth data in AsyncStorage
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }

  return { data, error };
};

/**
 * Sign in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Supabase response
 */
export const signInUser = async (email, password) => {
  const { data, error } = await supabaseFetch('/auth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      grant_type: 'password',
    }),
  });

  if (data) {
    // Store auth data in AsyncStorage
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }

  return { data, error };
};

/**
 * Sign out the current user
 * @returns {Promise} Supabase response
 */
export const signOutUser = async () => {
  const { error } = await supabaseFetch('/auth/v1/logout', {
    method: 'POST',
  });

  // Clear auth data from AsyncStorage
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);

  return { error };
};

/**
 * Reset user password
 * @param {string} email - User's email
 * @returns {Promise} Supabase response
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabaseFetch('/auth/v1/recover', {
    method: 'POST',
    body: JSON.stringify({
      email,
      redirect_to: 'brighterday://reset-password',
    }),
  });

  return { data, error };
};

/**
 * Get the current user
 * @returns {Promise} Current user or null
 */
export const getCurrentUser = async () => {
  // First check if we have a user in AsyncStorage
  const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (!authData) {
    return { user: null, error: null };
  }

  // Verify the user with Supabase
  const { data, error } = await supabaseFetch('/auth/v1/user', {
    method: 'GET',
  });

  return { user: data || null, error };
};

/**
 * Update user profile in Supabase
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise} Supabase response
 */
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabaseFetch('/rest/v1/profiles', {
    method: 'POST',
    headers: {
      'Prefer': 'return=representation',
    },
    body: JSON.stringify([
      {
        id: userId,
        updated_at: new Date().toISOString(),
        ...updates,
      },
    ]),
  });

  if (data?.[0]) {
    // Update profile in AsyncStorage
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data[0]));
  }

  return { data, error };
};

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise} User profile data
 */
export const getUserProfile = async (userId) => {
  // First check if we have the profile in AsyncStorage
  const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
  if (storedProfile) {
    const profile = JSON.parse(storedProfile);
    if (profile.id === userId) {
      return { profile, error: null };
    }
  }

  // Fetch from Supabase if not in storage
  const { data, error } = await supabaseFetch(
    `/rest/v1/profiles?id=eq.${userId}&select=*`,
    { method: 'GET' }
  );

  const profile = data?.[0] || null;
  
  if (profile) {
    // Store profile in AsyncStorage
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }

  return { profile, error };
};

/**
 * Save user focus area
 * @param {string} userId - User ID
 * @param {string} focusArea - Selected focus area
 * @returns {Promise} Supabase response
 */
export const saveFocusArea = async (userId, focusArea) => {
  const { data, error } = await supabaseFetch('/rest/v1/user_preferences', {
    method: 'POST',
    headers: {
      'Prefer': 'return=representation',
    },
    body: JSON.stringify([
      {
        user_id: userId,
        focus_area: focusArea,
        updated_at: new Date().toISOString(),
      },
    ]),
  });

  return { data, error };
};

/**
 * Save personalization data
 * @param {string} userId - User ID
 * @param {object} personalData - Child age, relationship, etc.
 * @returns {Promise} Supabase response
 */
export const savePersonalization = async (userId, personalData) => {
  const { data, error } = await supabaseFetch('/rest/v1/user_preferences', {
    method: 'POST',
    headers: {
      'Prefer': 'return=representation',
    },
    body: JSON.stringify([
      {
        user_id: userId,
        ...personalData,
        updated_at: new Date().toISOString(),
      },
    ]),
  });

  return { data, error };
};
