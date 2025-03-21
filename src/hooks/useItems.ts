
import { useState, useEffect, useMemo } from "react";
import { useItemsQuery, ItemsQueryResult } from "./useItemsQuery";
import { Item } from "@/types/item";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

/**
 * Interface for the return value of the useItems hook
 */
export interface UseItemsResult {
  items: Item[];
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  locationData: Map<string, { name: string; address: string; }>;
  fetchItems: (options?: RefetchOptions) => Promise<QueryObserverResult<Item[], Error>>;
}

/**
 * Custom hook to fetch and manage items with loading state
 * @param userId Optional user ID to filter items by owner
 * @returns Items data and loading states
 */
export const useItems = (userId?: string): UseItemsResult => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { 
    data: items = [], 
    isLoading, 
    error,
    refetch,
    locationData
  } = useItemsQuery({ userId });

  // Set isLoaded state once data is available
  useEffect(() => {
    if (items.length > 0 && !isLoaded && !isLoading) {
      setIsLoaded(true);
    }
  }, [items, isLoading, isLoaded]);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({ 
    items, 
    isLoaded, 
    isLoading,
    error: error || null,
    locationData,
    fetchItems: refetch 
  }), [items, isLoaded, isLoading, error, locationData, refetch]);
};
