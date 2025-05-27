
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/item";
import { retryWithBackoff, checkSupabaseConnection } from "@/services/connectionService";

interface ItemsQueryOptions {
  userId?: string;
}

export interface ItemsQueryResult {
  data: Item[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  locationData: Map<string, { name: string; address: string; }>;
}

const fetchItems = async (userId?: string): Promise<Item[]> => {
  console.log("useItemsQuery: Fetching all items");
  
  // Check connection health first
  const connectionStatus = await checkSupabaseConnection();
  if (!connectionStatus.isConnected) {
    throw new Error(`Database connection failed: ${connectionStatus.error}`);
  }

  const itemsOperation = async () => {
    let query = supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: items, error: itemsError } = await query;

    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      throw itemsError;
    }

    return items || [];
  };

  const profilesOperation = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, full_name, location");

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      throw profilesError;
    }

    return profiles || [];
  };

  const locationsOperation = async () => {
    const { data: locations, error: locationsError } = await supabase
      .from("community_locations")
      .select("*");

    if (locationsError) {
      console.error("Error fetching locations:", locationsError);
      throw locationsError;
    }

    return locations || [];
  };

  // Execute all operations with retry logic
  const [items, profiles, locations] = await Promise.all([
    retryWithBackoff(itemsOperation),
    retryWithBackoff(profilesOperation),
    retryWithBackoff(locationsOperation)
  ]);

  console.log(`Fetched ${items.length} items, ${profiles.length} profiles, ${locations.length} locations`);

  // Create lookup maps
  const profilesMap = new Map();
  profiles.forEach(profile => {
    profilesMap.set(profile.id, profile);
  });

  const locationsMap = new Map();
  locations.forEach(location => {
    locationsMap.set(location.id, location);
  });

  // Transform items with owner information
  const transformedItems: Item[] = items.map(item => {
    const ownerProfile = profilesMap.get(item.user_id);
    const locationData = locationsMap.get(ownerProfile?.location);

    return {
      ...item,
      ownerName: ownerProfile ? (ownerProfile.username || ownerProfile.full_name || "Unknown") : "Unknown",
      locationAddress: locationData ? `${locationData.name}, ${locationData.address}` : undefined,
    };
  });

  console.log(`Transformed ${transformedItems.length} items with owner data`);
  return transformedItems;
};

const fetchLocationData = async (): Promise<Map<string, { name: string; address: string; }>> => {
  const locationOperation = async () => {
    const { data: locations, error } = await supabase
      .from("community_locations")
      .select("*");

    if (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }

    return locations || [];
  };

  const locations = await retryWithBackoff(locationOperation);
  
  const locationData = new Map();
  locations.forEach(location => {
    locationData.set(location.id, {
      name: location.name,
      address: location.address
    });
  });

  return locationData;
};

export const useItemsQuery = ({ userId }: ItemsQueryOptions = {}) => {
  const itemsQuery = useQuery({
    queryKey: ["items", userId],
    queryFn: () => fetchItems(userId),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const locationQuery = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocationData,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    data: itemsQuery.data || [],
    isLoading: itemsQuery.isLoading || locationQuery.isLoading,
    error: itemsQuery.error || locationQuery.error,
    refetch: itemsQuery.refetch,
    locationData: locationQuery.data || new Map(),
  };
};
