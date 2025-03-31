
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  profile: {
    username: string;
    full_name: string;
    location: string;
    telegram_id: string;
    telegram_username: string;
  } | null;
  userEmail: string | null;
  onProfileUpdate: () => void;
}

const updateProfileSchema = z.object({
  username: z.string().min(2).max(50),
  full_name: z.string().min(2).max(50),
  location: z.string().min(1, { message: "Location is required" }),
  telegram_id: z.string().min(1, { message: "Telegram ID is required" }),
  telegram_username: z.string().min(1, { message: "Telegram username is required" }),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

const ProfileForm = ({ profile, userEmail, onProfileUpdate }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [locations, setLocations] = useState<{id: string, name: string, address: string}[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Fetch community locations
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('*')
          .order('name');
          
        if (error) {
          console.error('Error fetching locations:', error);
          toast({
            variant: "destructive",
            title: "Could not load locations",
            description: "Please try again later"
          });
        } else {
          setLocations(data || []);
        }
      } catch (err) {
        console.error('Error in location fetch:', err);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    
    fetchLocations();
  }, [toast]);

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
    console.log("Submitting profile update:", values);
    
    try {
      // Use the profile service
      const updatedProfile = await updateProfile({
        username: values.username,
        full_name: values.full_name,
        location: values.location,
        telegram_id: values.telegram_id,
        telegram_username: values.telegram_username
      });
      
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
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "An unexpected error occurred."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-6 py-4">
        {/* Email Field (non-editable) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={userEmail || ""} disabled className="bg-muted" />
          <p className="text-sm text-muted-foreground">
            Your email address is used for login and cannot be changed.
          </p>
        </div>

        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name that others will see.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription>
                Your full name will be used for communication.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoadingLocations}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your community location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This helps other members find items near them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Telegram ID Field */}
        <FormField
          control={form.control}
          name="telegram_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram ID</FormLabel>
              <FormControl>
                <Input placeholder="Your Telegram ID" {...field} />
              </FormControl>
              <FormDescription>
                Your Telegram ID is used for notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Telegram Username Field */}
        <FormField
          control={form.control}
          name="telegram_username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Username</FormLabel>
              <FormControl>
                <Input placeholder="@your_telegram_username" {...field} />
              </FormControl>
              <FormDescription>
                Your Telegram username is used for borrow request notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
