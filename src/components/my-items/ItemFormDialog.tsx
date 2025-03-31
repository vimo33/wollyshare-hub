
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
import ItemFormFields from "./form/ItemFormFields";

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
