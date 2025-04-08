
import { Item } from "@/types/item";
import { LocationMap } from "@/hooks/useItemsQuery";

/**
 * Transform an item from raw data into a fully populated Item object
 */
export const transformItemData = (
  item: any, 
  userInfo: { name?: string; location?: string | null } = {}, 
  locationMap?: LocationMap
): Item => {
  if (!item) {
    throw new Error('Cannot transform undefined or null item data');
  }

  // Get location details if available
  const locationData = item.location && locationMap?.get(item.location);
  
  // Determine location display and address - prefer data from the location map
  const locationName = locationData?.name || userInfo.location || null;
  const locationAddress = locationData?.address || undefined;
  
  // Return transformed item with all required properties
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description || null,
    image_url: item.image_url || null,
    user_id: item.user_id,
    weekday_availability: item.weekday_availability || 'anytime',
    weekend_availability: item.weekend_availability || 'anytime',
    condition: item.condition || null,
    location: locationName,
    ownerName: userInfo.name || 'Unknown User',
    locationAddress,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
};
