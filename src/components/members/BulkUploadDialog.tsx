
import React from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ open, onOpenChange }) => {
  // Handle bulk upload (placeholder function - will be implemented)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    toast.info("CSV upload feature will be implemented soon");
    // Reset the file input
    event.target.value = '';
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Invitations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="csv-upload">Upload CSV/XLS File</Label>
            <p className="text-sm text-muted-foreground mb-2">
              File should have a column for email addresses.
            </p>
            <Input 
              id="csv-upload" 
              type="file" 
              accept=".csv,.xls,.xlsx" 
              onChange={handleFileUpload}
            />
          </div>
          <Button 
            className="w-full"
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            Select File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
