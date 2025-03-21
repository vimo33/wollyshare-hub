
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Checks if a bucket exists, and if not, attempts to create it
 */
async function ensureBucketExists(bucketName: string): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
    
    // If bucket doesn't exist, try to create it
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make bucket public so files can be accessed without authentication
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      console.log(`Storage bucket '${bucketName}' created successfully`);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking/creating bucket:', error);
    return false;
  }
}

/**
 * Uploads an image file to Supabase storage
 */
export const uploadImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    const bucketName = 'items';
    
    // Ensure the bucket exists
    const bucketReady = await ensureBucketExists(bucketName);
    if (!bucketReady) {
      throw new Error('Could not ensure bucket exists');
    }

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

    return data.publicUrl;
  } catch (error) {
    console.error('Error in upload process:', error);
    return null;
  }
};
