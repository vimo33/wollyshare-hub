
import React, { memo, useState, useEffect } from "react";
import { Image } from "lucide-react";

interface ImageContainerProps {
  imageUrl: string | null;
  name: string;
  category: string;
  categoryColors: Record<string, string>;
}

const ImageContainer = memo(({
  imageUrl,
  name,
  category,
  categoryColors
}: ImageContainerProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(imageUrl);
  
  // Reset image error state when imageUrl changes
  useEffect(() => {
    setImageError(false);
    setImageSrc(imageUrl);
  }, [imageUrl]);
  
  const categoryColor = categoryColors[category] || "bg-gray-200 text-gray-700";
  
  const handleImageError = () => {
    console.error(`Failed to load image for "${name}":`, imageUrl);
    setImageError(true);
  };

  // Add a fallback placeholder for specific items that are known to have image issues
  useEffect(() => {
    if ((name.includes("TV Samsung") || name.includes("Pressure Cooker")) && (!imageSrc || imageError)) {
      // Fallback to a placeholder image for these specific items
      setImageSrc("https://placehold.co/600x400?text=Item+Image");
      setImageError(false);
    }
  }, [name, imageSrc, imageError]);

  return (
    <div className="relative h-48 bg-muted overflow-hidden">
      {/* Category Badge */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${categoryColor}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </div>
      
      {/* Image or Placeholder */}
      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Image className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}
    </div>
  );
});

ImageContainer.displayName = 'ImageContainer';

export default ImageContainer;
