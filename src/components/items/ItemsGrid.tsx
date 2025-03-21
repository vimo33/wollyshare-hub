
import ItemCard from "../ItemCard";
import { Item } from "../../types/item";

type ItemsGridProps = {
  items: Item[];
};

const ItemsGrid = ({ items }: ItemsGridProps) => {
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
