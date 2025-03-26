
import { Item } from "@/types/item";
import { extractLocationFromDescription } from "./itemUtils";
import { LocationMap } from "@/hooks/useItemsQuery";

/**
 * User profile information needed for item transformation
 */
interface UserInfo {
  name: string;
  location: string | null;
}

/**
 * Transforms raw item data from Supabase to our Item type
 * 
 * @param rawItem Raw item data from Supabase
 * @param userInfo Optional user information with name and location
 * @param locationData Map of location IDs to location information
 * @returns Transformed Item object
 */
export const transformItemData = (
  rawItem: any, 
  userInfo: UserInfo | undefined,
  locationData?: LocationMap
): Item => {
  if (!rawItem) {
    throw new Error('Cannot transform undefined or null item data');
  }
  
  // Extract location information
  let locationName = "Location not specified";
  let locationAddress = undefined;
  
  // Case 1: We have location data from the user profile
  if (userInfo?.location && locationData?.get(userInfo.location)) {
    const locationInfo = locationData.get(userInfo.location);
    locationName = locationInfo?.name || "Location not specified";
    locationAddress = locationInfo?.address;
  } 
  // Case 2: Try to extract from description
  else if (rawItem.description) {
    const extractedLocation = extractLocationFromDescription(rawItem.description);
    locationName = extractedLocation !== "Location not specified" ? extractedLocation : "Location not specified";
  }
  
  // Validate category to include the new categories
  const validCategories = ["tools", "kitchen", "electronics", "sports", "books", "games", "diy-craft", "other"];
  const safeCategory = validCategories.includes(rawItem.category) ? rawItem.category : "other";
  
  return {
    ...rawItem,
    ownerName: userInfo?.name || "Unknown User",
    location: locationName,
    locationAddress: locationAddress,
    category: safeCategory
  } as Item;
};

/**
 * Format the location display text
 * 
 * @param location Location name
 * @param locationAddress Optional location address
 * @returns Formatted location string
 */
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
