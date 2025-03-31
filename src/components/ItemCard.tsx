
import { useState, useCallback, memo } from "react";
import { Item } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BorrowRequestDialog from "./borrow/BorrowRequestDialog";
import ImageContainer from "./items/ImageContainer";
import ItemDetails from "./items/ItemDetails";
import { categoryColors } from "./items/utils/category-utils";
import { Send } from "lucide-react";

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
  onClick,
}: ItemCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
    // Could add additional logic here after a successful request
  }, []);

  // Create the item object for the dialog
  const itemForDialog: Item = {
    id,
    name,
    category,
    user_id,
    image_url: imageUrl,
    description: null,
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
        className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer w-full max-w-md mx-auto"
        onClick={onClick}
      >
        <ImageContainer 
          imageUrl={imageUrl}
          name={name}
          category={category}
          categoryColors={categoryColors}
        />
        
        <ItemDetails 
          name={name}
          ownerName={ownerName}
          location={location || ""}
          locationAddress={locationAddress}
          weekdayAvailability={weekdayAvailability}
          weekendAvailability={weekendAvailability}
        />
        
        {/* Action Button */}
        <div className="p-4 pt-0">
          <button 
            className="w-full mt-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors flex items-center justify-center"
            onClick={handleRequestClick}
          >
            <Send className="mr-2 h-4 w-4" />
            Request to Borrow
          </button>
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
