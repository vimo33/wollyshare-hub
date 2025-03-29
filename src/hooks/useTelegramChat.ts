
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type TelegramChatResult = {
  success: boolean;
  error?: string;
};

export const useTelegramChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startTelegramChat = async (
    requesterId: string,
    ownerId: string,
    itemName: string
  ): Promise<TelegramChatResult> => {
    setIsLoading(true);

    try {
      // Fetch telegram IDs for both users
      const { data: requesterData, error: requesterError } = await supabase
        .from('profiles')
        .select('telegram_id, username')
        .eq('id', requesterId)
        .single();

      const { data: ownerData, error: ownerError } = await supabase
        .from('profiles')
        .select('telegram_id, username')
        .eq('id', ownerId)
        .single();

      if (requesterError || ownerError) {
        console.error('Error fetching user profiles:', { requesterError, ownerError });
        return { success: false, error: 'Could not fetch user information' };
      }

      // Check if both users have Telegram IDs
      if (!requesterData?.telegram_id || !ownerData?.telegram_id) {
        console.log('Missing Telegram IDs:', { 
          requester: requesterData?.telegram_id, 
          owner: ownerData?.telegram_id 
        });
        return { 
          success: false, 
          error: 'One or both users have not provided their Telegram ID' 
        };
      }

      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        console.error('Missing Telegram bot token');
        return { success: false, error: 'Telegram bot token not configured' };
      }

      // Send message to requester
      const requesterMessage = `You've requested to borrow "${itemName}" from ${ownerData.username || 'the owner'}. They'll respond to you here if they approve your request.`;
      await sendTelegramMessage(botToken, requesterData.telegram_id, requesterMessage);

      // Send message to owner
      const ownerMessage = `${requesterData.username || 'Someone'} has requested to borrow your item "${itemName}". You can communicate with them here about the details if you approve their request.`;
      await sendTelegramMessage(botToken, ownerData.telegram_id, ownerMessage);

      return { success: true };
    } catch (error) {
      console.error('Error starting Telegram chat:', error);
      return { 
        success: false, 
        error: 'Failed to start Telegram chat. Please try again later.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendTelegramMessage = async (
    botToken: string,
    chatId: string,
    message: string
  ) => {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        throw new Error('Failed to send Telegram message');
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  };

  return {
    startTelegramChat,
    isLoading,
  };
};
