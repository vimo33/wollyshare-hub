
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ title, description, onClose }) => {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left relative pb-2 border-b mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground pr-8">{description}</p>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-8 w-8 p-0 rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
};

export default DialogHeader;
