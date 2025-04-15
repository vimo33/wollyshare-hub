
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface PendingApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PendingApprovalModal: React.FC<PendingApprovalModalProps> = ({ isOpen, onClose }) => {
  // Telegram usernames from requirements
  const adminTelegramUsernames = ["vimo33", "walterweltbrand"];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to WollyShare!</DialogTitle>
          <DialogDescription className="text-center">
            Your account needs approval before you can access member features
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              To complete your registration, please contact one of our admins on Telegram:
            </p>
            <div className="mt-3 space-y-2">
              {adminTelegramUsernames.map((username) => (
                <a
                  key={username}
                  href={`https://t.me/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-white rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">@{username}</span>
                </a>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Once approved, you'll have full access to browse and share items with the community.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingApprovalModal;
