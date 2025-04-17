
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IncomingRequest } from "@/types/supabase";
import { updateBorrowRequestStatus } from "@/services/borrowRequestService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface IncomingRequestsTableProps {
  requests: IncomingRequest[];
  refreshRequests: () => void;
}

const IncomingRequestsTable = ({ 
  requests,
  refreshRequests,
}: IncomingRequestsTableProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [processingIds, setProcessingIds] = React.useState<Set<string>>(new Set());

  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update request status",
      });
      return;
    }

    try {
      setProcessingIds(prev => new Set(prev).add(requestId));
      
      const { success, error } = await updateBorrowRequestStatus(requestId, status, user.id);
      
      if (success) {
        toast({
          title: status === 'approved' ? "Request approved!" : "Request declined",
          description: status === 'approved' 
            ? "The borrower has been notified." 
            : "The request has been declined.",
        });
        
        // Refresh the requests list
        refreshRequests();
      } else {
        throw new Error(error?.message || "Failed to update request");
      }
    } catch (error: any) {
      console.error(`Error ${status} request:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} request: ${error.message}`,
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>A list of your incoming requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Requester</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No incoming requests found.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.requester_username}</TableCell>
                <TableCell>{request.item_name}</TableCell>
                <TableCell>{formatDate(request.created_at)}</TableCell>
                <TableCell className="max-w-xs truncate">{request.message || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-2 justify-end">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700" 
                      disabled={processingIds.has(request.id)}
                      onClick={() => handleUpdateStatus(request.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={processingIds.has(request.id)}
                      onClick={() => handleUpdateStatus(request.id, 'rejected')}
                    >
                      Decline
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default IncomingRequestsTable;
