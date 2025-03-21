import { supabase } from '@/integrations/supabase/client';

// Regular user registration
export const registerUser = async (
  email: string, 
  password: string, 
  username: string, 
  fullName: string,
  invitationToken?: string,
  metadata?: Record<string, any>
): Promise<{ user: any; error: any }> => {
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
): Promise<{ user: any; error: any }> => {
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
): Promise<{ user: any; error: any }> => {
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

// Get current session
export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

// Get current user
export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};
