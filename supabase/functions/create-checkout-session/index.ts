import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.error("❌ Method:", req.method);
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    const body = await req.json();
    console.log("📥 Request body:", JSON.stringify(body));
    
    const { userId, email, successUrl, cancelUrl } = body;
    
    if (!userId || !successUrl || !cancelUrl) {
      console.error("❌ Missing required fields:", { userId: !!userId, successUrl: !!successUrl, cancelUrl: !!cancelUrl });
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const priceId = Deno.env.get("STRIPE_PRICE_MONTHLY");

    if (!stripeKey || stripeKey.length < 10) {
      console.error("❌ STRIPE_SECRET_KEY not configured or invalid");
      return new Response(JSON.stringify({ error: "Server configuration error: STRIPE_SECRET_KEY missing" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (!priceId) {
      console.error("❌ STRIPE_PRICE_MONTHLY not configured");
      return new Response(JSON.stringify({ error: "Server configuration error: STRIPE_PRICE_MONTHLY missing" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    console.log("✅ Environment OK. Creating Stripe session...");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { user_id: userId },
      customer_email: email || undefined
    });

    console.log("✅ Checkout session created:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ 
      error: "Failed to create checkout session",
      details: errorMsg
    }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
