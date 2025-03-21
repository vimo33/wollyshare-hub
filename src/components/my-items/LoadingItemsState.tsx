
import { Loader2 } from "lucide-react";

const LoadingItemsState = () => {
  return (
    <div className="text-center py-12 flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading your items...</p>
    </div>
  );
};

export default LoadingItemsState;
