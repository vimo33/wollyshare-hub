
import { memo } from 'react';
import ItemCard from "../ItemCard";
import { Item } from "@/types/item";
import { useIsMobile } from "@/hooks/use-mobile";
import SwipeableCard from "../mobile/SwipeableCard";
import { useToast } from '@/hooks/use-toast';

interface ItemsGridProps {
  items: Item[];
}

/**
 * Displays a responsive grid of item cards
 */
const ItemsGrid = memo(({ items }: ItemsGridProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleSwipeLeft = (itemName: string) => {
    if (isMobile) {
      toast({
        title: "Not interested",
        description: `You've swiped left on ${itemName}`,
      });
    }
  };
  
  const handleSwipeRight = (itemName: string) => {
    if (isMobile) {
      toast({
        title: "Interested",
        description: `You've swiped right on ${itemName}! Try tapping to request.`,
      });
    }
  };

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Items grid"
      role="region"
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className="opacity-0 animate-fade-up"
          style={{ 
            animationDelay: `${index * 50}ms`, 
            animationFillMode: 'forwards' 
          }}
          data-testid={`item-card-${item.id}`}
        >
          {isMobile ? (
            <SwipeableCard
              onSwipeLeft={() => handleSwipeLeft(item.name)}
              onSwipeRight={() => handleSwipeRight(item.name)}
            >
              <ItemCard
                id={item.id}
                name={item.name}
                ownerName={item.ownerName || "Unknown"}
                location={item.location || "Location not specified"}
                locationAddress={item.locationAddress}
                weekdayAvailability={item.weekday_availability}
                weekendAvailability={item.weekend_availability}
                category={item.category as any}
                imageUrl={item.image_url}
                user_id={item.user_id}
                onClick={() => console.log(`Clicked on item: ${item.id}`)}
              />
            </SwipeableCard>
          ) : (
            <ItemCard
              id={item.id}
              name={item.name}
              ownerName={item.ownerName || "Unknown"}
              location={item.location || "Location not specified"}
              locationAddress={item.locationAddress}
              weekdayAvailability={item.weekday_availability}
              weekendAvailability={item.weekend_availability}
              category={item.category as any}
              imageUrl={item.image_url}
              user_id={item.user_id}
              onClick={() => console.log(`Clicked on item: ${item.id}`)}
            />
          )}
        </div>
      ))}
    </div>
  );
});

ItemsGrid.displayName = 'ItemsGrid';

export default ItemsGrid;
