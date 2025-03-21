
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
}
