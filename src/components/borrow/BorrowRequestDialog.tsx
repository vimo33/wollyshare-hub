import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as z from "zod";
import { createBorrowRequest } from "@/services/borrowService";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import useTelegramChat from "@/hooks/useTelegramChat";

interface BorrowRequestDialogProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onRequestSent?: () => void; // Add callback prop for refreshing requests
}

const BorrowRequestDialog = ({ 
  item, 
  isOpen, 
  onClose,
  onRequestSent 
}: BorrowRequestDialogProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const borrowRequestSchema = z.object({
    dateRange: z.object({
      from: z.date({
        required_error: "A start date is required.",
      }),
      to: z.date({
        required_error: "An end date is required.",
      }),
    }),
    message: z.string().optional(),
  });
  
  type BorrowRequestFormValues = z.infer<typeof borrowRequestSchema>;
  
  const { toast } = useToast();
  const { startTelegramChat } = useTelegramChat();
  const { user } = useAuth();

  const form = useForm<BorrowRequestFormValues>({
    resolver: zodResolver(borrowRequestSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      message: "",
    },
  });

  const onSubmit = async (data: BorrowRequestFormValues) => {
    setIsSubmitting(true);

    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "You must be logged in to request an item",
        });
        return;
      }

      const { error, data: requestData } = await createBorrowRequest({
        item_id: item.id,
        start_date: data.dateRange.from,
        end_date: data.dateRange.to,
        message: data.message,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error creating borrow request",
          description: error.message,
        });
      } else {
        // Start Telegram chat
        if (user) {
          try {
            await startTelegramChat(
              user.id, 
              item.user_id, 
              item.name
            );
          } catch (chatError) {
            // Silently log the error but don't impact the user experience
            console.error("Failed to start Telegram chat:", chatError);
          }
        }

        toast({
          title: "Request sent successfully!",
          description: "The item owner has been notified of your request.",
        });
        
        // Call the onRequestSent callback if provided
        if (onRequestSent) {
          onRequestSent();
        }
        
        onClose();
      }
    } catch (err) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
          <DialogDescription>
            Submit a request to borrow this item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value?.from && "text-muted-foreground"
                          )}
                        >
                          {field.value?.from ? (
                            field.value?.to ? (
                              `${format(field.value.from, "MMM dd, yyyy")} - ${format(field.value.to, "MMM dd, yyyy")}`
                            ) : (
                              format(field.value.from, "MMM dd, yyyy")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Write a message to the owner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowRequestDialog;
