
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/item";
import { Search } from "lucide-react";
import ItemsGrid from "@/components/items/ItemsGrid";
import LoadingState from "@/components/items/LoadingState";
import EmptyState from "@/components/items/EmptyState";
import SearchBar from "@/components/items/SearchBar";
import CategoryFilter from "@/components/items/CategoryFilter";

const Index = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<Map<string, {name: string, address: string}>>(new Map());

  useEffect(() => {
    console.log("Index page mounted - fetching locations and items");
    fetchLocations();
    fetchAllItems();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('community_locations')
        .select('*');
        
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      const locMap = new Map();
      data?.forEach(location => {
        locMap.set(location.id, {
          name: location.name,
          address: location.address
        });
      });
      
      setLocationData(locMap);
      console.log(`Index: Fetched ${locMap.size} locations`);
    } catch (error) {
      console.error('Error in fetchLocations:', error);
    }
  };

  const fetchAllItems = async () => {
    setIsLoading(true);
    try {
      console.log("Index: Explicitly fetching ALL items from ALL users");
      
      // Fetch all items without user filtering
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');

      if (itemsError) {
        console.error('Error fetching all items:', itemsError);
        setIsLoading(false);
        return;
      }

      console.log(`Index: Retrieved ${itemsData?.length || 0} total items`);
      
      if (itemsData.length === 0) {
        console.log("Index: No items found");
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

      console.log(`Index: Processed ${itemsWithOwners.length} items with owner data`);
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
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        
        {/* Items Section */}
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
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-wolly-green flex items-center justify-center">
                <span className="text-green-800 font-bold text-sm">W</span>
              </div>
              <span className="font-semibold">WollyShare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A community-driven platform to share and borrow items, reducing waste and building connections.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} WollyShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
