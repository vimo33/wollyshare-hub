
import { useState, useEffect } from "react";
import { useBorrowRequestHistory } from "@/hooks/useBorrowRequestHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const RequestHistoryCard = ({ request }) => {
  const formattedDate = format(new Date(request.created_at), "MMM d, yyyy h:mm a");
  
  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{request.item_name}</CardTitle>
            <CardDescription className="text-xs flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {formattedDate}
            </CardDescription>
          </div>
          <Badge className={getStatusBadgeVariant(request.status)}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <p className="text-sm">
          <span className="font-medium">{request.type === "outgoing" ? "Owner" : "Borrower"}:</span> {request.type === "outgoing" ? request.owner_name : request.requester_username}
        </p>
        {request.message && (
          <p className="text-sm mt-2 text-gray-600 italic">"{request.message}"</p>
        )}
      </CardContent>
    </Card>
  );
};

const BorrowRequestHistory = () => {
  const { requests, isLoading, error, refetchRequests } = useBorrowRequestHistory();
  const [showAll, setShowAll] = useState(false);

  const displayedRequests = showAll ? requests : requests.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg border-red-200 p-8">
        <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Request History</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={refetchRequests}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted p-8">
        <h3 className="text-lg font-semibold mb-2">No Borrow Requests Yet</h3>
        <p className="text-muted-foreground">Your borrow request history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Borrow Request History</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={refetchRequests}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {displayedRequests.map((request) => (
          <RequestHistoryCard key={request.id} request={request} />
        ))}
      </div>

      {requests.length > 5 && (
        <Button
          variant="link"
          className="mt-4 w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : `Show All (${requests.length})`}
        </Button>
      )}
    </div>
  );
};

export default BorrowRequestHistory;
