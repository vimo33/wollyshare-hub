
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { updateUserPassword } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Attempting to update password");
      
      // Verify we have a valid session before proceeding
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setError("No valid authentication session found. Please request a new password reset link.");
        setIsSubmitting(false);
        return;
      }
      
      // Use our authService function to update the password
      const { error } = await updateUserPassword(data.password);

      if (error) {
        console.error("Error from updateUserPassword:", error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        setSuccess(true);
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully",
        });
        
        // Sign out to clear the recovery token session
        await supabase.auth.signOut();
        
        // Slight delay before redirecting
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <h3 className="text-lg font-medium mb-2">Password Reset Successful!</h3>
        <p className="text-muted-foreground mb-4">
          Your password has been updated successfully.
        </p>
        <Button onClick={() => navigate("/auth")} className="w-full">
          Continue to Login
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 text-center">
          <h2 className="text-lg font-medium">Set a new password</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Please enter and confirm your new password
          </p>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
