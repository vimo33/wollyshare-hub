
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          After signing up, please start the{" "}
          <a 
            href="https://t.me/WollyShareBot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#1EAEDB] hover:underline font-medium"
            style={{ color: "#1EAEDB" }}
          >
            WollyShare Bot
          </a>{" "}
          in Telegram to receive notifications.
        </AlertDescription>
      </Alert>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Sign Up"
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
