
import { useState, useEffect } from "react";
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

  // Set isLoaded state once data is available
  useEffect(() => {
    if (items.length > 0 && !isLoaded && !isLoading) {
      setIsLoaded(true);
    }
  }, [items, isLoading, isLoaded]);
  
  return { 
    items, 
    isLoaded, 
    isLoading,
    error,
    locationData,
    fetchItems: refetch 
  };
};
