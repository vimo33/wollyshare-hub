
import { Item } from "@/types/item";
import { LocationMap } from "@/hooks/useItemsQuery";

export const transformItemData = (
  item: any, 
  userInfo: { name?: string; location?: string | null } = {}, 
  locationMap?: LocationMap
): Item => {
  // Get location details if available
  const locationData = item.location && locationMap?.get(item.location);
  
  // Determine location display and address
  let locationName = userInfo.location || null;
  let locationAddress = null;
  
  // If we have a location ID and it exists in the location map
  if (item.location && locationMap && locationMap.has(item.location)) {
    const locData = locationMap.get(item.location);
    locationName = locData?.name || locationName;
    locationAddress = locData?.address || null;
  }
  
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
    locationAddress: locationAddress,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
};
