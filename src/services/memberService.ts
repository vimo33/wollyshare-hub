
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

export const getTotalMembers = async (): Promise<number> => {
  try {
    // Direct count query on the profiles table without ANY filters
    // This should return ALL profiles in the database
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error fetching total profiles count:', error);
      throw error;
    }
    
    console.log('Total profiles count from Supabase:', count);
    return count || 0;
  } catch (error) {
    console.error('Exception in getTotalMembers:', error);
    return 0;
  }
};

export const getNonMembers = async (): Promise<Profile[]> => {
  // Get profiles where is_member is false
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_member', false)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching non-members:', error);
    return [];
  }
  
  return data as Profile[];
};

export const deleteMember = async (memberId: string): Promise<boolean> => {
  try {
    console.log(`Deleting member with ID: ${memberId} and permanently removing their items`);
    
    // First, permanently delete all items owned by this member from the database
    const { error: deleteItemsError } = await supabase
      .from('items')
      .delete()
      .eq('user_id', memberId);
      
    if (deleteItemsError) {
      console.error('Error permanently deleting member items:', deleteItemsError);
      return false;
    }
    
    // Then call a more thorough delete_member_complete function that:
    // 1. Sets is_member to false
    // 2. Removes user access if possible
    // 3. Marks the profile for complete deletion
    const { data, error } = await supabase
      .rpc('delete_member_complete', {
        member_id: memberId
      });
      
    if (error) {
      console.error('Error removing member completely:', error);
      return false;
    }
    
    console.log('Member and all their items permanently deleted successfully');
    return !!data;
  } catch (error) {
    console.error('Exception in deleteMember:', error);
    return false;
  }
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
