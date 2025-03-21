
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationSelectProps {
  control: Control<any>;
  isRequired?: boolean;
  defaultValue?: string;
}

const LocationSelect = ({ control, isRequired = false, defaultValue }: LocationSelectProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('id, name, address');

        if (error) {
          console.error('Error fetching locations:', error);
          // Fall back to mock data if there's an error
          setLocations([
            { id: '1', name: 'Main Building', address: '123 Community Ave, City' },
            { id: '2', name: 'East Wing', address: '125 Community Ave, City' },
          ]);
        } else if (data && data.length > 0) {
          setLocations(data as Location[]);
        } else {
          // Fall back to mock data if no locations are found
          setLocations([
            { id: '1', name: 'Main Building', address: '123 Community Ave, City' },
            { id: '2', name: 'East Wing', address: '125 Community Ave, City' },
          ]);
        }
      } catch (err) {
        console.error('Error in fetchLocations:', err);
        // Fall back to mock data if there's an error
        setLocations([
          { id: '1', name: 'Main Building', address: '123 Community Ave, City' },
          { id: '2', name: 'East Wing', address: '125 Community Ave, City' },
        ]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (defaultValue) {
      console.log("LocationSelect initialized with defaultValue:", defaultValue);
    }
  }, [defaultValue]);

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => {
        // Make sure we use defaultValue if field.value is empty
        const value = field.value || defaultValue || '';
        
        console.log("LocationSelect rendering with field value:", field.value);
        console.log("LocationSelect rendering with defaultValue:", defaultValue);
        console.log("LocationSelect using value:", value);
        
        return (
          <FormItem>
            <FormLabel>Your Location{isRequired && "*"}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={value} 
              disabled={isLoadingLocations || locations.length === 0}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name} - {location.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {locations.length === 0 && !isLoadingLocations && (
              <p className="text-sm text-muted-foreground">No locations available. Please contact an administrator.</p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default LocationSelect;
