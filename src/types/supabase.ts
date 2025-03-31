
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
  location: string; // Required field
  telegram_id: string; // Required field 
  telegram_username: string; // Required field
  created_at: string;
  updated_at: string;
  email?: string;
  is_member?: boolean;
}

// Admin profile type
export interface AdminProfile {
  id: string;
  username: string;
  full_name: string;
  created_at?: string;
}

// Item type
export interface Item {
  id: string;
  name: string;
  category: 'tools' | 'kitchen' | 'electronics' | 'sports' | 'other';
  description: string | null;
  image_url: string | null;
  weekday_availability: string;
  weekend_availability: string;
  user_id: string;
  location?: string; 
  condition?: string;
  locationAddress?: string;
  ownerName?: string;
  created_at?: string;
  updated_at?: string;
}

// Define Invitation type
export interface Invitation {
  id: string;
  email: string;
  token: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
}

// Define BorrowRequestWithDetails type for the request history
export interface BorrowRequestWithDetails {
  id: string;
  item_id: string;
  item_name: string;
  owner_id: string;
  borrower_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  owner_name: string;
  borrower_name?: string;
  message?: string;
}
