
import { Item } from "@/types/item";
import { extractLocationFromDescription } from "./itemUtils";

// Helper function to transform raw item data from Supabase to our Item type
export const transformItemData = (
  rawItem: any, 
  userInfo: { name: string, location: string | null } | undefined,
  locationData?: Map<string, {name: string, address: string}>
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
