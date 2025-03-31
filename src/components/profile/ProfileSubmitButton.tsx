
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileSubmitButtonProps {
  isSubmitting: boolean;
}

const ProfileSubmitButton: React.FC<ProfileSubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </div>
  );
};

export default ProfileSubmitButton;
