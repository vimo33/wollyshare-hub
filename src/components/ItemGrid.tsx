import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import CategoryPill from "./CategoryPill";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define the Item type
type Item = {
  id: string;
  name: string;
  category: string;
  user_id: string;
  image_url: string | null;
  description: string | null;
  weekday_availability: string;
  weekend_availability: string;
  ownerName?: string; // Will be populated after fetching
  location?: string; // We'll derive this from the description
  availableFor?: string; // Adding this property to fix the type error
};

const ItemGrid = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      // Fetch items from Supabase
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
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map of user IDs to names
      const userMap = new Map();
      profilesData?.forEach(profile => {
        userMap.set(profile.id, profile.full_name || 'Unknown User');
      });

      // Combine items with owner names
      const itemsWithOwners = itemsData.map(item => {
        const formattedAvailability = formatAvailability(item.weekday_availability, item.weekend_availability);
        return {
          ...item,
          ownerName: userMap.get(item.user_id) || 'Unknown User',
          // Extract a location from the description or use a default
          location: extractLocationFromDescription(item.description),
          // Format availability and add it to the item object
          availableFor: formattedAvailability
        };
      });

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

  // Helper function to extract location from description
  const extractLocationFromDescription = (description: string | null): string => {
    if (!description) return 'Location not specified';
    
    // Look for location-related keywords in the description
    const locationKeywords = ['located', 'location', 'available at', 'found at', 'stored at'];
    
    for (const keyword of locationKeywords) {
      const index = description.toLowerCase().indexOf(keyword);
      if (index !== -1) {
        // Extract a substring after the keyword (max 30 chars)
        const locationInfo = description.substring(index + keyword.length, index + keyword.length + 30);
        return locationInfo.split('.')[0].trim(); // Stop at the first period
      }
    }
    
    return 'Location in description';
  };

  // Helper function to format availability
  const formatAvailability = (weekday: string, weekend: string): string => {
    if (weekday === 'anytime' && weekend === 'anytime') return 'Anytime';
    if (weekday === 'anytime') return 'Weekdays';
    if (weekend === 'anytime') return 'Weekends';
    if (weekday === 'morning' && weekend === 'morning') return 'Mornings';
    if (weekday === 'evening' && weekend === 'evening') return 'Evenings';
    return `${weekday} & ${weekend}`;
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
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search items or owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
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
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-80 rounded-2xl bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <ItemCard
                  id={item.id}
                  name={item.name}
                  ownerName={item.ownerName || "Unknown"}
                  location={item.location || "Location not specified"}
                  availableFor={item.availableFor || "Check with owner"}
                  category={item.category as any}
                  imageUrl={item.image_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  onClick={() => console.log(`Clicked on item: ${item.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemGrid;
