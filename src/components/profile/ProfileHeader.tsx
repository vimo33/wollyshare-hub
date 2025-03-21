
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ProfileHeaderProps {
  title: string;
  description: string;
}

const ProfileHeader = ({ title, description }: ProfileHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

export default ProfileHeader;
