
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
      <p className="text-sm text-muted-foreground">{description}</p>
      {/* Close button removed as it's redundant with the Dialog's built-in close button */}
    </div>
  );
};

export default DialogHeader;
