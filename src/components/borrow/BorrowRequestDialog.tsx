
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Item } from "@/types/supabase";
import { createBorrowRequest } from "@/services/borrowRequestService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface BorrowRequestDialogProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BorrowRequestDialog = ({
  item,
  isOpen,
  onClose,
  onSuccess,
}: BorrowRequestDialogProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error("User not authenticated when submitting request");
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to request items",
      });
      return;
    }

    console.log("Submit request clicked for item:", item.name);
    console.log("Current user from AuthContext:", user);
    
    setIsSubmitting(true);

    try {
      const requestData = {
        item_id: item.id,
        owner_id: item.user_id,
        message,
      };

      console.log("Sending borrow request with data:", requestData);
      
      await createBorrowRequest(requestData, user.id);

      toast({
        title: "Request sent!",
        description: "The owner has been notified of your request.",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Failed to send request",
        description: error.message,
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
            Send a borrow request to the owner of {item.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message for the owner"
              type="text"
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
