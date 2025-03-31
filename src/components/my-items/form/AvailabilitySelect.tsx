
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AvailabilitySelectProps {
  type: "weekday" | "weekend";
  value: string;
  onChange: (value: string) => void;
}

const AvailabilitySelect: React.FC<AvailabilitySelectProps> = ({ 
  type, 
  value, 
  onChange 
}) => {
  const label = type === "weekday" ? "Weekday Availability" : "Weekend Availability";
  const id = type === "weekday" ? "weekday_availability" : "weekend_availability";
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
          <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
          <SelectItem value="evening">Evening (5PM-9PM)</SelectItem>
          <SelectItem value="anytime">Anytime</SelectItem>
          <SelectItem value="unavailable">Unavailable</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AvailabilitySelect;
