
import { useState, useCallback, memo } from "react";
import { Item } from "@/types/item";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BorrowRequestDialog from "./borrow/BorrowRequestDialog";
import ImageContainer from "./items/ImageContainer";
import ItemDetails from "./items/ItemDetails";
import { categoryColors } from "./items/utils/category-utils";

type ItemCardProps = {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  locationAddress?: string;
  weekdayAvailability: string;
  weekendAvailability: string;
  category: "tools" | "kitchen" | "electronics" | "sports" | "other";
  imageUrl: string | null;
  user_id: string;
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
  onClick,
}: ItemCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(prev => !prev);
  }, []);

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
    // Could add additional logic here after a successful request
  }, []);

  // Create an item object for the dialog - memoized to prevent recreating on every render
  const itemForDialog: Item = useMemo(() => ({
    id,
    name,
    category: category,
    user_id,
    image_url: imageUrl,
    description: null,
    weekday_availability: weekdayAvailability,
    weekend_availability: weekendAvailability,
    ownerName,
    location,
    locationAddress
  }), [id, name, category, user_id, imageUrl, weekdayAvailability, weekendAvailability, ownerName, location, locationAddress]);

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
        onClick={onClick}
      >
        <ImageContainer 
          imageUrl={imageUrl}
          name={name}
          category={category}
          categoryColors={categoryColors}
          onLike={handleLike}
          isLiked={isLiked}
        />
        
        <ItemDetails 
          name={name}
          ownerName={ownerName}
          location={location}
          locationAddress={locationAddress}
          weekdayAvailability={weekdayAvailability}
          weekendAvailability={weekendAvailability}
        />
        
        {/* Action Button */}
        <div className="p-4 pt-0">
          <button 
            className="w-full mt-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
            onClick={handleRequestClick}
          >
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
