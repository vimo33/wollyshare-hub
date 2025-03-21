
import ItemCard from "../ItemCard";
import { Item } from "../../types/item";

type ItemsGridProps = {
  items: Item[];
};

const ItemsGrid = ({ items }: ItemsGridProps) => {
  // Add detailed debugging to verify we're getting items
  console.log(`ItemsGrid rendering ${items.length} items with IDs:`, items.map(item => item.id));
  
  if (items.length === 0) {
    console.log("ItemsGrid: No items to display!");
    return <p className="text-center text-gray-500">No items available.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
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
};

export default ItemsGrid;
