
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useLocationData } from "@/hooks/useLocationData";
import ItemFormDialog from "./ItemFormDialog";
import ItemCard from "./ItemCard";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import EmptyItemsState from "./EmptyItemsState";
import LoadingItemsState from "./LoadingItemsState";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types/item";

export interface MyItemsListRef {
  fetchItems: () => Promise<void>;
}

const MyItemsList = forwardRef<MyItemsListRef>((props, ref) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { locationData } = useLocationData();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  
  // Explicitly log that we're in the MyItemsList component
  console.log(`MyItemsList: Explicitly showing only current user's items. User ID: ${user?.id || 'Not logged in'}`);
  
  useEffect(() => {
    if (user) {
      fetchUserItems();
    } else {
      setItems([]);
      setIsLoading(false);
    }
  }, [user, locationData]);

  // Function to fetch only the current user's items
  const fetchUserItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log(`MyItemsList: Fetching items for user ID: ${user.id}`);
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id);

      if (itemsError) {
        console.error('Error fetching user items:', itemsError);
        setIsLoading(false);
        return;
      }

      console.log(`MyItemsList: Retrieved ${itemsData?.length || 0} items for current user`);
      
      if (itemsData.length === 0) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      // Get user profile for display name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, username, location')
        .eq('id', user.id)
        .single();

      const userName = profileData?.username || profileData?.full_name || 'You';
      let locationName = "Location not specified";
      let locationAddress = undefined;
      
      if (profileData?.location && locationData.get(profileData.location)) {
        const locationInfo = locationData.get(profileData.location);
        locationName = locationInfo?.name || "Location not specified";
        locationAddress = locationInfo?.address;
      }

      // Process items with user info
      const processedItems = itemsData.map(item => ({
        ...item,
        ownerName: userName,
        location: locationName,
        locationAddress: locationAddress,
        category: item.category as any
      } as Item));

      console.log(`MyItemsList: Processed ${processedItems.length} items with user data`);
      setItems(processedItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchUserItems:', error);
      setIsLoading(false);
    }
  };

  // Expose fetchItems method via ref
  useImperativeHandle(ref, () => ({
    fetchItems: async () => {
      await fetchUserItems();
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
      await fetchUserItems();
      
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
          onSuccess={() => fetchUserItems()}
        />
      )}
    </div>
  );
});

MyItemsList.displayName = "MyItemsList";

export default MyItemsList;
