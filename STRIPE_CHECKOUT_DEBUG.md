# 🔍 Stripe Checkout Session Debug Guide

## Current Error
```
Error: Edge Function returned a non-2xx status code
```

## Step-by-Step Debugging

### 1. Check Supabase Edge Function Logs
```bash
# View logs in Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/[your-project]/functions
2. Click on "create-checkout-session" function
3. Click "Logs" tab
4. Look for the actual error message (will show one of the errors below)
```

### 2. Common Error Causes & Fixes

#### ❌ Error: "STRIPE_SECRET_KEY not configured"
**Fix:**
```bash
# Set the Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```
Or in Dashboard: Settings → Edge Functions → Add Secret

#### ❌ Error: "STRIPE_PRICE_MONTHLY not configured"
**Fix:**
```bash
# Get your Price ID from Stripe Dashboard → Products
# It should look like: price_1ABC123xyz...
supabase secrets set STRIPE_PRICE_MONTHLY=price_1ABC123xyz...
```

#### ❌ Error: "Missing required fields"
**Fix:** Check the frontend is sending all required fields:
- userId (Supabase user.id)
- email (user.email)
- successUrl (full URL with protocol)
- cancelUrl (full URL with protocol)

#### ❌ Stripe API Error (Invalid API Key)
**Fix:**
```bash
# Your key might be expired or from wrong environment
# Get a fresh key from: https://dashboard.stripe.com/test/apikeys
supabase secrets set STRIPE_SECRET_KEY=sk_test_NEW_KEY_HERE
```

### 3. Verify Environment Variables

Run this in your terminal:
```bash
# List all secrets (won't show values, just names)
supabase secrets list

# Should show:
# - STRIPE_SECRET_KEY
# - STRIPE_PRICE_MONTHLY
# - STRIPE_WEBHOOK_SECRET
```

### 4. Test Stripe Price ID

Verify your Price ID is correct:
1. Go to: https://dashboard.stripe.com/test/products
2. Click on your product
3. Copy the Price ID (starts with `price_`)
4. Make sure it's a **recurring** price (not one-time)

### 5. Updated Edge Function Code

Replace `/supabase/functions/create-checkout-session/index.ts` with:

```typescript
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
    console.log("📥 Body:", JSON.stringify(body));
    
    const { userId, email, successUrl, cancelUrl } = body;
    
    if (!userId || !successUrl || !cancelUrl) {
      console.error("❌ Missing fields");
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const priceId = Deno.env.get("STRIPE_PRICE_MONTHLY");

    if (!stripeKey || stripeKey.length < 10) {
      console.error("❌ STRIPE_SECRET_KEY missing");
      return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (!priceId) {
      console.error("❌ STRIPE_PRICE_MONTHLY missing");
      return new Response(JSON.stringify({ error: "STRIPE_PRICE_MONTHLY not configured" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    console.log("✅ Creating session...");
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

    console.log("✅ Session created:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({ 
      error: err instanceof Error ? err.message : String(err)
    }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
```

### 6. Deploy Updated Function

```bash
supabase functions deploy create-checkout-session
```

### 7. Test the Flow

1. Go to `/app/billing`
2. Click "Go Pro - $15/mo"
3. Check browser console for logs
4. Check Supabase function logs for server-side errors

### 8. Quick Test Checklist

- [ ] STRIPE_SECRET_KEY is set (starts with `sk_test_` or `sk_live_`)
- [ ] STRIPE_PRICE_MONTHLY is set (starts with `price_`)
- [ ] Price is recurring (monthly subscription)
- [ ] User is logged in (userId exists)
- [ ] Function logs show the actual error message

## Still Not Working?

Check the Supabase function logs - they will show the EXACT error. The most common issues are:
1. Missing STRIPE_SECRET_KEY
2. Missing STRIPE_PRICE_MONTHLY
3. Invalid Stripe API key (expired or wrong environment)
4. Price ID is for one-time payment instead of subscription
