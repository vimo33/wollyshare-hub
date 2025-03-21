
import { Item } from "@/types/item";
import ItemsGrid from "./ItemsGrid";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";

interface ItemsSectionProps {
  items: Item[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const ItemsSection = ({ 
  items, 
  isLoading, 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory 
}: ItemsSectionProps) => {
  
  console.log(`ItemsSection: Displaying ${items.length} items, isLoading=${isLoading}`);

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Discover Available Items</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through items shared by community members that you can borrow.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <CategoryFilter activeCategory={activeCategory} handleCategoryClick={handleCategoryClick} />
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <LoadingState />
        ) : items.length > 0 ? (
          <ItemsGrid items={items} />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default ItemsSection;
