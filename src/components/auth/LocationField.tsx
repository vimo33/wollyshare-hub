
import React from "react";
import { Control } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import LocationSelect from "./LocationSelect";
import { SignupFormValues } from "./signupSchema";

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationFieldProps {
  control: Control<SignupFormValues>;
  locations: Location[];
}

const LocationField: React.FC<LocationFieldProps> = ({ control, locations }) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <LocationSelect 
              onChange={field.onChange}
              value={field.value}
              control={control}
              defaultValue={field.value}
              locations={locations}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
