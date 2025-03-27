
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IncomingRequestRow from "./IncomingRequestRow";

interface IncomingRequest {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  borrower_name: string;
  message: string;
  created_at: string;
}

interface IncomingRequestsTableProps {
  requests: IncomingRequest[];
  onUpdateStatus: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
  processingRequestIds: Set<string>;
}

const IncomingRequestsTable = ({ 
  requests, 
  onUpdateStatus, 
  processingRequestIds 
}: IncomingRequestsTableProps) => {
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <IncomingRequestRow 
              key={request.id}
              request={request}
              onUpdateStatus={onUpdateStatus}
              processingRequestIds={processingRequestIds}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default IncomingRequestsTable;
