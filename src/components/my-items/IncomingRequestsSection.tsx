
import { useState, useEffect } from "react";
import { Collapsible } from "@/components/ui/collapsible";
import IncomingRequestsHeader from "./incoming-requests/IncomingRequestsHeader";
import IncomingRequestsContent from "./incoming-requests/IncomingRequestsContent";
import { useIncomingRequests } from "./incoming-requests/useIncomingRequests";

interface IncomingRequestsSectionProps {
  onStatusChange: () => void;
}

const IncomingRequestsSection = ({ onStatusChange }: IncomingRequestsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const {
    incomingRequests,
    isLoading,
    processingRequestIds,
    handleUpdateStatus,
    fetchIncomingRequests
  } = useIncomingRequests(onStatusChange);

  // Re-fetch on mount to ensure we have the latest data
  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  return (
    <div className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <IncomingRequestsHeader isOpen={isOpen} />
        <IncomingRequestsContent 
          isOpen={isOpen}
          isLoading={isLoading}
          incomingRequests={incomingRequests}
          processingRequestIds={processingRequestIds}
          onUpdateStatus={handleUpdateStatus}
        />
      </Collapsible>
    </div>
  );
};

export default IncomingRequestsSection;
