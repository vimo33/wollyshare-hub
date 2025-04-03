
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Item as SupabaseItem } from "@/types/supabase";
import { format } from "date-fns";
import { User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageContainer from "../items/ImageContainer";

interface BorrowedItemsListProps {
  items: SupabaseItem[];
  isLoading: boolean;
  error: Error | null;
}

const BorrowedItemCard = ({ item }: { item: SupabaseItem }) => {
  const formattedDate = item.created_at 
    ? format(new Date(item.created_at), "MMM d, yyyy - h:mm a")
    : "Unknown date";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 group">
      <ImageContainer 
        category={item.category} 
        name={item.name}
        itemId={item.id}
      />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{item.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
        )}
        <p className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Owner: {item.ownerName || "Unknown"}</span>
        </p>
        <p className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Borrowed on: {formattedDate}</span>
        </p>
      </CardContent>
    </Card>
  );
};

const BorrowedItemsList = ({ items, isLoading, error }: BorrowedItemsListProps) => {
  useEffect(() => {
    if (error) {
      console.error("Error in BorrowedItemsList:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg border-red-200 p-8">
        <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Borrowed Items</h3>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted p-8">
        <h3 className="text-lg font-semibold mb-2">No Borrowed Items</h3>
        <p className="text-muted-foreground">You haven't borrowed any items yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Items You've Borrowed</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <BorrowedItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BorrowedItemsList;
