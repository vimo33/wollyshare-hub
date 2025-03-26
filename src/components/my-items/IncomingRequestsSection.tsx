
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { updateBorrowRequestStatus } from "@/services/borrowRequestService";

interface IncomingRequest {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  borrower_name: string;
  message: string;
  created_at: string;
}

interface IncomingRequestsSectionProps {
  onStatusChange: () => void;
}

const IncomingRequestsSection = ({ onStatusChange }: IncomingRequestsSectionProps) => {
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [processingRequestIds, setProcessingRequestIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchIncomingRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('borrow_requests')
        .select(`
          id,
          item_id,
          borrower_id,
          message,
          created_at,
          items:item_id(name),
          profiles:borrower_id(username, full_name)
        `)
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'pending');

      if (error) throw error;

      const formattedRequests: IncomingRequest[] = data.map(request => ({
        id: request.id,
        item_id: request.item_id,
        item_name: request.items?.name || 'Unknown Item',
        borrower_id: request.borrower_id,
        borrower_name: request.profiles?.username || request.profiles?.full_name || 'Unknown User',
        message: request.message || '',
        created_at: request.created_at,
      }));

      setIncomingRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
      toast({
        title: "Error loading requests",
        description: "Failed to load incoming requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    // Add this request to processing state
    setProcessingRequestIds(prev => new Set(prev).add(requestId));
    
    try {
      const result = await updateBorrowRequestStatus(requestId, status);
      
      if (result.success) {
        // Update the local state to remove this request
        setIncomingRequests(prev => prev.filter(request => request.id !== requestId));
        
        // Show success message
        toast({
          title: `Request ${status}`,
          description: `You have ${status} the borrow request.`,
        });
        
        // Trigger parent refresh
        onStatusChange();
      } else {
        throw new Error(result.error || `Failed to ${status} request`);
      }
    } catch (error: any) {
      console.error(`Error ${status} request:`, error);
      toast({
        title: "Error",
        description: error.message || `An error occurred when trying to ${status} the request.`,
        variant: "destructive"
      });
    } finally {
      // Remove from processing state
      setProcessingRequestIds(prev => {
        const updated = new Set(prev);
        updated.delete(requestId);
        return updated;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-muted/50 p-4 flex items-center justify-between cursor-pointer">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="text-lg font-medium">Incoming Borrow Requests</h3>
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          {isLoading ? (
            <div className="p-4 text-center">Loading incoming requests...</div>
          ) : incomingRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              You have no pending borrow requests.
            </div>
          ) : (
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
                  {incomingRequests.map((request) => (
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
                            onClick={() => handleUpdateStatus(request.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingRequestIds.has(request.id)}
                            onClick={() => handleUpdateStatus(request.id, 'rejected')}
                          >
                            Decline
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default IncomingRequestsSection;
