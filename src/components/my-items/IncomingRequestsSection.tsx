import React from "react";
import IncomingRequestsHeader from "./incoming-requests/IncomingRequestsHeader";
import IncomingRequestsContent from "./incoming-requests/IncomingRequestsContent";
import { IncomingRequest } from "@/types";

interface IncomingRequestsSectionProps {
  requests: IncomingRequest[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  refreshRequests: () => void; // Add refresh function
}

const IncomingRequestsSection = ({
  requests,
  isLoading,
  isError,
  error,
  refreshRequests, // Include in props
}: IncomingRequestsSectionProps) => {
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <IncomingRequestsHeader count={requests.length} />
      <IncomingRequestsContent
        requests={requests}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refreshRequests={refreshRequests} // Pass to content
      />
    </div>
  );
};

export default IncomingRequestsSection;
