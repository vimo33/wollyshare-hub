
import { formatAvailability } from './availability-utils';
import { categoryColors } from './category-utils';
import { extractLocationFromDescription } from '@/utils/itemUtils';
import { Item } from '@/types/item';

// Format the location display text
export const formatLocationDisplay = (location?: string, locationAddress?: string): string => {
  if (!location || location === "Unknown Location" || location === "Location not specified") {
    return "Location not specified";
  }
  
  // If we have both location name and address, display them both
  if (locationAddress) {
    return `${location} (${locationAddress})`;
  }
  
  return location;
};

// Extract location information from item data and location map
export const extractLocationInfo = (
  item: any, 
  locationData?: Map<string, {name: string, address: string}>
) => {
  let locationName = "Location not specified";
  let locationAddress = undefined;
  
  // Case 1: We have location data from the user profile
  if (item.userInfo?.location && locationData?.get(item.userInfo.location)) {
    const locationInfo = locationData.get(item.userInfo.location);
    locationName = locationInfo?.name || "Location not specified";
    locationAddress = locationInfo?.address;
  } 
  // Case 2: Try to extract from description
  else if (item.description) {
    const extractedLocation = extractLocationFromDescription(item.description);
    locationName = extractedLocation !== "Location not specified" ? extractedLocation : "Location not specified";
  }
  
  return { locationName, locationAddress };
};

// Transform raw item data from Supabase to our Item type
export const transformItemData = (
  rawItem: any, 
  userInfo: { name: string, location: string | null } | undefined,
  locationData?: Map<string, {name: string, address: string}>
): Item => {
  // Extract location information
  const { locationName, locationAddress } = extractLocationInfo({ 
    ...rawItem, 
    userInfo 
  }, locationData);
  
  // Validate category
  const validCategories = ["tools", "kitchen", "electronics", "sports", "other"];
  const safeCategory = validCategories.includes(rawItem.category) ? rawItem.category : "other";
  
  return {
    ...rawItem,
    ownerName: userInfo?.name || "Unknown User",
    location: locationName,
    locationAddress: locationAddress,
    category: safeCategory
  } as Item;
};
