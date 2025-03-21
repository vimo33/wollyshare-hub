
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ItemsSection from "@/components/items/ItemsSection";
import { useItemsQuery } from "@/hooks/useItemsQuery";

const Index = () => {
  const { toast } = useToast();
  const { data: items = [], isLoading, error } = useItemsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Handle any fetching errors with a toast
  if (error) {
    console.error('Error fetching items:', error);
    toast({
      title: "Error fetching items",
      description: "Please try again later",
      variant: "destructive"
    });
  }

  // Filter items based on search query and active category
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === "" || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === null || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <ItemsSection 
          items={filteredItems} 
          isLoading={isLoading} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
