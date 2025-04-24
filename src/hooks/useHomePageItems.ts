
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useItems } from "@/hooks/useItems";
import { Item } from "@/types/item";

export const useHomePageItems = () => {
  const { user } = useAuth();
  const [totalItems, setTotalItems] = useState(0);
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Use the existing useItems hook to get all items
  const { 
    items, 
    isLoaded: itemsLoaded, 
    isLoading: itemsLoading, 
    error: itemsError,
    fetchItems
  } = useItems();

  // Filter items based on search query and category
  const filteredItems = useCallback(() => {
    return items.filter((item) => {
      // Apply search filter
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply category filter
      const matchesCategory = !activeCategory || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Count total items
      const { count: itemsCount, error: itemsError } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true });

      if (itemsError) throw itemsError;
      
      setTotalItems(itemsCount || 0);

      // Count total borrows (all approved borrow requests)
      const { count: borrowsCount, error: borrowsError } = await supabase
        .from("borrow_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      if (borrowsError) throw borrowsError;
      
      setTotalBorrows(borrowsCount || 0);

    } catch (err: any) {
      console.error("Error fetching home page stats:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Function to refresh both stats and items
  const refreshAll = useCallback(async () => {
    try {
      console.log("Manually refreshing home page items");
      await fetchStats();
      await fetchItems();
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  }, [fetchStats, fetchItems]);

  // Return all required properties
  return {
    totalItems,
    totalBorrows,
    isLoading: isLoading || itemsLoading,
    error: error || itemsError,
    filteredItems: filteredItems(),
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    refreshItems: refreshAll,
    refetchStats: fetchStats
  };
};
