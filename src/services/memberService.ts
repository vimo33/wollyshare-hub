
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

export const addMemberDirectly = async (email: string, username: string, fullName: string): Promise<boolean> => {
  try {
    // Call our custom function to add a member directly
    // Using any type to bypass the TypeScript error as the function exists in the database
    const { data, error } = await supabase
      .rpc('add_member_directly' as any, {
        member_email: email,
        member_username: username,
        member_full_name: fullName
      });
      
    if (error) {
      console.error('Error adding member directly:', error);
      throw new Error(error.message);
    }
    
    return !!data;
  } catch (error) {
    console.error('Error adding member directly:', error);
    throw error;
  }
};
