
import { useEffect, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { lazy } from "react";
import { useHomePageItems } from "@/hooks/useHomePageItems";

// Code-split the ItemsSection component
const ItemsSection = lazy(() => import("@/components/items/ItemsSection"));

const LoadingFallback = () => (
  <div className="py-16 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-10 w-64 mx-auto mb-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-5 w-1/2 mx-auto bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="space-y-6">
        <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

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
        <Suspense fallback={<LoadingFallback />}>
          <ItemsSection 
            items={filteredItems} 
            isLoading={isLoading} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
