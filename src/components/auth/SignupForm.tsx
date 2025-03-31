
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "./signupSchema";
import { registerUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LocationSelect from "./LocationSelect";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface SignupFormProps {
  invitationToken?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ invitationToken }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      fullName: "",
      location: undefined,
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
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
                <Input type="password" placeholder="******" {...field} />
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
                  onChange={field.onChange}
                  value={field.value}
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
          name="telegramId"
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

        <FormField
          control={form.control}
          name="telegramUsername"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Telegram Username (Optional)</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Telegram Username Help</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set a username in Telegram under Settings → Username</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs text-muted-foreground">
                This is required for direct messaging in Telegram notifications
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
