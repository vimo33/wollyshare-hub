
import { useState, useMemo } from "react";
import { useItemsQuery } from "./useItemsQuery";
import { Item } from "@/types/item";

export const useHomePageItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Use useItemsQuery without userId to get all items
  const { data: items = [], isLoading, error } = useItemsQuery();
  
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
    setActiveCategory
  };
};
