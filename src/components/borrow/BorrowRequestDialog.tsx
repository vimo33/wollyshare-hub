
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createBorrowRequest } from "@/services/borrowRequestService";

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
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send a borrow request",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Fix: createBorrowRequest expects to return an object with success property, not an array
      const result = await createBorrowRequest({
        item_id: item.id,
        owner_id: item.user_id,
        message,
      });

      // Check if result is an object with success property
      if (result && 'success' in result && result.success) {
        toast({
          title: "Request sent",
          description: `Your request to borrow ${item.name} has been sent.`,
        });
        setMessage("");
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Error sending request",
          description: result && 'message' in result ? result.message : "There was a problem sending your request.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:top-[15%] top-0 max-h-[90vh] overflow-y-auto">
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-8 w-8 bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">Owned by {item.ownerName || "Unknown"}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message to Owner (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Hi! I'd like to borrow this item..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowRequestDialog;
