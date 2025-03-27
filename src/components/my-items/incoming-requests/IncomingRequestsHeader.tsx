
import { ChevronDown, ChevronUp } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";

interface IncomingRequestsHeaderProps {
  isOpen: boolean;
}

const IncomingRequestsHeader = ({ isOpen }: IncomingRequestsHeaderProps) => {
  return (
    <div className="bg-muted/50 p-4 flex items-center justify-between cursor-pointer">
      <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
        <h3 className="text-lg font-medium">Incoming Borrow Requests</h3>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </CollapsibleTrigger>
    </div>
  );
};

export default IncomingRequestsHeader;
