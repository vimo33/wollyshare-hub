
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/services/profileService";
import { Profile } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

export const useProfileData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the latest profile data
  const fetchLatestProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        const latestProfile = await getProfile();
        setProfile(latestProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: "Please try again later."
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Redirect if not logged in and fetch profile data
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      fetchLatestProfile();
    }
  }, [user, navigate]);

  // Function to handle profile updates
  const handleProfileUpdate = async () => {
    toast({
      title: "Profile updated successfully!"
    });
    await fetchLatestProfile();
  };

  return {
    user,
    profile,
    loading,
    handleProfileUpdate,
    fetchLatestProfile
  };
};
