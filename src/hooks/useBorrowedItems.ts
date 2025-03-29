
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/supabase";

export const useBorrowedItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchBorrowedItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get approved borrow requests for the current user
      const { data: borrowRequests, error: borrowError } = await supabase
        .from("borrow_requests")
        .select("item_id")
        .eq("borrower_id", user.id)
        .eq("status", "approved");

      if (borrowError) {
        throw borrowError;
      }

      if (borrowRequests.length === 0) {
        setItems([]);
        return;
      }

      // Get the item details for borrowed items
      const itemIds = borrowRequests.map((request) => request.item_id);
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds);

      if (itemsError) {
        throw itemsError;
      }

      // Transform the data to match the Item type
      const transformedItems: Item[] = itemsData.map((item) => ({
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
      setError(err);
      console.error("Error fetching borrowed items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBorrowedItems();
    }
  }, [user, fetchBorrowedItems]);

  return { items, isLoading, error, refetchBorrowedItems: fetchBorrowedItems };
};
