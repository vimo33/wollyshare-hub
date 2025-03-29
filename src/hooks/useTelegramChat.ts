
import { supabase } from '@/integrations/supabase/client';

export const useTelegramChat = () => {
  const startTelegramChat = async (
    requesterId: string, 
    ownerId: string, 
    itemName: string
  ): Promise<boolean> => {
    try {
      // Get the telegram_id for both users from profiles
      const { data: requesterProfile, error: requesterError } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('user_id', requesterId)
        .single();
      
      if (requesterError || !requesterProfile?.telegram_id) {
        console.error('Failed to get requester telegram_id:', requesterError);
        return false;
      }
      
      const { data: ownerProfile, error: ownerError } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('user_id', ownerId)
        .single();
      
      if (ownerError || !ownerProfile?.telegram_id) {
        console.error('Failed to get owner telegram_id:', ownerError);
        return false;
      }
      
      // Get the token from environment variables
      const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      if (!token) {
        console.error('No telegram bot token found in environment variables');
        return false;
      }
      
      // Send message to both users
      const message = `Chat started for borrowing ${itemName}. Reply here to communicate!`;
      
      // Send to requester
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: requesterProfile.telegram_id,
          text: message,
        }),
      });
      
      // Send to owner
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: ownerProfile.telegram_id,
          text: message,
        }),
      });
      
      return true;
    } catch (error) {
      console.error('Error starting Telegram chat:', error);
      return false;
    }
  };

  return { startTelegramChat };
};

export default useTelegramChat;
