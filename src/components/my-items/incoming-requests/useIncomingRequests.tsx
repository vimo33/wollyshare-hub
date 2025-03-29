
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { IncomingRequest } from "@/types/supabase";
import { getIncomingRequests } from "@/services/itemService";

export const useIncomingRequests = () => {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);
  const { user } = useAuth();

  const fetchIncomingRequests = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      if (!user) {
        throw new Error("Not authenticated");
      }

      const incomingRequests = await getIncomingRequests();
      setRequests(incomingRequests);
    } catch (error: any) {
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, [user]);

  return {
    requests,
    isLoading,
    isError,
    error,
    fetchIncomingRequests, // Export the fetch function
  };
};
