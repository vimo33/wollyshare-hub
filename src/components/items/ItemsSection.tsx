
import { memo, lazy, Suspense } from "react";
import { Item } from "@/types/item";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import ItemsSkeletonGrid from "./ItemsSkeletonGrid";

// Code-split the ItemsGrid component
const ItemsGrid = lazy(() => import("./ItemsGrid"));

interface ItemsSectionProps {
  items: Item[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const ItemsSection = memo(({ 
  items, 
  isLoading, 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory 
}: ItemsSectionProps) => {
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
          <CategoryFilter activeCategory={activeCategory} handleCategoryClick={setActiveCategory} />
        </div>

        {/* Items Grid with improved loading states */}
        {isLoading ? (
          <ItemsSkeletonGrid />
        ) : items.length > 0 ? (
          <Suspense fallback={<ItemsSkeletonGrid />}>
            <ItemsGrid items={items} />
          </Suspense>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
});

ItemsSection.displayName = 'ItemsSection';

export default ItemsSection;
