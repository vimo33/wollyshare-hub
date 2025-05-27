
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AdminProfile } from '@/types/supabase';
import { getProfile, getAdminProfile } from '@/services/profileService';
import { checkSupabaseConnection, retryWithBackoff } from '@/services/connectionService';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  connectionStatus: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  adminProfile: null,
  isLoading: true,
  isAdmin: false,
  isMember: false,
  connectionStatus: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // First, check if Supabase is accessible
        console.log('Checking Supabase connection on auth init...');
        const connectionCheck = await checkSupabaseConnection();
        setConnectionStatus(connectionCheck.isConnected);
        
        if (!connectionCheck.isConnected) {
          console.error('Supabase connection failed:', connectionCheck.error);
          setIsLoading(false);
          return;
        }
        
        console.log('Supabase connection established, setting up auth listener...');
        
        // Set up the auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, 'Session exists:', !!session);
          
          // Update user state synchronously first
          setUser(session?.user || null);
          
          // Then fetch additional data if user exists
          if (session?.user) {
            // Use setTimeout to avoid Supabase Auth deadlock
            setTimeout(async () => {
              try {
                console.log("Fetching user profile data after auth change");
                
                const userProfile = await retryWithBackoff(() => getProfile());
                setProfile(userProfile);
                
                const adminProfileData = await retryWithBackoff(() => getAdminProfile());
                setAdminProfile(adminProfileData);
                
                setIsLoading(false);
              } catch (error) {
                console.error('Error fetching profile data:', error);
                setIsLoading(false);
              }
            }, 0);
          } else {
            setProfile(null);
            setAdminProfile(null);
            setIsLoading(false);
          }
        });
        
        // THEN check for existing session with retry logic
        const sessionData = await retryWithBackoff(async () => {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          return data;
        });
        
        setUser(sessionData.session?.user || null);
        
        if (sessionData.session?.user) {
          const userProfile = await retryWithBackoff(() => getProfile());
          setProfile(userProfile);
          
          const adminProfileData = await retryWithBackoff(() => getAdminProfile());
          setAdminProfile(adminProfileData);

          // Set up realtime subscription for profile changes
          const profileChanges = supabase
            .channel('profile-changes')
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${sessionData.session.user.id}`,
              },
              async (payload) => {
                console.log('Profile updated in realtime:', payload);
                try {
                  const refreshedProfile = await retryWithBackoff(() => getProfile());
                  setProfile(refreshedProfile);
                } catch (error) {
                  console.error('Error refreshing profile:', error);
                }
              }
            )
            .subscribe();

          // Return cleanup function
          return () => {
            supabase.removeChannel(profileChanges);
            subscription.unsubscribe();
          };
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setConnectionStatus(false);
        setIsLoading(false);
      }
    };
    
    initAuth();
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
      isMember,
      connectionStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
