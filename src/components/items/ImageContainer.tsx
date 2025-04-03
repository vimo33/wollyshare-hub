
import React, { memo } from "react";
import { getCategoryIcon, getCategoryIconBackground, getCategoryIconColor } from "./utils/category-icon-utils";

interface ImageContainerProps {
  category: string;
  name: string;
}

const ImageContainer = memo(({
  category,
  name
}: ImageContainerProps) => {
  return (
    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Category Badge */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${getCategoryIconColor(category)} bg-white shadow-sm`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </div>
      
      {/* Category Icon */}
      <div className="w-full h-full flex items-center justify-center">
        <div className={`p-8 rounded-full ${getCategoryIconBackground(category)} shadow-inner`}>
          {getCategoryIcon(category, 64)}
        </div>
      </div>
    </div>
  );
});

ImageContainer.displayName = 'ImageContainer';

export default ImageContainer;
