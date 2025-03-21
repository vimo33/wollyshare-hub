
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadFieldProps {
  initialImageUrl: string | null;
  onImageChange: (file: File | null) => void;
}

const ImageUploadField = ({ initialImageUrl, onImageChange }: ImageUploadFieldProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
              <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB)</p>
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
