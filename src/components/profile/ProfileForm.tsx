
import React, { useEffect } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/supabase";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  telegramId: z.string().optional(),
});

interface ProfileFormProps {
  profile?: Profile | null;
  userEmail?: string;
  onProfileUpdate?: () => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, userEmail, onProfileUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      telegramId: "",
    },
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        fullName: profile.full_name || "",
        telegramId: profile.telegram_id || "",
      });
    }
  }, [profile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: values.username,
          full_name: values.fullName,
          telegram_id: values.telegramId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      ).select();

      if (error) {
        throw error;
      }

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          username: values.username,
          full_name: values.fullName,
          telegram_id: values.telegramId,
        },
      });
      
      if (onProfileUpdate) {
        await onProfileUpdate();
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="shadcn" {...form.register("username")} disabled={isSubmitting} />
          </FormControl>
          <FormDescription>
            This is your public display name.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" {...form.register("fullName")} disabled={isSubmitting} />
          </FormControl>
          <FormDescription>
            This is your full name.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Telegram ID</FormLabel>
          <FormControl>
            <Input placeholder="Your Telegram ID" {...form.register("telegramId")} disabled={isSubmitting} />
          </FormControl>
          <FormDescription>
            Enter your Telegram ID to receive notifications. To find your ID:
          </FormDescription>
          <FormMessage />
          <ol className="text-sm text-muted-foreground mt-1 list-decimal pl-5 space-y-1">
            <li>Message @WollyShareBot with /start to enable notifications</li>
            <li>Find your Telegram ID by messaging @userinfobot on Telegram</li>
            <li>Paste the numeric ID here (e.g., 123456789)</li>
          </ol>
        </FormItem>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
