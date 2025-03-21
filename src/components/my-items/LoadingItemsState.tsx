
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingItemsState = () => {
  return (
    <div className="space-y-8">
      <div className="text-center py-6 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your items...</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((key) => (
          <div key={key} className="rounded-xl border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-5 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="pt-4 flex justify-between">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingItemsState;
