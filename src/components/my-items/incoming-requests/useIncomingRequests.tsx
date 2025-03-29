
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { updateBorrowRequestStatus } from "@/services/borrowRequestService";

interface IncomingRequest {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  borrower_name: string;
  message: string;
  created_at: string;
}

export const useIncomingRequests = (onStatusChange: () => void) => {
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRequestIds, setProcessingRequestIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchIncomingRequests = async () => {
    setIsLoading(true);
    try {
      // Get the current user ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Could not get current user');
      }
      
      // Fetch pending borrow requests where the current user is the owner
      const { data, error } = await supabase
        .from('borrow_requests')
        .select('id, item_id, borrower_id, message, created_at')
        .eq('owner_id', userData.user.id)
        .eq('status', 'pending');

      if (error) throw error;
      
      // If we have requests, fetch related item and borrower data
      if (data && data.length > 0) {
        // Transform the data with detailed item and borrower information
        const formattedRequests: IncomingRequest[] = await Promise.all(
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
              message: request.message || '',
              created_at: request.created_at,
            };
          })
        );

        setIncomingRequests(formattedRequests);
      } else {
        setIncomingRequests([]);
      }
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
      toast({
        title: "Error loading requests",
        description: "Failed to load incoming requests. Please try again.",
        variant: "destructive"
      });
      // Set empty array to prevent undefined
      setIncomingRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch requests on mount
    fetchIncomingRequests();
    
    // Set up real-time subscription for borrow_requests updates
    const borrowRequestsSubscription = supabase
      .channel('borrow_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'borrow_requests' 
      }, () => {
        // Refresh incoming requests when changes occur
        fetchIncomingRequests();
      })
      .subscribe();

    // Clean up subscription
    return () => {
      borrowRequestsSubscription.unsubscribe();
    };
  }, []);

  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    // Add this request to processing state
    setProcessingRequestIds(prev => new Set(prev).add(requestId));
    
    try {
      const result = await updateBorrowRequestStatus(requestId, status);
      
      if (result.success) {
        // Update the local state to remove this request
        setIncomingRequests(prev => prev.filter(request => request.id !== requestId));
        
        // Show success message
        toast({
          title: `Request ${status}`,
          description: `You have ${status} the borrow request.`,
        });
        
        // Trigger parent refresh
        onStatusChange();
      } else {
        throw new Error(result.error || `Failed to ${status} request`);
      }
    } catch (error: any) {
      console.error(`Error ${status} request:`, error);
      toast({
        title: "Error",
        description: error.message || `An error occurred when trying to ${status} the request.`,
        variant: "destructive"
      });
    } finally {
      // Remove from processing state
      setProcessingRequestIds(prev => {
        const updated = new Set(prev);
        updated.delete(requestId);
        return updated;
      });
    }
  };

  return {
    incomingRequests,
    isLoading,
    processingRequestIds,
    handleUpdateStatus,
    fetchIncomingRequests,
  };
};
