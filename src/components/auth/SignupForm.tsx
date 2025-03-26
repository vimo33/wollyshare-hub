import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/services/authService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import LocationSelect from "./LocationSelect";
import { signupSchema, type SignupFormValues } from "./signupSchema";
import { AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface SignupFormProps {
  invitationToken?: string;
}

const SignupForm = ({ invitationToken }: SignupFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      fullName: "",
      location: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add the selected location to the user metadata
      const metadata = {
        username: data.username,
        fullName: data.fullName,
        location: data.location || undefined
      };

      const { user, error } = await registerUser({
        email: data.email,
        password: data.password,
        username: data.username,
        fullName: data.fullName,
        invitationToken,
        metadata
      });
      
      if (error) {
        setError(error.message);
        setIsSuccess(false);
      } else if (user) {
        setUserEmail(data.email);
        setIsSuccess(true);
        toast({
          title: "Account created successfully",
          description: "Please check your email for confirmation link.",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsSuccess(false);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 ml-2">Registration Successful!</AlertTitle>
          <AlertDescription className="ml-7">
            <p className="mb-2">Thank you for registering with WollyShare!</p>
            <p className="mb-2">
              <strong>Next steps:</strong>
            </p>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Check your email inbox at <strong>{userEmail}</strong> for a confirmation link</li>
              <li>If you don't see it, please check your spam/junk folder</li>
              <li>After confirming your email, a community admin will need to approve your membership to grant you full access</li>
            </ol>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => navigate("/")}
              >
                Return to Home
              </Button>
              <Button 
                onClick={() => {
                  window.open(`mailto:${userEmail}`);
                }}
              >
                Open Email App
              </Button>
            </div>
          </AlertDescription>
        </Alert>
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

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
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

        <LocationSelect control={form.control} />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
