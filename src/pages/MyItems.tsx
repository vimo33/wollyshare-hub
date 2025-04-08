import React, { useEffect } from "react";
import PageHeader from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyItems } from "@/hooks/useMyItems";
import MyItemsList from "@/components/my-items/MyItemsList";
import BorrowRequestHistory from "@/components/my-items/BorrowRequestHistory";
import BorrowedItemsList from "@/components/my-items/BorrowedItemsList";
import { useBorrowedItems } from "@/hooks/useBorrowedItems";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const MyItems = () => {
  const { items, isLoading, error, refetchItems } = useMyItems();
  const { items: borrowedItems, isLoading: isBorrowedLoading, error: borrowedError, refetchBorrowedItems } = useBorrowedItems();
  const { user } = useAuth();

  // Set up subscription for real-time updates on borrow requests
  useEffect(() => {
    if (!user) return;
    
    // Set up channel for borrow requests changes
    const channel = supabase
      .channel('my-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'borrow_requests'
        },
        (payload) => {
          console.log('Borrow request change detected:', payload);
          // Add type checking to ensure the properties exist before accessing them
          if (payload.new && 
              typeof payload.new === 'object' && 
              'owner_id' in payload.new && 
              'borrower_id' in payload.new &&
              (payload.new.owner_id === user.id || payload.new.borrower_id === user.id)) {
            console.log('Refreshing items and borrowed items');
            refetchItems();
            refetchBorrowedItems();
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetchItems, refetchBorrowedItems]);

  return (
    <div className="container py-6">
      <PageHeader title="My WollyShare" description="Manage your shared items and borrow requests." />
      
      <Tabs defaultValue="my-items" className="w-full mt-6">
        <TabsList className="w-full border-b">
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="history">Shared Items</TabsTrigger>
          <TabsTrigger value="borrowed-items">Borrowed Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-items">
          <MyItemsList 
            items={items} 
            isLoading={isLoading} 
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <BorrowRequestHistory />
        </TabsContent>
        
        <TabsContent value="borrowed-items">
          <BorrowedItemsList 
            items={borrowedItems}
            isLoading={isBorrowedLoading}
            error={borrowedError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyItems;
