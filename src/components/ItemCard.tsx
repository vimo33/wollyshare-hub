
import { useState, useCallback, memo, useEffect } from "react";
import { Item } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BorrowRequestDialog from "./borrow/BorrowRequestDialog";
import ImageContainer from "./items/ImageContainer";
import ItemDetails from "./items/ItemDetails";
import { Send } from "lucide-react";
import { useBorrowedItems } from "@/hooks/useBorrowedItems"; // Add this import

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
  const { refetchBorrowedItems } = useBorrowedItems(); // Add this hook

  const handleRequestClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("Request button clicked. User authenticated:", !!user);
    console.log("User details:", user);
    
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
    console.log("Borrow request successfully submitted");
    toast({
      title: "Request sent!",
      description: "Your borrow request has been sent successfully",
    });
    
    // Refresh borrowed items list after successful request
    refetchBorrowedItems();
  }, [toast, refetchBorrowedItems]);

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
      >
        <ImageContainer 
          category={category}
          name={name}
          itemId={id}
        />
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg">{name}</h3>
          
          {/* Description - only show if there is one */}
          {description && (
            <div className="mt-1 mb-3">
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
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

ItemDetails.displayName = 'ItemDetails';
ItemCard.displayName = 'ItemCard';

export default ItemCard;
