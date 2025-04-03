
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ItemFormValues } from "../types";
import ItemFormFields from "./ItemFormFields";
import DialogFooter from "./DialogFooter";

interface ItemFormProps {
  form: UseFormReturn<ItemFormValues>;
  onSubmit: (data: ItemFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialImageUrl: string | null;
  onImageChange: (file: File | null) => void;
  isEditing: boolean;
}

const ItemForm = ({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
  initialImageUrl,
  onImageChange,
  isEditing
}: ItemFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ItemFormFields 
          form={form} 
          initialImageUrl={initialImageUrl} 
          onImageChange={onImageChange}
        />
        <DialogFooter 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
        />
      </form>
    </Form>
  );
};

export default ItemForm;
