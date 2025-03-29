
import { memo, useEffect, useState } from 'react';
import ItemCard from "../ItemCard";
import { Item } from "@/types/item";
import { useIsMobile } from "@/hooks/use-mobile";

interface ItemsGridProps {
  items: Item[];
}

/**
 * Displays a responsive grid of item cards
 */
const ItemsGrid = memo(({ items }: ItemsGridProps) => {
  const isMobile = useIsMobile();
  // Add state to track if items are mounted to help with animations
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted after a small delay to ensure animations run properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0"
      aria-label="Items grid"
      role="region"
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`${isMounted ? 'opacity-0 animate-fade-up' : 'opacity-0'}`}
          style={{ 
            animationDelay: `${index * 50}ms`, 
            animationFillMode: 'forwards' 
          }}
          data-testid={`item-card-${item.id}`}
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
        </div>
      ))}
    </div>
  );
});

ItemsGrid.displayName = 'ItemsGrid';

export default ItemsGrid;
