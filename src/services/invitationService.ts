import { supabase } from '@/integrations/supabase/client';
import { Invitation } from '@/types/supabase';

export const createInvitation = async (email: string): Promise<Invitation | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) return null;
  
  try {
    // Call our custom function to create an invitation
    const { data, error } = await supabase
      .rpc('create_invitation', {
        admin_id: user.user.id,
        email: email
      });
      
    if (error) {
      console.error('Error creating invitation:', error);
      
      // Check for specific database errors
      if (error.code === '23505') {
        throw new Error('An invitation has already been sent to this email address');
      }
      
      throw new Error('Failed to create invitation. Please try again.');
    }
    
    if (!data) {
      throw new Error('No invitation ID returned from server');
    }
    
    // Fetch the created invitation
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', data)
      .single();
      
    if (fetchError) {
      console.error('Error fetching invitation:', fetchError);
      throw new Error('Failed to retrieve invitation details');
    }
    
    return invitation as unknown as Invitation;
  } catch (error) {
    // Just re-throw if it's already our error
    if (error instanceof Error) {
      throw error;
    }
    
    // Otherwise wrap in a generic message
    throw new Error('Failed to send invitation. Please try again.');
  }
};

export const listInvitations = async (): Promise<Invitation[]> => {
  // Use our custom function to list invitations
  const { data, error } = await supabase
    .rpc('list_invitations');
    
  if (error) {
    console.error('Error listing invitations:', error);
    throw error; // Throw the error so it can be caught by the query
  }
  
  return data as unknown as Invitation[];
};

export const verifyInvitation = async (token: string): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('verify_invitation', {
      token: token
    });
    
  if (error) {
    console.error('Error verifying invitation:', error);
    throw error; // Throw the error so it can be caught
  }
  
  return !!data;
};
