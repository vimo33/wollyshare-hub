
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyItems } from "@/hooks/useMyItems";
import { useBorrowedItems } from "@/hooks/useBorrowedItems";
import { useIncomingRequests } from "@/components/my-items/incoming-requests/useIncomingRequests";
import MyItemsList from "@/components/my-items/MyItemsList";
import BorrowedItemsList from "@/components/my-items/BorrowedItemsList";
import IncomingRequestsSection from "@/components/my-items/IncomingRequestsSection";
import RequestHistorySection from "@/components/my-items/RequestHistorySection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MyItems = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/auth");
    }
  }, [user, isAuthLoading, navigate]);
  
  const { 
    items: myItems, 
    isLoading: isItemsLoading, 
    error: itemsError 
  } = useMyItems();
  
  const { 
    items: borrowedItems, 
    isLoading: isBorrowedLoading, 
    error: borrowedError 
  } = useBorrowedItems();
  
  // Get the fetch function from useIncomingRequests
  const { 
    requests, 
    isLoading: isRequestsLoading, 
    isError: isRequestsError, 
    error: requestsError,
    fetchIncomingRequests 
  } = useIncomingRequests();
  
  if (isAuthLoading) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Items</h1>
        <Button onClick={() => navigate("/browse")}>Browse Items</Button>
      </div>
      
      <Tabs defaultValue="my-items" className="w-full">
        <TabsList className="w-full md:w-auto mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="incoming-requests">Incoming Requests</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="borrowed-items">Borrowed Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-items">
          <MyItemsList 
            items={myItems} 
            isLoading={isItemsLoading} 
            error={itemsError}
            onRequestSent={fetchIncomingRequests}
          />
        </TabsContent>
        
        <TabsContent value="incoming-requests">
          <IncomingRequestsSection 
            requests={requests || []}
            isLoading={isRequestsLoading}
            isError={isRequestsError || false}
            error={requestsError}
            refreshRequests={fetchIncomingRequests}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <RequestHistorySection />
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
