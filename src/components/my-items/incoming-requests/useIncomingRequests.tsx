
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { IncomingRequest } from "@/types/supabase";
import { getIncomingRequests } from "@/services/borrowRequestService";

export const useIncomingRequests = () => {
  const { user } = useAuth();
  
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
    refetch: fetchIncomingRequests
  } = useQuery({
    queryKey: ['incomingRequests', user?.id],
    queryFn: getIncomingRequests,
    enabled: !!user,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    requests,
    isLoading,
    isError,
    error,
    fetchIncomingRequests,
  };
};
