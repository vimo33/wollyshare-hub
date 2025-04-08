
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

type CategoryType = 
  | "tools" 
  | "kitchen" 
  | "electronics" 
  | "sports" 
  | "books" 
  | "games" 
  | "diy-craft" 
  | "clothing" 
  | "music" 
  | "vehicles" 
  | "bicycles" 
  | "activities" 
  | "other";

// Create multiple icon options for each category
const categoryIconOptions: Record<CategoryType | string, React.ReactNode[]> = {
  "tools": [<Wrench key="wrench1" />, <Wrench key="wrench2" className="rotate-45" />, <Wrench key="wrench3" className="rotate-90" />],
  "kitchen": [<Utensils key="utensils1" />, <Utensils key="utensils2" className="rotate-45" />, <Utensils key="utensils3" className="scale-x-[-1]" />],
  "electronics": [<Laptop key="laptop1" />, <Laptop key="laptop2" className="rotate-12" />, <Laptop key="laptop3" className="rotate-[-12]" />],
  "sports": [<Dumbbell key="dumbbell1" />, <Dumbbell key="dumbbell2" className="rotate-90" />, <Dumbbell key="dumbbell3" className="scale-x-[-1]" />],
  "books": [<Book key="book1" />, <Book key="book2" className="rotate-12" />, <Book key="book3" className="rotate-[-12]" />],
  "games": [<Gamepad2 key="gamepad1" />, <Gamepad2 key="gamepad2" className="rotate-12" />, <Gamepad2 key="gamepad3" className="rotate-[-12]" />],
  "diy-craft": [<Scissors key="scissors1" />, <Scissors key="scissors2" className="rotate-45" />, <Scissors key="scissors3" className="rotate-[-45]" />],
  "clothing": [<Shirt key="shirt1" />, <Shirt key="shirt2" className="rotate-12" />, <Shirt key="shirt3" className="rotate-[-12]" />],
  "music": [<Music key="music1" />, <Music key="music2" className="rotate-12" />, <Music key="music3" className="rotate-[-12]" />],
  "vehicles": [<Car key="car1" />, <Car key="car2" className="rotate-12" />, <Car key="car3" className="rotate-[-12]" />],
  "bicycles": [<Bike key="bike1" />, <Bike key="bike2" className="rotate-12" />, <Bike key="bike3" className="rotate-[-12]" />],
  "activities": [<Ticket key="ticket" />, <MapPin key="mappin" />, <Calendar key="calendar" />],
  "other": [<HelpCircle key="help1" />, <HelpCircle key="help2" className="rotate-45" />, <HelpCircle key="help3" className="rotate-[-45]" />]
};

// Maintain a map of selected icon indices for each category instance
const iconSelectionMap = new Map<string, number>();

// Get a random icon index for a category if not already selected
const getIconIndex = (category: string, itemId: string = ''): number => {
  const key = `${category}_${itemId}`;
  if (!iconSelectionMap.has(key)) {
    iconSelectionMap.set(key, Math.floor(Math.random() * 3));
  }
  return iconSelectionMap.get(key) || 0;
};

// Map categories to their respective Lucide icons
export const getCategoryIcon = (category: string, size: number = 24, itemId: string = ''): React.ReactElement => {
  const safeCategory = (category in categoryIconOptions) ? category : "other";
  const options = categoryIconOptions[safeCategory];
  const iconIndex = getIconIndex(safeCategory, itemId);
  
  // Clone the icon element and set the size
  const iconElement = options[iconIndex];
  return React.cloneElement(iconElement as React.ReactElement, { size });
};

// Get background colors for category icons
export const getCategoryIconBackground = (category: string): string => {
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
    "activities": "bg-orange-50",
    "other": "bg-yellow-50"
  };
  
  return bgColors[category] || bgColors["other"];
};

// Get text colors for category icons
export const getCategoryIconColor = (category: string): string => {
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
    "activities": "text-orange-600",
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
    const safeCategory = (category in categoryIconOptions) ? category : "other";
    const options = categoryIconOptions[safeCategory];
    const nextIndex = (iconIndex + 1) % options.length;
    setIconIndex(nextIndex);
  };
  
  return { iconIndex, rotateIcon };
};
