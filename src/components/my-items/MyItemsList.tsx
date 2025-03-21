
import { forwardRef, useImperativeHandle } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ItemFormDialog from "./ItemFormDialog";
import ItemCard from "./ItemCard";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import EmptyItemsState from "./EmptyItemsState";
import LoadingItemsState from "./LoadingItemsState";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/item";
import { useState } from "react";
import { useItemsQuery, itemsQueryKeys } from "@/hooks/useItemsQuery";
import { useQueryClient } from "@tanstack/react-query";

export interface MyItemsListRef {
  fetchItems: () => Promise<void>;
}

const MyItemsList = forwardRef<MyItemsListRef>((props, ref) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  
  // Only fetch items if user is logged in
  const { data: items = [], isLoading, refetch } = useItemsQuery({
    userId: user?.id,
    enabled: !!user
  });
  
  console.log(`MyItemsList: Displaying ${items.length} items for user: ${user?.id || 'Not logged in'}`);
  
  // Expose fetchItems method via ref
  useImperativeHandle(ref, () => ({
    fetchItems: async () => {
      await refetch();
    }
  }));

  const handleDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !user) return;

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemToDelete);

      if (error) throw error;

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({
        queryKey: itemsQueryKeys.byUser(user.id)
      });
      
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

  const handleItemSaved = () => {
    if (user) {
      queryClient.invalidateQueries({
        queryKey: itemsQueryKeys.byUser(user.id)
      });
    }
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
            item={{
              id: item.id,
              name: item.name,
              category: item.category,
              description: item.description,
              image_url: item.image_url,
              weekday_availability: item.weekday_availability,
              weekend_availability: item.weekend_availability,
            }}
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
          onSuccess={handleItemSaved}
        />
      )}
    </div>
  );
});

MyItemsList.displayName = "MyItemsList";

export default MyItemsList;
