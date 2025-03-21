
// Helper function to extract location from description
export const extractLocationFromDescription = (description: string | null): string => {
  if (!description) return 'Location not specified';
  
  // Look for location-related keywords in the description
  const locationKeywords = ['located', 'location', 'available at', 'found at', 'stored at', 'at the'];
  
  for (const keyword of locationKeywords) {
    const index = description.toLowerCase().indexOf(keyword);
    if (index !== -1) {
      // Extract a substring after the keyword (max 30 chars)
      const locationInfo = description.substring(index + keyword.length, index + keyword.length + 30);
      const cleanedLocation = locationInfo.split('.')[0].trim(); // Stop at the first period
      
      // If the extracted location is too short, it might not be valuable
      if (cleanedLocation.length > 3) {
        return cleanedLocation;
      }
    }
  }
  
  return 'Location not specified';
};
