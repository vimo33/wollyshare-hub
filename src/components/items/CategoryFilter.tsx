
import CategoryPill from "../CategoryPill";
import CategoryIcon from "../CategoryIcon";
import { cn } from "@/lib/utils";
import type { ItemCategory } from "@/types/item";

type CategoryFilterProps = {
  activeCategory: string | null;
  handleCategoryClick: (category: string | null) => void;
};

const CategoryFilter = ({ activeCategory, handleCategoryClick }: CategoryFilterProps) => {
  const handleClick = (category: string | null) => {
    handleCategoryClick(category);
  };

  return (
    <div className="space-y-6">
      {/* Traditional category pills */}
      <div className="flex flex-wrap justify-center gap-3">
        <CategoryPill 
          label="All Items" 
          color="blue"
          active={activeCategory === null}
          onClick={() => handleClick(null)}
        />
        <CategoryPill 
          label="Tools" 
          color="blue"
          active={activeCategory === "tools"}
          onClick={() => handleClick("tools")}
        />
        <CategoryPill 
          label="Kitchen" 
          color="pink"
          active={activeCategory === "kitchen"}
          onClick={() => handleClick("kitchen")}
        />
        <CategoryPill 
          label="Electronics" 
          color="purple"
          active={activeCategory === "electronics"}
          onClick={() => handleClick("electronics")}
        />
        <CategoryPill 
          label="Sports" 
          color="green"
          active={activeCategory === "sports"}
          onClick={() => handleClick("sports")}
        />
        <CategoryPill 
          label="Books" 
          color="blue"
          active={activeCategory === "books"}
          onClick={() => handleClick("books")}
        />
        <CategoryPill 
          label="Games" 
          color="purple"
          active={activeCategory === "games"}
          onClick={() => handleClick("games")}
        />
        <CategoryPill 
          label="DIY & Craft" 
          color="pink"
          active={activeCategory === "diy-craft"}
          onClick={() => handleClick("diy-craft")}
        />
        <CategoryPill 
          label="Other" 
          color="yellow"
          active={activeCategory === "other"}
          onClick={() => handleClick("other")}
        />
      </div>
      
      {/* New animated category icons */}
      <div className="pt-4 flex flex-wrap justify-center gap-4">
        <IconButton 
          category="tools"
          label="Tools" 
          isSelected={activeCategory === "tools"}
          onClick={() => handleClick("tools")}
        />
        <IconButton 
          category="kitchen"
          label="Kitchen" 
          isSelected={activeCategory === "kitchen"}
          onClick={() => handleClick("kitchen")}
        />
        <IconButton 
          category="electronics"
          label="Electronics" 
          isSelected={activeCategory === "electronics"}
          onClick={() => handleClick("electronics")}
        />
        <IconButton 
          category="sports"
          label="Sports" 
          isSelected={activeCategory === "sports"}
          onClick={() => handleClick("sports")}
        />
        <IconButton 
          category="books"
          label="Books" 
          isSelected={activeCategory === "books"}
          onClick={() => handleClick("books")}
        />
        <IconButton 
          category="games"
          label="Games" 
          isSelected={activeCategory === "games"}
          onClick={() => handleClick("games")}
        />
        <IconButton 
          category="diy-craft"
          label="DIY & Craft" 
          isSelected={activeCategory === "diy-craft"}
          onClick={() => handleClick("diy-craft")}
        />
        <IconButton 
          category="other"
          label="Other" 
          isSelected={activeCategory === "other"}
          onClick={() => handleClick("other")}
        />
      </div>
    </div>
  );
};

// Helper component for category icons with labels
interface IconButtonProps {
  category: ItemCategory;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function IconButton({ category, label, isSelected, onClick }: IconButtonProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center gap-2 cursor-pointer",
        "transition-opacity hover:opacity-90"
      )}
      onClick={onClick}
    >
      <CategoryIcon 
        category={category} 
        size="md" 
        isSelected={isSelected} 
      />
      <span className={cn(
        "text-xs font-medium",
        isSelected ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
}

export default CategoryFilter;
