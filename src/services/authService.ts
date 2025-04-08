
import { supabase } from '@/integrations/supabase/client';

// Types for better organization
export interface AuthResponse {
  user: any;
  error: any;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  invitationToken?: string;
  metadata?: Record<string, any>;
}

/**
 * Authentication service for user management
 */

// Regular user registration
export const registerUser = async ({
  email,
  password,
  username,
  fullName,
  invitationToken,
  metadata = {}
}: UserRegistrationData): Promise<AuthResponse> => {
  // First verify the invitation if token is provided
  if (invitationToken) {
    const { data: valid, error: verifyError } = await supabase
      .rpc('verify_invitation', { token: invitationToken });
      
    if (verifyError || !valid) {
      return { 
        user: null, 
        error: verifyError || new Error('Invalid or expired invitation') 
      };
    }
  }
  
  // Register the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        ...metadata
      }
    }
  });
  
  return {
    user: data.user,
    error
  };
};

// Admin registration
export const registerAdmin = async (
  email: string, 
  password: string, 
  username: string, 
  fullName: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        role: 'admin'
      }
    }
  });
  
  return {
    user: data.user,
    error
  };
};

// Login for both users and admins
export const loginUser = async (
  email: string, 
  password: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return {
    user: data.user,
    error
  };
};

// Logout
export const logoutUser = async (): Promise<{ error: any }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Password reset
export const sendPasswordResetEmail = async (
  email: string,
  redirectTo?: string
): Promise<{ error: any }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${window.location.origin}/reset-password`
  });
  return { error };
};

// Update password
export const updateUserPassword = async (
  newPassword: string
): Promise<{ error: any }> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  return { error };
};

// Session management
export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};
