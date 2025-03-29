
import React from "react";
import { Item } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import ItemForm from "./ItemForm";
import { useMyItems } from "./useMyItems";
import ItemCard from "@/components/ItemCard";
import { useToast } from "@/hooks/use-toast";

interface MyItemsListProps {
  items: Item[];
  isLoading: boolean;
  error: any;
  onRequestSent?: () => void;
}

const MyItemsList = ({ 
  items, 
  isLoading, 
  error,
  onRequestSent,
}: MyItemsListProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { deleteItem } = useMyItems();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      toast({
        title: "Item deleted successfully!",
      });
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
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
              id={item.id}
              name={item.name}
              ownerName={"You"}
              location={item.location || "Not specified"}
              locationAddress={undefined}
              weekdayAvailability={item.weekday_availability || "anytime"}
              weekendAvailability={item.weekend_availability || "anytime"}
              category={item.category as any}
              imageUrl={item.image_url}
              user_id={item.user_id}
              condition={item.condition || "Good"}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
      
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
    </div>
  );
};

export default MyItemsList;
