
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

      console.log("Fetching items for user:", user.id);
      
      const { data, error: supabaseError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      console.log("Items fetched successfully:", data);

      // Transform the data to match the Item type
      const transformedItems: Item[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as Item['category'],
        description: item.description || null,
        image_url: item.image_url || null,
        weekday_availability: item.weekday_availability || 'anytime',
        weekend_availability: item.weekend_availability || 'anytime',
        user_id: item.user_id,
        location: item.location,
        condition: item.condition,
        created_at: item.created_at,
        updated_at: item.updated_at,
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

      // First check if there are any borrow requests for this item
      const { data: borrowRequests, error: borrowError } = await supabase
        .from("borrow_requests")
        .select("id")
        .eq("item_id", itemId);

      if (borrowError) {
        throw borrowError;
      }

      // If there are active borrow requests, return error
      if (borrowRequests && borrowRequests.length > 0) {
        return { 
          success: false, 
          hasBorrowRequests: true,
          message: "Cannot delete item with active borrow requests" 
        };
      }

      // Otherwise proceed with deletion
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
