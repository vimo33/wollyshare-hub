
import CategoryPill from "../CategoryPill";

type CategoryFilterProps = {
  activeCategory: string | null;
  handleCategoryClick: (category: string | null) => void;
};

const CategoryFilter = ({ activeCategory, handleCategoryClick }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <CategoryPill 
        label="All Items" 
        color="blue"
        active={activeCategory === null}
        onClick={() => handleCategoryClick(null)}
      />
      <CategoryPill 
        label="Tools" 
        color="blue"
        active={activeCategory === "tools"}
        onClick={() => handleCategoryClick("tools")}
      />
      <CategoryPill 
        label="Kitchen" 
        color="pink"
        active={activeCategory === "kitchen"}
        onClick={() => handleCategoryClick("kitchen")}
      />
      <CategoryPill 
        label="Electronics" 
        color="purple"
        active={activeCategory === "electronics"}
        onClick={() => handleCategoryClick("electronics")}
      />
      <CategoryPill 
        label="Sports" 
        color="green"
        active={activeCategory === "sports"}
        onClick={() => handleCategoryClick("sports")}
      />
      <CategoryPill 
        label="Other" 
        color="yellow"
        active={activeCategory === "other"}
        onClick={() => handleCategoryClick("other")}
      />
    </div>
  );
};

export default CategoryFilter;
