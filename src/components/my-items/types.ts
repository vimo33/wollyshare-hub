
export type Item = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  weekday_availability: string;
  weekend_availability: string;
};

export type ItemFormData = {
  id?: string;
  name: string;
  category: string;
  description: string;
  weekdayAvailability: string;
  weekendAvailability: string;
  imageUrl?: string | null;
};

// Add the missing ItemFormValues type
export type ItemFormValues = {
  name: string;
  category: string;
  description: string;
  weekdayAvailability: string;
  weekendAvailability: string;
};
