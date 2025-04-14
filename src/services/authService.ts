
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
  // Build the redirect URL - make sure to use the full path without any hash or search params
  const redirectUrl = redirectTo || `${window.location.origin}/reset-password`;
  console.log(`Sending password reset email with redirect to: ${redirectUrl}`);
  
  // Make sure the URL doesn't already contain a hash or search params
  const cleanRedirectUrl = redirectUrl.split('?')[0].split('#')[0];
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: cleanRedirectUrl
  });
  
  if (error) {
    console.error("Error sending password reset email:", error);
  } else {
    console.log("Password reset email sent successfully");
  }
  
  return { error };
};

// Update password
export const updateUserPassword = async (
  newPassword: string
): Promise<{ error: any }> => {
  console.log("Updating user password");
  
  // Get the current session to check if we're in a valid recovery flow
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.error("No active session when trying to update password");
    return { error: new Error("No active session. Please request a new password reset link.") };
  }
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    console.error("Error updating password:", error);
  } else {
    console.log("Password updated successfully");
  }
  
  return { error };
};

// Session management
export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};
