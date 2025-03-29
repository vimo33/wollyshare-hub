
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Interface for borrow request data
interface BorrowRequestData {
  item_id: string;
  owner_id: string;
  message: string;
  start_date: string;
  end_date: string;
}

// Create a new borrow request
export const createBorrowRequest = async (requestData: BorrowRequestData) => {
  const { user } = useAuth();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("borrow_requests")
    .insert({
      ...requestData,
      borrower_id: user.id,
      status: "pending",
    })
    .select();

  if (error) {
    console.error("Error creating borrow request:", error);
    throw error;
  }

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
      start_date,
      end_date,
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
  status: 'approved' | 'rejected' | 'cancelled'
) => {
  const { user } = useAuth();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("borrow_requests")
    .update({ status })
    .eq("id", requestId)
    .select();

  if (error) {
    console.error("Error updating borrow request:", error);
    throw error;
  }

  return data;
};
