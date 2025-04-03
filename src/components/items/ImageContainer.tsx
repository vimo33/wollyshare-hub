
import React, { memo } from "react";
import { getCategoryIcon, getCategoryIconBackground, getCategoryIconColor } from "./utils/category-icon-utils";

interface ImageContainerProps {
  category: string;
  name: string;
  categoryColors: Record<string, string>;
}

const ImageContainer = memo(({
  category,
  name,
  categoryColors
}: ImageContainerProps) => {
  const categoryColor = categoryColors[category] || "bg-gray-200 text-gray-700";
  
  return (
    <div className="relative h-48 bg-muted overflow-hidden">
      {/* Category Badge */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${categoryColor}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </div>
      
      {/* Category Icon */}
      <div className={`w-full h-full flex items-center justify-center ${getCategoryIconBackground(category)}`}>
        <div className={`p-6 rounded-full ${getCategoryIconColor(category)}`}>
          {getCategoryIcon(category, 48)}
        </div>
      </div>
    </div>
  );
});

ImageContainer.displayName = 'ImageContainer';

export default ImageContainer;
