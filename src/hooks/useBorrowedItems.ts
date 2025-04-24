
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

      // First, get all approved borrow requests for the current user
      const { data: borrowRequests, error: borrowError } = await supabase
        .from("borrow_requests")
        .select(`
          item_id,
          owner_id,
          created_at
        `)
        .eq("borrower_id", user.id)
        .eq("status", "approved");

      if (borrowError) {
        throw borrowError;
      }

      console.log("Found borrow requests:", borrowRequests?.length || 0);

      if (!borrowRequests || borrowRequests.length === 0) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      // Collect all item IDs and owner IDs
      const itemIds = borrowRequests.map(br => br.item_id);
      const ownerIds = borrowRequests.map(br => br.owner_id);

      // Get all the items
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds);

      if (itemsError) {
        throw itemsError;
      }

      // Get owner profiles as a separate query to avoid join errors
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, location")
        .in("id", ownerIds);

      if (profilesError) {
        throw profilesError;
      }

      // Create a map for quick lookup
      const profilesMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Map borrow requests to their respective items and owners
      const borrowMap = new Map();
      borrowRequests.forEach(br => {
        borrowMap.set(br.item_id, br);
      });

      // Transform the data to match the Item type
      const transformedItems: Item[] = itemsData
        ? itemsData.map((item) => {
            const borrowRequest = borrowMap.get(item.id);
            const ownerProfile = borrowRequest ? profilesMap.get(borrowRequest.owner_id) : null;

            return {
              id: item.id,
              name: item.name,
              category: item.category as Item['category'],
              description: item.description,
              image_url: item.image_url,
              weekday_availability: item.weekday_availability,
              weekend_availability: item.weekend_availability,
              user_id: borrowRequest?.owner_id,
              location: item.location,
              condition: item.condition,
              created_at: borrowRequest?.created_at,
              ownerName: ownerProfile ? (ownerProfile.username || ownerProfile.full_name || "Unknown Owner") : "Unknown Owner",
              locationAddress: ownerProfile ? ownerProfile.location : undefined
            };
          })
        : [];

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
