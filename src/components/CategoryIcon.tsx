
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCategoryIcon, getCategoryIconBackground, getCategoryIconColor } from "./items/utils/category-icon-utils";
import type { ItemCategory } from "@/types/item";

export type CategoryIconSize = "sm" | "md" | "lg" | "xl";

interface CategoryIconProps {
  category: ItemCategory;
  size?: CategoryIconSize;
  isSelected?: boolean;
  className?: string;
  itemId?: string;
  onClick?: () => void;
}

// Size mappings for icons and containers
const iconSizeMap: Record<CategoryIconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};

const containerSizeMap: Record<CategoryIconSize, string> = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24"
};

export default function CategoryIcon({ 
  category,
  size = "md",
  isSelected = false,
  className = "",
  itemId = "",
  onClick
}: CategoryIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const containerVariants = {
    initial: { scale: 1, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" },
    hover: { scale: 1.05, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)" },
    selected: { scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: { rotate: isSelected ? 0 : 5, scale: 1.1 },
    selected: { rotate: 0, scale: 1.1 }
  };

  const backgroundClass = getCategoryIconBackground(category);
  const textColorClass = getCategoryIconColor(category);
  const iconSize = iconSizeMap[size];
  const containerSize = containerSizeMap[size];

  const animationState = isSelected ? "selected" : isHovered ? "hover" : "initial";
  
  return (
    <motion.div
      className={cn(
        containerSize,
        "flex items-center justify-center rounded-full",
        backgroundClass,
        isSelected && "ring-2 ring-offset-2 ring-gray-200",
        className,
        onClick && "cursor-pointer"
      )}
      variants={containerVariants}
      initial="initial"
      animate={animationState}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.div
        className={cn("flex items-center justify-center", textColorClass)}
        variants={iconVariants}
        initial="initial"
        animate={animationState}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {getCategoryIcon(category, iconSize, itemId)}
      </motion.div>
    </motion.div>
  );
}
