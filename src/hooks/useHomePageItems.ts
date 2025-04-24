
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useHomePageItems = () => {
  const { user } = useAuth();
  const [totalItems, setTotalItems] = useState(0);
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Count total items
      const { count: itemsCount, error: itemsError } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true });

      if (itemsError) throw itemsError;
      
      setTotalItems(itemsCount || 0);

      // Count total borrows (all approved borrow requests)
      const { count: borrowsCount, error: borrowsError } = await supabase
        .from("borrow_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      if (borrowsError) throw borrowsError;
      
      setTotalBorrows(borrowsCount || 0);

    } catch (err: any) {
      console.error("Error fetching home page stats:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    totalItems,
    totalBorrows,
    isLoading,
    error,
    refetchStats: fetchStats
  };
};
