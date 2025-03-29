
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import IncomingRequestsTable from "./IncomingRequestsTable";
import { Skeleton } from "@/components/ui/skeleton";

interface IncomingRequest {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  borrower_name: string;
  message: string;
  created_at: string;
}

interface IncomingRequestsContentProps {
  isOpen: boolean;
  isLoading: boolean;
  incomingRequests: IncomingRequest[];
  processingRequestIds: Set<string>;
  onUpdateStatus: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
}

const IncomingRequestsContent = ({
  isOpen,
  isLoading,
  incomingRequests,
  processingRequestIds,
  onUpdateStatus
}: IncomingRequestsContentProps) => {
  return (
    <CollapsibleContent>
      {isLoading ? (
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : incomingRequests.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          You have no pending borrow requests.
        </div>
      ) : (
        <IncomingRequestsTable 
          requests={incomingRequests}
          onUpdateStatus={onUpdateStatus}
          processingRequestIds={processingRequestIds}
        />
      )}
    </CollapsibleContent>
  );
};

export default IncomingRequestsContent;
