
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";

import { Form } from "@/components/ui/form";
import ProfileBasicFields from "./ProfileBasicFields";
import ProfileLocationField from "./ProfileLocationField";
import ProfileTelegramFields from "./ProfileTelegramFields";
import ProfileSubmitButton from "./ProfileSubmitButton";

const updateProfileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50),
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(50),
  location: z.string().min(1, "Location is required"),
  telegram_id: z.string().min(1, "Telegram ID is required"),
  telegram_username: z.string().min(1, "Telegram username is required"),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

const ProfileForm = ({ profile, userEmail, onProfileUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      location: profile?.location || "",
      telegram_id: profile?.telegram_id || "",
      telegram_username: profile?.telegram_username || "",
    },
  });

  async function handleSubmit(values: UpdateProfileSchema) {
    setIsSubmitting(true);
    try {
      const updatedProfile = await updateProfile(values);
      
      if (updatedProfile) {
        toast({
          title: "Profile updated successfully!"
        });
        onProfileUpdate();
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update profile",
          description: "Please try again later."
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating your profile."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-6 py-4">
        <ProfileBasicFields control={form.control} userEmail={userEmail} />
        
        <ProfileLocationField 
          control={form.control} 
          name="location" 
          label="Location" 
        />
        
        <ProfileTelegramFields control={form.control} />
        
        <ProfileSubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default ProfileForm;
