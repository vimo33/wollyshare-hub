
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

export const getMembers = async (): Promise<Profile[]> => {
  // Use the get_members function which will return all profiles with is_member = true
  const { data, error } = await supabase
    .rpc('get_members');
    
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  
  return data as unknown as Profile[];
};

export const deleteMember = async (memberId: string): Promise<boolean> => {
  // Use the delete_member function which checks if the current user is an admin
  // and sets is_member to false for the specified user
  const { data, error } = await supabase
    .rpc('delete_member', {
      member_id: memberId
    });
    
  if (error) {
    console.error('Error deleting member:', error);
    return false;
  }
  
  return !!data;
};
