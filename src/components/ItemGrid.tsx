
import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import CategoryPill from "./CategoryPill";
import { Search } from "lucide-react";

// Mock data
const mockItems = [
  {
    id: "1",
    name: "Power Drill",
    ownerName: "Alex Kim",
    location: "North Building",
    availableFor: "Weekends",
    category: "tools",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    name: "Stand Mixer",
    ownerName: "Jamie Chen",
    location: "East Wing",
    availableFor: "Weekdays",
    category: "kitchen",
    imageUrl: "https://images.unsplash.com/photo-1577991128076-d09a189172d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    ownerName: "Taylor Smith",
    location: "South Building",
    availableFor: "Anytime",
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    name: "Yoga Mat",
    ownerName: "Jordan Lee",
    location: "West Wing",
    availableFor: "Mornings",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    name: "Camping Tent",
    ownerName: "Casey Wong",
    location: "Storage Room",
    availableFor: "Weekends",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "6",
    name: "Projector",
    ownerName: "Riley Johnson",
    location: "Meeting Room",
    availableFor: "Evenings",
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
] as const;

const ItemGrid = () => {
  const [items, setItems] = useState(mockItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter items based on search query and active category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
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
        {!isLoaded ? (
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
                  ownerName={item.ownerName}
                  location={item.location}
                  availableFor={item.availableFor}
                  category={item.category}
                  imageUrl={item.imageUrl}
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
