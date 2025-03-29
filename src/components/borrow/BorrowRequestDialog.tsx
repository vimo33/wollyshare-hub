import React from "react";
import { Item } from "@/types/supabase";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { useTelegramChat } from "@/hooks/useTelegramChat";

interface BorrowRequestDialogProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onRequestSent?: () => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const BorrowRequestDialog: React.FC<BorrowRequestDialogProps> = ({ 
  item, 
  isOpen, 
  onClose,
  onRequestSent,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { sendTelegramMessage } = useTelegramChat();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to request items.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current date in ISO format
      const now = new Date();
      const currentDate = format(now, "yyyy-MM-dd");
      // Default end date (14 days later)
      const endDate = format(
        new Date(now.setDate(now.getDate() + 14)),
        "yyyy-MM-dd"
      );

      const { error } = await supabase.from("borrow_requests").insert({
        item_id: item.id,
        owner_id: item.user_id,
        borrower_id: user.id,
        status: "pending",
        message: data.message,
        start_date: currentDate,
        end_date: endDate,
      });

      if (error) {
        throw error;
      }

      // Try to send Telegram notification if owner has Telegram ID
      if (item.ownerName) {
        try {
          // Get owner's profile to check for telegram_id
          const { data: ownerData } = await supabase
            .from('profiles')
            .select('telegram_id')
            .eq('id', item.user_id)
            .single();
            
          if (ownerData?.telegram_id) {
            const requesterName = profile?.username || profile?.full_name || 'Someone';
            const message = `🔔 *New Borrow Request*\n\n${requesterName} wants to borrow your item "${item.name}".\n\nMessage: "${data.message}"\n\nPlease check the app to approve or reject this request.`;
            
            await sendTelegramMessage(ownerData.telegram_id, message);
          }
        } catch (telegramError) {
          console.error("Failed to send Telegram notification:", telegramError);
          // Don't throw here, we still want to succeed even if the notification fails
        }
      }

      toast({
        title: "Request Sent!",
        description: `Your request for ${item.name} has been sent to the owner.`,
      });

      onClose();
      
      // Call onRequestSent callback if provided
      if (onRequestSent) {
        onRequestSent();
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
          <DialogDescription>
            Send a request to borrow this item from {item.ownerName || "the owner"}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Location:</p>
              <p>{item.location || "Not specified"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category:</p>
              <p className="capitalize">{item.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Weekday Availability:</p>
              <p>{item.weekday_availability}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Weekend Availability:</p>
              <p>{item.weekend_availability}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to Owner</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain why you'd like to borrow this item and when you need it."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowRequestDialog;
