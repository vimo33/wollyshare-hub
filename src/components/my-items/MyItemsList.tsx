
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Edit, Trash2, AlertTriangle, Image, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import ItemFormDialog from "./ItemFormDialog";
import { supabase } from "@/integrations/supabase/client";

// Item type
type Item = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  weekday_availability: string;
  weekend_availability: string;
};

// Helper function to get readable availability text
const getAvailabilityText = (value: string) => {
  const options: Record<string, string> = {
    morning: "Morning (8AM-12PM)",
    afternoon: "Afternoon (12PM-5PM)",
    evening: "Evening (5PM-9PM)",
    anytime: "Anytime",
    unavailable: "Unavailable",
  };
  return options[value] || value;
};

// Helper function to get category badge color
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    tools: "bg-wolly-blue text-blue-800",
    kitchen: "bg-wolly-pink text-pink-800",
    electronics: "bg-wolly-purple text-purple-800",
    sports: "bg-wolly-green text-green-800",
    other: "bg-wolly-yellow text-yellow-800",
  };
  return colors[category] || "bg-gray-200 text-gray-800";
};

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
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

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

  const handleImageError = (itemId: string) => {
    setImageError(prev => ({ ...prev, [itemId]: true }));
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your items.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="text-center py-12 bg-muted/30">
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-muted">
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No items yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't added any items to share with your community.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Default image URL to use if the provided URL is null or fails to load
  const defaultImageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48 bg-muted">
              {item.image_url && !imageError[item.id] ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(item.id)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Image className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </div>
            </div>
            
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              {item.description && (
                <CardDescription>{item.description}</CardDescription>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekdays:</span>
                  <span className="font-medium">{getAvailabilityText(item.weekday_availability)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekends:</span>
                  <span className="font-medium">{getAvailabilityText(item.weekend_availability)}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(item)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your item
              and remove it from your shared items list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
