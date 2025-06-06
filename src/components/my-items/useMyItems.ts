
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/supabase";

export const useMyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error: supabaseError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      // Ensure we have the correct types
      const transformedItems: Item[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as Item['category'],
        description: item.description || null,
        user_id: item.user_id,
        image_url: item.image_url || null,
        weekday_availability: item.weekday_availability || 'anytime',
        weekend_availability: item.weekend_availability || 'anytime',
        location: item.location,
        condition: item.condition,
        locationAddress: undefined
      }));

      setItems(transformedItems);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error: supabaseError } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state after successful deletion
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting item:", err);
      throw err;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, fetchItems]);

  return { 
    items, 
    isLoading, 
    error, 
    refetchItems: fetchItems, 
    deleteItem 
  };
};
