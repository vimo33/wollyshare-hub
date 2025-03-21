
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/types/supabase";

interface ProfileAvatarProps {
  profile: Profile;
  size?: "sm" | "md" | "lg";
}

const ProfileAvatar = ({ profile, size = "lg" }: ProfileAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {profile.avatar_url ? (
        <AvatarImage src={profile.avatar_url} alt={profile.username || "User"} />
      ) : (
        <AvatarFallback className="text-lg">
          {getInitials(profile.full_name || profile.username || "User")}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
