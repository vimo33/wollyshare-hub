
export type Item = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  weekday_availability: string;
  weekend_availability: string;
  location?: string;
  condition?: string;
};

export type ItemFormData = {
  id?: string;
  name: string;
  category: string;
  description: string;
  weekdayAvailability: string;
  weekendAvailability: string;
  imageUrl?: string | null;
  location?: string;
  condition?: string;
};

// Export the ItemFormValues type properly
export type ItemFormValues = {
  name: string;
  category: string;
  description: string;
  weekdayAvailability: string;
  weekendAvailability: string;
  location?: string;
  condition?: string;
};
