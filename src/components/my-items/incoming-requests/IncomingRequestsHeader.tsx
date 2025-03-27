
import { ChevronDown, ChevronUp } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface IncomingRequestsHeaderProps {
  isOpen: boolean;
}

const IncomingRequestsHeader = ({ isOpen }: IncomingRequestsHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-muted/50 md:p-4 p-3 flex items-center justify-between cursor-pointer rounded-t-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>
          {isMobile ? 'Incoming Requests' : 'Incoming Borrow Requests'}
        </h3>
        {isOpen ? 
          <ChevronUp className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} /> : 
          <ChevronDown className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
        }
      </CollapsibleTrigger>
    </div>
  );
};

export default IncomingRequestsHeader;
