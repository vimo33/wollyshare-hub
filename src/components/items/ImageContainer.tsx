
import { useState } from "react";
import { Image, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageContainerProps {
  imageUrl: string | null;
  name: string;
  category: string;
  categoryColors: Record<string, string>;
  onLike?: (e: React.MouseEvent) => void;
  isLiked?: boolean;
}

const ImageContainer = ({ 
  imageUrl, 
  name, 
  category, 
  categoryColors, 
  onLike, 
  isLiked = false 
}: ImageContainerProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Default image URL to use if the provided URL is null or fails to load
  const defaultImageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // Use the provided imageUrl if it exists and isn't empty, otherwise use the default
  const displayImageUrl = (!imageUrl || imageError) ? defaultImageUrl : imageUrl;

  // Debug logging for image URLs
  if (process.env.NODE_ENV === 'development') {
    console.log(`Rendering image for ${name}:`, { 
      original: imageUrl, 
      display: displayImageUrl, 
      hasError: imageError 
    });
  }

  const handleImageError = () => {
    console.error(`Failed to load image for item "${name}":`, imageUrl);
    setImageError(true);
    setImageLoaded(true); // Consider the image "loaded" even if it failed to load the real image
  };

  return (
    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-t-primary/30 border-primary/10 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={displayImageUrl}
        alt={name}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={handleImageError}
      />
      
      {/* Category Tag */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </div>
      
      {onLike && (
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          onClick={onLike}
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors", 
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            )} 
          />
        </button>
      )}
    </div>
  );
};

export default ImageContainer;
