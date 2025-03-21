
import { Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EmptyItemsState = () => {
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
};

export default EmptyItemsState;
