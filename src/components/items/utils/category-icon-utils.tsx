
import React from "react";
import { 
  Wrench, 
  Utensils, 
  Laptop, 
  Dumbbell, 
  Book, 
  Gamepad2, 
  Scissors, 
  HelpCircle,
  Shirt,
  Music,
  Car,
  Bike
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
    "clothing": <Shirt size={size} />,
    "music": <Music size={size} />,
    "vehicles": <Car size={size} />,
    "bicycles": <Bike size={size} />,
    "other": <HelpCircle size={size} />
  };
  
  return icons[category] || icons["other"];
};

// Get background colors for category icons
export const getCategoryIconBackground = (category: string) => {
  const bgColors: Record<string, string> = {
    "tools": "bg-blue-50",
    "kitchen": "bg-pink-50",
    "electronics": "bg-purple-50",
    "sports": "bg-green-50",
    "books": "bg-blue-50",
    "games": "bg-purple-50",
    "diy-craft": "bg-pink-50",
    "clothing": "bg-amber-50",
    "music": "bg-indigo-50",
    "vehicles": "bg-red-50",
    "bicycles": "bg-emerald-50",
    "other": "bg-yellow-50"
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
    "clothing": "text-amber-600",
    "music": "text-indigo-600",
    "vehicles": "text-red-600",
    "bicycles": "text-emerald-600",
    "other": "text-yellow-600"
  };
  
  return textColors[category] || textColors["other"];
};
