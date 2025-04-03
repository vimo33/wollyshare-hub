
// Format availability text for display
export const formatAvailability = (availability: string): string => {
  switch (availability) {
    case "morning": return "Morning (8AM-12PM)";
    case "afternoon": return "Afternoon (12PM-5PM)";
    case "evening": return "Evening (5PM-9PM)";
    case "anytime": return "Anytime";
    case "unavailable": return "Unavailable";
    default: return availability;
  }
};

// Export getAvailabilityText as an alias for formatAvailability for consistency with other modules
export const getAvailabilityText = formatAvailability;
