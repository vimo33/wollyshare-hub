
import { supabase } from "@/integrations/supabase/client";

// Interface for borrow request data
interface BorrowRequestData {
  item_id: string;
  owner_id: string;
  message: string;
}

// Send Telegram notifications to both owner and borrower
const sendTelegramNotifications = async (
  requesterId: string, 
  ownerId: string, 
  itemName: string,
  itemId: string
) => {
  console.log("Preparing to send Telegram notifications for request:", {
    requesterId,
    ownerId,
    itemName,
    itemId
  });

  try {
    // Get telegram_id, telegram_username and user details for requester and owner
    const [requesterResult, ownerResult] = await Promise.all([
      supabase.from('profiles').select('telegram_id, telegram_username, username, full_name').eq('id', requesterId).single(),
      supabase.from('profiles').select('telegram_id, telegram_username, username, full_name').eq('id', ownerId).single()
    ]);

    console.log("Retrieved profile data:", {
      requester: requesterResult.data,
      requesterError: requesterResult.error,
      owner: ownerResult.data,
      ownerError: ownerResult.error
    });

    if (requesterResult.error) {
      console.error("Error fetching requester data:", requesterResult.error);
    }
    
    if (ownerResult.error) {
      console.error("Error fetching owner data:", ownerResult.error);
    }

    const requesterTelegramId = requesterResult.data?.telegram_id;
    const ownerTelegramId = ownerResult.data?.telegram_id;
    const requesterName = requesterResult.data?.full_name || requesterResult.data?.username || 'Someone';
    const ownerName = ownerResult.data?.full_name || ownerResult.data?.username || 'the owner';
    const requesterUsername = requesterResult.data?.telegram_username;
    const ownerUsername = ownerResult.data?.telegram_username;

    if (!requesterTelegramId && !ownerTelegramId) {
      console.warn('No Telegram IDs found for requester or owner - skipping notifications');
      return;
    }

    console.log('Sending notifications to:', {
      requester: { 
        id: requesterId, 
        telegramId: requesterTelegramId,
        telegramUsername: requesterUsername,
        name: requesterName 
      },
      owner: { 
        id: ownerId, 
        telegramId: ownerTelegramId,
        telegramUsername: ownerUsername,
        name: ownerName 
      }
    });

    // Prepare messages with direct message buttons
    const messages = [];

    if (requesterTelegramId) {
      // Add reply_markup with inline keyboard if owner has a username
      const replyMarkup = ownerUsername ? {
        inline_keyboard: [[
          { text: "Message Owner", url: `https://t.me/${ownerUsername}` }
        ]]
      } : undefined;

      messages.push({ 
        chat_id: requesterTelegramId, 
        text: `You requested <b>"${itemName}"</b>.\n\nThe owner, ${ownerName}, has been notified. You can now chat with them directly in Telegram.`,
        reply_markup: replyMarkup
      });
    }

    if (ownerTelegramId) {
      // Add reply_markup with inline keyboard if requester has a username
      const replyMarkup = requesterUsername ? {
        inline_keyboard: [[
          { text: "Message Requester", url: `https://t.me/${requesterUsername}` }
        ]]
      } : undefined;

      messages.push({ 
        chat_id: ownerTelegramId, 
        text: `<b>${requesterName}</b> has requested your item <b>"${itemName}"</b>.\n\nThey've been notified about their request. You can now chat with them directly in Telegram.`,
        reply_markup: replyMarkup
      });
    }

    console.log('Prepared messages for sending:', JSON.stringify(messages.map(m => ({
      ...m,
      has_reply_markup: !!m.reply_markup
    }))));

    // Send all messages and collect results
    const results = await Promise.all(messages.map(async (msg) => {
      console.log(`Sending notification to chat_id: ${msg.chat_id} with reply markup: ${msg.reply_markup ? 'yes' : 'no'}`);
      try {
        const result = await supabase.functions.invoke('send-telegram-notification', {
          body: msg
        });
        console.log(`Notification result for ${msg.chat_id}:`, result);
        return result;
      } catch (err) {
        console.error(`Error sending notification to ${msg.chat_id}:`, err);
        return { error: err };
      }
    }));

    console.log('All notification results:', results);
    return results;
  } catch (error) {
    console.error('Error in sendTelegramNotifications:', error);
    return { error };
  }
};

// Create a new borrow request
export const createBorrowRequest = async (requestData: BorrowRequestData, userId: string) => {
  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  // Always fetch the current auth user directly from Supabase to ensure the most recent session
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Auth verification error:", authError);
    throw new Error(`Authentication verification failed: ${authError.message}`);
  }
  
  if (!authData.user) {
    console.error("No authenticated user found in current session");
    throw new Error("Authentication required. Please log in again.");
  }
  
  // Log the verification process
  console.log("Auth verification - provided userId:", userId);
  console.log("Auth verification - current session userId:", authData.user.id);
  
  // Always use the Supabase auth user ID to ensure RLS compatibility
  const currentUserId = authData.user.id;
  
  console.log("Creating borrow request with verified userId:", currentUserId);
  console.log("Request data:", requestData);

  // Create the payload with the correct schema fields, focusing on borrower_id which is used in RLS
  const payload = {
    item_id: requestData.item_id,
    owner_id: requestData.owner_id,
    message: requestData.message,
    borrower_id: currentUserId, // Required for NOT NULL constraint and RLS policy
    status: "pending",
  };

  console.log("Final payload for insert:", payload);

  try {
    // Get the item details for notification
    const { data: itemData, error: itemError } = await supabase
      .from("items")
      .select("name")
      .eq("id", requestData.item_id)
      .single();

    if (itemError) {
      console.error("Error fetching item details:", itemError);
      throw itemError;
    }

    console.log("Retrieved item data for notification:", itemData);

    // Insert the borrow request
    const { data, error } = await supabase
      .from("borrow_requests")
      .insert(payload)
      .select();

    if (error) {
      console.error("Error creating borrow request:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error("Request payload:", JSON.stringify(payload, null, 2));
      throw error;
    }

    console.log("Successfully created borrow request:", data);

    // Send notifications after successful request creation
    console.log("Sending Telegram notifications for new request");
    const notificationResults = await sendTelegramNotifications(
      currentUserId,
      requestData.owner_id,
      itemData.name,
      requestData.item_id
    );
    
    console.log("Notification process completed:", notificationResults);
    
    // Explicitly update the borrow_requests table status to trigger realtime updates
    await supabase
      .from("borrow_requests")
      .update({ status: "pending" }) // Redundant update to trigger realtime events
      .eq("id", data[0].id);
    
    return data;
  } catch (error) {
    console.error("Error in createBorrowRequest:", error);
    throw error;
  }
};

// Get borrow requests for a specific item
export const getBorrowRequests = async (itemId: string) => {
  const { data, error } = await supabase
    .from("borrow_requests")
    .select(`
      id, 
      item_id, 
      borrower_id, 
      profiles:borrower_id (username, full_name),
      owner_id,
      status,
      message,
      created_at
    `)
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching borrow requests:", error);
    throw error;
  }

  return data;
};

// Update a borrow request status
export const updateBorrowRequestStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected' | 'cancelled',
  userId: string
) => {
  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  console.log("Updating borrow request status:", { requestId, status, userId });

  const { data, error } = await supabase
    .from("borrow_requests")
    .update({ status })
    .eq("id", requestId)
    .select();

  if (error) {
    console.error("Error updating borrow request:", error);
    throw error;
  }

  console.log("Successfully updated borrow request status:", data);
  return data;
};
