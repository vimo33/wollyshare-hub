
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
    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group">
      {/* Category Badge */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${getCategoryIconColor(category)} bg-white shadow-sm`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </div>
      
      {/* Category Icon */}
      <div className="w-full h-full flex items-center justify-center">
        <div className={`p-8 rounded-full ${getCategoryIconBackground(category)} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
          {getCategoryIcon(category, 64)}
        </div>
      </div>
      
      {/* Glare Effect - appears on hover with category-specific color */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none ${getCategoryIconBackground(category).replace('bg-', 'bg-gradient-to-tr from-transparent via-')} rounded-t-xl`}
        style={{ 
          backgroundSize: '200% 200%',
          backgroundPosition: '100% 100%',
          animation: 'glare 1.5s ease-in-out infinite alternate'
        }}
      />
    </div>
  );
});

ImageContainer.displayName = 'ImageContainer';

export default ImageContainer;
