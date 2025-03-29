
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types/item";
import { Skeleton } from "@/components/ui/skeleton";
import ItemsGrid from "../items/ItemsGrid";

const BorrowedItemsList = () => {
  const [borrowedItems, setBorrowedItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBorrowedItems();
    }
  }, [user]);

  const fetchBorrowedItems = async () => {
    try {
      setIsLoading(true);
      
      // Get all approved borrow requests by the current user
      const { data: approvedRequests, error: requestsError } = await supabase
        .from('borrow_requests')
        .select('item_id, owner_id')
        .eq('borrower_id', user?.id)
        .eq('status', 'approved');
        
      if (requestsError) throw requestsError;
      
      if (approvedRequests && approvedRequests.length > 0) {
        // Get item details for each borrowed item
        const itemIds = approvedRequests.map(request => request.item_id);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select(`
            id, 
            name, 
            category, 
            description, 
            image_url, 
            weekday_availability, 
            weekend_availability,
            user_id
          `)
          .in('id', itemIds);
          
        if (itemsError) throw itemsError;
        
        // Get owner details (username/profile) for display
        if (itemsData && itemsData.length > 0) {
          const ownerIds = [...new Set(itemsData.map(item => item.user_id))];
          
          const { data: ownersData, error: ownersError } = await supabase
            .from('profiles')
            .select('id, username, full_name')
            .in('id', ownerIds);
            
          if (ownersError) throw ownersError;
          
          // Map owner names to items
          const itemsWithOwners = itemsData.map(item => {
            const owner = ownersData?.find(owner => owner.id === item.user_id);
            const ownerName = owner?.username || owner?.full_name || 'Unknown User';
            
            return {
              ...item,
              ownerName,
              location: "Owner's Location", // We could fetch actual location if needed
              locationAddress: undefined
            };
          });
          
          setBorrowedItems(itemsWithOwners);
        } else {
          setBorrowedItems([]);
        }
      } else {
        setBorrowedItems([]);
      }
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
      setBorrowedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your borrowed items.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (borrowedItems.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted p-8">
        <h3 className="text-lg font-semibold mb-2">No Borrowed Items</h3>
        <p className="text-muted-foreground">You haven't borrowed any items yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Items You've Borrowed</h3>
      <ItemsGrid items={borrowedItems} />
    </div>
  );
};

export default BorrowedItemsList;
