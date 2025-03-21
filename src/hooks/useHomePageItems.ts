
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/item";

export const useHomePageItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState<Map<string, {name: string, address: string}>>(new Map());

  useEffect(() => {
    console.log("useHomePageItems hook mounted - fetching locations and items");
    fetchLocations();
    fetchAllItems();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('community_locations')
        .select('*');
        
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      const locMap = new Map();
      data?.forEach(location => {
        locMap.set(location.id, {
          name: location.name,
          address: location.address
        });
      });
      
      setLocationData(locMap);
      console.log(`useHomePageItems: Fetched ${locMap.size} locations`);
    } catch (error) {
      console.error('Error in fetchLocations:', error);
    }
  };

  const fetchAllItems = async () => {
    setIsLoading(true);
    try {
      console.log("useHomePageItems: Explicitly fetching ALL items from ALL users");
      
      // Fetch all items without user filtering
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');

      if (itemsError) {
        console.error('Error fetching all items:', itemsError);
        setIsLoading(false);
        return;
      }

      console.log(`useHomePageItems: Retrieved ${itemsData?.length || 0} total items`);
      
      if (itemsData.length === 0) {
        console.log("useHomePageItems: No items found");
        setItems([]);
        setIsLoading(false);
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
        
        // Use location name from the map if available
        let locationName = "Location not specified";
        let locationAddress = undefined;
        
        if (userInfo.location && locationData.get(userInfo.location)) {
          const locationInfo = locationData.get(userInfo.location);
          locationName = locationInfo?.name || "Location not specified";
          locationAddress = locationInfo?.address;
        }
        
        return {
          ...item,
          ownerName: userInfo.name,
          location: locationName,
          locationAddress: locationAddress,
          category: item.category as any
        } as Item;
      });

      console.log(`useHomePageItems: Processed ${itemsWithOwners.length} items with owner data`);
      setItems(itemsWithOwners);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchAllItems:', error);
      setIsLoading(false);
    }
  };

  return { items, isLoading, fetchItems: fetchAllItems };
};
