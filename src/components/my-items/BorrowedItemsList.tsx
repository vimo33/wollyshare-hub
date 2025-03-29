
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ItemsGrid from "../items/ItemsGrid";
import { Item as SupabaseItem } from "@/types/supabase";
import { Item as ItemType } from "@/types/item";

interface BorrowedItemsListProps {
  items: SupabaseItem[];
  isLoading: boolean;
  error: Error | null;
}

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

  // Map Supabase items to ItemType items expected by ItemsGrid
  const mappedItems: ItemType[] = items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    image_url: item.image_url,
    user_id: item.user_id,
    weekday_availability: item.weekday_availability,
    weekend_availability: item.weekend_availability,
    location: item.location,
    condition: item.condition,
    ownerName: item.ownerName,
    locationAddress: item.locationAddress,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Items You've Borrowed</h3>
      <ItemsGrid items={mappedItems} />
    </div>
  );
};

export default BorrowedItemsList;
