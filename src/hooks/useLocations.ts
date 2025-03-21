
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LocationData {
  id: string;
  name: string;
  address: string;
}

export const useLocations = () => {
  const [locationData, setLocationData] = useState<Map<string, {name: string, address: string}>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('community_locations')
          .select('*');
          
        if (error) {
          throw new Error(`Error fetching locations: ${error.message}`);
        }
        
        const locMap = new Map();
        data?.forEach(location => {
          locMap.set(location.id, {
            name: location.name,
            address: location.address
          });
        });
        
        setLocationData(locMap);
      } catch (err) {
        console.error('Error in fetchLocations:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching locations'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locationData, isLoading, error };
};
