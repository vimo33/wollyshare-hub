
// Helper function to extract location from description
export const extractLocationFromDescription = (description: string | null): string => {
  if (!description) return 'Location not specified';
  
  // Look for location-related keywords in the description
  const locationKeywords = ['located', 'location', 'available at', 'found at', 'stored at'];
  
  for (const keyword of locationKeywords) {
    const index = description.toLowerCase().indexOf(keyword);
    if (index !== -1) {
      // Extract a substring after the keyword (max 30 chars)
      const locationInfo = description.substring(index + keyword.length, index + keyword.length + 30);
      return locationInfo.split('.')[0].trim(); // Stop at the first period
    }
  }
  
  return 'Location not specified';
};
