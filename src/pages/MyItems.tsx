
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyItems } from "@/hooks/useMyItems";
import MyItemsList from "@/components/my-items/MyItemsList";
import IncomingRequestsSection from "@/components/my-items/IncomingRequestsSection";
import BorrowRequestHistory from "@/components/my-items/BorrowRequestHistory";
import BorrowedItemsList from "@/components/my-items/BorrowedItemsList";
import { useBorrowedItems } from "@/hooks/useBorrowedItems";

const MyItems = () => {
  const { items, isLoading, error, refetchItems } = useMyItems();
  const { items: borrowedItems, isLoading: isBorrowedLoading, error: borrowedError, refetchBorrowedItems } = useBorrowedItems();

  return (
    <div className="container py-6">
      <PageHeader heading="My Items" text="Manage your shared items and borrow requests." />
      
      <Tabs defaultValue="my-items" className="w-full mt-6">
        <TabsList className="w-full border-b">
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="incoming-requests">Incoming Requests</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="borrowed-items">Borrowed Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-items">
          <MyItemsList 
            items={items} 
            isLoading={isLoading} 
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="incoming-requests">
          <IncomingRequestsSection />
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
