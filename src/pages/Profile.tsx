
import React from "react";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { useProfileData } from "@/hooks/useProfileData";

const ProfilePage: React.FC = () => {
  const { user, profile, loading, handleProfileUpdate } = useProfileData();

  return (
    <div className="container mx-auto py-10">
      <ProfileContainer
        profile={profile}
        userEmail={user?.email}
        isLoading={loading}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default ProfilePage;
