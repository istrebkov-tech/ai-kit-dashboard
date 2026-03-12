import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("openrouter-limits: key length", apiKey.length, "prefix", apiKey.substring(0, 5));

    // Use Headers object to prevent stripping
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("Content-Type", "application/json");

    const keyResp = await fetch("https://openrouter.ai/api/v1/key", {
      method: "GET",
      headers,
    });

    if (!keyResp.ok) {
      const errText = await keyResp.text();
      console.error("OpenRouter /key error:", keyResp.status, errText);
      
      // If auth fails, try with HTTP-Authorization header workaround
      const retryResp = await fetch("https://openrouter.ai/api/v1/key", {
        method: "GET",
        headers: {
          "HTTP-Authorization": `Bearer ${apiKey}`,
          "Authorization": `Bearer ${apiKey}`,
          "X-Api-Key": apiKey,
        },
      });
      
      if (!retryResp.ok) {
        const retryErr = await retryResp.text();
        console.error("OpenRouter /key retry error:", retryResp.status, retryErr);
        return new Response(
          JSON.stringify({ error: `OpenRouter error ${keyResp.status}` }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const retryData = await retryResp.json();
      return new Response(JSON.stringify(retryData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const keyData = await keyResp.json();
    return new Response(JSON.stringify(keyData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("openrouter-limits error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});