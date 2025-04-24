
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

      console.log("Fetching borrowed items for user:", user.id);

      // Get approved borrow requests with item details in a single query
      const { data: borrowedItems, error: borrowError } = await supabase
        .from("borrow_requests")
        .select(`
          item_id,
          owner_id,
          created_at,
          items (
            id,
            name,
            category,
            description,
            image_url,
            weekday_availability,
            weekend_availability,
            location,
            condition
          ),
          profiles!owner_id (
            username,
            full_name,
            location
          )
        `)
        .eq("borrower_id", user.id)
        .eq("status", "approved");

      if (borrowError) {
        throw borrowError;
      }

      console.log("Found borrowed items:", borrowedItems?.length || 0);

      // Transform the data to match the Item type
      const transformedItems: Item[] = borrowedItems
        .filter(bi => bi.items) // Filter out any null items
        .map((bi) => ({
          id: bi.items.id,
          name: bi.items.name,
          category: bi.items.category as Item['category'],
          description: bi.items.description,
          image_url: bi.items.image_url,
          weekday_availability: bi.items.weekday_availability,
          weekend_availability: bi.items.weekend_availability,
          user_id: bi.owner_id,
          location: bi.items.location,
          condition: bi.items.condition,
          created_at: bi.created_at,
          ownerName: bi.profiles?.username || bi.profiles?.full_name || "Unknown Owner",
          locationAddress: bi.profiles?.location
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

      // Set up real-time subscription for borrow request changes
      const channel = supabase
        .channel('borrowed-items-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events
            schema: 'public',
            table: 'borrow_requests',
            filter: `borrower_id=eq.${user.id}`
          },
          () => {
            console.log('Borrow request changed, refreshing items');
            fetchBorrowedItems();
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for borrowed-items-changes: ${status}`);
        });

      return () => {
        console.log("Removing borrowed items channel subscription");
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchBorrowedItems]);

  return { items, isLoading, error, refetchBorrowedItems: fetchBorrowedItems };
};
