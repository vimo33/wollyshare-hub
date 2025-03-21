
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertCircle } from "lucide-react";

interface ImageUploadFieldProps {
  initialImageUrl: string | null;
  onImageChange: (file: File | null) => void;
}

const ImageUploadField = ({ initialImageUrl, onImageChange }: ImageUploadFieldProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [oversized, setOversized] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size - just for user feedback (will still be compressed)
      const sizeInKB = file.size / 1024;
      setFileSize(sizeInKB);
      setOversized(sizeInKB > 100);
      
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
    onImageChange(null);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Item Image (Optional)</FormLabel>
      
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
    </div>
  );
};

export default ImageUploadField;
