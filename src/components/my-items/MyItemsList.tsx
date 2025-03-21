
import { useState } from "react";
import { Edit, Trash2, AlertTriangle, Image } from "lucide-react";
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

// Temporary mock data until we connect to Supabase
const mockItems = [
  {
    id: "1",
    name: "Power Drill",
    category: "tools",
    description: "Cordless power drill, works great for home projects",
    imageUrl: "https://images.unsplash.com/photo-1580402427914-a6cc60da4ebc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    weekdayAvailability: "evening",
    weekendAvailability: "anytime",
  },
  {
    id: "2",
    name: "Stand Mixer",
    category: "kitchen",
    description: "Professional grade stand mixer, perfect for baking",
    imageUrl: "https://images.unsplash.com/photo-1594224457860-23f321e0d814?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    weekdayAvailability: "unavailable",
    weekendAvailability: "morning",
  },
  {
    id: "3",
    name: "Camping Tent",
    category: "sports",
    description: "4-person camping tent, easy to set up",
    imageUrl: null,
    weekdayAvailability: "anytime",
    weekendAvailability: "anytime",
  },
];

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

const MyItemsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState(mockItems);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any | null>(null);

  // In a real implementation, we would fetch items from Supabase here

  const handleDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real implementation, we would delete from Supabase here
      const updatedItems = items.filter(item => item.id !== itemToDelete);
      setItems(updatedItems);
      
      toast({
        title: "Item Deleted",
        description: "Your item has been removed successfully.",
      });
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleEdit = (item: any) => {
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48 bg-muted">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
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
                  <span className="font-medium">{getAvailabilityText(item.weekdayAvailability)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekends:</span>
                  <span className="font-medium">{getAvailabilityText(item.weekendAvailability)}</span>
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
          itemData={itemToEdit}
        />
      )}
    </div>
  );
};

export default MyItemsList;
