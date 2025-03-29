// Define the IncomingRequest type
export interface IncomingRequest {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  requester_username: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message: string;
  created_at: string;
}

// Borrow request type for the history
export interface BorrowRequestHistory {
  id: string;
  item_id: string;
  item_name: string;
  owner_id: string;
  owner_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  message?: string;
}

// Profile type
export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  location?: string;
  telegram_id?: string;
  created_at: string;
  updated_at: string;
}
