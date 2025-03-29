
import { useEffect } from "react";
import { Item } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import ItemsGrid from "../items/ItemsGrid";

interface BorrowedItemsListProps {
  items: Item[];
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Items You've Borrowed</h3>
      <ItemsGrid items={items} />
    </div>
  );
};

export default BorrowedItemsList;
