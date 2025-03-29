
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BorrowRequestWithDetails {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  borrower_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message: string;
  created_at: string;
  updated_at: string;
}

export const useBorrowRequestHistory = () => {
  const [requests, setRequests] = useState<BorrowRequestWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequestHistory = async () => {
    setIsLoading(true);
    try {
      // Get the current user ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Could not get current user');
      }
      
      // Fetch all borrow requests where the current user is the owner, any status
      const { data, error } = await supabase
        .from('borrow_requests')
        .select('id, item_id, borrower_id, status, message, created_at, updated_at')
        .eq('owner_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If we have requests, fetch the related data
      if (data && data.length > 0) {
        // Create a formatted request array
        const formattedRequests: BorrowRequestWithDetails[] = await Promise.all(
          data.map(async (request) => {
            // Get item name
            const { data: itemData } = await supabase
              .from('items')
              .select('name')
              .eq('id', request.item_id)
              .single();
              
            // Get borrower information
            const { data: borrowerData } = await supabase
              .from('profiles')
              .select('username, full_name')
              .eq('id', request.borrower_id)
              .single();
              
            return {
              id: request.id,
              item_id: request.item_id,
              item_name: itemData?.name || 'Unknown Item',
              borrower_id: request.borrower_id,
              borrower_name: 
                borrowerData?.username || 
                borrowerData?.full_name || 
                'Unknown User',
              status: request.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
              message: request.message || '',
              created_at: request.created_at,
              updated_at: request.updated_at,
            };
          })
        );

        setRequests(formattedRequests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching request history:', error);
      toast({
        title: "Error loading history",
        description: "Failed to load your request history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestHistory();
  }, []);

  return {
    requests,
    isLoading,
    fetchRequestHistory,
  };
};
