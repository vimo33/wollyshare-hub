
import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ItemFormValues } from "./types";
import { handleItemSubmit } from "../../utils/form-submit-utils"; 
import DialogHeader from "./form/DialogHeader";
import ItemForm from "./form/ItemForm";

// Define form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Item name must be at least 3 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
  weekdayAvailability: z.string().min(1, { message: "Please select weekday availability" }),
  weekendAvailability: z.string().min(1, { message: "Please select weekend availability" }),
  location: z.string().optional(),
  condition: z.string().optional(), // Keep condition in schema but make it optional
  image_url: z.string().optional() // Add image_url to the schema
});

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemData?: ItemFormValues & { id?: string; imageUrl?: string };
  onSuccess?: () => void;
}

const ItemFormDialog = ({ open, onOpenChange, itemData, onSuccess }: ItemFormDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up form with default values
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "tools",
      description: "",
      weekdayAvailability: "anytime",
      weekendAvailability: "anytime",
      location: "",
      condition: "Good",
      image_url: "" // Initialize image_url in the form
    },
  });
  
  // Reset form when itemData changes or dialog opens
  useEffect(() => {
    if (open) {
      if (itemData) {
        form.reset({
          name: itemData.name || "",
          category: itemData.category || "tools",
          description: itemData.description || "",
          weekdayAvailability: itemData.weekdayAvailability || "anytime",
          weekendAvailability: itemData.weekendAvailability || "anytime",
          location: itemData.location || "",
          condition: itemData.condition || "Good",
          image_url: itemData.imageUrl || "" // Set the image URL from itemData
        });
      } else {
        form.reset({
          name: "",
          category: "tools",
          description: "",
          weekdayAvailability: "anytime",
          weekendAvailability: "anytime",
          location: "",
          condition: "Good",
          image_url: ""
        });
      }
    }
  }, [open, itemData, form]);

  const onSubmit = async (data: ItemFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Include the existing image URL if we're editing and no new image was uploaded
      if (itemData?.imageUrl && !imageFile) {
        data.image_url = itemData.imageUrl;
      }

      const result = await handleItemSubmit({
        data,
        userId: user.id,
        imageFile,
        itemId: itemData?.id,
        existingImageUrl: itemData?.imageUrl
      });

      if (result.success) {
        toast({
          title: itemData ? "Item Updated" : "Item Added",
          description: `${data.name} has been ${itemData ? "updated" : "added"} successfully.`,
        });
        
        // Reset form and state
        onOpenChange(false);
        form.reset();
        setImageFile(null);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "There was a problem saving your item. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
    setImageFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        setImageFile(null);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader 
          title={itemData?.id ? "Edit Item" : "Add New Item"}
          description="Enter the details about the item you want to share with your community."
          onClose={() => onOpenChange(false)}
        />

        <ItemForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          initialImageUrl={itemData?.imageUrl || null}
          onImageChange={setImageFile}
          isEditing={!!itemData?.id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
