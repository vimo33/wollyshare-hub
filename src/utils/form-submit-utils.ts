
import { ItemFormValues } from "@/components/my-items/types";
import { supabase } from "@/integrations/supabase/client";
import sanitizeHtml from "sanitize-html";

export const submitItemForm = async (values: ItemFormValues, userId: string): Promise<{ success: boolean; message?: string; error?: any; itemId?: string }> => {
  try {
    console.log("Submitting item form with values:", values);
    
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

    // Log the sanitized values to validate them before insert
    console.log("Sanitized values for submission:", sanitizedValues);

    const { data, error } = await supabase.from("items").insert({
      name: sanitizedValues.name,
      category: sanitizedValues.category,
      description: sanitizedValues.description,
      weekday_availability: sanitizedValues.weekdayAvailability,
      weekend_availability: sanitizedValues.weekendAvailability,
      location: sanitizedValues.location,
      condition: sanitizedValues.condition,
      user_id: userId
    }).select();

    if (error) {
      console.error("Supabase error when adding item:", error);
      throw error;
    }
    
    console.log("Item added successfully:", data);
    return { success: true, itemId: data?.[0]?.id };
  } catch (error: any) {
    console.error("Error submitting item form:", error);
    return { 
      success: false, 
      error, 
      message: error.message || "Failed to add item" 
    };
  }
};

export const updateItemForm = async (itemId: string, values: ItemFormValues, userId: string): Promise<{ success: boolean; message?: string; error?: any }> => {
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

    console.log("Updating item with values:", sanitizedValues);

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
  } catch (error: any) {
    console.error("Error updating item:", error);
    return { 
      success: false, 
      error, 
      message: error.message || "Failed to update item" 
    };
  }
};

export const handleItemSubmit = async ({
  data,
  userId,
  imageFile,
  itemId,
  existingImageUrl
}: {
  data: ItemFormValues;
  userId: string;
  imageFile: File | null;
  itemId?: string;
  existingImageUrl?: string;
}): Promise<{ success: boolean; message?: string; itemId?: string }> => {
  try {
    console.log("handleItemSubmit called with:", { data, userId, itemId });
    
    // Handle image upload first if needed
    let image_url = existingImageUrl;
    if (imageFile) {
      try {
        // Create a unique file path
        const filePath = `items/${userId}/${Date.now()}-${imageFile.name}`;
        
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('items')
          .getPublicUrl(filePath);
        
        image_url = publicUrlData.publicUrl;
        console.log("Image uploaded successfully:", image_url);
      } catch (error: any) {
        console.error("Error uploading image:", error);
        // Continue with item creation/update even if image upload fails
      }
    }
    
    // Now create or update the item with the image URL if available
    let result;
    if (itemId) {
      result = await updateItemForm(itemId, {
        ...data,
        ...(image_url && { image_url })
      }, userId);
    } else {
      result = await submitItemForm({
        ...data,
        ...(image_url && { image_url })
      }, userId);
    }

    if (!result.success) {
      throw new Error(result.message || "Failed to save item data");
    }

    return { 
      success: true, 
      itemId: itemId || result.itemId
    };
  } catch (error: any) {
    console.error("Error in handleItemSubmit:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred" 
    };
  }
};
