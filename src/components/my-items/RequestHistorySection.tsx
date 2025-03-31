
import React, { useState } from "react";
import { useBorrowRequestHistory } from "@/hooks/useBorrowRequestHistory";
import { Button } from "@/components/ui/button";
import { BorrowRequestWithDetails } from "@/types/supabase";
import { RefreshCw, Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const RequestHistoryRow = ({ request }: { request: BorrowRequestWithDetails }) => {
  const formattedDate = format(new Date(request.created_at), "MMM d, yyyy 'at' h:mm a");
  const userName = request.borrower_id === request.owner_id ? request.owner_name : request.borrower_name || "Unknown"; 
  
  return (
    <Card className="mb-2">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{request.item_name}</CardTitle>
            <CardDescription className="text-xs flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {formattedDate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <p className="text-sm flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">Shared with: </span> 
          <span className="ml-1">{userName}</span>
        </p>
        {request.message && (
          <p className="text-sm mt-2 text-gray-600 italic">"{request.message}"</p>
        )}
      </CardContent>
    </Card>
  );
};

interface EmptyRequestHistoryProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const EmptyRequestHistory = ({
  onRefresh,
  isLoading,
}: EmptyRequestHistoryProps) => (
  <div className="text-center p-6 border rounded-lg border-dashed border-gray-300">
    <p className="text-muted-foreground mb-4">No shared items found</p>
    <Button
      variant="outline"
      size="sm"
      onClick={onRefresh}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Refreshing...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </>
      )}
    </Button>
  </div>
);

const RequestHistorySection = () => {
  const {
    requests,
    isLoading,
    error,
    refetchRequests,
  } = useBorrowRequestHistory();
  const [showAll, setShowAll] = useState(false);

  const displayedRequests = showAll
    ? requests
    : requests.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Shared Items</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={refetchRequests}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500">Error loading history</p>
          <Button
            variant="outline"
            size="sm"
            onClick={refetchRequests}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : requests.length === 0 ? (
        <EmptyRequestHistory onRefresh={refetchRequests} isLoading={isLoading} />
      ) : (
        <>
          <div className="space-y-3">
            {displayedRequests.map((request) => (
              <RequestHistoryRow key={request.id} request={request} />
            ))}
          </div>

          {requests.length > 3 && (
            <Button
              variant="link"
              className="mt-4 w-full"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show All (${requests.length})`}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default RequestHistorySection;
