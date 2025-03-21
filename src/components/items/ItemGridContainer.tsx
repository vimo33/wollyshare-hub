
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "../../types/item";
import { useLocationData } from "@/hooks/useLocationData";
import { useItems } from "@/hooks/useItems";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ItemsGrid from "./ItemsGrid";

interface ItemGridContainerProps {
  showAllItems?: boolean;
  userId?: string;
}

const ItemGridContainer = ({ showAllItems = false, userId }: ItemGridContainerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { profile } = useAuth();
  const { locationData } = useLocationData();
  
  // If showAllItems is true, we don't pass userId even if it's available
  // This ensures we get items from all users on the homepage
  const itemsUserId = showAllItems ? undefined : userId;
  
  // Explicit logging to debug the container's behavior
  console.log(`ItemGridContainer: ${showAllItems ? 'Explicitly showing ALL items' : 'Showing filtered items'}, userID filter: ${itemsUserId || 'None'}`);
  
  const { items, isLoaded, isLoading } = useItems(locationData, itemsUserId);

  // Filter items based on search query and active category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === null || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  // Get the user's location info
  const getUserLocationInfo = () => {
    if (profile?.location && locationData.get(profile.location)) {
      const locationInfo = locationData.get(profile.location);
      return {
        name: locationInfo?.name || "",
        address: locationInfo?.address || ""
      };
    }
    return null;
  };

  const userLocationInfo = getUserLocationInfo();

  // Add debug logging to understand what items we're showing
  console.log(`ItemGridContainer: Showing ${filteredItems.length} filtered items from ${items.length} total items`);

  // Log the actual item data for debugging
  useEffect(() => {
    if (items.length > 0) {
      console.log("ItemGridContainer items data sample:", items[0]);
    }
  }, [items]);

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Discover Available Items</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through items shared by community members that you can borrow.
          </p>
          {userLocationInfo && (
            <p className="text-sm mt-2 text-secondary-foreground">
              Your location: <span className="font-medium">{userLocationInfo.name}</span>
              {userLocationInfo.address && (
                <span className="text-gray-500"> ({userLocationInfo.address})</span>
              )}
            </p>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-10">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <CategoryFilter activeCategory={activeCategory} handleCategoryClick={handleCategoryClick} />
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <LoadingState />
        ) : filteredItems.length > 0 ? (
          <ItemsGrid items={filteredItems} />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default ItemGridContainer;
