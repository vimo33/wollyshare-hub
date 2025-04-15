
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
import { createBorrowRequest } from "@/services/borrowRequestService";
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
      // First create borrow request to get it in the database 
      const response = await createBorrowRequest(
        {
          item_id: item.id,
          owner_id: item.user_id,
          message: message,
        },
        user.id
      );

      // Then send Telegram notification with the user's message included
      await startTelegramChat(user.id, item.user_id, item.name, message);

      toast({
        title: "Request approved automatically",
        description: "Your borrow request has been automatically approved.",
      });
      
      // Close dialog and trigger success callback
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
              placeholder="Briefly explain why you want to borrow this item..."
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
