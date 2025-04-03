
import React from "react";
import { 
  Wrench, 
  Utensils, 
  Laptop, 
  Dumbbell, 
  Book, 
  Gamepad2, 
  Scissors, 
  HelpCircle 
} from "lucide-react";

// Map categories to their respective Lucide icons
export const getCategoryIcon = (category: string, size: number = 24) => {
  const icons: Record<string, React.ReactNode> = {
    "tools": <Wrench size={size} />,
    "kitchen": <Utensils size={size} />,
    "electronics": <Laptop size={size} />,
    "sports": <Dumbbell size={size} />,
    "books": <Book size={size} />,
    "games": <Gamepad2 size={size} />,
    "diy-craft": <Scissors size={size} />,
    "other": <HelpCircle size={size} />
  };
  
  return icons[category] || icons["other"];
};

// Get background colors for category icons
export const getCategoryIconBackground = (category: string) => {
  const bgColors: Record<string, string> = {
    "tools": "bg-blue-100",
    "kitchen": "bg-pink-100",
    "electronics": "bg-purple-100",
    "sports": "bg-green-100",
    "books": "bg-blue-100",
    "games": "bg-purple-100",
    "diy-craft": "bg-pink-100",
    "other": "bg-yellow-100"
  };
  
  return bgColors[category] || bgColors["other"];
};

// Get text colors for category icons
export const getCategoryIconColor = (category: string) => {
  const textColors: Record<string, string> = {
    "tools": "text-blue-600",
    "kitchen": "text-pink-600",
    "electronics": "text-purple-600",
    "sports": "text-green-600",
    "books": "text-blue-600",
    "games": "text-purple-600",
    "diy-craft": "text-pink-600",
    "other": "text-yellow-600"
  };
  
  return textColors[category] || textColors["other"];
};
