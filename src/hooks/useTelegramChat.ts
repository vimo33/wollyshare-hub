
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

      // Get telegram_id for requester and owner
      const [requesterResult, ownerResult] = await Promise.all([
        supabase.from('profiles').select('telegram_id, username, full_name').eq('id', requesterId).single(),
        supabase.from('profiles').select('telegram_id, username, full_name').eq('id', ownerId).single()
      ]);

      console.log("Profile fetch results:", {
        requester: requesterResult,
        owner: ownerResult
      });

      const requesterTelegramId = requesterResult.data?.telegram_id;
      const ownerTelegramId = ownerResult.data?.telegram_id;
      const requesterName = requesterResult.data?.full_name || requesterResult.data?.username || 'Someone';
      const ownerName = ownerResult.data?.full_name || ownerResult.data?.username || 'the owner';

      if (!requesterTelegramId && !ownerTelegramId) {
        console.warn('No Telegram IDs found for requester or owner - skipping notifications');
        return;
      }

      console.log('Sending notifications to:', {
        requester: { 
          id: requesterId, 
          telegramId: requesterTelegramId,
          name: requesterName 
        },
        owner: { 
          id: ownerId, 
          telegramId: ownerTelegramId,
          name: ownerName
        }
      });

      // Send messages to both users
      const messages = [];

      if (requesterTelegramId) {
        messages.push({ 
          chat_id: requesterTelegramId, 
          text: `You requested <b>"${itemName}"</b>.\n\nThe owner, ${ownerName}, has been notified. You can now chat with them directly in Telegram.` 
        });
      }

      if (ownerTelegramId) {
        messages.push({ 
          chat_id: ownerTelegramId, 
          text: `<b>${requesterName}</b> has requested your item <b>"${itemName}"</b>.\n\nThey've been notified about their request. You can now chat with them directly in Telegram.` 
        });
      }

      console.log('Prepared messages:', JSON.stringify(messages));

      // Send all messages and collect results
      const results = await Promise.all(messages.map(async (msg) => {
        console.log(`Sending notification to chat_id: ${msg.chat_id}`);
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
