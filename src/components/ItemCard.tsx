
import { useState } from "react";
import { Calendar, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type ItemCardProps = {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  weekdayAvailability: string;
  weekendAvailability: string;
  category: "tools" | "kitchen" | "electronics" | "sports" | "other";
  imageUrl: string;
  onClick?: () => void;
};

const ItemCard = ({
  id,
  name,
  ownerName,
  location,
  weekdayAvailability,
  weekendAvailability,
  category,
  imageUrl,
  onClick,
}: ItemCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const categoryColors = {
    tools: "bg-wolly-blue",
    kitchen: "bg-wolly-pink",
    electronics: "bg-wolly-purple",
    sports: "bg-wolly-green",
    other: "bg-wolly-yellow",
  };

  const formatAvailability = (availability: string): string => {
    switch (availability) {
      case "morning": return "Morning (8AM-12PM)";
      case "afternoon": return "Afternoon (12PM-5PM)";
      case "evening": return "Evening (5PM-9PM)";
      case "anytime": return "Anytime";
      case "unavailable": return "Unavailable";
      default: return availability;
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-primary/30 border-primary/10 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Category Tag */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>
        
        {/* Like Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          onClick={handleLike}
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors", 
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            )} 
          />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">Owned by {ownerName}</p>
        
        {/* Item Details */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{location}</span>
          </div>
          <div className="flex flex-col space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                <strong>Weekdays:</strong> {formatAvailability(weekdayAvailability)}
              </span>
            </div>
            <div className="flex items-center ml-6">
              <span>
                <strong>Weekends:</strong> {formatAvailability(weekendAvailability)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <button className="w-full mt-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors">
          Request to Borrow
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
