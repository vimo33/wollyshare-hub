
import { supabase } from '@/integrations/supabase/client';

export interface ConnectionStatus {
  isConnected: boolean;
  error?: string;
  latency?: number;
}

export const checkSupabaseConnection = async (): Promise<ConnectionStatus> => {
  const startTime = Date.now();
  
  try {
    console.log('Checking Supabase connection health...');
    
    // Simple health check query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    const latency = Date.now() - startTime;
    
    if (error) {
      console.error('Connection health check failed:', error);
      return {
        isConnected: false,
        error: error.message,
        latency
      };
    }
    
    console.log(`Connection health check passed in ${latency}ms`);
    return {
      isConnected: true,
      latency
    };
  } catch (err: any) {
    const latency = Date.now() - startTime;
    console.error('Connection health check error:', err);
    return {
      isConnected: false,
      error: err.message || 'Unknown connection error',
      latency
    };
  }
};

export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} for operation`);
      }
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.error(`Operation failed on attempt ${attempt + 1}:`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};
