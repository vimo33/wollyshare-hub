
import { useState } from "react";
import { Item } from "../types/item";
import { useItemsQuery } from "./useItemsQuery";

export const useItems = (locationData: Map<string, {name: string, address: string}>, userId?: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { data: items = [], isLoading, refetch } = useItemsQuery({ userId });

  // Once data is loaded, update the isLoaded state
  if (items.length > 0 && !isLoaded && !isLoading) {
    setIsLoaded(true);
  }
  
  return { 
    items, 
    isLoaded, 
    isLoading, 
    fetchItems: refetch 
  };
};
