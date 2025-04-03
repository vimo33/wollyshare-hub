
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAvailabilityText } from "./utils/availability-utils";
import { getCategoryIcon, getCategoryIconBackground, getCategoryIconColor } from "../items/utils/category-icon-utils";
import { Item } from "@/types/supabase";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps) => {
  return (
    <Card className="overflow-hidden w-full max-w-md mx-auto flex flex-col h-full hover:shadow-md transition-all duration-300">
      <div className="relative h-[12rem] sm:h-[16rem] bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Category badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${getCategoryIconColor(item.category)} bg-white shadow-sm`}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </div>
        
        {/* Category icon */}
        <div className="w-full h-full flex items-center justify-center">
          <div className={`p-8 rounded-full ${getCategoryIconBackground(item.category)} shadow-inner`}>
            {getCategoryIcon(item.category, 64)}
          </div>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        {/* Only show description if there is one */}
        {item.description && (
          <div className="description-container mt-2">
            <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-2">
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
      
      <CardFooter className="flex justify-between mt-auto">
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
          onClick={() => onDelete(item)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
