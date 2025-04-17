
import { supabase } from "@/integrations/supabase/client";
import { IncomingRequest } from "@/types/supabase";
import { PostgrestError } from "@supabase/supabase-js";

// Types for better organization
interface TelegramResponse {
  data: any | null;
  error: any | null;
}

// Function to update borrow request status
export const updateBorrowRequestStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected',
  userId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`Updating borrow request ${requestId} to status ${status} by user ${userId}`);
    
    // Verify the user is the owner of this request
    const { data: requestData, error: requestError } = await supabase
      .from('borrow_requests')
      .select('owner_id, item_id, borrower_id')
      .eq('id', requestId)
      .single();
    
    if (requestError) {
      console.error("Error fetching borrow request:", requestError);
      return { success: false, error: requestError };
    }
    
    if (requestData.owner_id !== userId) {
      console.error("Authorization error: User is not the owner of this request");
      return { success: false, error: "You are not authorized to update this request" };
    }
    
    // Update the status
    const { error: updateError } = await supabase
      .from('borrow_requests')
      .update({ status })
      .eq('id', requestId);
    
    if (updateError) {
      console.error(`Error updating borrow request status to ${status}:`, updateError);
      return { success: false, error: updateError };
    }
    
    console.log(`Successfully updated borrow request ${requestId} to ${status}`);
    return { success: true };
  } catch (err) {
    console.error("Error in updateBorrowRequestStatus:", err);
    return { success: false, error: err };
  }
};

// Function to send Telegram notifications
const sendTelegramNotifications = async (
  requesterId: string, 
  ownerId: string, 
  itemName: string,
  itemId: string,
  message?: string
): Promise<TelegramResponse> => {
  console.log("Preparing to send Telegram notifications for request:", {
    requesterId,
    ownerId,
    itemName,
    itemId,
    message
  });

  try {
    // Fetch requester's profile to get their username
    const { data: requesterProfile, error: requesterError } = await supabase
      .from('profiles')
      .select('username, telegram_id, telegram_username')
      .eq('id', requesterId)
      .single();
    
    if (requesterError) {
      console.error("Error fetching requester profile:", requesterError);
      return { data: null, error: requesterError };
    }
    
    // Fetch owner's profile to get their Telegram ID
    const { data: ownerProfile, error: ownerError } = await supabase
      .from('profiles')
      .select('telegram_id, telegram_username')
      .eq('id', ownerId)
      .single();
    
    if (ownerError) {
      console.error("Error fetching owner profile:", ownerError);
      return { data: null, error: ownerError };
    }
    
    // Check if both users have Telegram IDs
    const requesterTelegramId = requesterProfile?.telegram_id;
    const requesterTelegramUsername = requesterProfile?.telegram_username;
    const ownerTelegramId = ownerProfile?.telegram_id;
    const ownerTelegramUsername = ownerProfile?.telegram_username;
    
    // If either user doesn't have a Telegram ID, log a warning
    if (!requesterTelegramId && !ownerTelegramId) {
      console.warn("Missing Telegram IDs:", {
        requesterTelegramId,
        ownerTelegramId
      });
    }
    
    // Get the requester's name (username or 'Unknown User')
    const requesterName = requesterProfile?.username || 'Unknown User';
    
    console.log("Prepared notification data:", {
      requesterName,
      requesterTelegramId,
      requesterTelegramUsername,
      ownerTelegramId,
      ownerTelegramUsername
    });

    // Format message if provided
    const messageText = message ? `\nMessage from requester: "${message}"` : '';

    // Prepare messages for notification
    if (ownerTelegramId) {
      console.log(`Sending notification to owner (${ownerTelegramId})`);

      // Create message for owner with button to message requester if available
      const replyMarkup = requesterTelegramUsername ? {
        inline_keyboard: [[
          { text: "Message Requester", url: `https://t.me/${requesterTelegramUsername}` }
        ]]
      } : undefined;

      // Send notification using edge function
      const { data, error } = await supabase.functions.invoke('send-telegram-notification', {
        body: {
          chat_id: ownerTelegramId,
          text: `<b>${requesterName}</b> has requested your item <b>"${itemName}"</b>.${messageText}\n\nYou can now chat with them directly in Telegram.`,
          reply_markup: replyMarkup
        }
      });

      if (error) {
        console.error("Error sending Telegram notification to owner:", error);
        return { data: null, error };
      }

      console.log("Telegram notification to owner sent successfully:", data);
      
      // Also send notification to requester if they have Telegram ID
      if (requesterTelegramId) {
        console.log(`Sending notification to requester (${requesterTelegramId})`);
        
        // Create message for requester with button to message owner if available
        const requesterReplyMarkup = ownerTelegramUsername ? {
          inline_keyboard: [[
            { text: "Message Owner", url: `https://t.me/${ownerTelegramUsername}` }
          ]]
        } : undefined;
        
        const { data: requesterData, error: requesterError } = await supabase.functions.invoke('send-telegram-notification', {
          body: {
            chat_id: requesterTelegramId,
            text: `You requested <b>"${itemName}"</b>.\n\nThe owner has been notified. You can now chat with them directly in Telegram.`,
            reply_markup: requesterReplyMarkup
          }
        });
        
        if (requesterError) {
          console.error("Error sending Telegram notification to requester:", requesterError);
          // We don't return error here as the main notification to owner was sent
        } else {
          console.log("Telegram notification to requester sent successfully:", requesterData);
        }
      }
      
      return { data, error: null };
    } else {
      console.log("No Telegram notifications sent (missing owner Telegram ID)");
      return { data: "No notifications sent (missing Telegram IDs)", error: null };
    }
  } catch (err) {
    console.error("Error in sendTelegramNotifications:", err);
    return { data: null, error: err };
  }
};

