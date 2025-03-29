
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
      throw new Error("Telegram bot token not configured");
    }
    
    const requestData = await req.json();
    const { chat_id, text } = requestData;
    console.log(`Sending message to chat_id: ${chat_id}`);
    
    if (!chat_id || !text) {
      throw new Error("Chat ID and text are required");
    }
    
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id,
        text,
      }),
    });
    
    const telegramData = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramData);
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
