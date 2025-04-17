
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
      try {
        setIsLoading(true);
        
        // Set up the auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          // Update user state synchronously first
          setUser(session?.user || null);
          
          // Then fetch additional data if user exists
          if (session?.user) {
            // Use setTimeout to avoid Supabase Auth deadlock
            setTimeout(async () => {
              console.log("Fetching user profile data after auth change");
              const userProfile = await getProfile();
              setProfile(userProfile);
              
              const adminProfileData = await getAdminProfile();
              setAdminProfile(adminProfileData);
              
              setIsLoading(false);
            }, 0);
          } else {
            setProfile(null);
            setAdminProfile(null);
            setIsLoading(false);
          }
        });
        
        // THEN check for existing session
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
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      // Cleanup handled within initAuth
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
