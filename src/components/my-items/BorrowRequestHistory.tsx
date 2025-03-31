
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar } from "lucide-react";

interface BorrowRequest {
  id: string;
  item_id: string;
  item_name: string;
  borrower_id: string;
  borrower_name: string;
  status: string;
  created_at: string;
}

const BorrowRequestCard = ({ request }: { request: BorrowRequest }) => {
  const formattedDate = request.created_at 
    ? format(new Date(request.created_at), "MMM d, yyyy - h:mm a")
    : "Unknown date";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{request.item_name}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <p className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Shared with: {request.borrower_name || "Unknown"}</span>
        </p>
        <p className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Requested on: {formattedDate}</span>
        </p>
      </CardContent>
    </Card>
  );
};

const BorrowRequestHistory = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!user) {
          setRequests([]);
          return;
        }

        setIsLoading(true);
        const { data: borrowRequests, error: requestsError } = await supabase
          .from("borrow_requests")
          .select("id, item_id, status, created_at, borrower_id")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (requestsError) throw requestsError;

        // If no requests, return early
        if (!borrowRequests || borrowRequests.length === 0) {
          setRequests([]);
          setIsLoading(false);
          return;
        }

        // Get item details
        const itemIds = borrowRequests.map(req => req.item_id);
        const { data: items, error: itemsError } = await supabase
          .from("items")
          .select("id, name")
          .in("id", itemIds);

        if (itemsError) throw itemsError;
        
        // Get borrower names
        const borrowerIds = borrowRequests.map(req => req.borrower_id);
        const { data: borrowers, error: borrowersError } = await supabase
          .from("profiles")
          .select("id, username, full_name")
          .in("id", borrowerIds);

        if (borrowersError) throw borrowersError;

        // Create a map for easy lookup
        const itemMap = new Map();
        items?.forEach(item => itemMap.set(item.id, item.name));
        
        const borrowerMap = new Map();
        borrowers?.forEach(borrower => {
          const displayName = borrower.username || borrower.full_name || "Unknown";
          borrowerMap.set(borrower.id, displayName);
        });

        // Combine data
        const enrichedRequests = borrowRequests.map(request => ({
          id: request.id,
          item_id: request.item_id,
          item_name: itemMap.get(request.item_id) || "Unknown Item",
          borrower_id: request.borrower_id,
          borrower_name: borrowerMap.get(request.borrower_id) || "Unknown User",
          status: request.status,
          created_at: request.created_at
        }));

        setRequests(enrichedRequests);
      } catch (err: any) {
        console.error("Error fetching borrow requests:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted p-8">
        <h3 className="text-lg font-semibold mb-2">No Shared Items</h3>
        <p className="text-muted-foreground">You haven't shared any items yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Items You've Shared</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map(request => (
          <BorrowRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
};

export default BorrowRequestHistory;
