import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ItemFormValues } from "./types";
import { submitItemForm, updateItemForm } from "../../utils/form-submit-utils"; // Using relative path
import ItemFormFields from "./form/ItemFormFields";

// Define form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Item name must be at least 3 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
  weekdayAvailability: z.string().min(1, { message: "Please select weekday availability" }),
  weekendAvailability: z.string().min(1, { message: "Please select weekend availability" }),
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
    },
  });

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
      let result;
      
      if (itemData?.id) {
        // Update existing item
        result = await updateItemForm(itemData.id, data, user.id);
      } else {
        // Create new item
        result = await submitItemForm(data, user.id);
      }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{itemData ? "Edit Item" : "Add New Item"}</DialogTitle>
          <DialogDescription>
            Enter the details about the item you want to share with your community.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ItemFormFields 
              form={form} 
              initialImageUrl={itemData?.imageUrl || null}
              onImageChange={setImageFile}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {itemData ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
