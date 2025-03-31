
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "./signupSchema";
import { registerUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BasicInfoFields from "./BasicInfoFields";
import LocationField from "./LocationField";
import TelegramInfoFields from "./TelegramInfoFields";
import SubmitButton from "./SubmitButton";

interface SignupFormProps {
  invitationToken?: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ invitationToken }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

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

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      fullName: "",
      location: "",
      telegramId: "",
      telegramUsername: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const { user, error } = await registerUser({
        email: data.email,
        password: data.password,
        username: data.username,
        fullName: data.fullName,
        invitationToken,
        metadata: {
          location: data.location,
          telegram_id: data.telegramId,
          telegram_username: data.telegramUsername?.replace('@', '') // Remove @ if included
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error creating account",
          description: error.message,
        });
        console.error("Signup error:", error);
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields control={form.control} />
        <LocationField control={form.control} locations={locations} />
        <TelegramInfoFields control={form.control} />
        <SubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default SignupForm;
