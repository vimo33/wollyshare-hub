
import { cn } from "@/lib/utils";

type CategoryPillProps = {
  label: string;
  color: "pink" | "green" | "yellow" | "blue" | "purple";
  active?: boolean;
  onClick?: () => void;
};

const CategoryPill = ({ label, color, active = false, onClick }: CategoryPillProps) => {
  const colorClasses = {
    pink: "bg-wolly-pink text-pink-800",
    green: "bg-wolly-green text-green-800",
    yellow: "bg-wolly-yellow text-yellow-800",
    blue: "bg-wolly-blue text-blue-800",
    purple: "bg-wolly-purple text-purple-800",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        colorClasses[color],
        active ? "ring-2 ring-offset-2 ring-gray-200" : "hover:opacity-90",
        "hover-lift"
      )}
    >
      {label}
    </button>
  );
};

export default CategoryPill;
