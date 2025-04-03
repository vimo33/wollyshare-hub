
import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DialogHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
}

const DialogHeader = ({ title, description, onClose }: DialogHeaderProps) => {
  return (
    <UIDialogHeader className="flex items-center justify-between">
      <div>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full h-8 w-8 absolute right-4 top-4"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </UIDialogHeader>
  );
};

export default DialogHeader;
