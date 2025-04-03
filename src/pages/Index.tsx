
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ItemsSection from "@/components/items/ItemsSection"; 
import { useHomePageItems } from "@/hooks/useHomePageItems";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    filteredItems, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory,
    refreshItems
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

  // Refresh items when auth state changes or component mounts
  useEffect(() => {
    console.log("Index page: auth state changed, refreshing items");
    if (!authLoading) {
      refreshItems();
    }
  }, [user, authLoading, refreshItems]);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <ItemsSection 
          items={filteredItems} 
          isLoading={isLoading || authLoading} 
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
