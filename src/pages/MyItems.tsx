
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import MyItemsList from "@/components/my-items/MyItemsList";
import ItemFormDialog from "@/components/my-items/ItemFormDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import IncomingRequestsSection from "@/components/my-items/IncomingRequestsSection";
import BorrowRequestHistory from "@/components/my-items/BorrowRequestHistory";
import BorrowedItemsList from "@/components/my-items/BorrowedItemsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyItems = () => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-items");
  const { user } = useAuth();
  const { toast } = useToast();
  const itemsListRef = useRef<{ fetchItems: () => Promise<void> } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    console.log("MyItems page mounted - should show ONLY current user's items");
  }, []);

  const onOpenAddItem = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items.",
        variant: "destructive",
      });
      return;
    }
    setIsAddItemOpen(true);
  };

  const handleItemAdded = () => {
    // Refresh the items list when a new item is added
    if (itemsListRef.current) {
      itemsListRef.current.fetchItems();
    }
  };

  const handleRequestStatusChange = () => {
    // This function is called when a request status changes (approved/rejected)
    // We could show a toast or refresh some data if needed
  };

  const handleRequestSent = () => {
    // Trigger a refresh of the incoming requests list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <PageHeader
        title="My Items"
        description="Share your items with your community. Add, edit, or remove items you want to lend to your neighbors."
      >
        <div className="mt-6">
          <Button 
            onClick={onOpenAddItem}
            className="bg-wolly-green text-green-800 hover:bg-wolly-green/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>
      </PageHeader>

      {/* Tabbed content */}
      <div className="mt-8 border rounded-lg overflow-hidden">
        <Tabs defaultValue="my-items" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-muted/50 p-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="my-items">My Items</TabsTrigger>
              <TabsTrigger value="borrowed">Items I Borrowed</TabsTrigger>
              <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
              <TabsTrigger value="history">Request History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="my-items" className="mt-0 p-6">
            <MyItemsList ref={itemsListRef} />
          </TabsContent>
          
          <TabsContent value="borrowed" className="mt-0 p-6">
            <BorrowedItemsList />
          </TabsContent>
          
          <TabsContent value="incoming" className="mt-0 p-6">
            <IncomingRequestsSection 
              onStatusChange={handleRequestStatusChange} 
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 p-6">
            <BorrowRequestHistory />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add item dialog */}
      <ItemFormDialog 
        open={isAddItemOpen} 
        onOpenChange={setIsAddItemOpen}
        onSuccess={handleItemAdded}
      />
    </div>
  );
};

export default MyItems;
