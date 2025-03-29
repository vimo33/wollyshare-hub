
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

  // Always fetch the current auth user directly from Supabase to ensure the most recent session
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Auth verification error:", authError);
    throw new Error(`Authentication verification failed: ${authError.message}`);
  }
  
  if (!authData.user) {
    console.error("No authenticated user found in current session");
    throw new Error("Authentication required. Please log in again.");
  }
  
  // Log the verification process
  console.log("Auth verification - provided userId:", userId);
  console.log("Auth verification - current session userId:", authData.user.id);
  
  // Always use the Supabase auth user ID to ensure RLS compatibility
  const currentUserId = authData.user.id;
  
  console.log("Creating borrow request with verified userId:", currentUserId);
  console.log("Request data:", requestData);

  // Create the payload with the correct schema fields, focusing on borrower_id which is used in RLS
  const payload = {
    item_id: requestData.item_id,
    owner_id: requestData.owner_id,
    message: requestData.message,
    borrower_id: currentUserId, // Required for NOT NULL constraint and RLS policy
    status: "pending",
  };

  console.log("Final payload for insert:", payload);

  const { data, error } = await supabase
    .from("borrow_requests")
    .insert(payload)
    .select();

  if (error) {
    console.error("Error creating borrow request:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    console.error("Request payload:", JSON.stringify(payload, null, 2));
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
