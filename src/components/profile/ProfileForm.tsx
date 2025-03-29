
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import LocationSelect from '../auth/LocationSelect';

const profileFormSchema = z.object({
  username: z.string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  fullName: z.string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(50, {
      message: "Full name must not be longer than 50 characters.",
    }),
  location: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional(),
  bio: z.string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      location: "",
      website: "",
      bio: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            setApiError(error.message);
          } else if (profileData) {
            // Use a type assertion to ensure the profile data has the correct type
            setProfile(profileData as Profile);
            form.setValue("username", profileData.username || "");
            form.setValue("fullName", profileData.full_name || "");
            form.setValue("location", profileData.location || "");
          }
        } catch (err: any) {
          setApiError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user, form]);

  const handleSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      const updates = {
        id: user.id,
        updated_at: new Date().toISOString(), // Convert Date to string
        username: values.username,
        full_name: values.fullName,
        location: values.location,
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw new Error(error.message);
      }

      // Optimistically update the profile in the UI
      if (profile) {
        setProfile({
          ...profile,
          username: values.username,
          full_name: values.fullName,
          location: values.location || '',
        });
      }

      setApiError(null);
      alert('Profile updated successfully!');
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="John Doe" {...field} />
              </FormControl>
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
                <LocationSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
