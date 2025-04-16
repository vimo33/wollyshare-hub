
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { sendPasswordResetEmail } from "@/services/authService";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Sending password reset email to:", data.email);
      
      // Build the absolute URL for the reset password page
      const origin = window.location.origin; // e.g., https://example.com
      const resetUrl = `${origin}/reset-password`; 
      
      console.log("Using reset URL:", resetUrl);
      
      const { error } = await sendPasswordResetEmail(data.email, resetUrl);

      if (error) {
        console.error("Error sending reset email:", error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        console.log("Password reset email sent successfully");
        setEmailSent(true);
        toast({
          title: "Email sent",
          description: "Check your inbox for the password reset link",
        });
      }
    } catch (err: any) {
      console.error("Error during password reset:", err);
      setError("An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-muted-foreground">
          We've sent a password reset link to your email address.
          Please check your inbox to reset your password.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Didn't receive an email? Check your spam folder or
          <button
            onClick={() => {
              setEmailSent(false);
              form.reset();
            }}
            className="text-primary hover:underline ml-1"
          >
            try again
          </button>
        </p>
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
          <h2 className="text-lg font-medium">Reset your password</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
