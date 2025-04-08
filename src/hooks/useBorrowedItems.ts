
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
        .select("item_id, owner_id, created_at")
        .eq("borrower_id", user.id)
        .eq("status", "approved");

      if (borrowError) {
        throw borrowError;
      }

      if (borrowRequests.length === 0) {
        setItems([]);
        setIsLoading(false);
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
      
      // Get owner details
      const ownerIds = borrowRequests.map(request => request.owner_id);
      const { data: owners, error: ownersError } = await supabase
        .from("profiles")
        .select("id, username, full_name, location")
        .in("id", ownerIds);
        
      if (ownersError) {
        throw ownersError;
      }
      
      // Create maps for easy lookup
      const ownerMap = new Map();
      owners?.forEach(owner => {
        ownerMap.set(owner.id, {
          name: owner.username || owner.full_name || "Unknown Owner",
          location: owner.location
        });
      });
      
      const borrowDatesMap = new Map();
      borrowRequests.forEach(req => {
        borrowDatesMap.set(req.item_id, req.created_at);
      });

      // Transform the data to match the Item type
      const transformedItems: Item[] = itemsData.map((item) => {
        const ownerInfo = ownerMap.get(item.user_id) || { name: "Unknown Owner", location: null };
        
        return {
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
          created_at: borrowDatesMap.get(item.id) || item.created_at, // Use borrow request date
          updated_at: item.updated_at,
          ownerName: ownerInfo.name,
          locationAddress: ownerInfo.location
        };
      });

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
    
    // Set up subscription for real-time updates
    if (user) {
      const channel = supabase
        .channel('borrowed-items-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'borrow_requests',
            filter: `borrower_id=eq.${user.id}`
          },
          () => {
            console.log('Borrow request change detected, refreshing borrowed items');
            fetchBorrowedItems();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchBorrowedItems]);

  return { items, isLoading, error, refetchBorrowedItems: fetchBorrowedItems };
};
