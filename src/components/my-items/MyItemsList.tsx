
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ItemFormDialog from "./ItemFormDialog";
import ItemCard, { Item } from "./ItemCard";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import EmptyItemsState from "./EmptyItemsState";
import LoadingItemsState from "./LoadingItemsState";
import { supabase } from "@/integrations/supabase/client";
import { useLocationData } from "@/hooks/useLocationData";
import { useItems } from "@/hooks/useItems";

export interface MyItemsListRef {
  fetchItems: () => Promise<void>;
}

const MyItemsList = forwardRef<MyItemsListRef>((props, ref) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { locationData } = useLocationData();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  
  // Explicitly set the user ID and log that we're in the MyItemsList component
  console.log(`MyItemsList: Explicitly showing only current user's items. User ID: ${user?.id || 'Not logged in'}`);
  
  // Use the useItems hook with the current user's ID to filter
  const { items, isLoading, fetchItems: refetchItems } = useItems(locationData, user?.id);

  // Log items for debugging
  useEffect(() => {
    console.log(`MyItemsList: Found ${items.length} items for current user`);
  }, [items]);

  // Expose fetchItems method via ref
  useImperativeHandle(ref, () => ({
    fetchItems: async () => {
      await refetchItems();
    }
  }));

  const handleDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemToDelete);

      if (error) throw error;

      // Refetch items after delete
      await refetchItems();
      
      toast({
        title: "Item Deleted",
        description: "Your item has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (item: Item) => {
    setItemToEdit(item);
    setEditDialogOpen(true);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your items.</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingItemsState />;
  }

  if (items.length === 0) {
    return <EmptyItemsState />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard 
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />

      {/* Edit item dialog */}
      {itemToEdit && (
        <ItemFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          itemData={{
            id: itemToEdit.id,
            name: itemToEdit.name,
            category: itemToEdit.category,
            description: itemToEdit.description || "",
            weekdayAvailability: itemToEdit.weekday_availability,
            weekendAvailability: itemToEdit.weekend_availability,
            imageUrl: itemToEdit.image_url,
          }}
          onSuccess={() => refetchItems()}
        />
      )}
    </div>
  );
});

MyItemsList.displayName = "MyItemsList";

export default MyItemsList;
