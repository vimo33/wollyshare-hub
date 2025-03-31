
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyItems } from "./useMyItems";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "./utils/image-upload-utils";

interface ItemFormProps {
  onClose: () => void;
}

const ItemForm = ({ onClose }: ItemFormProps) => {
  const { user } = useAuth();
  const { refetchItems } = useMyItems();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "tools",
    description: "",
    weekday_availability: "anytime",
    weekend_availability: "anytime",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add items",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your item",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload image if selected
      let image_url = null;
      if (imageFile && user) {
        image_url = await uploadImage(imageFile, user.id);
      }
      
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
          condition: "Good", // Default value
          location: "Home", // Default value
          image_url
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      toast({
        title: "Item added successfully!",
      });
      
      // Refresh the items list
      refetchItems();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Item Image (Optional)</Label>
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

      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter the name of your item"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          defaultValue={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tools">Tools</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your item"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weekday_availability">Weekday Availability</Label>
          <Select
            defaultValue={formData.weekday_availability}
            onValueChange={(value) => handleSelectChange("weekday_availability", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
              <SelectItem value="evening">Evening (5PM-9PM)</SelectItem>
              <SelectItem value="anytime">Anytime</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weekend_availability">Weekend Availability</Label>
          <Select
            defaultValue={formData.weekend_availability}
            onValueChange={(value) => handleSelectChange("weekend_availability", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
              <SelectItem value="evening">Evening (5PM-9PM)</SelectItem>
              <SelectItem value="anytime">Anytime</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Item
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
