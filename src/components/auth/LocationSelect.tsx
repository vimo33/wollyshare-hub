
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
  control?: Control<any>;
  isRequired?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const LocationSelect = ({ control, isRequired = false, defaultValue, value, onChange }: LocationSelectProps) => {
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

  // If control is provided, use the FormField wrapper
  if (control) {
    return (
      <FormField
        control={control}
        name="location"
        render={({ field }) => {
          // Make sure we use defaultValue if field.value is empty
          const currentValue = field.value || defaultValue || '';
          
          return (
            <FormItem>
              <FormLabel>Your Location{isRequired && "*"}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={currentValue} 
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
  }

  // If no control is provided, use the direct component
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your Location{isRequired && "*"}</label>
      <Select 
        onValueChange={onChange} 
        value={value || defaultValue || ''} 
        disabled={isLoadingLocations || locations.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your location" />
        </SelectTrigger>
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
    </div>
  );
};

export default LocationSelect;
