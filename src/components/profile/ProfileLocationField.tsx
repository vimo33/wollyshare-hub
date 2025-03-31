
import React, { useState, useEffect } from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
  address: string;
}

interface ProfileLocationFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
}

const ProfileLocationField: React.FC<ProfileLocationFieldProps> = ({ 
  control, 
  name, 
  label, 
  description 
}) => {
  const [locations, setLocations] = useState<Location[]>([]);

  // Fetch locations from community_locations table
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('id, name, address')
          .order('name', { ascending: true });
          
        if (error) {
          console.error("Error fetching locations:", error);
          return;
        }
        
        setLocations(data || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    
    fetchLocations();
  }, []);

  // Find the current location's name and address
  const getLocationWithAddress = (locationId: string): string => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return "Location not specified";
    return `${location.name}, ${location.address}`;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your community location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {`${loc.name}, ${loc.address}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {field.value && (
            <FormDescription>
              Location: {getLocationWithAddress(field.value)}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProfileLocationField;
