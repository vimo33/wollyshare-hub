
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

  // Once data is loaded, update the isLoaded state
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
