import { supabase } from "@/integrations/supabase/client";
import { IncomingRequest } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

// Types for better organization
interface TelegramResponse {
  data: any;
  error: any;
}

// Function to send Telegram notifications
const sendTelegramNotifications = async (
  requesterId: string, 
  ownerId: string, 
  itemName: string,
  itemId: string,
  message?: string
) => {
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
      return { error: requesterError };
    }
    
    // Fetch owner's profile to get their Telegram ID
    const { data: ownerProfile, error: ownerError } = await supabase
      .from('profiles')
      .select('telegram_id, telegram_username')
      .eq('id', ownerId)
      .single();
    
    if (ownerError) {
      console.error("Error fetching owner profile:", ownerError);
      return { error: ownerError };
    }
    
    // Check if both users have Telegram IDs
    const requesterTelegramId = requesterProfile?.telegram_id;
    const requesterTelegramUsername = requesterProfile?.telegram_username;
    const ownerTelegramId = ownerProfile?.telegram_id;
    const ownerTelegramUsername = ownerProfile?.telegram_username;
    
    // If either user doesn't have a Telegram ID, log a warning
    if (!requesterTelegramId || !ownerTelegramId) {
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

    // Prepare Telegram Chat inline keyboard markup for both users
    let replyMarkup = undefined;

    if (requesterTelegramUsername && ownerTelegramUsername) {
      // Both users have Telegram usernames, create direct message buttons
      replyMarkup = {
        inline_keyboard: [
          [
            {
              text: "Open chat",
              url: `https://t.me/${requesterTelegramUsername}`
            }
          ]
        ]
      };
    }

    // Format message if provided
    const messageText = message ? `\nMessage from requester: "${message}"` : '';

    // Prepare messages with direct message buttons
    const messages = [];

    // Notification to owner
    if (ownerTelegramId) {
      console.log(`Sending notification to owner (${ownerTelegramId})`);

      messages.push({ 
        chat_id: ownerTelegramId, 
        text: `<b>${requesterName}</b> has requested your item <b>"${itemName}"</b>.${messageText}\n\nYou can now chat with them directly in Telegram.`,
        reply_markup: replyMarkup
      });
    }

    // Only send if we have messages to send
    if (messages.length > 0) {
      // Send notifications using edge function
      const { data, error } = await supabase.functions.invoke('send-telegram-notification', {
        body: { messages }
      });

      if (error) {
        console.error("Error sending Telegram notifications:", error);
        return { error };
      }

      console.log("Telegram notifications sent successfully:", data);
      return { data };
    } else {
      console.log("No Telegram notifications to send (missing Telegram IDs)");
      return { data: "No notifications sent (missing Telegram IDs)" };
    }
  } catch (err) {
    console.error("Error in sendTelegramNotifications:", err);
    return { error: err };
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
      return { error };
    }

    // Fetch the item name for the notification
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select('name')
      .eq('id', item_id)
      .single();

    if (itemError) {
      console.error("Error fetching item name:", itemError);
      return { error: itemError };
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

    if (telegramResponse.error) {
      console.error("Error sending Telegram notifications:", telegramResponse.error);
      // Do not return here, continue to return the borrow request data
    }

    console.log("Borrow request created successfully:", data);
    return { data };
  } catch (err) {
    console.error("Error in createBorrowRequest:", err);
    return { error: err };
  }
};

// Get all incoming borrow requests for the current user's items
export const getIncomingRequests = async (): Promise<IncomingRequest[]> => {
  // Get the user from local storage or session
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
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

    // Get borrower usernames separately
    const borrowerIds = (data || []).map(request => request.borrower_id);
    const { data: borrowerProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', borrowerIds);

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
