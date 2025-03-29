
import React, { useState } from "react";
import { Item } from "@/types/item";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createBorrowRequest } from "@/services/borrowRequestService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTelegramChat } from "@/hooks/useTelegramChat";

// Schema for form validation
const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
}).refine(data => data.startDate <= data.endDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

interface BorrowRequestDialogProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onRequestSent?: () => void; // Callback to refresh parent component
}

const BorrowRequestDialog = ({ 
  item, 
  isOpen, 
  onClose,
  onRequestSent
}: BorrowRequestDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startTelegramChat } = useTelegramChat();
  
  // Form setup with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      startDate: new Date(),
      endDate: new Date(),
    }
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "Please sign in to borrow items",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format dates for storage
      const requestData = {
        item_id: item.id,
        owner_id: item.user_id,
        message: values.message,
        start_date: format(values.startDate, "yyyy-MM-dd"),
        end_date: format(values.endDate, "yyyy-MM-dd"),
      };
      
      // Create the borrow request
      const result = await createBorrowRequest(requestData);
      
      // Try to start a Telegram chat
      // This will succeed silently or fail silently
      try {
        await startTelegramChat(
          user.id, 
          item.user_id, 
          item.name
        );
      } catch (chatError) {
        // Log but don't show to user since this is a non-critical feature
        console.error("Failed to start Telegram chat:", chatError);
      }
      
      toast({
        title: "Request sent!",
        description: "Your borrow request has been sent to the owner.",
      });
      
      // Trigger refresh of parent component
      if (onRequestSent) {
        onRequestSent();
      }
      
      handleClose();
    } catch (error: any) {
      console.error("Error sending borrow request:", error);
      toast({
        variant: "destructive",
        title: "Failed to send request",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow Request</DialogTitle>
          <DialogDescription>
            Send a request to borrow {item.name} from its owner.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Date range selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date() || 
                            (form.getValues().startDate && date < form.getValues().startDate)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Message field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to owner</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please let me borrow this item..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowRequestDialog;
