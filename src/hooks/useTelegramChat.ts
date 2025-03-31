
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTelegramChat = () => {
  // Get user from useAuth hook at the component level
  const { user } = useAuth();

  const startTelegramChat = async (requesterId: string, ownerId: string, itemName: string) => {
    try {
      console.log("useTelegramChat.startTelegramChat called with:", {
        requesterId,
        ownerId,
        itemName
      });

      // Get telegram_id, telegram_username, and other data for requester and owner
      const [requesterResult, ownerResult] = await Promise.all([
        supabase.from('profiles').select('telegram_id, telegram_username, username, full_name').eq('id', requesterId).single(),
        supabase.from('profiles').select('telegram_id, telegram_username, username, full_name').eq('id', ownerId).single()
      ]);

      console.log("Profile fetch results:", {
        requester: requesterResult,
        owner: ownerResult
      });

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

      // Send messages to both users with inline keyboard buttons
      const messages = [];

      if (requesterTelegramId) {
        // Create message for requester with button to message owner
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
        // Create message for owner with button to message requester
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

      console.log('Prepared messages:', JSON.stringify(messages));

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
      console.error('Error starting Telegram chat:', error);
      return { error };
    }
  };

  return { startTelegramChat };
};
