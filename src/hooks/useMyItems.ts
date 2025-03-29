
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/item";

export const useMyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchItems = async () => {
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

      // Transform the data to match the Item type
      const transformedItems: Item[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as Item['category'],
        description: item.description,
        image_url: item.image_url,
        weekday_availability: item.weekday_availability,
        weekend_availability: item.weekend_availability,
        user_id: item.user_id,
        location: item.location || 'Unknown',
        condition: item.condition || 'Good',
        locationAddress: undefined
      }));

      setItems(transformedItems);
    } catch (err: any) {
      setError(err);
      console.error("Error fetching items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (itemId: string) => {
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
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  return { items, isLoading, error, refetchItems: fetchItems, deleteItem };
};
