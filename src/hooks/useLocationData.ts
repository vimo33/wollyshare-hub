
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type LocationInfo = {
  name: string;
  address: string;
};

export const useLocationData = () => {
  const [locationData, setLocationData] = useState<Map<string, LocationInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('community_locations')
        .select('id, name, address');
      
      if (error) {
        console.error('Error fetching location data:', error);
        return;
      }

      const locationMap = new Map();
      data.forEach(location => {
        locationMap.set(location.id, {
          name: location.name,
          address: location.address
        });
      });
      
      setLocationData(locationMap);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchLocationData:', error);
      setIsLoading(false);
    }
  };

  return { locationData, isLoading };
};
