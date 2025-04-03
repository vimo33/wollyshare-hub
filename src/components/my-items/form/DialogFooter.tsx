
import { DialogFooter as UIDialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogFooterProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

const DialogFooter = ({ onCancel, isSubmitting, isEditing }: DialogFooterProps) => {
  return (
    <UIDialogFooter>
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isEditing ? (
          "Update Item"
        ) : (
          "Add Item"
        )}
      </Button>
    </UIDialogFooter>
  );
};

export default DialogFooter;
