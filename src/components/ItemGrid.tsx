
import { useEffect } from "react";
import { useLocationData } from "@/hooks/useLocationData";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "../types/item";
import ItemsGrid from "./items/ItemsGrid";
import LoadingState from "./items/LoadingState";
import EmptyState from "./items/EmptyState";
import SearchBar from "./items/SearchBar";
import CategoryFilter from "./items/CategoryFilter";
import { useState } from "react";

// This component renders ALL users' items on the homepage
const ItemGrid = () => {
  const { locationData } = useLocationData();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    console.log("ItemGrid component mounted - explicitly fetching ALL items");
    fetchAllItems();
  }, [locationData]);

  const fetchAllItems = async () => {
    setIsLoading(true);
    try {
      console.log("ItemGrid: Explicitly fetching ALL items from ALL users");
      
      // Fetch all items without user filtering
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');

      if (itemsError) {
        console.error('Error fetching all items:', itemsError);
        setIsLoading(false);
        return;
      }

      console.log(`ItemGrid: Retrieved ${itemsData?.length || 0} total items`);
      
      if (itemsData.length === 0) {
        console.log("ItemGrid: No items found");
        setItems([]);
        setIsLoading(false);
        return;
      }

      // Get unique user IDs from the items
      const userIds = [...new Set(itemsData.map(item => item.user_id))];
      
      // Fetch user profiles for those IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, location')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map of user IDs to names and locations
      const userMap = new Map();
      profilesData?.forEach(profile => {
        userMap.set(profile.id, {
          name: profile.username || profile.full_name || 'Unknown User',
          location: profile.location || null
        });
      });

      // Combine items with owner names and locations
      const itemsWithOwners = itemsData.map(item => {
        const userInfo = userMap.get(item.user_id) || { name: 'Unknown User', location: null };
        
        // Use location name from the map if available
        let locationName = "Location not specified";
        let locationAddress = undefined;
        
        if (userInfo.location && locationData.get(userInfo.location)) {
          const locationInfo = locationData.get(userInfo.location);
          locationName = locationInfo?.name || "Location not specified";
          locationAddress = locationInfo?.address;
        }
        
        return {
          ...item,
          ownerName: userInfo.name,
          location: locationName,
          locationAddress: locationAddress,
          category: item.category as any
        } as Item;
      });

      console.log(`ItemGrid: Processed ${itemsWithOwners.length} items with owner data`);
      setItems(itemsWithOwners);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchAllItems:', error);
      setIsLoading(false);
    }
  };

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
        ) : filteredItems.length > 0 ? (
          <ItemsGrid items={filteredItems} />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default ItemGrid;
