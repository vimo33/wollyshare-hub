
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
        profiles:borrower_id (username),
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

    // Transform the data to match the IncomingRequest type
    return (data || []).map((request) => ({
      id: request.id,
      item_id: request.item_id,
      item_name: request.items.name,
      borrower_id: request.borrower_id,
      requester_username: request.profiles.username,
      start_date: request.start_date || '',  // Fallback for missing fields
      end_date: request.end_date || '',      // Fallback for missing fields
      status: request.status,
      message: request.message || '',
      created_at: request.created_at,
    }));
  } catch (err) {
    console.error("Error in getIncomingRequests:", err);
    return [];  // Return empty array on error
  }
};
