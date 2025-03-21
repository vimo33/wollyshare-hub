
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Compresses and resizes an image to optimize file size
 */
const compressImage = async (file: File, maxSizeKB: number = 100): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Create a canvas element to resize the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Create an image element to load the file
    const img = new Image();
    img.onload = () => {
      // Start with original dimensions
      let width = img.width;
      let height = img.height;
      
      // Set initial quality
      let quality = 0.8;
      
      // Maximum dimensions for resizing
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      
      // Resize if larger than max dimensions
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Function to compress with specific quality
      const compressWithQuality = (q: number) => {
        return new Promise<Blob>((resolveBlob) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolveBlob(blob);
              else reject(new Error('Failed to create blob'));
            },
            'image/jpeg',
            q
          );
        });
      };
      
      // Start compression process
      (async () => {
        try {
          // First attempt with initial quality
          let blob = await compressWithQuality(quality);
          
          // If still too large, gradually reduce quality
          while (blob.size > maxSizeKB * 1024 && quality > 0.1) {
            quality -= 0.1;
            blob = await compressWithQuality(quality);
          }
          
          console.log(`Compressed image: ${(blob.size / 1024).toFixed(2)}KB, Quality: ${(quality * 100).toFixed(0)}%`);
          
          // Convert blob to file
          const compressedFile = new File([blob], file.name, { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          resolve(compressedFile);
        } catch (error) {
          reject(error);
        }
      })();
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Uploads an image file to Supabase storage
 */
export const uploadImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    const bucketName = 'items';
    
    // Compress the image before uploading
    console.log(`Original image size: ${(file.size / 1024).toFixed(2)}KB`);
    const compressedFile = await compressImage(file);
    console.log(`Compressed image ready for upload: ${(compressedFile.size / 1024).toFixed(2)}KB`);

    // Create a unique filename
    const fileExt = "jpg"; // Always save as jpg after compression
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload the compressed file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, compressedFile);

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
