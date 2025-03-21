
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads an image file to Supabase storage
 */
export const uploadImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    const bucketName = 'items';

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('File uploaded successfully, public URL:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error in upload process:', error);
    return null;
  }
};
