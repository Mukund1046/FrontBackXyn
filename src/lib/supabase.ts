/**
 * Supabase Client Configuration
 * Handles authentication and database operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://odcsjinnozhnlysivdji.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kY3NqaW5ub3pobmx5c2l2ZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTYyNTUsImV4cCI6MjA3ODE3MjI1NX0.FYvU-TwrZYQywSmrwhcoMp-kEIcnax6YHGF77zRi0Cc';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to get current session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
