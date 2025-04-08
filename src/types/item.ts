
import { Database } from "@/integrations/supabase/types";

/**
 * Base item type from database schema
 */
export type BaseItem = Database['public']['Tables']['items']['Row'];

/**
 * Valid item categories
 */
export type ItemCategory = 
  | "tools" 
  | "kitchen" 
  | "electronics" 
  | "sports" 
  | "books" 
  | "games" 
  | "diy-craft" 
  | "clothing" 
  | "music" 
  | "vehicles" 
  | "bicycles" 
  | "activities" 
  | "other";

/**
 * Extended Item type with additional UI properties
 */
export interface Item extends BaseItem {
  ownerName?: string;
  locationAddress?: string;
}

/**
 * Represents an item owner
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
