
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface BorrowRequest {
  id: string;
  item_id: string;
  item_name: string;
  owner_id: string;
  owner_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message: string;
  created_at: string;
}

const BorrowRequestHistory = () => {
  const [requestHistory, setRequestHistory] = useState<BorrowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const fetchRequestHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('borrow_requests')
        .select(`
          id,
          item_id,
          owner_id,
          status,
          message,
          created_at,
          items:item_id(name),
          profiles:owner_id(username, full_name)
        `)
        .eq('borrower_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests: BorrowRequest[] = data.map(request => ({
        id: request.id,
        item_id: request.item_id,
        item_name: request.items?.name || 'Unknown Item',
        owner_id: request.owner_id,
        owner_name: request.profiles?.username || request.profiles?.full_name || 'Unknown User',
        status: request.status,
        message: request.message || '',
        created_at: request.created_at,
      }));

      setRequestHistory(formattedRequests);
    } catch (error) {
      console.error('Error fetching request history:', error);
      toast({
        title: "Error loading history",
        description: "Failed to load your request history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Declined</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-muted/50 p-4 flex items-center justify-between cursor-pointer">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="text-lg font-medium">My Borrow Requests</h3>
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          {isLoading ? (
            <div className="p-4 text-center">Loading your request history...</div>
          ) : requestHistory.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              You haven't requested to borrow any items yet.
            </div>
          ) : (
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestHistory.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.item_name}</TableCell>
                      <TableCell>{request.owner_name}</TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.message}</TableCell>
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

export default BorrowRequestHistory;
