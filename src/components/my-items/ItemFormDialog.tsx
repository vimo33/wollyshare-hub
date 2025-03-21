
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
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Image, X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

// Define form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Item name must be at least 3 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
  weekdayAvailability: z.string().min(1, { message: "Please select weekday availability" }),
  weekendAvailability: z.string().min(1, { message: "Please select weekend availability" }),
});

type ItemFormValues = z.infer<typeof formSchema>;

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemData?: ItemFormValues & { id?: string; imageUrl?: string };
  onSuccess?: () => void;
}

const ItemFormDialog = ({ open, onOpenChange, itemData, onSuccess }: ItemFormDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(itemData?.imageUrl || null);
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

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('items')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('items')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in upload process:', error);
      return null;
    }
  };

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
      let imageUrl = itemData?.imageUrl || null;

      // If there's a new image file, upload it
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (itemData?.id) {
        // Update existing item
        const { error } = await supabase
          .from('items')
          .update({
            name: data.name,
            category: data.category,
            description: data.description || null,
            image_url: imageUrl,
            weekday_availability: data.weekdayAvailability,
            weekend_availability: data.weekendAvailability,
            updated_at: new Date().toISOString(),
          })
          .eq('id', itemData.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('items')
          .insert({
            user_id: user.id,
            name: data.name,
            category: data.category,
            description: data.description || null,
            image_url: imageUrl,
            weekday_availability: data.weekdayAvailability,
            weekend_availability: data.weekendAvailability,
          });

        if (error) throw error;
      }

      toast({
        title: itemData ? "Item Updated" : "Item Added",
        description: `${data.name} has been ${itemData ? "updated" : "added"} successfully.`,
      });
      
      // Reset form and state
      onOpenChange(false);
      form.reset();
      setImagePreview(null);
      setImageFile(null);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    setImagePreview(null);
    setImageFile(null);
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ladder, Blender, Drill" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add details like condition, model, special instructions" 
                      {...field} 
                      className="h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weekdayAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekday Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM-9PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weekendAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekend Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM-9PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
