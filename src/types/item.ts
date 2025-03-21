
// Define the Item type
export type Item = {
  id: string;
  name: string;
  category: string;
  user_id: string;
  image_url: string | null;
  description: string | null;
  weekday_availability: string;
  weekend_availability: string;
  ownerName?: string; // Will be populated after fetching
  location?: string; // We'll derive this from the description
  availableFor?: string; // This property is needed for compatibility
};
