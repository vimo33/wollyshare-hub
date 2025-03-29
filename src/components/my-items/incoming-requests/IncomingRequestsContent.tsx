
import React from "react";
import { IncomingRequest } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import IncomingRequestsTable from "./IncomingRequestsTable";

interface IncomingRequestsContentProps {
  requests: IncomingRequest[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  refreshRequests: () => void;
}

const IncomingRequestsContent = ({
  requests,
  isLoading,
  isError,
  error,
  refreshRequests,
}: IncomingRequestsContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error fetching incoming requests: {error.message}
      </div>
    );
  }

  if (requests.length === 0) {
    return <div className="text-gray-500">No incoming requests.</div>;
  }

  return (
    <div className="space-y-4">
      <IncomingRequestsTable requests={requests} refreshRequests={refreshRequests} />
    </div>
  );
};

export default IncomingRequestsContent;
