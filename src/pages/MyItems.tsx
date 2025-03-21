
import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import MyItemsList from "@/components/my-items/MyItemsList";
import ItemFormDialog from "@/components/my-items/ItemFormDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const MyItems = () => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const itemsListRef = useRef<{ fetchItems: () => Promise<void> } | null>(null);

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

      {/* Items list */}
      <MyItemsList ref={itemsListRef} />

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