// Create a borrow request
export const createBorrowRequest = async (
  { item_id, owner_id, message }: { item_id: string; owner_id: string; message?: string },
  requester_id: string
): Promise<TelegramResponse> => {
  console.log("Creating borrow request:", { item_id, owner_id, requester_id, message });

  try {
    // Insert the borrow request into the database
    const { data, error } = await supabase
      .from('borrow_requests')
      .insert([
        {
          item_id,
          owner_id,
          borrower_id: requester_id,
          status: 'pending',
          message: message || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating borrow request:", error);
      return { data: null, error };
    }

    // Fetch the item name for the notification
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select('name')
      .eq('id', item_id)
      .single();

    if (itemError) {
      console.error("Error fetching item name:", itemError);
      return { data: null, error: itemError };
    }

    const itemName = itemData?.name || 'Unknown Item';

    // Send Telegram notifications
    const telegramResponse = await sendTelegramNotifications(
      requester_id,
      owner_id,
      itemName,
      item_id,
      message
    );

    console.log("Borrow request created successfully:", data);
    
    // Return successful result even if telegram had issues
    if (telegramResponse.error) {
      console.error("Warning: Telegram notifications had issues:", telegramResponse.error);
      return { data, error: telegramResponse.error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error("Error in createBorrowRequest:", err);
    return { data: null, error: err };
  }
};

// Get all incoming borrow requests for the current user's items
export const getIncomingRequests = async (): Promise<IncomingRequest[]> => {
  // Get the user from local storage or session
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  if (!user) {
    console.error("User not authenticated in getIncomingRequests");
    throw new Error("User not authenticated");
  }

  try {
    console.log("Fetching incoming requests for user:", user.id);
    
    // Get all borrow requests for the current user's items
    const { data, error } = await supabase
      .from("borrow_requests")
      .select(`
        id,
        item_id,
        items:item_id (name),
        borrower_id,
        status,
        message,
        created_at
      `)
      .eq("owner_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching incoming requests:", error);
      throw error;
    }

    console.log("Incoming requests fetched:", data?.length || 0);

    // Get borrower usernames separately
    const borrowerIds = (data || []).map(request => request.borrower_id);
    const { data: borrowerProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', borrowerIds.length > 0 ? borrowerIds : ['00000000-0000-0000-0000-000000000000']);

    if (profilesError) {
      console.error("Error fetching borrower profiles:", profilesError);
    }

    // Create a map of borrower ids to usernames
    const borrowerMap = new Map();
    if (borrowerProfiles) {
      borrowerProfiles.forEach(profile => {
        borrowerMap.set(profile.id, profile.username || 'Unknown User');
      });
    }

    // Transform the data to match the IncomingRequest type
    return (data || []).map((request) => ({
      id: request.id,
      item_id: request.item_id,
      item_name: request.items?.name || 'Unknown Item',
      borrower_id: request.borrower_id,
      requester_username: borrowerMap.get(request.borrower_id) || 'Unknown User',
      start_date: '',  // Set default value as it's not in database yet
      end_date: '',    // Set default value as it's not in database yet
      status: (request.status || 'pending') as IncomingRequest['status'],
      message: request.message || '',
      created_at: request.created_at,
    }));
  } catch (err) {
    console.error("Error in getIncomingRequests:", err);
    return [];  // Return empty array on error
  }
};

