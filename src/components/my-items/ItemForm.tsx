
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
import { Loader2 } from "lucide-react";

interface ItemFormProps {
  onClose: () => void;
}

const ItemForm = ({ onClose }: ItemFormProps) => {
  const { user } = useAuth();
  const { refetchItems } = useMyItems();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
          condition: "Good", // Default value
          location: "Home" // Default value
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
