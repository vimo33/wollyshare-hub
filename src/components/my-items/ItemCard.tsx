
import React from "react";
import { Edit, Trash2, Image } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAvailabilityText } from "./utils/availability-utils";
import { getCategoryColor } from "./utils/category-utils";
import { Item } from "./types";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
}

const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image for "${item.name}":`, item.image_url);
    setImageError(true);
  };

  // Debug logging for image URLs in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ItemCard rendering for ${item.name}:`, { imageUrl: item.image_url });
    }
  }, [item.name, item.image_url]);

  return (
    <Card className="overflow-hidden w-full max-w-md mx-auto">
      <div className="relative h-[12rem] sm:h-[16rem] bg-muted">
        {item.image_url && !imageError ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Image className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        {item.description && (
          <CardDescription>{item.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {item.location && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{item.location}</span>
            </div>
          )}
          {item.condition && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Condition:</span>
              <span className="font-medium">{item.condition}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weekdays:</span>
            <span className="font-medium">{getAvailabilityText(item.weekday_availability)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weekends:</span>
            <span className="font-medium">{getAvailabilityText(item.weekend_availability)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
