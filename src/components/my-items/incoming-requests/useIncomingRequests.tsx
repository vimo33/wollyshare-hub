
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { IncomingRequest } from "@/types/supabase";
import { getIncomingRequests } from "@/services/itemService";

export const useIncomingRequests = () => {
  const { user } = useAuth();
  
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
    refetch: fetchIncomingRequests
  } = useQuery({
    queryKey: ['incomingRequests'],
    queryFn: getIncomingRequests,
    enabled: !!user,
  });

  return {
    requests,
    isLoading,
    isError,
    error,
    fetchIncomingRequests,
  };
};
