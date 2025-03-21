import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/services/authService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  location: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  invitationToken?: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
}

const SignupForm = ({ invitationToken }: SignupFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

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

  // Fetch locations from the database
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('id, name, address');

        if (error) {
          console.error('Error fetching locations:', error);
          // Fall back to mock data if there's an error
          setLocations([
            { id: '1', name: 'Main Building', address: '123 Community Ave, City' },
            { id: '2', name: 'East Wing', address: '125 Community Ave, City' },
          ]);
        } else if (data && data.length > 0) {
          setLocations(data as Location[]);
        } else {
          // Fall back to mock data if no locations are found
          setLocations([
            { id: '1', name: 'Main Building', address: '123 Community Ave, City' },
            { id: '2', name: 'East Wing', address: '125 Community Ave, City' },
          ]);
        }
      } catch (err) {
        console.error('Error in fetchLocations:', err);
        // Fall back to mock data if there's an error
        setLocations([
          { id: '1', name: 'Main Building', address: '123 Community Ave, City' },
          { id: '2', name: 'East Wing', address: '125 Community Ave, City' },
        ]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

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

      const { user, error } = await registerUser(
        data.email, 
        data.password, 
        data.username, 
        data.fullName,
        invitationToken,
        metadata
      );
      
      if (error) {
        setError(error.message);
      } else if (user) {
        toast({
          title: "Account created successfully",
          description: "Welcome to WollyShare!",
        });
        navigate("/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!invitationToken && (
          <Alert>
            <AlertDescription>
              Note: You need an invitation to become a full member. Without an invitation link, you'll sign up with limited access.
            </AlertDescription>
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

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Location</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoadingLocations || locations.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {locations.length === 0 && !isLoadingLocations && (
                <p className="text-sm text-muted-foreground">No locations available. Please contact an administrator.</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

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
