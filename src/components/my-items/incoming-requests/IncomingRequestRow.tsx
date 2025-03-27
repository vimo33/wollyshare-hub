
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface IncomingRequest {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  borrower_name: string;
  message: string;
  created_at: string;
}

interface IncomingRequestRowProps {
  request: IncomingRequest;
  onUpdateStatus: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
  processingRequestIds: Set<string>;
}

const IncomingRequestRow = ({ 
  request, 
  onUpdateStatus, 
  processingRequestIds 
}: IncomingRequestRowProps) => {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TableRow key={request.id}>
      <TableCell className="font-medium">{request.item_name}</TableCell>
      <TableCell>{request.borrower_name}</TableCell>
      <TableCell>{formatDate(request.created_at)}</TableCell>
      <TableCell className="max-w-xs truncate">{request.message}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            size="sm"
            className="bg-wolly-green text-green-800 hover:bg-wolly-green/80"
            disabled={processingRequestIds.has(request.id)}
            onClick={() => onUpdateStatus(request.id, 'approved')}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={processingRequestIds.has(request.id)}
            onClick={() => onUpdateStatus(request.id, 'rejected')}
          >
            Decline
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default IncomingRequestRow;
