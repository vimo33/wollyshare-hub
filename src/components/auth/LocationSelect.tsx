
import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationSelectProps {
  onChange: (value: string) => void;
  value: string;
  control: Control<any>;
  defaultValue?: string;
  locations?: Location[];
}

const LocationSelect = ({
  onChange,
  value,
  defaultValue,
  locations: propLocations,
}: LocationSelectProps) => {
  const [locations, setLocations] = useState<Location[]>(propLocations || []);
  const [loading, setLoading] = useState(!propLocations);

  useEffect(() => {
    if (propLocations) {
      setLocations(propLocations);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("community_locations")
          .select("id, name, address")
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching locations:", error);
          return;
        }

        setLocations(data || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [propLocations]);

  return (
    <Select onValueChange={onChange} defaultValue={defaultValue} value={value}>
      <SelectTrigger
        className={!locations.length && loading ? "animate-pulse" : ""}
      >
        <SelectValue placeholder="Select your community location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((loc) => (
          <SelectItem key={loc.id} value={loc.id}>
            {loc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocationSelect;
