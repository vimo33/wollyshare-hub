
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const updateProfileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50),
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(50),
  location: z.string().min(1, "Location is required"),
  telegram_id: z.string().min(1, "Telegram ID is required"),
  telegram_username: z.string().min(1, "Telegram username is required"),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

interface Location {
  id: string;
  name: string;
  address: string;
}

const ProfileForm = ({ profile, userEmail, onProfileUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
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

  // Fetch locations from community_locations table
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('id, name, address')
          .order('name', { ascending: true });
          
        if (error) {
          console.error("Error fetching locations:", error);
          return;
        }
        
        setLocations(data || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    
    fetchLocations();
  }, []);

  // Get location address for the selected location ID
  const getLocationAddress = (locationId: string): string => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.address : "";
  };

  // Find the current location's name and address
  const getLocationWithAddress = (locationId: string): string => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return "Location not specified";
    return `${location.name}, ${location.address}`;
  };

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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={userEmail || ""} disabled className="bg-muted" />
          <p className="text-sm text-muted-foreground">
            Your email address is used for login and cannot be changed.
          </p>
        </div>

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
              {field.value && (
                <FormDescription>
                  Location: {getLocationWithAddress(field.value)}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telegram_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram ID</FormLabel>
              <FormControl>
                <Input placeholder="123456789" {...field} />
              </FormControl>
              <FormDescription>
                Your Telegram ID is used for notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telegram_username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Username</FormLabel>
              <FormControl>
                <Input placeholder="your_telegram_username" {...field} />
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
