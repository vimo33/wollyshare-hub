
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "../types/item";
import { extractLocationFromDescription } from "../utils/itemUtils";

// Valid category types for type-checking
const validCategories = ["tools", "kitchen", "electronics", "sports", "other"] as const;
type ValidCategory = typeof validCategories[number];

// Helper to validate if a category is one of the allowed values
const isValidCategory = (category: string): category is ValidCategory => {
  return validCategories.includes(category as ValidCategory);
};

export const useItems = (locationData: Map<string, {name: string, address: string}>) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [locationData]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching all items from all users");
      
      // Fetch all items from Supabase without any user filtering
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');

      if (itemsError) {
        console.error('Error fetching items:', itemsError);
        return;
      }

      // Get unique user IDs from the items
      const userIds = [...new Set(itemsData.map(item => item.user_id))];
      
      // Fetch user profiles for those IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, location')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map of user IDs to names and locations
      const userMap = new Map();
      profilesData?.forEach(profile => {
        userMap.set(profile.id, {
          name: profile.username || profile.full_name || 'Unknown User',
          location: profile.location || null
        });
      });

      // Combine items with owner names and locations
      const itemsWithOwners = itemsData.map(item => {
        const userInfo = userMap.get(item.user_id) || { name: 'Unknown User', location: null };
        // Use location name from the map if available, or extract from description as fallback
        let locationName = "Location not specified";
        let locationAddress = undefined;
        
        if (userInfo.location && locationData.get(userInfo.location)) {
          const locationInfo = locationData.get(userInfo.location);
          locationName = locationInfo?.name || "Location not specified";
          locationAddress = locationInfo?.address;
        } else if (item.description) {
          const extractedLocation = extractLocationFromDescription(item.description);
          locationName = extractedLocation !== "Location not specified" ? extractedLocation : "Location not specified";
        }
        
        // Validate the category or fallback to "other"
        const safeCategory = isValidCategory(item.category) ? item.category : "other";
        
        return {
          ...item,
          ownerName: userInfo.name,
          location: locationName,
          locationAddress: locationAddress,
          category: safeCategory
        } as Item; // Cast to Item after validation
      });

      console.log(`Found ${itemsWithOwners.length} items from all users`);
      setItems(itemsWithOwners);
      
      // Simulate some loading time for smoother UI
      setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error in fetchItems:', error);
      setIsLoading(false);
    }
  };

  return { items, isLoaded, isLoading, fetchItems };
};
