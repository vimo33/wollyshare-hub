
import React from "react";
import { Item } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import ItemForm from "./ItemForm";
import { useMyItems } from "./useMyItems";
import { useToast } from "@/hooks/use-toast";
import ItemFormDialog from "./ItemFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ItemCard from "../my-items/ItemCard";

interface MyItemsListProps {
  items: Item[];
  isLoading: boolean;
  error: any;
}

const MyItemsList = ({ items, isLoading, error }: MyItemsListProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const { deleteItem } = useMyItems();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      await deleteItem(selectedItem.id);
      toast({
        title: "Item deleted successfully!",
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting item",
        description: error.message,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Items</h2>
        <Button variant="outline" onClick={handleOpenDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      {isLoading ? (
        <p>Loading items...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : items.length === 0 ? (
        <p>No items added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEditItem(item)}
              onDelete={() => handleDeleteItem(item)}
            />
          ))}
        </div>
      )}
      
      {/* Add Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a new item</DialogTitle>
            <DialogDescription>
              Make sure to add all the details of your item.
            </DialogDescription>
          </DialogHeader>
          <ItemForm onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <ItemFormDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        itemData={selectedItem ? {
          id: selectedItem.id,
          name: selectedItem.name,
          category: selectedItem.category,
          description: selectedItem.description || "",
          weekdayAvailability: selectedItem.weekday_availability,
          weekendAvailability: selectedItem.weekend_availability,
          imageUrl: selectedItem.image_url || undefined
        } : undefined}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteItem}
      />
    </div>
  );
};

export default MyItemsList;
