
import { Search } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No items found</h3>
      <p className="text-muted-foreground">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
};

export default EmptyState;
