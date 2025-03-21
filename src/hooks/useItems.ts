
import { useState, useEffect, useMemo } from "react";
import { useItemsQuery } from "./useItemsQuery";

export const useItems = (userId?: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { 
    data: items = [], 
    isLoading, 
    error,
    refetch,
    locationData
  } = useItemsQuery({ userId });

  // Set isLoaded state once data is available with proper dependencies
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
    error,
    locationData,
    fetchItems: refetch 
  }), [items, isLoaded, isLoading, error, locationData, refetch]);
};
