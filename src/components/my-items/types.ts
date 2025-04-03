
export interface ItemFormValues {
  name: string;
  category: string;
  description?: string;
  weekdayAvailability: string;
  weekendAvailability: string;
  location?: string;
  condition?: string;
  image_url?: string | null;
}
