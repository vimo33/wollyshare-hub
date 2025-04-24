
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tools">Tools</SelectItem>
          <SelectItem value="kitchen">Kitchen</SelectItem>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="books">Books</SelectItem>
          <SelectItem value="games">Games</SelectItem>
          <SelectItem value="diy-craft">DIY & Craft</SelectItem>
          <SelectItem value="activities">Activities</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelect;
