
// Helper function to get category badge color
export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    tools: "bg-wolly-blue text-blue-800",
    kitchen: "bg-wolly-pink text-pink-800",
    electronics: "bg-wolly-purple text-purple-800",
    sports: "bg-wolly-green text-green-800",
    books: "bg-wolly-blue text-blue-800",
    games: "bg-wolly-purple text-purple-800",
    "diy-craft": "bg-wolly-pink text-pink-800",
    other: "bg-wolly-yellow text-yellow-800",
  };
  return colors[category] || "bg-gray-200 text-gray-800";
};
