
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BorrowRequestWithDetails } from "@/types/supabase";

export const useBorrowRequestHistory = () => {
  const [requests, setRequests] = useState<BorrowRequestWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchRequestHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get all borrow requests made by the current user
      const { data, error: requestsError } = await supabase
        .from("borrow_requests")
        .select(`
          id,
          item_id,
          items:item_id (name),
          owner_id,
          borrower_id,
          status,
          message,
          created_at
        `)
        .eq("borrower_id", user.id)
        .order("created_at", { ascending: false });

      if (requestsError) {
        throw requestsError;
      }

      // Get owner names separately to avoid join errors
      const ownerIds = (data || []).map(request => request.owner_id);
      const { data: ownerProfiles, error: ownersError } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .in('id', ownerIds);

      if (ownersError) {
        console.error("Error fetching owner profiles:", ownersError);
      }

      // Create a map of owner ids to names
      const ownerMap = new Map();
      if (ownerProfiles) {
        ownerProfiles.forEach(profile => {
          ownerMap.set(profile.id, profile.username || profile.full_name || 'Unknown Owner');
        });
      }

      // Transform the data to match the BorrowRequestWithDetails type
      const transformedRequests: BorrowRequestWithDetails[] = (data || []).map((request) => {
        // Use the owner map to get the owner name
        const ownerName = ownerMap.get(request.owner_id) || 'Unknown Owner';

        return {
          id: request.id,
          item_id: request.item_id,
          item_name: request.items?.name || 'Unknown Item',
          owner_id: request.owner_id,
          borrower_id: request.borrower_id,
          status: (request.status || 'pending') as BorrowRequestWithDetails['status'],
          message: request.message || '',
          created_at: request.created_at,
          owner_name: ownerName
        };
      });

      setRequests(transformedRequests);
    } catch (err: any) {
      setError(err);
      console.error("Error fetching request history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRequestHistory();
    }
  }, [user, fetchRequestHistory]);

  return {
    requests,
    isLoading,
    error,
    refetchRequests: fetchRequestHistory
  };
};
