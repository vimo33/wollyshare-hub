
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ItemFormDialog from "./ItemFormDialog";
import ItemCard, { Item } from "./ItemCard";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import EmptyItemsState from "./EmptyItemsState";
import LoadingItemsState from "./LoadingItemsState";
import { supabase } from "@/integrations/supabase/client";

export interface MyItemsListRef {
  fetchItems: () => Promise<void>;
}

const MyItemsList = forwardRef<MyItemsListRef>((props, ref) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

  // Fetch items from Supabase
  const fetchItems = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to load your items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Expose fetchItems method via ref
  useImperativeHandle(ref, () => ({
    fetchItems
  }));

  // Fetch items when component mounts or user changes
  useEffect(() => {
    fetchItems();
  }, [user]);

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

      // Remove item from state
      setItems(items.filter(item => item.id !== itemToDelete));
      
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
    // Transform item to match form structure
    const formattedItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description || "",
      weekdayAvailability: item.weekday_availability,
      weekendAvailability: item.weekend_availability,
      imageUrl: item.image_url,
    };
    
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
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
});

MyItemsList.displayName = "MyItemsList";

export default MyItemsList;
