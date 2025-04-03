import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/supabase";
import { useTelegramChat } from "@/hooks/useTelegramChat";

interface BorrowRequestDialogProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BorrowRequestDialog: React.FC<BorrowRequestDialogProps> = ({
  item,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { startTelegramChat } = useTelegramChat();

  const handleSubmit = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to request an item.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create borrow request
      const { data, error } = await supabase.from("borrow_requests").insert([
        {
          item_id: item.id,
          borrower_id: user.id,
          owner_id: item.user_id,
          message: message,
          status: "pending",
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      // Start Telegram chat
      await startTelegramChat(user.id, item.user_id, item.name);

      toast({
        title: "Request submitted",
        description: "Your request has been successfully submitted.",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error submitting borrow request:", error);
      toast({
        title: "Error",
        description:
          error.message || "There was an error submitting your request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, item, message, toast, onClose, onSuccess, startTelegramChat]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
          <DialogDescription>
            Let {item.ownerName} know why you want to borrow {item.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowRequestDialog;
