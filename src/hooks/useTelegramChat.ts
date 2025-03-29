
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '7668612759:AAE3nly6dp0iA0XwwWuVSxwX6eeur61ZTyE'; // Temp hardcoded for testing

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

      if (!requesterTelegramId || !ownerTelegramId) {
        console.warn('Missing Telegram IDs', { requesterTelegramId, ownerTelegramId });
        return;
      }

      // Send messages to both users
      const messages = [
        { 
          chat_id: requesterTelegramId, 
          text: `You requested ${itemName}. Chat with the owner!` 
        },
        { 
          chat_id: ownerTelegramId, 
          text: `Your item "${itemName}" was requested. Chat with the borrower!` 
        }
      ];

      await Promise.all(messages.map(msg =>
        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg),
        })
      ));

    } catch (error) {
      console.error('Error starting Telegram chat:', error);
    }
  };

  return { startTelegramChat };
};
