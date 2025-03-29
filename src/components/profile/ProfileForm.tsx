
import React from "react";
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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  telegramId: z.string().optional(),
});

const ProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.user_metadata?.username || "",
      fullName: user?.user_metadata?.full_name || "",
      telegramId: user?.user_metadata?.telegram_id || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

      toast({
        title: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="shadcn" {...form.register("username")} />
          </FormControl>
          <FormDescription>
            This is your public display name.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" {...form.register("fullName")} />
          </FormControl>
          <FormDescription>
            This is your full name.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Telegram ID</FormLabel>
          <FormControl>
            <Input placeholder="Your Telegram ID" {...form.register("telegramId")} />
          </FormControl>
          <FormDescription>
            Enter your Telegram ID to receive notifications.
          </FormDescription>
          <FormMessage />
          <p className="text-sm text-muted-foreground mt-1">Message @WollyShareBot with /start to enable notifications.</p>
        </FormItem>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
