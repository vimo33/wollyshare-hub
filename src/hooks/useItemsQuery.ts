
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/item";
import { transformItemData } from "@/utils/itemTransformUtils";

// Define query keys for better cache management
export const itemsQueryKeys = {
  all: ['items'] as const,
  byUser: (userId: string) => [...itemsQueryKeys.all, 'user', userId] as const,
  locations: ['locations'] as const,
  profiles: ['profiles'] as const,
};

// Valid category types for type-checking
const validCategories = ["tools", "kitchen", "electronics", "sports", "books", "games", "diy-craft", "other"] as const;
export type ValidCategory = typeof validCategories[number];

// Helper to validate if a category is one of the allowed values
export const isValidCategory = (category: string): category is ValidCategory => {
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

export type LocationMap = Map<string, LocationInfo>;

export interface ItemsQueryResult extends Omit<UseQueryResult<Item[], Error>, 'data'> {
  data?: Item[];
  locationData: LocationMap;
  locationError?: Error;
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

// New hook to fetch all user profiles
export const useProfilesQuery = () => {
  return useQuery({
    queryKey: itemsQueryKeys.profiles,
    queryFn: async () => {
      console.log('Fetching all user profiles');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, location');
        
      if (error) {
        console.error('Error fetching user profiles:', error);
        throw error;
      }
      
      // Create a map of user IDs to profile information
      const userMap = new Map();
      data?.forEach(profile => {
        userMap.set(profile.id, {
          name: profile.username || profile.full_name || 'Unknown User',
          location: profile.location || null
        });
      });
      
      console.log(`Fetched ${userMap.size} user profiles`);
      return userMap;
    },
    staleTime: 1000 * 60 * 5, // Cache profiles for 5 minutes
  });
};

export const useItemsQuery = ({ userId, enabled = true }: UseItemsQueryOptions = {}): ItemsQueryResult => {
  // Use the locations query
  const { 
    data: locationData = new Map(), 
    isLoading: isLocationLoading, 
    error: locationError 
  } = useLocationsQuery();

  // Use the profiles query to get all user profiles
  const {
    data: userMap = new Map(),
    isLoading: isProfilesLoading,
    error: profilesError
  } = useProfilesQuery();

  // Use React Query to fetch items
  const itemsQuery = useQuery({
    queryKey: userId ? itemsQueryKeys.byUser(userId) : itemsQueryKeys.all,
    queryFn: async () => {
      console.log(`useItemsQuery: ${userId ? `Fetching items for user ${userId}` : 'Fetching all items'}`);
      
      let queryBuilder = supabase.from('items').select('*');
      
      // Only filter by userId if provided
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

      // Combine items with owner names and locations directly from userMap
      return itemsData.map(item => {
        const userInfo = userMap.get(item.user_id) || { name: 'Unknown User', location: null };
        return transformItemData(item, userInfo, locationData);
      });
    },
    enabled: enabled && !isLocationLoading && !isProfilesLoading,
    staleTime: 1000 * 60 * 2, // Cache items for 2 minutes
  });

  return {
    ...itemsQuery,
    isLoading: itemsQuery.isLoading || isLocationLoading || isProfilesLoading,
    locationData,
    locationError: locationError || profilesError
  };
};
