export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  location?: string;
  location_address?: string;
  is_member: boolean;
  created_at: string;
  updated_at: string;
  telegram_id?: string; // Add telegram_id property
}

export interface AdminProfile {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface Item {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    image_urls: string[];
    user_id: string;
    category: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
}

export interface BorrowRequest {
    id: string;
    created_at: string;
    item_id: string;
    requester_id: string;
    owner_id: string;
    start_date: string;
    end_date: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected' | 'returned';
}

export interface IncomingRequest {
    id: string;
    created_at: string;
    item_id: string;
    requester_id: string;
    owner_id: string;
    start_date: string;
    end_date: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected' | 'returned';
    item_name: string;
    requester_username: string;
    requester_full_name: string;
}
