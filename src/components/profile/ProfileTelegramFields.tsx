
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProfileTelegramFieldsProps {
  control: Control<any>;
}

const ProfileTelegramFields: React.FC<ProfileTelegramFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="telegram_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telegram ID</FormLabel>
            <FormControl>
              <Input placeholder="123456789" {...field} />
            </FormControl>
            <FormDescription>
              Your Telegram ID is used for notifications.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="telegram_username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telegram Username</FormLabel>
            <FormControl>
              <Input placeholder="your_telegram_username" {...field} />
            </FormControl>
            <FormDescription>
              Your Telegram username is used for borrow request notifications.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfileTelegramFields;
