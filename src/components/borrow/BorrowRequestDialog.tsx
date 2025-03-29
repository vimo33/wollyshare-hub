import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createBorrowRequest } from "@/services/borrowRequestService";
import { Item } from "@/types/supabase";

const borrowRequestFormSchema = z.object({
  message: z.string().optional(),
  start_date: z.string().min(1, {
    message: "Please select a start date.",
  }),
  end_date: z.string().min(1, {
    message: "Please select an end date.",
  }),
});

export interface BorrowRequestFormValues extends z.infer<typeof borrowRequestFormSchema> {}

export interface BorrowRequestDialogProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onRequestSent?: () => void;
  onSuccess?: () => void; // Add this optional prop
}

const BorrowRequestDialog: React.FC<BorrowRequestDialogProps> = ({ item, isOpen, onClose, onRequestSent, onSuccess }) => {
  const { toast } = useToast();

  const form = useForm<BorrowRequestFormValues>({
    resolver: zodResolver(borrowRequestFormSchema),
    defaultValues: {
      message: "",
      start_date: "",
      end_date: "",
    },
  });

  const handleSubmit = async (values: BorrowRequestFormValues) => {
    try {
      await createBorrowRequest({
        item_id: item.id,
        owner_id: item.user_id,
        message: values.message || '',
        start_date: values.start_date,
        end_date: values.end_date,
      });

      toast({
        title: "Request sent!",
        description: "Your request has been submitted to the item owner.",
      });
      
      // After successful submission:
      if (onRequestSent) onRequestSent();
      if (onSuccess) onSuccess();

      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to send request: ${error.message}`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
          <DialogDescription>
            Send a borrow request to the item owner.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a message to the item owner"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Send Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowRequestDialog;
