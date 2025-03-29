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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BorrowRequestDialog from "@/components/borrow/BorrowRequestDialog";
import { useToast } from "@/components/ui/use-toast";

interface MyItemsListProps {
  items: Item[];
  isLoading: boolean;
  error: any;
  onRequestSent?: () => void; // Add the callback prop
}

const MyItemsList = ({ 
  items, 
  isLoading, 
  error,
  onRequestSent, // Include in props
}: MyItemsListProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
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

  const handleBorrowRequest = (item: Item) => {
    setSelectedItem(item);
    setIsRequestDialogOpen(true);
  };
  
  // Pass onRequestSent to the BorrowRequestDialog
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
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  <Badge>Category: {item.category}</Badge>
                </p>
                <p>Condition: {item.condition || "Not specified"}</p>
                <p>Location: {item.location || "Not specified"}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleBorrowRequest(item)}>
                  Request to Borrow
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {selectedItem && (
        <BorrowRequestDialog 
          item={selectedItem} 
          isOpen={isRequestDialogOpen}
          onClose={() => setIsRequestDialogOpen(false)}
          onRequestSent={onRequestSent} // Pass the callback
        />
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
