
import { MapPin, Calendar } from "lucide-react";

interface ItemDetailsProps {
  name: string;
  ownerName: string;
  location: string;
  locationAddress?: string;
  weekdayAvailability: string;
  weekendAvailability: string;
  formatAvailability: (availability: string) => string;
}

const ItemDetails = ({ 
  name, 
  ownerName, 
  location, 
  locationAddress,
  weekdayAvailability, 
  weekendAvailability,
  formatAvailability
}: ItemDetailsProps) => {
  // Format the location display text
  const displayLocation = () => {
    if (!location || location === "Unknown Location") {
      return "Location not specified";
    }
    
    // If we have both location name and address, display them both
    if (locationAddress) {
      return `${location} (${locationAddress})`;
    }
    
    return location;
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1 truncate">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">Owned by {ownerName}</p>
      
      {/* Item Details */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span>{displayLocation()}</span>
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
    </div>
  );
};

export default ItemDetails;
