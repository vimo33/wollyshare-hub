
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import { getProfile } from "@/services/profileService";
import { Profile } from "@/types/supabase";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the latest profile data
  const fetchLatestProfile = async () => {
    if (user) {
      setLoading(true);
      const latestProfile = await getProfile();
      setProfile(latestProfile);
      setLoading(false);
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

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <ProfileHeader 
          title="Your Profile" 
          description="View and update your profile information"
        />
        <ProfileForm 
          profile={profile}
          userEmail={user.email}
          onProfileUpdate={handleProfileUpdate}
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
