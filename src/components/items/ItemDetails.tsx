
import React, { memo } from "react";
import { getAvailabilityText } from "./utils/availability-utils";
import { MapPin, Clock, User } from "lucide-react";

interface ItemDetailsProps {
  name: string;
  ownerName: string;
  location: string;
  locationAddress?: string | null;
  weekdayAvailability: string;
  weekendAvailability: string;
}

const ItemDetails = memo(({
  ownerName,
  location,
  locationAddress,
  weekdayAvailability,
  weekendAvailability
}: ItemDetailsProps) => {
  // Format location display
  const displayLocation = () => {
    if (!location || location === "Unknown Location" || location === "Location not specified") {
      return "Location not specified";
    }
    
    // Check if location is a UUID (likely an ID reference)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(location);
    
    if (isUUID && locationAddress) {
      return locationAddress;
    }
    
    return location;
  };

  return (
    <div className="space-y-2 text-sm mt-2">
      {/* Owner Info */}
      <div className="flex items-start">
        <User className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
        <span className="text-gray-700">{ownerName}</span>
      </div>
      
      {/* Location Info */}
      <div className="flex items-start">
        <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
        <div>
          <span className="text-gray-700">{displayLocation()}</span>
          {!isUUID && locationAddress && (
            <p className="text-xs text-gray-500 mt-0.5">{locationAddress}</p>
          )}
        </div>
      </div>
      
      {/* Availability Info */}
      <div className="flex items-start">
        <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
        <div>
          <div className="flex flex-wrap items-center gap-x-1">
            <span className="text-gray-500">Weekdays:</span>
            <span className="text-gray-700">{getAvailabilityText(weekdayAvailability)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-1">
            <span className="text-gray-500">Weekends:</span>
            <span className="text-gray-700">{getAvailabilityText(weekendAvailability)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ItemDetails.displayName = 'ItemDetails';

export default ItemDetails;
