
import { ItemFormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";
import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes user input values
 */
const sanitizeValues = (values: ItemFormValues): ItemFormValues => {
  return {
    ...values,
    name: sanitizeHtml(values.name, { allowedTags: [] }),
    description: values.description 
      ? sanitizeHtml(values.description, {
          allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
          allowedAttributes: {
            'a': ['href']
          }
        }) 
      : undefined,
    location: values.location 
      ? sanitizeHtml(values.location, { allowedTags: [] }) 
      : undefined,
    condition: values.condition 
      ? sanitizeHtml(values.condition, { allowedTags: [] }) 
      : undefined
  };
};

/**
 * Creates a new item in the database
 */
export const submitItemForm = async (
  values: ItemFormValues, 
  userId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Sanitize user inputs
    const sanitizedValues = sanitizeValues(values);

    const { error } = await supabase.from("items").insert({
      name: sanitizedValues.name,
      category: sanitizedValues.category,
      description: sanitizedValues.description,
      weekday_availability: sanitizedValues.weekdayAvailability,
      weekend_availability: sanitizedValues.weekendAvailability,
      location: sanitizedValues.location,
      condition: sanitizedValues.condition,
      user_id: userId
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error submitting item form:", error);
    return { success: false, error };
  }
};

/**
 * Updates an existing item in the database
 */
export const updateItemForm = async (
  itemId: string, 
  values: ItemFormValues, 
  userId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Sanitize user inputs
    const sanitizedValues = sanitizeValues(values);

    const { error } = await supabase
      .from("items")
      .update({
        name: sanitizedValues.name,
        category: sanitizedValues.category,
        description: sanitizedValues.description,
        weekday_availability: sanitizedValues.weekdayAvailability,
        weekend_availability: sanitizedValues.weekendAvailability,
        location: sanitizedValues.location,
        condition: sanitizedValues.condition
      })
      .eq("id", itemId)
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error };
  }
};
