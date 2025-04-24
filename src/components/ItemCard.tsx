import { useState, useCallback, memo, KeyboardEvent } from "react";
import { Item } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BorrowRequestDialog from "./borrow/BorrowRequestDialog";
import ImageContainer from "./items/ImageContainer";
import ItemDetails from "./items/ItemDetails";
import { Send } from "lucide-react";
import { useBorrowedItems } from "@/hooks/useBorrowedItems";

type ItemCardProps = {
  id: string;
  name: string;
  ownerName: string;
  location: string | null;
  locationAddress?: string | null;
  weekdayAvailability: string;
  weekendAvailability: string;
  category: "tools" | "kitchen" | "electronics" | "sports" | "other";
  imageUrl: string | null;
  user_id: string;
  condition: string;
  description?: string | null;
  onClick?: () => void;
};

const ItemCard = memo(({
  id,
  name,
  ownerName,
  location,
  locationAddress,
  weekdayAvailability,
  weekendAvailability,
  category,
  imageUrl,
  user_id,
  condition,
  description,
  onClick,
}: ItemCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { refetchBorrowedItems } = useBorrowedItems();

  const handleRequestClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to log in to request items",
        variant: "destructive"
      });
      return;
    }
    
    setIsDialogOpen(true);
  }, [user, toast]);

  const handleRequestSuccess = useCallback(() => {
    toast({
      title: "Request sent!",
      description: "Your borrow request has been sent successfully",
    });
    
    // Refresh borrowed items list after successful request
    refetchBorrowedItems();
  }, [toast, refetchBorrowedItems]);

  // Add keyboard handler for accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    // Trigger click action on Enter or Space key
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  // Create the item object for the dialog
  const itemForDialog: Item = {
    id,
    name,
    category,
    user_id,
    image_url: imageUrl,
    description,
    weekday_availability: weekdayAvailability,
    weekend_availability: weekendAvailability,
    ownerName,
    location,
    locationAddress,
    condition,
  };

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer w-full max-w-md mx-auto flex flex-col h-full group"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${name}`}
      >
        <ImageContainer 
          category={category}
          name={name}
          itemId={id}
        />
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg">{name}</h3>
          
          {/* Description with scrollable container */}
          {description && (
            <div className="mt-1 mb-3 relative">
              <div 
                className="text-sm text-gray-600 h-[4.5em] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3
                }}
              >
                {description}
              </div>
            </div>
          )}
        
          <ItemDetails 
            name={name}
            ownerName={ownerName}
            location={location || ""}
            locationAddress={locationAddress}
            weekdayAvailability={weekdayAvailability}
            weekendAvailability={weekendAvailability}
          />
          
          {/* Action Button */}
          <div className="mt-auto">
            <button 
              className="w-full mt-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors flex items-center justify-center"
              onClick={handleRequestClick}
              aria-label="Request to borrow this item"
            >
              <Send className="mr-2 h-4 w-4" />
              Request to Borrow
            </button>
          </div>
        </div>
      </div>

      {/* Borrow Request Dialog */}
      <BorrowRequestDialog
        item={itemForDialog}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleRequestSuccess}
      />
    </>
  );
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;
