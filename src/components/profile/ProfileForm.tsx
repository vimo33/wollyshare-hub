
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, UpdateProfileFormValues } from "./updateProfileSchema";
import { updateProfile } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LocationSelect from "@/components/auth/LocationSelect";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface ProfileFormProps {
  profile?: any;
  userEmail?: string;
  onProfileUpdate?: () => Promise<void>;
}

const ProfileForm = ({ profile: propProfile, userEmail, onProfileUpdate }: ProfileFormProps = {}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { profile: authProfile } = useAuth();
  const profile = propProfile || authProfile;
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: profile?.username || "",
      fullName: profile?.full_name || "",
      location: profile?.location || undefined,
      telegram_id: profile?.telegram_id || "",
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        fullName: profile.full_name,
        location: profile.location || undefined,
        telegram_id: profile.telegram_id || "",
      });
    }
  }, [profile, form]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (data: UpdateProfileFormValues) => {
    setIsSubmitting(true);

    try {
      if (!profile) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find user profile.",
        });
        return;
      }

      const user = await updateProfileSchema.safeParseAsync(data);

      if (!user.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid form data.",
        });
        return;
      }

      const updates = {
        username: data.username,
        full_name: data.fullName,
        location: data.location,
        telegram_id: data.telegram_id,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await updateProfile(updates);

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Error updating profile",
          description: updateError.message,
        });
      } else {
        toast({
          title: "Profile updated!",
          description: "Your profile has been updated successfully.",
        });
        if (onProfileUpdate) {
          await onProfileUpdate();
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      console.error("Unexpected error during profile update:", err);
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
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
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <LocationSelect 
                  control={form.control}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="telegram_id"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Telegram ID (Optional)</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Telegram ID Help</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You can get your Telegram ID by messaging @get_id_bot on Telegram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input placeholder="123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating profile...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
