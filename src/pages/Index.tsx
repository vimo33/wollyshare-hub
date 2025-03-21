
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { lazy } from "react";
import { useItems } from "@/hooks/useItems";
import { Skeleton } from "@/components/ui/skeleton";

// Code-split the ItemsSection component
const ItemsSection = lazy(() => import("@/components/items/ItemsSection"));

const LoadingFallback = () => (
  <div className="py-16 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-1/2 mx-auto" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  const { toast } = useToast();
  const { items = [], isLoading, error } = useItems();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
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

  // Use memoized callback for search updates
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Use memoized callback for category updates
  const handleCategoryChange = useCallback((category: string | null) => {
    setActiveCategory(prevCategory => 
      category === prevCategory ? null : category
    );
  }, []);

  // Filter items based on search query and active category - memoized
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchQuery === "" || 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === null || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <Suspense fallback={<LoadingFallback />}>
          <ItemsSection 
            items={filteredItems} 
            isLoading={isLoading} 
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
