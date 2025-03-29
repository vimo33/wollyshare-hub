
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ItemsSection from "@/components/items/ItemsSection"; 
import { useHomePageItems } from "@/hooks/useHomePageItems";

const Index = () => {
  const { toast } = useToast();
  const { 
    filteredItems, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory 
  } = useHomePageItems();
  
  // Handle any fetching errors with a toast
  useEffect(() => {
    if (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error fetching items",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  }, [error, toast]);

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
