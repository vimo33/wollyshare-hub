
/**
 * Represents an item that can be shared within the community
 */
export interface Item {
  id: string;
  name: string;
  description: string | null;
  category: "tools" | "kitchen" | "electronics" | "sports" | "other";
  image_url: string | null;
  user_id: string;
  weekday_availability: string;
  weekend_availability: string;
  ownerName?: string;
  location?: string;
  locationAddress?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Represents a user profile associated with items
 */
export interface ItemOwner {
  id: string;
  name: string;
  location: string | null;
}

/**
 * Represents item filtering options
 */
export interface ItemFilterOptions {
  searchQuery?: string;
  category?: string | null;
  userId?: string;
}

/**
 * Represents parameters for item pagination
 */
export interface ItemPaginationParams {
  page: number;
  itemsPerPage: number;
}
