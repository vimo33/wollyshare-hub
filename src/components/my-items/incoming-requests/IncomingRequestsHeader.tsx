
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface IncomingRequestsHeaderProps {
  count: number;
}

const IncomingRequestsHeader = ({ count }: IncomingRequestsHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-muted/50 md:p-4 p-3 flex items-center justify-between rounded-t-lg">
      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>
        Incoming Borrow Requests {count > 0 && `(${count})`}
      </h3>
    </div>
  );
};

export default IncomingRequestsHeader;
