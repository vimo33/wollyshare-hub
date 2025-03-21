
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/services/profileService";
import LocationSelect from "@/components/auth/LocationSelect";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Save } from "lucide-react";

// Define form schema
const profileFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !profile) {
      navigate("/auth");
    }
  }, [user, profile, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      location: "",
    },
  });

  useEffect(() => {
    // Update form values when profile data loads
    if (profile) {
      console.log("Setting form values with profile:", profile);
      form.reset({
        username: profile.username || "",
        fullName: profile.full_name || "",
        email: profile.email || user?.email || "",
        location: profile.location || "",
      });
    }
  }, [profile, user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting profile data:", data);
      const updatedProfile = await updateProfile({
        username: data.username,
        full_name: data.fullName,
        email: data.email,
        location: data.location,
      });
      
      if (updatedProfile) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
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

  if (!user || !profile) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and update your profile information
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.username || "User"} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.full_name || profile.username || "User")}
                    </AvatarFallback>
                  )}
                </Avatar>
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

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <LocationSelect control={form.control} />
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
      </Card>
    </div>
  );
};

export default ProfilePage;
