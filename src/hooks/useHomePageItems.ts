
import { useState, useMemo, useCallback } from "react";
import { useItems } from "./useItems";
import { Item } from "@/types/item";

export interface UseHomePageItemsResult {
  items: Item[];
  filteredItems: Item[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  refreshItems: () => Promise<void>;
}

/**
 * Custom hook to handle home page items with filtering functionality
 * @returns Filtered items and filter state management
 */
export const useHomePageItems = (): UseHomePageItemsResult => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { items, isLoading, error, fetchItems } = useItems();
  
  // Memoized callback for category changes
  const handleCategoryChange = useCallback((category: string | null) => {
    setActiveCategory(prevCategory => 
      category === prevCategory ? null : category
    );
  }, []);

  // Memoized callback for search changes
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Refresh items function
  const refreshItems = useCallback(async () => {
    try {
      await fetchItems();
    } catch (error) {
      console.error("Error refreshing items:", error);
    }
  }, [fetchItems]);

  // Filter items based on search query and active category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchQuery === "" || 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === null || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  return {
    items,
    filteredItems,
    isLoading,
    error,
    searchQuery,
    setSearchQuery: handleSearchChange,
    activeCategory,
    setActiveCategory: handleCategoryChange,
    refreshItems
  };
};
