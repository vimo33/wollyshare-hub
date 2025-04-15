
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ItemsSection from "@/components/items/ItemsSection"; 
import { useHomePageItems } from "@/hooks/useHomePageItems";
import { useAuth } from "@/contexts/AuthContext";
import Landing from "@/components/landing/Landing";
import PendingApprovalModal from "@/components/auth/PendingApprovalModal";

const Index = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading, profile } = useAuth();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  
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
  
  // Show approval modal for users who are not approved members yet
  useEffect(() => {
    if (user && profile && !profile.is_member && !authLoading) {
      setShowApprovalModal(true);
    }
  }, [user, profile, authLoading]);

  // If user is logged in but not approved, show the modal
  if (user && profile && !profile.is_member) {
    return (
      <div className="min-h-screen bg-white">
        <main className="py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to WollyShare</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your account is pending approval by an administrator.
          </p>
          <p className="text-gray-500">
            Please contact an admin on Telegram for approval.
          </p>
          
          <PendingApprovalModal 
            isOpen={showApprovalModal} 
            onClose={() => setShowApprovalModal(false)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // For unauthenticated users, show landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Landing />
        <Footer />
      </div>
    );
  }

  // For authenticated and approved users, show the items discovery page
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
