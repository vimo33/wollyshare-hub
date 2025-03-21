
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type BorrowRequest = {
  id: string;
  item_id: string;
  borrower_id: string;
  owner_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message: string;
  created_at: string;
  updated_at: string;
};

export const createBorrowRequest = async (
  item_id: string,
  owner_id: string,
  message: string
): Promise<{ success: boolean; data?: BorrowRequest; error?: string }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'You must be logged in to request items' };
    }

    const { data, error } = await supabase
      .from('borrow_requests')
      .insert({
        item_id,
        owner_id,
        borrower_id: userData.user.id,
        message,
        status: 'pending'
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating borrow request:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as BorrowRequest };
  } catch (error: any) {
    console.error('Error in createBorrowRequest:', error);
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
};

export const getBorrowRequests = async (): Promise<BorrowRequest[]> => {
  const { data, error } = await supabase
    .from('borrow_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching borrow requests:', error);
    throw new Error(error.message);
  }

  return data as BorrowRequest[];
};

export const updateBorrowRequestStatus = async (
  requestId: string,
  status: 'approved' | 'rejected' | 'cancelled'
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('borrow_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) {
    console.error('Error updating borrow request:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};
