
import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ItemFormValues } from "./types";
import { handleItemSubmit } from "../../utils/form-submit-utils"; 

// Import our form components
import CategorySelect from "./form/CategorySelect";
import AvailabilitySelect from "./form/AvailabilitySelect";
import ConditionSelect from "./form/ConditionSelect";
import FormSection from "./form/FormSection";
import FormActions from "./form/FormActions";
import ImageUploadField from "./form/ImageUploadField";

// Define form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Item name must be at least 3 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
  weekdayAvailability: z.string().min(1, { message: "Please select weekday availability" }),
  weekendAvailability: z.string().min(1, { message: "Please select weekend availability" }),
  location: z.string().optional(),
  condition: z.string().optional(),
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
    defaultValues: itemData || {
      name: "",
      category: "",
      description: "",
      weekdayAvailability: "",
      weekendAvailability: "",
      location: "",
      condition: ""
    },
  });
  
  // Reset form when itemData changes
  useEffect(() => {
    if (open && itemData) {
      form.reset(itemData);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <div>
            <DialogTitle>{itemData ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              Enter the details about the item you want to share with your community.
            </DialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-8 w-8 absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUploadField 
              initialImageUrl={itemData?.imageUrl || null}
              onImageChange={setImageFile}
            />

            <FormSection>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Item Name</label>
                <input
                  id="name"
                  className="w-full p-2 border rounded-md"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>
                )}
              </div>
            </FormSection>

            <CategorySelect
              value={form.watch("category")}
              onChange={(value) => form.setValue("category", value)}
            />

            <FormSection>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  {...form.register("description")}
                />
              </div>
            </FormSection>

            <FormSection>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <input
                  id="location"
                  className="w-full p-2 border rounded-md"
                  {...form.register("location")}
                  placeholder="Where is this item located?"
                />
              </div>
            </FormSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AvailabilitySelect
                type="weekday"
                value={form.watch("weekdayAvailability")}
                onChange={(value) => form.setValue("weekdayAvailability", value)}
              />

              <AvailabilitySelect
                type="weekend"
                value={form.watch("weekendAvailability")}
                onChange={(value) => form.setValue("weekendAvailability", value)}
              />
            </div>

            <ConditionSelect
              value={form.watch("condition")}
              onChange={(value) => form.setValue("condition", value)}
            />

            <DialogFooter>
              <FormActions 
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
