
import { supabase } from '@/integrations/supabase/client';
import { Profile, AdminProfile } from '@/types/supabase';

export const getProfile = async (): Promise<Profile | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data as unknown as Profile;
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) return null;
  
  console.log('Updating profile with data:', profile);
  
  // Make sure the location field is included in the update
  if (profile.location === undefined) {
    console.warn('Location field is undefined in profile update');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  console.log('Profile updated successfully:', data);
  return data as unknown as Profile;
};

export const getAdminProfile = async (): Promise<AdminProfile | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) return null;
  
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', user.user.id)
    .single();
    
  if (error) {
    console.error('Error fetching admin profile:', error);
    return null;
  }
  
  return data as unknown as AdminProfile;
};
