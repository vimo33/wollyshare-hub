
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Upload, X, AlertCircle } from "lucide-react";

interface ImageUploadComponentProps {
  initialImageUrl?: string | null;
  onImageChange: (file: File | null) => void;
  label?: string;
}

const ImageUploadComponent = ({ 
  initialImageUrl, 
  onImageChange, 
  label = "Item Image (Optional)" 
}: ImageUploadComponentProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [oversized, setOversized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update preview if initialImageUrl changes (useful for form resets)
  useEffect(() => {
    setImagePreview(initialImageUrl || null);
  }, [initialImageUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PNG, JPG, or WEBP image");
        return;
      }

      // Check file size - just for user feedback (will still be compressed)
      const sizeInKB = file.size / 1024;
      setFileSize(sizeInKB);
      setOversized(sizeInKB > 5000); // 5MB warning
      setError(null);
      
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFileSize(null);
    setOversized(false);
    setError(null);
    onImageChange(null);
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      
      {imagePreview ? (
        <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={imagePreview} 
            alt="Item preview" 
            className="w-full h-full object-contain" 
          />
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {fileSize && (
            <div className={`absolute bottom-0 left-0 right-0 px-3 py-1 text-xs ${
              oversized ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
            }`}>
              {oversized ? (
                <div className="flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>
                    {fileSize.toFixed(1)}KB - Will be compressed before upload
                  </span>
                </div>
              ) : (
                <span>{fileSize.toFixed(1)}KB</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label 
            htmlFor="image-upload" 
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB, will be optimized to ~100KB)</p>
            </div>
            <input 
              id="image-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-500 flex items-center mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
