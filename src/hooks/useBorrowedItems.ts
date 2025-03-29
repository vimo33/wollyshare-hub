
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/item";

export const useBorrowedItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchBorrowedItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get all approved borrow requests where the current user is the borrower
      const { data: borrowRequests, error: requestsError } = await supabase
        .from("borrow_requests")
        .select("item_id")
        .eq("borrower_id", user.id)
        .eq("status", "approved");

      if (requestsError) {
        throw requestsError;
      }

      if (borrowRequests && borrowRequests.length > 0) {
        // Get the items that are being borrowed
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
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(err);
      console.error("Error fetching borrowed items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBorrowedItems();
    }
  }, [user]);

  return { items, isLoading, error };
};
