
import { useState } from "react";
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
    handleUpdateStatus
  } = useIncomingRequests(onStatusChange);

  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
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
