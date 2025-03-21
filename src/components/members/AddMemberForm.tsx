
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
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

// Form validation schema
const addMemberFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  fullName: z.string().min(2, { message: "Full name is required." }),
});

type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;

const AddMemberForm: React.FC = () => {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Member Directly</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Member Directly</DialogTitle>
          <DialogDescription>
            Add a member directly to your community without sending an invitation.
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
