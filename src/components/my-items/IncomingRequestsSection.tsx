
import React from "react";
import IncomingRequestsHeader from "./incoming-requests/IncomingRequestsHeader";
import IncomingRequestsContent from "./incoming-requests/IncomingRequestsContent";
import { useIncomingRequests } from "./incoming-requests/useIncomingRequests";

const IncomingRequestsSection = () => {
  const { requests, isLoading, isError, error, fetchIncomingRequests } = useIncomingRequests();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <IncomingRequestsHeader count={requests.length} />
      <IncomingRequestsContent
        requests={requests}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refreshRequests={fetchIncomingRequests}
      />
    </div>
  );
};

export default IncomingRequestsSection;
