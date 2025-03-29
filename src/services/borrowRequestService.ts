
import { supabase } from "@/integrations/supabase/client";

// Interface for borrow request data
interface BorrowRequestData {
  item_id: string;
  owner_id: string;
  message: string;
}

// Create a new borrow request
export const createBorrowRequest = async (requestData: BorrowRequestData, userId: string) => {
  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  // Verify current auth session to ensure we're using the correct user ID
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Auth verification error:", authError);
    throw new Error(`Authentication verification failed: ${authError.message}`);
  }
  
  if (authData.user?.id !== userId) {
    console.warn("Auth mismatch detected - context user vs current auth user:", userId, "vs", authData.user?.id);
    // Continue with the verified auth user ID instead
    userId = authData.user?.id || userId;
  }

  console.log("Creating borrow request with verified userId:", userId);
  console.log("Request data:", requestData);

  // Use both borrower_id and requester_id to ensure compatibility with any RLS policy
  const { data, error } = await supabase
    .from("borrow_requests")
    .insert({
      ...requestData,
      borrower_id: userId,
      requester_id: userId, // Critical for RLS policy match
      status: "pending",
    })
    .select();

  if (error) {
    console.error("Error creating borrow request:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }

  console.log("Successfully created borrow request:", data);
  return data;
};

// Get borrow requests for a specific item
export const getBorrowRequests = async (itemId: string) => {
  const { data, error } = await supabase
    .from("borrow_requests")
    .select(`
      id, 
      item_id, 
      borrower_id, 
      profiles:borrower_id (username, full_name),
      owner_id,
      status,
      message,
      created_at
    `)
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching borrow requests:", error);
    throw error;
  }

  return data;
};

// Update a borrow request status
export const updateBorrowRequestStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected' | 'cancelled',
  userId: string
) => {
  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  console.log("Updating borrow request status:", { requestId, status, userId });

  const { data, error } = await supabase
    .from("borrow_requests")
    .update({ status })
    .eq("id", requestId)
    .select();

  if (error) {
    console.error("Error updating borrow request:", error);
    throw error;
  }

  console.log("Successfully updated borrow request status:", data);
  return data;
};
