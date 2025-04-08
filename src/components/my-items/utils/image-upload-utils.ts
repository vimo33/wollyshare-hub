
/**
 * Compresses an image file to a smaller size
 * 
 * @param file - The file to compress
 * @param maxWidthOrHeight - The maximum width or height in pixels
 * @param quality - The quality of the compressed image (0-1)
 * @returns A promise that resolves to a compressed File object
 */
export const compressImage = (
  file: File,
  maxWidthOrHeight = 1000,
  quality = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Create image object to load the file
    const img = new Image();
    
    // Handle image load error
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Set up image onload handler outside of nested functions
    img.onload = () => {
      try {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        // If image is larger than max size, scale it down
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round(height * maxWidthOrHeight / width);
            width = maxWidthOrHeight;
          } else {
            width = Math.round(width * maxWidthOrHeight / height);
            height = maxWidthOrHeight;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with specified quality
        return createCompressedFile(canvas, file, quality, resolve, reject);
      } catch (error) {
        // Return a proper Error object
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error('Unknown error during image compression'));
        }
      }
    };
    
    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Creates a compressed file from canvas
 * Extracted to reduce nesting depth
 */
function createCompressedFile(
  canvas: HTMLCanvasElement,
  file: File,
  quality: number,
  resolve: (file: File) => void,
  reject: (error: Error) => void
): void {
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }
      
      // Convert blob to file
      const compressedFile = new File([blob], file.name, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      resolve(compressedFile);
    },
    'image/jpeg',
    quality
  );
}
