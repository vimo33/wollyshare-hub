
import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import { Profile } from "@/types/supabase";

interface ProfileContainerProps {
  profile: Profile | null;
  userEmail: string | null | undefined;
  isLoading: boolean;
  onProfileUpdate: () => Promise<void>;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ 
  profile, 
  userEmail, 
  isLoading,
  onProfileUpdate 
}) => {
  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
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
    <Card className="max-w-2xl mx-auto">
      <ProfileHeader 
        title="Your Profile" 
        description="View and update your profile information"
      />
      <ProfileForm 
        profile={profileWithDefaults}
        userEmail={userEmail || ""}
        onProfileUpdate={onProfileUpdate}
      />
    </Card>
  );
};

export default ProfileContainer;
