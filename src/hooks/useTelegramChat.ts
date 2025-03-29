
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''; // Fallback to empty string

export const useTelegramChat = () => {
  // Get user from useAuth hook at the component level
  const { user } = useAuth();

  const startTelegramChat = async (requesterId: string, ownerId: string, itemName: string) => {
    try {
      if (!telegramBotToken) {
        console.error('Telegram bot token missing');
        return;
      }

      // Get telegram_id for requester and owner
      const [requesterResult, ownerResult] = await Promise.all([
        supabase.from('profiles').select('telegram_id').eq('id', requesterId).single(),
        supabase.from('profiles').select('telegram_id').eq('id', ownerId).single()
      ]);

      const requesterTelegramId = requesterResult.data?.telegram_id;
      const ownerTelegramId = ownerResult.data?.telegram_id;

      if (!requesterTelegramId && !ownerTelegramId) {
        console.warn('No Telegram IDs found for requester or owner');
        return;
      }

      // Send messages to both users
      const messages = [];

      if (requesterTelegramId) {
        messages.push({ 
          chat_id: requesterTelegramId, 
          text: `You requested ${itemName}. Chat with the owner!` 
        });
      }

      if (ownerTelegramId) {
        messages.push({ 
          chat_id: ownerTelegramId, 
          text: `Your item "${itemName}" was requested. Chat with the borrower!` 
        });
      }

      await Promise.all(messages.map(msg =>
        supabase.functions.invoke('send-telegram-notification', {
          body: msg
        })
      ));

    } catch (error) {
      console.error('Error starting Telegram chat:', error);
    }
  };

  return { startTelegramChat };
};
