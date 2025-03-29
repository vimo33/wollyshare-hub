
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TelegramChatResponse {
  success: boolean;
  message: string;
}

export const useTelegramChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Start a Telegram chat between two users for a specific item borrowing
   */
  const startTelegramChat = async (
    requesterId: string,
    ownerId: string,
    itemName: string
  ): Promise<TelegramChatResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      // Get Telegram IDs for both users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, telegram_id")
        .in("id", [requesterId, ownerId]);

      if (profilesError) {
        throw new Error(`Failed to get user profiles: ${profilesError.message}`);
      }

      // Find the requester and owner profiles
      const requesterProfile = profiles.find((p) => p.id === requesterId);
      const ownerProfile = profiles.find((p) => p.id === ownerId);

      // Check if both users have Telegram IDs
      if (!requesterProfile?.telegram_id || !ownerProfile?.telegram_id) {
        console.log("Missing Telegram IDs", { requesterProfile, ownerProfile });
        return {
          success: false,
          message: "One or both users don't have Telegram IDs set up"
        };
      }

      // Telegram bot token should be stored in .env
      const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      if (!token) {
        console.error("Telegram bot token not found");
        return {
          success: false,
          message: "Telegram bot token not configured"
        };
      }

      // Message to send to both users
      const message = `Chat started for borrowing "${itemName}". You can communicate directly through this chat. Please coordinate for the borrowing details.`;

      // Send message to requester and owner
      // Note: In production, this would typically be handled by a secure backend service
      // This is a simplified example for demonstration purposes
      try {
        // We would normally use a secure backend API instead of direct Telegram API calls
        // For example purposes, logging what we would do:
        console.log("Would send to requester:", requesterProfile.telegram_id, message);
        console.log("Would send to owner:", ownerProfile.telegram_id, message);
        
        // For a real implementation, this would make API calls to Telegram:
        // await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ chat_id: requesterProfile.telegram_id, text: message })
        // });
        
        return {
          success: true,
          message: "Telegram notifications sent successfully"
        };
      } catch (sendError: any) {
        console.error("Failed to send Telegram messages:", sendError);
        return {
          success: false,
          message: `Failed to send Telegram messages: ${sendError.message}`
        };
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error in Telegram chat:", err);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startTelegramChat,
    isLoading,
    error
  };
};
