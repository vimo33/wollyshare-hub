
import { ItemFormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";
import sanitizeHtml from "sanitize-html";

export const submitItemForm = async (values: ItemFormValues, userId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // Sanitize user inputs
    const sanitizedValues = {
      ...values,
      name: sanitizeHtml(values.name, { allowedTags: [] }),
      description: values.description ? sanitizeHtml(values.description, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        allowedAttributes: {
          'a': ['href']
        }
      }) : null,
      location: values.location ? sanitizeHtml(values.location, { allowedTags: [] }) : null,
      condition: values.condition ? sanitizeHtml(values.condition, { allowedTags: [] }) : null
    };

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

export const updateItemForm = async (itemId: string, values: ItemFormValues, userId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // Sanitize user inputs
    const sanitizedValues = {
      ...values,
      name: sanitizeHtml(values.name, { allowedTags: [] }),
      description: values.description ? sanitizeHtml(values.description, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        allowedAttributes: {
          'a': ['href']
        }
      }) : null,
      location: values.location ? sanitizeHtml(values.location, { allowedTags: [] }) : null,
      condition: values.condition ? sanitizeHtml(values.condition, { allowedTags: [] }) : null
    };

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
