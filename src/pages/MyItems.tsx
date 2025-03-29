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
import BorrowRequestDialog from "@/components/borrow/BorrowRequestDialog";

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MyItemsList 
            items={myItems} 
            isLoading={isItemsLoading} 
            error={itemsError}
            onRequestSent={fetchIncomingRequests}
          />
          
          <BorrowedItemsList 
            items={borrowedItems}
            isLoading={isBorrowedLoading}
            error={borrowedError}
          />
        </div>
        
        <div className="space-y-8">
          <IncomingRequestsSection 
            requests={requests}
            isLoading={isRequestsLoading}
            isError={isRequestsError}
            error={requestsError}
            refreshRequests={fetchIncomingRequests}
          />
          
          <RequestHistorySection />
        </div>
      </div>
    </div>
  );
};

export default MyItems;
