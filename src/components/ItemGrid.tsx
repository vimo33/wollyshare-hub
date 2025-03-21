
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SearchBar from "./items/SearchBar";
import CategoryFilter from "./items/CategoryFilter";
import EmptyState from "./items/EmptyState";
import LoadingState from "./items/LoadingState";
import ItemsGrid from "./items/ItemsGrid";
import { Item } from "../types/item";
import { extractLocationFromDescription } from "../utils/itemUtils";
import { useAuth } from "@/contexts/AuthContext";

const ItemGrid = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState<Map<string, {name: string, address: string}>>(new Map());
  const { profile } = useAuth();

  useEffect(() => {
    fetchItems();
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const { data, error } = await supabase
        .from('community_locations')
        .select('id, name, address');
      
      if (error) {
        console.error('Error fetching location data:', error);
        return;
      }

      const locationMap = new Map();
      data.forEach(location => {
        locationMap.set(location.id, {
          name: location.name,
          address: location.address
        });
      });
      
      setLocationData(locationMap);
    } catch (error) {
      console.error('Error in fetchLocationData:', error);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching all items from all users");
      
      // Fetch all items from Supabase without any user filtering
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');

      if (itemsError) {
        console.error('Error fetching items:', itemsError);
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
        // Use location name from the map if available, or extract from description as fallback
        let locationName = "Location not specified";
        let locationAddress = undefined;
        
        if (userInfo.location && locationData.get(userInfo.location)) {
          const locationInfo = locationData.get(userInfo.location);
          locationName = locationInfo?.name || "Location not specified";
          locationAddress = locationInfo?.address;
        } else if (item.description) {
          const extractedLocation = extractLocationFromDescription(item.description);
          locationName = extractedLocation !== "Location not specified" ? extractedLocation : "Location not specified";
        }
        
        return {
          ...item,
          ownerName: userInfo.name,
          location: locationName,
          locationAddress: locationAddress
        };
      });

      console.log(`Found ${itemsWithOwners.length} items from all users`);
      setItems(itemsWithOwners);
      
      // Simulate some loading time for smoother UI
      setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error in fetchItems:', error);
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

export default ItemGrid;
