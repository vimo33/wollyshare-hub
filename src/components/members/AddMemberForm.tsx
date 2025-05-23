
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus, Info } from "lucide-react";
import * as z from "zod";
import { addMemberDirectly } from "@/services/memberService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const addMemberFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  fullName: z.string().min(2, { message: "Full name is required." }),
});

type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;

interface AddMemberFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const currentOpen = isControlled ? open : internalOpen;
  
  const queryClient = useQueryClient();

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: ({ email, fullName }: AddMemberFormValues) => 
      // We still need to pass a username value, so we'll generate one from the email
      addMemberDirectly(email, email.split('@')[0], fullName),
    onSuccess: () => {
      toast.success("Member added successfully");
      queryClient.invalidateQueries({ queryKey: ['members'] });
      form.reset();
      handleOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Add member error:", error);
      
      // Display the error message to the user
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add member. Please try again.");
      }
    },
  });

  // Form setup
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (data: AddMemberFormValues) => {
    addMemberMutation.mutate(data);
  };

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Add Member Directly</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Member Directly</DialogTitle>
          <DialogDescription>
            Add a member directly to your community without sending an invitation.
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You can only add users who already have accounts in the system. If the user doesn't exist, 
            please use the invitation feature instead.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="member@example.com" {...field} />
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
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={addMemberMutation.isPending}
                className="w-full"
              >
                {addMemberMutation.isPending ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberForm;
