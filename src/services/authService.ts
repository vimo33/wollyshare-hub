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
  
  // Log the metadata to verify what's being passed
  console.log("Registering user with metadata:", metadata);
  
  // Register the user with properly structured metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        location: metadata.location,
        telegram_id: metadata.telegram_id,
        telegram_username: metadata.telegram_username
      }
    }
  });
  
  if (error) {
    console.error("Registration error:", error);
    return { user: null, error };
  }
  
  console.log("Registration successful, user data:", data.user);
  return { user: data.user, error: null };
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

export const sendPasswordResetEmail = async (
  email: string,
  redirectTo?: string
): Promise<{ error: any }> => {
  try {
    // Clean and validate the redirect URL
    let redirectUrl: string;
    
    if (!redirectTo) {
      const origin = window.location.origin.replace(/\/+$/, ''); // Remove trailing slashes
      redirectUrl = `${origin}/reset-password`;
    } else {
      // Clean up any provided URL
      redirectUrl = redirectTo.replace(/\/+/g, '/'); // Replace multiple slashes with single slash
      if (!redirectUrl.startsWith('http')) {
        const origin = window.location.origin.replace(/\/+$/, '');
        redirectUrl = `${origin}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`;
      }
    }
    
    console.log(`Sending password reset email with redirect to: ${redirectUrl}`);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    if (error) {
      console.error("Error sending password reset email:", error);
    } else {
      console.log("Password reset email sent successfully");
    }
    
    return { error };
  } catch (err: any) {
    console.error("Unexpected error in sendPasswordResetEmail:", err);
    return { error: err };
  }
};

// Update password
export const updateUserPassword = async (
  newPassword: string
): Promise<{ error: any }> => {
  console.log("Updating user password");
  
  // Get the current session to check if we're in a valid recovery flow
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Session error when updating password:", sessionError);
    return { error: sessionError };
  }
  
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
