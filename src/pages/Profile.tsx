
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";

const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !profile) {
      navigate("/auth");
    }
  }, [user, profile, navigate]);

  if (!user || !profile) {
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
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
