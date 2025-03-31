import React, { useState, useEffect } from 'react';
import { LocationSelectProps } from './types';
import { Controller } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const LocationSelect: React.FC<LocationSelectProps> = ({ 
  value, 
  onChange, 
  className, 
  control, 
  defaultValue, 
  name 
}) => {
  const [locations, setLocations] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('id, name')
          .order('name');
          
        if (error) {
          console.error('Error fetching locations:', error);
        } else {
          setLocations(data || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching locations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  // If control is provided, use react-hook-form Controller with shadcn UI Select
  if (control) {
    return (
      <Controller
        control={control}
        name={name || "location"}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  }

  // Otherwise use standard controlled select
  return (
    <Select
      disabled={isLoading}
      onValueChange={onChange}
      defaultValue={value || ""}
      value={value || ""}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocationSelect;
