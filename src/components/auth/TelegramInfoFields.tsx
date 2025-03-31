
import React from "react";
import { Control } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { SignupFormValues } from "./signupSchema";

interface TelegramInfoFieldsProps {
  control: Control<SignupFormValues>;
}

const TelegramInfoFields: React.FC<TelegramInfoFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="telegramId"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Telegram ID</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Telegram ID Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You can get your Telegram ID by messaging @get_id_bot on Telegram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input placeholder="123456789" {...field} />
            </FormControl>
            <FormDescription className="text-xs text-muted-foreground">
              To get your Telegram ID, open Telegram and message @get_id_bot. The bot will reply with your numeric ID.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="telegramUsername"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Telegram Username</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Telegram Username Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set a username in Telegram under Settings → Username</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input placeholder="johndoe" {...field} />
            </FormControl>
            <FormDescription className="text-xs text-muted-foreground">
              To set a Telegram username, open Telegram, go to Settings → Username, and create a username without the @ symbol.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TelegramInfoFields;
