
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AdminProfile } from '@/types/supabase';
import { getProfile, getAdminProfile } from '@/services/profileService';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isMember: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  adminProfile: null,
  isLoading: true,
  isAdmin: false,
  isMember: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      setIsLoading(true);
      
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        const userProfile = await getProfile();
        setProfile(userProfile);
        
        const adminProfileData = await getAdminProfile();
        setAdminProfile(adminProfileData);

        // Set up realtime subscription for profile changes
        // This ensures membership status updates are reflected immediately
        const profileChanges = supabase
          .channel('profile-changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${data.session.user.id}`,
            },
            async (payload) => {
              console.log('Profile updated in realtime:', payload);
              // Refresh user profile data
              const refreshedProfile = await getProfile();
              setProfile(refreshedProfile);
            }
          )
          .subscribe();

        // Return cleanup function
        return () => {
          supabase.removeChannel(profileChanges);
        };
      }
      
      setIsLoading(false);
    };
    
    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user || null);
      
      if (session?.user) {
        const userProfile = await getProfile();
        setProfile(userProfile);
        
        const adminProfileData = await getAdminProfile();
        setAdminProfile(adminProfileData);
      } else {
        setProfile(null);
        setAdminProfile(null);
      }
      
      setIsLoading(false);
    });
    
    initAuth();
    
    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);
  
  const isAdmin = !!adminProfile;
  const isMember = profile?.is_member || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      adminProfile, 
      isLoading, 
      isAdmin, 
      isMember 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
