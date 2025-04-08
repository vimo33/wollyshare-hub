
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

/**
 * Transform raw item data into consistent Item type format
 */
const transformItemData = (itemData: any): Item => {
  return {
    id: itemData.id,
    name: itemData.name,
    category: itemData.category as Item['category'],
    description: itemData.description || null,
    image_url: itemData.image_url || null,
    weekday_availability: itemData.weekday_availability || 'anytime',
    weekend_availability: itemData.weekend_availability || 'anytime',
    user_id: itemData.user_id,
    location: itemData.location,
    condition: itemData.condition || "Good", // Default to "Good" if not provided
    created_at: itemData.created_at,
    updated_at: itemData.updated_at,
    locationAddress: undefined
  };
};

/**
 * Hook for managing user's items
 */
export const useMyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Fetch user's items from the database
   */
  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        console.log("useMyItems: No user authenticated, skipping fetch");
        setItems([]);
        return;
      }

      console.log("Fetching items for user:", user.id);
      
      const { data, error: supabaseError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      console.log("Items fetched successfully:", data);

      // Transform data to match Item type
      const transformedItems: Item[] = data.map(transformItemData);
      setItems(transformedItems);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setError(err);
      toast({
        title: "Error fetching items",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  /**
   * Update local state with a new item without fetching
   */
  const updateLocalItem = useCallback((itemData: any) => {
    console.log("Manually updating local item state:", itemData);
    const transformedItem: Item = transformItemData(itemData);
    
    setItems(prev => {
      // Check if the item already exists in the local state
      const index = prev.findIndex(item => item.id === transformedItem.id);
      if (index >= 0) {
        // Update existing item
        const updatedItems = [...prev];
        updatedItems[index] = transformedItem;
        return updatedItems;
      } else {
        // Add new item
        return [...prev, transformedItem];
      }
    });
  }, []);

  /**
   * Delete an item from the database and update local state
   */
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error: deleteError } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      console.log("Item deleted successfully:", itemId);

      // Update local state after successful deletion
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting item:", err);
      return { 
        success: false,
        message: err.message || "Error deleting item"
      };
    }
  }, [user]);

  // Set up effect for initial data fetch
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Set up subscription for real-time updates
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to changes on the items table
    const setupSubscription = () => {
      const channel = supabase
        .channel('items-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'items',
            filter: `user_id=eq.${user.id}`
          },
          handleRealtimeUpdate
        )
        .subscribe();
      
      return channel;
    };
    
    // Handle different types of realtime updates
    const handleRealtimeUpdate = (payload: any) => {
      console.log('Real-time update received:', payload);
      
      // For insert and update events, we can update the local state immediately
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        updateLocalItem(payload.new);
      } else if (payload.eventType === 'DELETE') {
        // For delete events, remove the item from local state
        setItems(prev => prev.filter(item => item.id !== payload.old.id));
      } else {
        // For other events, just refetch to be safe
        fetchItems();
      }
    };
    
    const channel = setupSubscription();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchItems, updateLocalItem]);

  return { 
    items, 
    isLoading, 
    error, 
    refetchItems: fetchItems, 
    deleteItem,
    updateLocalItem 
  };
};
