
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
    console.log("Received notification request with data:", JSON.stringify({
      ...requestData,
      chat_id: requestData.chat_id ? "REDACTED" : undefined // Redact chat_id for privacy
    }));
    
    const { chat_id, text, reply_markup } = requestData;
    
    if (!chat_id || !text) {
      console.error("Missing required parameters", { chat_id: !!chat_id, text: !!text });
      throw new Error("Chat ID and text are required");
    }
    
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log("Making request to Telegram API");
    
    // Create the payload, including reply_markup if provided
    const payload = {
      chat_id,
      text,
      parse_mode: "HTML",  // Allow HTML formatting in messages
      reply_markup: reply_markup || undefined
    };

    console.log("Sending payload to Telegram:", JSON.stringify({
      text_length: text?.length || 0,
      has_reply_markup: !!reply_markup,
      parse_mode: "HTML"
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
      console.error("Request details:", { 
        text_length: text?.length || 0, 
        has_reply_markup: !!reply_markup 
      });
      throw new Error(`Telegram API error: ${JSON.stringify(telegramData)}`);
    }
    
    console.log("Message sent successfully:", {
      ok: telegramData.ok,
      message_id: telegramData.result?.message_id
    });
    
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
