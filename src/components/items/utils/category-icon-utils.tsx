
import React, { useEffect, useState } from "react";
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
  Bike,
  // Adding icons for activities
  Ticket,
  MapPin,
  Calendar
} from "lucide-react";

// Create multiple icon options for each category
const categoryIconOptions: Record<string, React.ReactNode[]> = {
  "tools": [<Wrench />, <Wrench className="rotate-45" />, <Wrench className="rotate-90" />],
  "kitchen": [<Utensils />, <Utensils className="rotate-45" />, <Utensils className="scale-x-[-1]" />],
  "electronics": [<Laptop />, <Laptop className="rotate-12" />, <Laptop className="rotate-[-12]" />],
  "sports": [<Dumbbell />, <Dumbbell className="rotate-90" />, <Dumbbell className="scale-x-[-1]" />],
  "books": [<Book />, <Book className="rotate-12" />, <Book className="rotate-[-12]" />],
  "games": [<Gamepad2 />, <Gamepad2 className="rotate-12" />, <Gamepad2 className="rotate-[-12]" />],
  "diy-craft": [<Scissors />, <Scissors className="rotate-45" />, <Scissors className="rotate-[-45]" />],
  "clothing": [<Shirt />, <Shirt className="rotate-12" />, <Shirt className="rotate-[-12]" />],
  "music": [<Music />, <Music className="rotate-12" />, <Music className="rotate-[-12]" />],
  "vehicles": [<Car />, <Car className="rotate-12" />, <Car className="rotate-[-12]" />],
  "bicycles": [<Bike />, <Bike className="rotate-12" />, <Bike className="rotate-[-12]" />],
  "activities": [<Ticket />, <MapPin />, <Calendar />],
  "other": [<HelpCircle />, <HelpCircle className="rotate-45" />, <HelpCircle className="rotate-[-45]" />]
};

// Maintain a map of selected icon indices for each category instance
const iconSelectionMap = new Map<string, number>();

// Get a random icon index for a category if not already selected
const getIconIndex = (category: string, itemId: string = '') => {
  const key = `${category}_${itemId}`;
  if (!iconSelectionMap.has(key)) {
    iconSelectionMap.set(key, Math.floor(Math.random() * 3));
  }
  return iconSelectionMap.get(key) || 0;
};

// Map categories to their respective Lucide icons
export const getCategoryIcon = (category: string, size: number = 24, itemId: string = '') => {
  const options = categoryIconOptions[category] || categoryIconOptions["other"];
  const iconIndex = getIconIndex(category, itemId);
  
  // Clone the icon element and set the size
  const iconElement = options[iconIndex];
  return React.cloneElement(iconElement as React.ReactElement, { size });
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
    "activities": "bg-orange-50", // Added activities
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
    "activities": "text-orange-600", // Added activities
    "other": "text-yellow-600"
  };
  
  return textColors[category] || textColors["other"];
};

// Hook for rotating icons
export const useRotatingIcon = (category: string, itemId: string = '') => {
  const [iconIndex, setIconIndex] = useState(getIconIndex(category, itemId));
  
  useEffect(() => {
    const key = `${category}_${itemId}`;
    iconSelectionMap.set(key, iconIndex);
  }, [category, itemId, iconIndex]);
  
  const rotateIcon = () => {
    const options = categoryIconOptions[category] || categoryIconOptions["other"];
    const nextIndex = (iconIndex + 1) % options.length;
    setIconIndex(nextIndex);
  };
  
  return { iconIndex, rotateIcon };
};
