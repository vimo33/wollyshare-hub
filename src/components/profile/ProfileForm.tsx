
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { updateProfile } from "@/services/profileService";
import { Profile } from "@/types/supabase";
import LocationSelect from "@/components/auth/LocationSelect";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { HelpCircle, Loader2, MessageSquare, Save } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define form schema
const profileFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  location: z.string().optional(),
  telegramId: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profile: Profile | null;
  userEmail?: string;
  onProfileUpdate?: () => void;
}

const ProfileForm = ({ profile, userEmail, onProfileUpdate }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      location: "",
      telegramId: "",
    },
  });

  useEffect(() => {
    // Update form values when profile data loads
    if (profile) {
      console.log("Setting form values with profile:", profile);
      console.log("Profile location value:", profile.location);
      form.reset({
        username: profile.username || "",
        fullName: profile.full_name || "",
        email: profile.email || userEmail || "",
        location: profile.location || "",
        telegramId: profile.telegram_id || "",
      });
    }
  }, [profile, userEmail, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting profile data:", data);
      const updatedProfile = await updateProfile({
        username: data.username,
        full_name: data.fullName,
        email: data.email,
        location: data.location,
        telegram_id: data.telegramId,
      });
      
      if (updatedProfile) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        
        // Call the onProfileUpdate callback to refresh profile data
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      } else {
        toast({
          title: "Error",
          description: "There was a problem updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <ProfileAvatar profile={profile} />
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    {...field}
                    disabled 
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LocationSelect 
            control={form.control} 
            defaultValue={profile?.location || ""}
          />
          
          <FormField
            control={form.control}
            name="telegramId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1.5">
                  <FormLabel>Telegram ID</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>Find your Telegram ID by messaging @get_id_bot on Telegram. This enables direct communication for borrowing items.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <Input 
                        placeholder="123456789" 
                        {...field} 
                        className="pl-9"
                      />
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">Enter your Telegram ID to enable chat between borrowers and lenders</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="ml-auto flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default ProfileForm;
