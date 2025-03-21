
// Helper function to get readable availability text
export const getAvailabilityText = (value: string) => {
  const options: Record<string, string> = {
    morning: "Morning (8AM-12PM)",
    afternoon: "Afternoon (12PM-5PM)",
    evening: "Evening (5PM-9PM)",
    anytime: "Anytime",
    unavailable: "Unavailable",
  };
  return options[value] || value;
};
