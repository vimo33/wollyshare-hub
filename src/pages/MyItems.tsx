
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyItems = () => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const { user } = useAuth();
  const { toast } = useToast();
  const itemsListRef = useRef<{ fetchItems: () => Promise<void> } | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
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

      {/* Items list - explicitly showing only the current user's items */}
      <MyItemsList ref={itemsListRef} />

      {/* Borrow Requests Section with Tabs */}
      <div className="mt-8 border rounded-lg overflow-hidden">
        <Tabs defaultValue="pending" className="w-full">
          <div className="bg-muted/50 p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
              <TabsTrigger value="history">Request History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending" className="mt-0 border-0">
            <IncomingRequestsSection onStatusChange={handleRequestStatusChange} />
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 border-0">
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
