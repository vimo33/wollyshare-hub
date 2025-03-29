
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createBorrowRequest } from '@/services/borrowRequestService';
import { Item } from '@/types/item';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { useTelegramChat } from '@/hooks/useTelegramChat';

type BorrowRequestDialogProps = {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRequestSent?: () => void; // New callback for refreshing incoming requests
};

const BorrowRequestDialog = ({
  item,
  isOpen,
  onClose,
  onSuccess,
  onRequestSent,
}: BorrowRequestDialogProps) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { startTelegramChat } = useTelegramChat();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to request items',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBorrowRequest(
        item.id,
        item.user_id,
        message
      );

      if (result.success) {
        toast({
          title: 'Request sent',
          description: 'Your borrow request has been sent to the owner',
        });
        
        // Try to start a Telegram chat
        try {
          const chatResult = await startTelegramChat(
            user.id,
            item.user_id,
            item.name
          );
          
          if (chatResult.success) {
            toast({
              title: 'Telegram notification sent',
              description: 'The owner will be notified via Telegram',
            });
          } else if (chatResult.error) {
            // Log the error but don't show to user as it's a non-critical feature
            console.log('Telegram chat could not be created:', chatResult.error);
          }
        } catch (telegramError) {
          console.error('Error with Telegram integration:', telegramError);
          // Don't show this error to the user as Telegram is a supplementary feature
        }
        
        setMessage('');
        onSuccess();
        
        // Call the callback to refresh incoming requests
        if (onRequestSent) {
          onRequestSent();
        }
        
        onClose();
      } else {
        toast({
          title: 'Error sending request',
          description: result.error || 'An unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error sending request',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent requesting your own item
  const isOwnItem = user && user.id === item.user_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
          <DialogDescription>
            Send a request to borrow the item "{item.name}" from {item.ownerName || 'the owner'}.
          </DialogDescription>
        </DialogHeader>

        {isOwnItem ? (
          <div className="flex items-start space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">You cannot request to borrow your own item.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Message to Owner</h4>
                <Textarea
                  placeholder="Introduce yourself and explain why you'd like to borrow this item..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-32"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Availability</h4>
                <p className="text-sm text-gray-500">
                  <strong>Weekdays:</strong> {item.weekday_availability}
                  <br />
                  <strong>Weekends:</strong> {item.weekend_availability}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BorrowRequestDialog;
