
// Format availability strings into readable text
export const formatAvailability = (availability: string): string => {
  switch (availability) {
    case 'anytime':
      return 'Anytime';
    case 'morning':
      return 'Mornings';
    case 'afternoon':
      return 'Afternoons';
    case 'evening':
      return 'Evenings';
    case 'not_available':
      return 'Not Available';
    default:
      return availability.charAt(0).toUpperCase() + availability.slice(1);
  }
};

// Export as getAvailabilityText for backward compatibility
export const getAvailabilityText = formatAvailability;
