
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
          created_at,
          profiles:owner_id (username, full_name)
        `)
        .eq("borrower_id", user.id)
        .order("created_at", { ascending: false });

      if (requestsError) {
        throw requestsError;
      }

      // Transform the data to match the BorrowRequestWithDetails type
      const transformedRequests: BorrowRequestWithDetails[] = (data || []).map((request) => ({
        id: request.id,
        item_id: request.item_id,
        item_name: request.items?.name || 'Unknown Item',
        owner_id: request.owner_id,
        borrower_id: request.borrower_id,
        status: (request.status || 'pending') as BorrowRequestWithDetails['status'],
        message: request.message || '',
        created_at: request.created_at,
        owner_name: request.profiles?.username || 
                    request.profiles?.full_name || 
                    'Unknown Owner'
      }));

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
