
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { handleItemSubmit } from "@/utils/form-submit-utils";
import { useProfileData } from "@/hooks/useProfileData";

// Import our components
import ImageUploadComponent from "./form/ImageUploadComponent";
import CategorySelect from "./form/CategorySelect";
import AvailabilitySelect from "./form/AvailabilitySelect";
import ConditionSelect from "./form/ConditionSelect";
import FormSection from "./form/FormSection";
import FormActions from "./form/FormActions";

interface ItemFormProps {
  onClose: () => void;
  onItemAdded: () => void; // New prop to trigger refetch in parent
}

const ItemForm = ({ onClose, onItemAdded }: ItemFormProps) => {
  const { user } = useAuth();
  const { profile } = useProfileData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "tools",
    description: "",
    weekday_availability: "anytime",
    weekend_availability: "anytime",
    location: profile?.location || "",
    condition: "Good",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
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
      
      const result = await handleItemSubmit({
        data: {
          name: formData.name,
          category: formData.category,
          description: formData.description,
          weekdayAvailability: formData.weekday_availability,
          weekendAvailability: formData.weekend_availability,
          location: formData.location || profile?.location || null,
          condition: formData.condition,
        },
        userId: user.id,
        imageFile,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to add item");
      }

      console.log("Item added successfully:", result);

      toast({
        title: "Item added successfully!",
      });
      
      onItemAdded(); // Call the callback to refresh the parent's item list
      onClose();
    } catch (error: any) {
      console.error("Error adding item:", error);
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
      <ImageUploadComponent onImageChange={handleImageChange} />

      <FormSection>
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter the name of your item"
          required
        />
      </FormSection>

      <CategorySelect 
        value={formData.category} 
        onChange={(value) => handleSelectChange("category", value)} 
      />

      <FormSection>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your item"
        />
      </FormSection>

      <FormSection>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Where is this item located?"
        />
        {!formData.location && profile?.location && (
          <p className="text-xs text-muted-foreground">
            Default: {profile.location}
          </p>
        )}
      </FormSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AvailabilitySelect
          type="weekday"
          value={formData.weekday_availability}
          onChange={(value) => handleSelectChange("weekday_availability", value)}
        />

        <AvailabilitySelect
          type="weekend"
          value={formData.weekend_availability}
          onChange={(value) => handleSelectChange("weekend_availability", value)}
        />
      </div>

      <ConditionSelect
        value={formData.condition}
        onChange={(value) => handleSelectChange("condition", value)}
      />

      <FormActions onCancel={onClose} isSubmitting={isSubmitting} />
    </form>
  );
};

export default ItemForm;
