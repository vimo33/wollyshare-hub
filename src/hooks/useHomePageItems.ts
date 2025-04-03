
import { useState, useMemo, useCallback } from "react";
import { useItemsQuery } from "./useItemsQuery";
import { Item } from "@/types/item";
import { useAuth } from "@/contexts/AuthContext";

export const useHomePageItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Use useItemsQuery without userId to get all items, but make it depend on user auth state
  const { data: items = [], isLoading, error, refetch } = useItemsQuery({
    // This key ensures query is refetched when auth state changes
    queryKey: ['items', 'all', user?.id || 'anonymous']
  });
  
  // Add a manual refetch function that can be called after login
  const refreshItems = useCallback(() => {
    console.log("Manually refreshing home page items");
    refetch();
  }, [refetch]);
  
  // Filter items based on search query and active category
  const filteredItems = useMemo(() => {
    if (!items) return [];
    
    return items.filter((item: Item) => {
      const matchesSearch = 
        searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        !activeCategory || 
        item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);
  
  return {
    filteredItems,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    refreshItems
  };
};
