
import { supabase } from "@/integrations/supabase/client";
import { IncomingRequest } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

// Get all incoming borrow requests for the current user's items
export const getIncomingRequests = async (): Promise<IncomingRequest[]> => {
  const { user } = useAuth();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get all borrow requests for the current user's items
    const { data, error } = await supabase
      .from("borrow_requests")
      .select(`
        id,
        item_id,
        items:item_id (name),
        borrower_id,
        status,
        message,
        created_at
      `)
      .eq("owner_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching incoming requests:", error);
      throw error;
    }

    // Get borrower usernames separately
    const borrowerIds = (data || []).map(request => request.borrower_id);
    const { data: borrowerProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', borrowerIds);

    if (profilesError) {
      console.error("Error fetching borrower profiles:", profilesError);
    }

    // Create a map of borrower ids to usernames
    const borrowerMap = new Map();
    if (borrowerProfiles) {
      borrowerProfiles.forEach(profile => {
        borrowerMap.set(profile.id, profile.username || 'Unknown User');
      });
    }

    // Transform the data to match the IncomingRequest type
    return (data || []).map((request) => ({
      id: request.id,
      item_id: request.item_id,
      item_name: request.items?.name || 'Unknown Item',
      borrower_id: request.borrower_id,
      requester_username: borrowerMap.get(request.borrower_id) || 'Unknown User',
      start_date: '',  // Set default value as it's not in database yet
      end_date: '',    // Set default value as it's not in database yet
      status: (request.status || 'pending') as IncomingRequest['status'],
      message: request.message || '',
      created_at: request.created_at,
    }));
  } catch (err) {
    console.error("Error in getIncomingRequests:", err);
    return [];  // Return empty array on error
  }
};
