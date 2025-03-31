
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import { getProfile } from "@/services/profileService";
import { Profile } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

const ProfilePage: React.FC = () => {
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

  if (!user || loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Card>
      </div>
    );
  }

  // Ensure the profile has the required values before rendering the form
  const profileWithDefaults = profile ? {
    ...profile,
    username: profile.username || "",
    full_name: profile.full_name || "",
    location: profile.location || "",
    telegram_id: profile.telegram_id || "",
    telegram_username: profile.telegram_username || ""
  } : null;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <ProfileHeader 
          title="Your Profile" 
          description="View and update your profile information"
        />
        <ProfileForm 
          profile={profileWithDefaults}
          userEmail={user.email}
          onProfileUpdate={handleProfileUpdate}
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
