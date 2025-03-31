
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    
    if (!TELEGRAM_BOT_TOKEN) {
      console.error("CRITICAL ERROR: Telegram bot token not configured in environment variables");
      throw new Error("Telegram bot token not configured");
    }
    
    const requestData = await req.json();
    console.log("Received notification request with data:", JSON.stringify(requestData));
    
    const { chat_id, text, reply_markup } = requestData;
    console.log(`Attempting to send message to chat_id: ${chat_id}, message: ${text}`);
    
    if (!chat_id || !text) {
      console.error("Missing required parameters", { chat_id, text });
      throw new Error("Chat ID and text are required");
    }
    
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log(`Making request to Telegram API at: ${telegramApiUrl.split(TELEGRAM_BOT_TOKEN).join("REDACTED")}`);
    
    // Create the payload, including reply_markup if provided
    const payload = {
      chat_id,
      text,
      parse_mode: "HTML",  // Allow HTML formatting in messages
      reply_markup: reply_markup || undefined
    };

    console.log("Sending payload to Telegram:", JSON.stringify({
      ...payload,
      chat_id: payload.chat_id // Keep the original chat_id for logging
    }));
    
    const telegramResponse = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    const telegramData = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      console.error("Telegram API error response:", telegramData);
      console.error("Request details:", { chat_id, text_length: text?.length, has_reply_markup: !!reply_markup });
      throw new Error(`Telegram API error: ${JSON.stringify(telegramData)}`);
    }
    
    console.log("Message sent successfully:", telegramData);
    
    return new Response(
      JSON.stringify({ success: true, data: telegramData }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
