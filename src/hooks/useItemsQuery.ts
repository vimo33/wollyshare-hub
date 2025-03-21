
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/item";
import { useState, useEffect } from "react";
import { extractLocationFromDescription } from "@/utils/itemUtils";

// Define query keys for better cache management
export const itemsQueryKeys = {
  all: ['items'] as const,
  byUser: (userId: string) => [...itemsQueryKeys.all, 'user', userId] as const,
  locations: ['locations'] as const,
};

// Valid category types for type-checking
const validCategories = ["tools", "kitchen", "electronics", "sports", "other"] as const;
type ValidCategory = typeof validCategories[number];

// Helper to validate if a category is one of the allowed values
const isValidCategory = (category: string): category is ValidCategory => {
  return validCategories.includes(category as ValidCategory);
};

export interface UseItemsQueryOptions {
  userId?: string;
  enabled?: boolean;
}

export interface LocationInfo {
  name: string;
  address: string;
}

export const useLocationsQuery = () => {
  return useQuery({
    queryKey: itemsQueryKeys.locations,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_locations')
        .select('*');
        
      if (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
      
      const locMap = new Map<string, LocationInfo>();
      data?.forEach(location => {
        locMap.set(location.id, {
          name: location.name,
          address: location.address
        });
      });
      
      return locMap;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useItemsQuery = ({ userId, enabled = true }: UseItemsQueryOptions = {}) => {
  // Use the locations query
  const { 
    data: locationData = new Map(), 
    isLoading: isLocationLoading, 
    error: locationError 
  } = useLocationsQuery();

  // Use React Query to fetch items
  const itemsQuery = useQuery({
    queryKey: userId ? itemsQueryKeys.byUser(userId) : itemsQueryKeys.all,
    queryFn: async () => {
      console.log(`useItemsQuery: ${userId ? `Fetching items for user ${userId}` : 'Fetching all items'}`);
      
      let queryBuilder = supabase.from('items').select('*');
      
      if (userId) {
        queryBuilder = queryBuilder.eq('user_id', userId);
      }
      
      const { data: itemsData, error: itemsError } = await queryBuilder;

      if (itemsError) {
        console.error('Error fetching items:', itemsError);
        throw itemsError;
      }

      if (itemsData.length === 0) {
        return [];
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
        throw profilesError;
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
      return itemsData.map(item => {
        const userInfo = userMap.get(item.user_id) || { name: 'Unknown User', location: null };
        
        // Use location name from the map if available
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
        } as Item;
      });
    },
    enabled: enabled && !isLocationLoading,
    staleTime: 1000 * 60 * 2, // Cache items for 2 minutes
  });

  return {
    ...itemsQuery,
    isLoading: itemsQuery.isLoading || isLocationLoading,
    locationData,
    locationError
  };
};
