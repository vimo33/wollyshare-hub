
import { useState, useMemo, useCallback, useEffect } from "react";
import { useItemsQuery } from "./useItemsQuery";
import { Item } from "@/types/item";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useHomePageItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [ownerData, setOwnerData] = useState<Record<string, {username: string, full_name: string}>>({});
  const [isOwnerDataLoading, setIsOwnerDataLoading] = useState(false);
  const { user } = useAuth();
  
  // Use useItemsQuery without userId to get all items, but make it depend on user auth state
  const { data: items = [], isLoading: isItemsLoading, error, refetch } = useItemsQuery({
    // This key ensures query is refetched when auth state changes
    queryKey: ['items', 'all', user?.id || 'anonymous']
  });
  
  // Add a manual refetch function that can be called after login
  const refreshItems = useCallback(() => {
    console.log("Manually refreshing home page items");
    refetch();
  }, [refetch]);
  
  // Fetch owner data for all items
  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!items || items.length === 0) return;
      
      setIsOwnerDataLoading(true);
      
      try {
        // Extract unique owner IDs
        const uniqueOwnerIds = [...new Set(items.map(item => item.user_id))];
        
        // Fetch profile data for all owners at once
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', uniqueOwnerIds);
          
        if (error) {
          console.error('Error fetching item owner data:', error);
          return;
        }
        
        // Create a lookup object for quick access by ID
        const ownerLookup: Record<string, {username: string, full_name: string}> = {};
        profiles?.forEach((profile) => {
          ownerLookup[profile.id] = {
            username: profile.username || 'Unknown',
            full_name: profile.full_name || 'Unknown User'
          };
        });
        
        setOwnerData(ownerLookup);
      } catch (err) {
        console.error('Error in fetchOwnerData:', err);
      } finally {
        setIsOwnerDataLoading(false);
      }
    };
    
    fetchOwnerData();
  }, [items]);
  
  // Enhanced items with owner data
  const enhancedItems = useMemo(() => {
    if (!items) return [];
    
    return items.map(item => {
      const owner = ownerData[item.user_id];
      return {
        ...item,
        ownerName: owner?.full_name || owner?.username || 'Unknown User'
      };
    });
  }, [items, ownerData]);
  
  // Filter items based on search query and active category
  const filteredItems = useMemo(() => {
    if (!enhancedItems) return [];
    
    return enhancedItems.filter((item: Item) => {
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
  }, [enhancedItems, searchQuery, activeCategory]);
  
  return {
    filteredItems,
    isLoading: isItemsLoading || isOwnerDataLoading,
    error,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    refreshItems
  };
};
