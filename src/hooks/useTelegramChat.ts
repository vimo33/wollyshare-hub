
import { useState } from 'react';

interface TelegramChatOptions {
  botToken?: string;
}

export const useTelegramChat = (options?: TelegramChatOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const botToken = options?.botToken || import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

  // Function to send a telegram message
  const sendTelegramMessage = async (chatId: string, text: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!botToken) {
        throw new Error("Telegram bot token is missing");
      }
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Telegram API error: ${errorData.description}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err);
      console.error("Error sending Telegram message:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initialize a chat between requester and owner
  const initializeChat = async (requesterId: string, ownerId: string, itemName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, we would query the profiles to get telegram_ids
      // and then send messages to both parties
      console.log(`Initializing chat for item ${itemName} between requester ${requesterId} and owner ${ownerId}`);
      
      return { success: true };
    } catch (err: any) {
      setError(err);
      console.error("Error initializing Telegram chat:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendTelegramMessage,
    initializeChat,
    isLoading,
    error
  };
};
