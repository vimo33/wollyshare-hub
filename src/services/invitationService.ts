
import { supabase } from '@/integrations/supabase/client';
import { Invitation } from '@/types/supabase';

export const createInvitation = async (email: string): Promise<Invitation | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) return null;
  
  // Call our custom function to create an invitation
  const { data, error } = await supabase
    .rpc('create_invitation', {
      admin_id: user.user.id,
      email: email
    });
    
  if (error) {
    console.error('Error creating invitation:', error);
    return null;
  }
  
  // Fetch the created invitation
  const { data: invitation, error: fetchError } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', data)
    .single();
    
  if (fetchError) {
    console.error('Error fetching invitation:', fetchError);
    return null;
  }
  
  return invitation as unknown as Invitation;
};

export const listInvitations = async (): Promise<Invitation[]> => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error listing invitations:', error);
    return [];
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
    return false;
  }
  
  return !!data;
};
