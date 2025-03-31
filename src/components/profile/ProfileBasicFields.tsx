
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileBasicFieldsProps {
  control: Control<any>;
  userEmail: string;
}

const ProfileBasicFields: React.FC<ProfileBasicFieldsProps> = ({ control, userEmail }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={userEmail || ""} disabled className="bg-muted" />
        <p className="text-sm text-muted-foreground">
          Your email address is used for login and cannot be changed.
        </p>
      </div>

      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Enter your username" {...field} />
            </FormControl>
            <FormDescription>
              This is your public display name that others will see.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormDescription>
              Your full name will be used for communication.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfileBasicFields;
