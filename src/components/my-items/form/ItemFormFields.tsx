
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ItemFormValues } from "../types";
import ImageUploadField from "./ImageUploadField";

interface ItemFormFieldsProps {
  form: UseFormReturn<ItemFormValues>;
  initialImageUrl: string | null;
  onImageChange: (file: File | null) => void;
}

const ItemFormFields = ({ form, initialImageUrl, onImageChange }: ItemFormFieldsProps) => {
  return (
    <>
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
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="games">Games</SelectItem>
                <SelectItem value="diy-craft">DIY & Craft Supplies</SelectItem>
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

      <ImageUploadField 
        initialImageUrl={initialImageUrl} 
        onImageChange={onImageChange} 
      />

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
    </>
  );
};

export default ItemFormFields;
