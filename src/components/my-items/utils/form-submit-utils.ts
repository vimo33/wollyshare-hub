
import { supabase } from "@/integrations/supabase/client";
import { ItemFormValues } from "../types";
import { uploadImage } from "./image-upload-utils";

export async function handleItemSubmit({
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
  existingImageUrl?: string | null;
}) {
  try {
    let imageUrl = existingImageUrl || null;

    // If there's a new image file, upload it
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile, userId);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return { 
          success: false, 
          message: "Error uploading image. Item was not saved.",
          error: uploadError 
        };
      }
    }

    if (itemId) {
      // Update existing item
      const { error } = await supabase
        .from('items')
        .update({
          name: data.name,
          category: data.category,
          description: data.description || null,
          image_url: imageUrl,
          weekday_availability: data.weekdayAvailability,
          weekend_availability: data.weekendAvailability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (error) {
        console.error("Error updating item in database:", error);
        return { success: false, message: "Error updating item", error };
      }
      
      return { success: true, message: "Item updated successfully" };
    } else {
      // Insert new item
      const { error, data: insertedData } = await supabase
        .from('items')
        .insert({
          user_id: userId,
          name: data.name,
          category: data.category,
          description: data.description || null,
          image_url: imageUrl,
          weekday_availability: data.weekdayAvailability,
          weekend_availability: data.weekendAvailability,
        })
        .select();

      if (error) {
        console.error("Error inserting item in database:", error);
        return { success: false, message: "Error saving item", error };
      }
      
      return { 
        success: true, 
        message: "Item added successfully",
        data: insertedData?.[0] || null
      };
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred while saving the item", 
      error 
    };
  }
}
