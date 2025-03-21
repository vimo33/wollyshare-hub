
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import * as z from "zod";
import { createInvitation } from "@/services/invitationService";
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

// Form validation schema
const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const InviteForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Create invitation mutation
  const createInviteMutation = useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      form.reset();
      setOpen(false);
    },
    onError: (error: any) => {
      console.error("Invitation error:", error);
      
      // Display the error message to the user
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send invitation. Please try again.");
      }
    },
  });

  // Form setup
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    createInviteMutation.mutate(data.email);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Invite New Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a New Member</DialogTitle>
          <DialogDescription>
            Send an invitation email to a new member to join your community.
          </DialogDescription>
        </DialogHeader>
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
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={createInviteMutation.isPending}
                className="w-full"
              >
                {createInviteMutation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteForm;
