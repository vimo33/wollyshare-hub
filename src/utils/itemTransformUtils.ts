
import { Item } from "@/types/item";
import { LocationMap } from "@/hooks/useItemsQuery";

export const transformItemData = (
  item: any, 
  userInfo: { name?: string; location?: string | null } = {}, 
  locationMap?: LocationMap
): Item => {
  // Get location details if available
  const locationData = item.location && locationMap?.get(item.location);
  
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
    location: item.location || null,
    ownerName: userInfo.name || 'Unknown User',
    locationAddress: locationData?.address || userInfo.location || null,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
};
